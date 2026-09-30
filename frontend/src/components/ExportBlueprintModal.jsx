import React, { useState } from "react";
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  FileCode,
  FileCheck,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Loader2
} from "lucide-react";
import {
  downloadBlueprintPDF,
  downloadBlueprintDOCX,
  downloadBlueprintMarkdown,
  getShortProjectName,
  getExportTimestamp
} from "../services/exportService";

export default function ExportBlueprintModal({
  isOpen,
  onClose,
  intakeData,
  reports
}) {
  if (!isOpen) return null;

  const [selectedFormat, setSelectedFormat] = useState("pdf"); // "pdf" | "docx" | "md"
  const [isExporting, setIsExporting] = useState(false);
  const [exportedFilename, setExportedFilename] = useState(null);

  const ideaTitle = intakeData?.idea || "AI Startup Architecture";
  const shortName = getShortProjectName(ideaTitle);
  const timestamp = getExportTimestamp();

  const previewFilenames = {
    pdf: `${shortName}_blueprint_${timestamp}.pdf`,
    docx: `${shortName}_blueprint_${timestamp}.docx`,
    md: `${shortName}_blueprint_${timestamp}.md`
  };

  const handleDownload = async () => {
    setIsExporting(true);
    setExportedFilename(null);
    try {
      let res;
      if (selectedFormat === "pdf") {
        res = await downloadBlueprintPDF(intakeData, reports);
      } else if (selectedFormat === "docx") {
        res = await downloadBlueprintDOCX(intakeData, reports);
      } else {
        res = await downloadBlueprintMarkdown(intakeData, reports);
      }
      setExportedFilename(res?.filename || previewFilenames[selectedFormat]);
      setTimeout(() => {
        setIsExporting(false);
      }, 800);
    } catch (err) {
      console.error("Export error:", err);
      setIsExporting(false);
      alert("Export encountered an issue. Falling back to text download.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeUp text-left">
      <div className="relative w-full max-w-lg rounded-3xl border border-cyan-500/30 bg-surface p-6 sm:p-7 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                EXPORT BLUEPRINT
              </span>
              <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                10 AGENTS VERIFIED
              </span>
            </div>
            <h3 className="font-display font-bold text-xl text-text">
              Download Startup Blueprint
            </h3>
            <p className="text-xs text-textMuted leading-relaxed">
              Export the comprehensive multi-agent synthesis document tailored to your concept.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-textMuted hover:text-text hover:bg-surfaceAlt transition-all cursor-pointer border-none bg-transparent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Filename Preview Banner */}
        <div className="p-4 rounded-2xl bg-surfaceAlt/80 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[10px] font-bold text-textMuted uppercase">
              GENERATED FILENAME
            </span>
            <span className="font-mono text-[10px] text-cyan-400 font-bold">
              FORMAT: {selectedFormat.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface border border-border font-mono text-xs text-cyan-300 font-bold truncate">
            <FileText size={16} className="text-cyan-400 shrink-0" />
            <span className="truncate">{previewFilenames[selectedFormat]}</span>
          </div>
          <p className="text-[11px] text-textMuted font-mono">
            Project: <strong className="text-text">{shortName}</strong> · Standardized Swarm Synthesis
          </p>
        </div>

        {/* Format Selection Cards */}
        <div className="space-y-2.5">
          <span className="font-mono text-[10px] font-bold text-textMuted uppercase tracking-wider block">
            SELECT DOCUMENT FORMAT
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* PDF Option */}
            <button
              onClick={() => setSelectedFormat("pdf")}
              className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                selectedFormat === "pdf"
                  ? "bg-cyan-500/15 border-cyan-500/50 shadow-cyber-cyan"
                  : "bg-surfaceAlt border-border hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center font-bold text-xs font-mono">
                  PDF
                </div>
                {selectedFormat === "pdf" && (
                  <CheckCircle2 size={16} className="text-cyan-400" />
                )}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-text">PDF Blueprint</h4>
                <p className="text-[10px] text-textMuted leading-tight font-mono">
                  Executive Layout with Swarm Diagnostics & Chapters
                </p>
              </div>
            </button>

            {/* Word / DOCX Option */}
            <button
              onClick={() => setSelectedFormat("docx")}
              className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                selectedFormat === "docx"
                  ? "bg-cyan-500/15 border-cyan-500/50 shadow-cyber-cyan"
                  : "bg-surfaceAlt border-border hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center font-bold text-xs font-mono">
                  DOC
                </div>
                {selectedFormat === "docx" && (
                  <CheckCircle2 size={16} className="text-cyan-400" />
                )}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-text">Word Document</h4>
                <p className="text-[10px] text-textMuted leading-tight font-mono">
                  Editable Word / Google Docs with Tables
                </p>
              </div>
            </button>

            {/* Markdown Option */}
            <button
              onClick={() => setSelectedFormat("md")}
              className={`p-3.5 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                selectedFormat === "md"
                  ? "bg-cyan-500/15 border-cyan-500/50 shadow-cyber-cyan"
                  : "bg-surfaceAlt border-border hover:border-cyan-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-bold text-xs font-mono">
                  MD
                </div>
                {selectedFormat === "md" && (
                  <CheckCircle2 size={16} className="text-cyan-400" />
                )}
              </div>
              <div>
                <h4 className="font-display font-bold text-xs text-text">Markdown</h4>
                <p className="text-[10px] text-textMuted leading-tight font-mono">
                  Developer Readme & Version Control
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Success Alert if just downloaded */}
        {exportedFilename && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <CheckCircle2 size={15} className="shrink-0" />
            <span className="truncate">Downloaded: {exportedFilename}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-textMuted hover:text-text hover:bg-surfaceAlt transition-all cursor-pointer border border-border bg-transparent"
          >
            Close
          </button>

          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 border-none outline-none cursor-pointer shadow-cyber-cyan hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Generating {selectedFormat.toUpperCase()}...
              </>
            ) : (
              <>
                <Download size={14} /> Download {selectedFormat.toUpperCase()} Blueprint
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
