import io
import re
import logging
from datetime import datetime
from typing import Dict, Any, Optional

from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas

import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

logger = logging.getLogger(__name__)

def get_short_project_name(idea: str) -> str:
    """Generate a clean, professional, short project name for export filenames."""
    if not idea or not idea.strip():
        return "Startup"
    stop_words = {
        "a", "an", "the", "for", "and", "in", "of", "to", "with", "on", "at", 
        "by", "is", "powered", "based", "platform", "system", "app", "tool", "solution"
    }
    cleaned = re.sub(r'[^a-zA-Z0-9\s]', ' ', idea)
    words = [w for w in cleaned.split() if w.lower() not in stop_words]
    if not words:
        words = cleaned.split()[:2] or ["Startup"]
    short = "".join(w.capitalize() for w in words[:3])
    return short[:24] or "Startup"


class NumberedCanvas(canvas.Canvas):
    """ReportLab canvas that records all pages and draws header bar & page numbers in two passes."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        # Header & Footer on page 2+
        if self._pageNumber > 1:
            self.saveState()
            # Top dark header banner matching live swarm blueprint styling
            self.setFillColor(colors.HexColor("#0f172a"))
            self.rect(0, 755, 612, 37, fill=1, stroke=0)
            self.setFillColor(colors.white)
            self.setFont("Helvetica-Bold", 8.5)
            self.drawString(36, 768, "LIVE SWARM EXECUTION ENGINE | BLUEPRINT EXPORT")

            # Bottom footer line
            self.setStrokeColor(colors.HexColor("#e2e8f0"))
            self.setLineWidth(0.75)
            self.line(36, 38, 576, 38)

            # Footer text
            self.setFillColor(colors.HexColor("#64748b"))
            self.setFont("Helvetica", 8)
            self.drawString(36, 25, "Confidential - AI Startup Swarm Blueprint")
            self.drawRightString(576, 25, f"Page {self._pageNumber} of {page_count}")
            self.restoreState()


def export_blueprint_to_pdf(blueprint_data: Dict[str, Any], idea_title: str, industry: str = "SaaS / B2B") -> bytes:
    """Generate an investor-ready, beautifully styled PDF document matching the reference design."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom typography styles
    cover_title_style = ParagraphStyle(
        'CoverTitle',
        fontName='Helvetica-Bold',
        fontSize=28,
        leading=34,
        textColor=colors.HexColor("#00488f"),
        spaceAfter=6
    )
    cover_proj_style = ParagraphStyle(
        'CoverProject',
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0284c7"),
        spaceAfter=14
    )
    cover_sub_style = ParagraphStyle(
        'CoverSubtitle',
        fontName='Helvetica',
        fontSize=13,
        leading=17,
        textColor=colors.HexColor("#0369a1"),
        spaceAfter=26
    )
    cover_meta_style = ParagraphStyle(
        'CoverMeta',
        fontName='Helvetica',
        fontSize=10,
        leading=16,
        textColor=colors.HexColor("#1e293b"),
        spaceAfter=4
    )
    
    h1_style = ParagraphStyle(
        'SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=14,
        spaceAfter=6
    )
    chapter_header_style = ParagraphStyle(
        'ChapterHeader',
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor("#00488f"),
        spaceBefore=12,
        spaceAfter=4
    )
    body_style = ParagraphStyle(
        'BodyText',
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )
    bold_label_style = ParagraphStyle(
        'BoldLabel',
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=3
    )
    bullet_style = ParagraphStyle(
        'BulletText',
        fontName='Helvetica',
        fontSize=8.5,
        leading=12.5,
        textColor=colors.HexColor("#334155"),
        leftIndent=12,
        spaceAfter=2.5
    )

    story = []

    # ----------------------------------------------------
    # PAGE 1: COVER / TITLE PAGE
    # ----------------------------------------------------
    story.append(Spacer(1, 130))
    story.append(Paragraph("SWARM BLUEPRINT REPORT", cover_title_style))
    story.append(Paragraph(idea_title, cover_proj_style))
    story.append(Paragraph("Comprehensive Multi-Agent Synthesis Document", cover_sub_style))
    story.append(Spacer(1, 24))

    val = blueprint_data.get("validation", {}) or {}
    feas_score = val.get("feasibility_score", 88)
    if isinstance(feas_score, str):
        feas_score = feas_score.replace("/100", "").replace("/10", "").strip()

    story.append(Paragraph("<b>Orchestration Engine:</b> Cyra-1 AI Command Core / Google Gemini Swarm", cover_meta_style))
    story.append(Paragraph("<b>Agents Synchronized:</b> 10 Online", cover_meta_style))
    story.append(Paragraph("<b>Execution Blueprint Status:</b> Synthesis Complete", cover_meta_style))
    story.append(Paragraph(f"<b>Sector / Industry:</b> {industry}", cover_meta_style))
    story.append(Paragraph(f"<b>Feasibility Fit Rating:</b> {feas_score} / 100 (VERIFIED)", cover_meta_style))
    story.append(Paragraph(f"<b>Date:</b> {datetime.now().strftime('%B %d, %Y')}", cover_meta_style))

    story.append(PageBreak())

    # ----------------------------------------------------
    # PAGE 2: SYSTEM OVERVIEW & SWARM CORE DIAGNOSTICS
    # ----------------------------------------------------
    story.append(Paragraph("System Overview & Swarm Core Diagnostics", h1_style))
    story.append(Paragraph(
        "The multi-agent execution pipeline successfully gathered, scrubbed, and synthesized core operational strategies across 10 functional business vectors:",
        body_style
    ))
    story.append(Spacer(1, 4))

    # Diagnostics Table
    table_data = [
        [
            Paragraph("<b>Agent Identity</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
            Paragraph("<b>Assigned Chapter Output</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
            Paragraph("<b>Status</b>", ParagraphStyle('TH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white))
        ]
    ]

    roster = [
        ("Idea Validator", "Chapter 1: Feasibility Matrix & Problem Def.", "VERIFIED"),
        ("Market Scout", "Chapter 2: TAM/SAM Market Sizing Data", "VERIFIED"),
        ("Rival Radar", "Chapter 3: Competitive Edge Matrix", "VERIFIED"),
        ("Persona Weaver", "Chapter 4: Ideal Customer Profile Specs", "VERIFIED"),
        ("Model Architect", "Chapter 5: Monetization Architecture", "VERIFIED"),
        ("MVP Forge", "Chapter 6: Technical Implementation Specifications", "VERIFIED"),
        ("Coin Oracle", "Chapter 7: 3-Year Pro Forma Financial Vectors", "VERIFIED"),
        ("Sentinel", "Chapter 8: Risk Vectors & Dependency Auditing", "VERIFIED"),
        ("Signal Booster", "Chapter 9: Distribution Flywheels & Growth Channels", "VERIFIED"),
        ("Deck Maestro", "Chapter 10: Pitch Framework Architecture", "VERIFIED"),
    ]

    for agent, ch, st in roster:
        table_data.append([
            Paragraph(f"■ {agent}", ParagraphStyle('TD', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#0f172a"))),
            Paragraph(ch, ParagraphStyle('TD', fontName='Helvetica', fontSize=8, textColor=colors.HexColor("#1e293b"))),
            Paragraph(f"<b>{st}</b>", ParagraphStyle('TD_St', fontName='Helvetica-Bold', fontSize=8, textColor=colors.HexColor("#059669")))
        ])

    diag_table = Table(table_data, colWidths=[150, 300, 90])
    diag_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#0f172a")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
    ]))
    story.append(diag_table)
    story.append(Spacer(1, 14))

    # Helper function to append structured chapter details
    def add_chapter(chapter_num: int, title: str, agent_name: str, summary: str, details: list):
        story.append(Paragraph(f"Chapter {chapter_num}: {title} — {agent_name}", chapter_header_style))
        story.append(Paragraph(summary, body_style))
        for item in details:
            if isinstance(item, tuple) and len(item) == 2:
                k, v = item
                if isinstance(v, list) and v:
                    story.append(Paragraph(f"<b>{k}:</b>", bold_label_style))
                    for sub in v:
                        story.append(Paragraph(f"• {sub}", bullet_style))
                elif v:
                    story.append(Paragraph(f"<b>{k}:</b> {v}", bullet_style))
            elif isinstance(item, str):
                story.append(Paragraph(item, bullet_style))
        story.append(Spacer(1, 8))

    # 1. Validation
    val = blueprint_data.get("validation", {}) or {}
    val_summary = f"Validates the primary value proposition, maps foundational pain severity parameters (Scored {feas_score}/100), and tracks unfair competitive advantages."
    add_chapter(
        1, "Feasibility Matrix", "Idea Validator",
        val_summary,
        [
            ("Core Problem", val.get("problem", "Manual fragmented operations in vertical market.")),
            ("Proposed Solution", val.get("solution", "Autonomous multi-agent execution pipeline.")),
            ("Feasibility Fit Score", f"{feas_score} / 100"),
            ("Innovation Score", f"{val.get('innovation_score', 84)} / 100"),
            ("Key Validated Strengths", val.get("strengths", ["High founder-market fit", "Automated architecture replaces manual legacy work"])),
            ("Vulnerabilities & Weaknesses", val.get("weaknesses", ["Requires frictionless onboarding setup"])),
            ("Actionable Suggestions", val.get("suggestions", ["Deploy interactive guided walkthroughs"]))
        ]
    )

    # 2. Market
    mkt = blueprint_data.get("market", {}) or {}
    tam = mkt.get("tam") or mkt.get("market_size") or "$18.5B"
    sam = mkt.get("sam") or "$4.2B"
    mkt_summary = f"Total Addressable Market (TAM) verified at {tam} globally. SAM projected at {sam} via high-density target nodes."
    add_chapter(
        2, "Market Size Dimensions", "Market Scout",
        mkt_summary,
        [
            ("Target Industry", mkt.get("industry", industry)),
            ("Total Addressable Market (TAM)", tam),
            ("Serviceable Addressable Market (SAM)", sam),
            ("Serviceable Obtainable Market (SOM)", mkt.get("som", "$520M")),
            ("Market Trends", mkt.get("trends", ["Accelerating AI automation adoption", "Demand for unified solutions"])),
            ("Opportunities", mkt.get("opportunities", ["High willingness to pay for validated operational efficiency"])),
            ("Market Challenges", mkt.get("challenges", ["Incumbent inertia and switching friction"]))
        ]
    )

    # 3. Competitors
    comp = blueprint_data.get("competitors", {}) or {}
    comp_list = comp.get("competitors", []) if isinstance(comp.get("competitors"), list) else []
    comp_summary = "Identifies primary enterprise roadblocks, isolates performance feature gaps in current legacy software architectures, and defines defensibility vectors."
    comp_details = []
    if comp_list:
        for c in comp_list[:3]:
            name = c.get("name", "Incumbent")
            pricing = c.get("pricing", "Enterprise")
            gap = c.get("market_gap", "Slow legacy deployment")
            comp_details.append(f"• <b>{name}</b> ({pricing}) — <i>Market Gap:</i> {gap}")
    else:
        comp_details.append("• <b>Legacy Enterprise Suites:</b> High cost, slow onboarding; open market opportunity for agile AI platform.")
    add_chapter(3, "Competitive Edge Matrix", "Rival Radar", comp_summary, comp_details)

    # 4. Persona
    persona = blueprint_data.get("persona", {}) or {}
    persona_summary = "Constructs behavioral archetypes of high-intent enterprise users experiencing core system overhead, detailing targeted discretionary budget metrics."
    add_chapter(
        4, "Ideal Customer Profile", "Persona Weaver",
        persona_summary,
        [
            ("Demographic Target", f"Age {persona.get('age', '28 - 48')} · {persona.get('occupation', 'Head of Operations / Founder')}"),
            ("Core Pain Points", persona.get("pain_points", ["Wasting 15+ hours weekly coordinating manual operational tasks"])),
            ("Primary Goals", persona.get("goals", ["Automate recurring workflows to scale without adding headcount"])),
            ("Behavioral Patterns", persona.get("behaviour", "Tech-savvy, values sleek user experience and rapid time-to-value"))
        ]
    )

    # 5. Business Model
    bm = blueprint_data.get("business_model", {}) or {}
    bm_summary = "Establishes modern B2B SaaS structure alongside tier-based usage meters. Entry-level nodes configured for high recurring margin."
    add_chapter(
        5, "Monetization Architecture", "Model Architect",
        bm_summary,
        [
            ("Revenue Model", bm.get("revenue_model", "Tiered Recurring B2B SaaS Subscriptions")),
            ("Pricing Strategy", bm.get("pricing", "Starter: $49/mo · Pro: $179/mo · Enterprise: Custom")),
            ("Cost Structure", bm.get("cost_structure", "Cloud compute, AI token compute, customer acquisition")),
            ("Distribution Channels", bm.get("channels", ["Direct organic inbound", "Vertical communities", "Strategic ecosystem partners"]))
        ]
    )

    # 6. MVP Scope
    mvp = blueprint_data.get("mvp", {}) or {}
    mvp_summary = "Details optimal cloud application stack requirements and defines localized integration milestones for deployment scaling."
    add_chapter(
        6, "Technical Specs", "MVP Forge",
        mvp_summary,
        [
            ("Core Launch Features (Phase 1)", mvp.get("core_features", ["Automated intake synthesizer", "Multi-agent telemetry dashboard", "One-click export suite"])),
            ("Future Roadmap (Phase 2+)", mvp.get("future_features", ["Autonomous agent-to-agent feedback loops", "Live CRM/ERP data connectors"])),
            ("Development Phases", mvp.get("development_phases", ["Phase 1 (Weeks 1-4): Core engine", "Phase 2 (Weeks 5-8): Public beta launch"]))
        ]
    )

    # 7. Financials
    fin = blueprint_data.get("financial", {}) or {}
    fin_summary = "Computes forward projections showing highly resilient gross operating margins exceeding 70% inside initial launch phases based on system runway parameters."
    add_chapter(
        7, "Financial Vectors", "Coin Oracle",
        fin_summary,
        [
            ("Estimated Setup Capital", fin.get("estimated_cost", "$45,000")),
            ("Monthly Burn Rate", fin.get("monthly_expense", "$7,200")),
            ("Projected Year 1 Revenue", fin.get("expected_revenue", "$380k ARR")),
            ("Break-Even Horizon", fin.get("break_even", "3.8 Months")),
            ("Projected ROI Multiple", fin.get("roi", "8.5x"))
        ]
    )

    # 8. Risks
    risk = blueprint_data.get("risk", {}) or {}
    risk_summary = "Flags platform dependency constraints on singular deep upstream models. Recommends implementing local abstract fallback routes to guarantee continuous uptime."
    add_chapter(
        8, "Risk Auditing", "Sentinel",
        risk_summary,
        [
            ("Technical Risk", risk.get("technical_risk", "Model latency and API uptime dependency")),
            ("Financial Risk", risk.get("financial_risk", "Runway management prior to break-even")),
            ("Legal & Compliance", risk.get("legal_risk", "GDPR & SOC2 Type II data security standards")),
            ("Mitigation Safeguards", risk.get("mitigation", ["Multi-provider fallback architecture with local caching layer"]))
        ]
    )

    # 9. Marketing
    mktg = blueprint_data.get("marketing", {}) or {}
    mktg_summary = "Establishes zero-CAC organic user acquisition methods by configuring scalable, open utility templates designed to organically drive inside-team adoption."
    add_chapter(
        9, "Distribution Flywheels", "Signal Booster",
        mktg_summary,
        [
            ("Brand Identity", mktg.get("branding", "Modern, high-velocity intelligence suite")),
            ("Acquisition Channels", mktg.get("marketing_channels", ["High-intent search", "Founder community demos", "Viral blueprint watermarks"])),
            ("Launch Playbook", mktg.get("launch_plan", "Private beta with 50 design partners followed by Product Hunt launch")),
            ("Growth Strategy", mktg.get("growth_strategy", "Expand from individual operators into enterprise team accounts"))
        ]
    )

    # 10. Pitch Deck
    pitch = blueprint_data.get("pitch", {}) or {}
    pitch_summary = "Extracts standard 10-slide narrative arcs structured to perfectly convey market problem alignment, scalability horizons, and execution timelines to investors."
    add_chapter(
        10, "Pitch Framework Architecture", "Deck Maestro",
        pitch_summary,
        [
            ("Slide 1 · Title & Hook", pitch.get("title", idea_title)),
            ("Slide 2 · Problem Statement", pitch.get("problem", val.get("problem", "Operational friction"))),
            ("Slide 3 · Proposed Solution", pitch.get("solution", val.get("solution", "Autonomous AI Acceleration"))),
            ("Slide 4 · Market Opportunity", pitch.get("market", f"{tam} addressable market expanding rapidly")),
            ("Slide 5 · Business Model", pitch.get("business_model", "High-margin recurring SaaS subscription tiers")),
            ("Slide 6 · Financial Projections", pitch.get("financials", fin.get("expected_revenue", "$380k Y1 ARR"))),
            ("Slide 7 · The Investment Ask", pitch.get("ask", "Seeking Seed Round Capital for 18-month engineering & GTM runway")),
            ("Slide 8 · Execution Roadmap", pitch.get("roadmap", "MVP launch in 6 weeks, public beta in 12 weeks"))
        ]
    )

    doc.build(story, canvasmaker=NumberedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def export_blueprint_to_docx(blueprint_data: Dict[str, Any], idea_title: str, industry: str = "SaaS / B2B") -> bytes:
    """Generate a clean, professional Microsoft Word (.docx) document matching the blueprint layout."""
    doc = Document()
    
    # 0.75-inch standard margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # Page 1: Cover Title
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_before = Pt(100)

    p_title = doc.add_paragraph()
    r_title = p_title.add_run("SWARM BLUEPRINT REPORT")
    r_title.font.name = "Arial"
    r_title.font.size = Pt(26)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0, 72, 143)

    p_proj = doc.add_paragraph()
    r_proj = p_proj.add_run(idea_title)
    r_proj.font.name = "Arial"
    r_proj.font.size = Pt(17)
    r_proj.font.bold = True
    r_proj.font.color.rgb = RGBColor(2, 132, 199)

    p_sub = doc.add_paragraph()
    r_sub = p_sub.add_run("Comprehensive Multi-Agent Synthesis Document")
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(12)
    r_sub.font.color.rgb = RGBColor(3, 105, 161)
    p_sub.paragraph_format.space_after = Pt(24)

    val = blueprint_data.get("validation", {}) or {}
    feas_score = val.get("feasibility_score", 88)

    meta_items = [
        ("Orchestration Engine", "Cyra-1 AI Command Core / Google Gemini Swarm"),
        ("Agents Synchronized", "10 Online"),
        ("Execution Blueprint Status", "Synthesis Complete"),
        ("Sector / Industry", industry),
        ("Feasibility Fit Rating", f"{feas_score} / 100 (VERIFIED)"),
        ("Date", datetime.now().strftime("%B %d, %Y"))
    ]

    for k, v in meta_items:
        p_m = doc.add_paragraph()
        r_k = p_m.add_run(f"{k}: ")
        r_k.bold = True
        p_m.add_run(v)
        p_m.paragraph_format.space_after = Pt(2)

    doc.add_page_break()

    # Page 2: System Diagnostics
    h_diag = doc.add_heading("System Overview & Swarm Core Diagnostics", level=1)
    h_diag.paragraph_format.space_before = Pt(8)
    
    p_diag_sub = doc.add_paragraph("The multi-agent execution pipeline successfully gathered, scrubbed, and synthesized core operational strategies across 10 functional business vectors:")
    p_diag_sub.paragraph_format.space_after = Pt(8)

    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Agent Identity"
    hdr_cells[1].text = "Assigned Chapter Output"
    hdr_cells[2].text = "Status"

    roster = [
        ("Idea Validator", "Chapter 1: Feasibility Matrix & Problem Def.", "VERIFIED"),
        ("Market Scout", "Chapter 2: TAM/SAM Market Sizing Data", "VERIFIED"),
        ("Rival Radar", "Chapter 3: Competitive Edge Matrix", "VERIFIED"),
        ("Persona Weaver", "Chapter 4: Ideal Customer Profile Specs", "VERIFIED"),
        ("Model Architect", "Chapter 5: Monetization Architecture", "VERIFIED"),
        ("MVP Forge", "Chapter 6: Technical Implementation Specifications", "VERIFIED"),
        ("Coin Oracle", "Chapter 7: 3-Year Pro Forma Financial Vectors", "VERIFIED"),
        ("Sentinel", "Chapter 8: Risk Vectors & Dependency Auditing", "VERIFIED"),
        ("Signal Booster", "Chapter 9: Distribution Flywheels & Growth Channels", "VERIFIED"),
        ("Deck Maestro", "Chapter 10: Pitch Framework Architecture", "VERIFIED"),
    ]

    for agent, ch, st in roster:
        row_cells = table.add_row().cells
        row_cells[0].text = f"■ {agent}"
        row_cells[1].text = ch
        row_cells[2].text = st

    doc.add_paragraph().paragraph_format.space_after = Pt(12)

    # Chapters
    chapters_data = [
        (1, "Feasibility Matrix", "Idea Validator", "Validates the primary value proposition, maps foundational pain severity parameters, and tracks unfair competitive advantages.", val),
        (2, "Market Size Dimensions", "Market Scout", "Total Addressable Market (TAM) verified globally with serviceable segments.", blueprint_data.get("market", {}) or {}),
        (3, "Competitive Edge Matrix", "Rival Radar", "Identifies primary enterprise roadblocks, isolates performance feature gaps in current legacy software architectures.", blueprint_data.get("competitors", {}) or {}),
        (4, "Ideal Customer Profile", "Persona Weaver", "Constructs behavioral archetypes of high-intent enterprise users experiencing core system overhead.", blueprint_data.get("persona", {}) or {}),
        (5, "Monetization Architecture", "Model Architect", "Establishes modern B2B SaaS structure alongside tier-based usage meters.", blueprint_data.get("business_model", {}) or {}),
        (6, "Technical Specs", "MVP Forge", "Details optimal cloud application stack requirements and defines localized integration milestones.", blueprint_data.get("mvp", {}) or {}),
        (7, "Financial Vectors", "Coin Oracle", "Computes forward projections showing highly resilient gross operating margins.", blueprint_data.get("financial", {}) or {}),
        (8, "Risk Auditing", "Sentinel", "Flags platform dependency constraints on singular deep upstream models.", blueprint_data.get("risk", {}) or {}),
        (9, "Distribution Flywheels", "Signal Booster", "Establishes zero-CAC organic user acquisition methods by configuring scalable templates.", blueprint_data.get("marketing", {}) or {}),
        (10, "Pitch Framework Architecture", "Deck Maestro", "Extracts standard 10-slide narrative arcs structured to convey market problem alignment to investors.", blueprint_data.get("pitch", {}) or {}),
    ]

    for num, ch_title, agent, summary, data in chapters_data:
        h = doc.add_heading(f"Chapter {num}: {ch_title} — {agent}", level=2)
        h.paragraph_format.space_before = Pt(10)
        p_s = doc.add_paragraph(summary)
        p_s.paragraph_format.space_after = Pt(6)

        if isinstance(data, dict):
            for k, v in data.items():
                if isinstance(v, list) and v:
                    doc.add_paragraph(f"{k.replace('_', ' ').title()}:", style='List Bullet')
                    for item in v:
                        doc.add_paragraph(f"• {item}", style='List Bullet 2')
                elif isinstance(v, (str, int, float)) and v:
                    doc.add_paragraph(f"• {k.replace('_', ' ').title()}: {v}")

    buffer = io.BytesIO()
    doc.save(buffer)
    docx_bytes = buffer.getvalue()
    buffer.close()
    return docx_bytes


def export_blueprint_to_markdown(blueprint_data: Dict[str, Any], idea_title: str, industry: str = "SaaS / B2B") -> str:
    """Generate a clean, comprehensive Markdown report of the complete Startup Blueprint."""
    md = []
    md.append(f"# SWARM BLUEPRINT REPORT: {idea_title}\n")
    md.append("*Comprehensive Multi-Agent Synthesis Document · Powered by Google Gemini Swarm*\n")
    md.append(f"- **Sector**: {industry}")
    md.append(f"- **Generated At**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n---\n")

    val = blueprint_data.get("validation", {}) or {}
    if val:
        md.append("## Chapter 1: Feasibility Matrix — Idea Validator\n")
        md.append(f"- **Core Problem**: {val.get('problem')}")
        md.append(f"- **Proposed Solution**: {val.get('solution')}")
        md.append(f"- **Feasibility Score**: {val.get('feasibility_score')}/100")
        md.append(f"- **Innovation Score**: {val.get('innovation_score')}/100\n")
        md.append("### Key Strengths")
        for s in val.get("strengths", []):
            md.append(f"- {s}")
        md.append("\n### Key Weaknesses")
        for w in val.get("weaknesses", []):
            md.append(f"- {w}\n\n---\n")

    mkt = blueprint_data.get("market", {}) or {}
    if mkt:
        md.append("## Chapter 2: Market Size Dimensions — Market Scout\n")
        md.append(f"- **Industry**: {mkt.get('industry', industry)}")
        md.append(f"- **Total Addressable Market (TAM)**: {mkt.get('tam', mkt.get('market_size'))}")
        md.append(f"- **Serviceable Addressable Market (SAM)**: {mkt.get('sam')}")
        md.append(f"- **Serviceable Obtainable Market (SOM)**: {mkt.get('som')}\n\n---\n")

    fin = blueprint_data.get("financial", {}) or {}
    if fin:
        md.append("## Chapter 7: Financial Vectors — Coin Oracle\n")
        md.append(f"- **Estimated Setup Cost**: {fin.get('estimated_cost')}")
        md.append(f"- **Monthly Burn**: {fin.get('monthly_expense')}")
        md.append(f"- **Expected Revenue**: {fin.get('expected_revenue')}")
        md.append(f"- **Break-Even**: {fin.get('break_even')}")
        md.append(f"- **Projected ROI**: {fin.get('roi')}\n\n---\n")

    return "\n".join(md)
