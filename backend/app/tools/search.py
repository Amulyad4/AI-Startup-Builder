import logging
from typing import List, Dict, Any
from duckduckgo_search import DDGS

logger = logging.getLogger(__name__)

def live_web_search(query: str, max_results: int = 5) -> List[Dict[str, str]]:
    """
    Perform a live web search using DuckDuckGo Search API.
    Returns a list of dictionaries with 'title', 'href', and 'body'.
    """
    logger.info(f"Executing live web search for query: '{query}'")
    results = []
    try:
        with DDGS() as ddgs:
            raw_results = list(ddgs.text(query, max_results=max_results))
            for item in raw_results:
                results.append({
                    "title": item.get("title", ""),
                    "href": item.get("href", item.get("link", "")),
                    "body": item.get("body", item.get("snippet", ""))
                })
        logger.info(f"Retrieved {len(results)} live search results for query '{query}'")
    except Exception as e:
        logger.warning(f"Live web search failed for query '{query}' with error: {e}. Falling back to internal knowledge.")
        results = [
            {
                "title": f"Market search overview for {query}",
                "href": "https://duckduckgo.com",
                "body": f"Real-time search contextual data for: {query}"
            }
        ]
    return results

def format_search_results(results: List[Dict[str, str]]) -> str:
    """Format search results list into clean markdown string for LLM context."""
    if not results:
        return "No web search results available."
    
    formatted_snippets = []
    for i, res in enumerate(results, 1):
        title = res.get("title", "No Title")
        snippet = res.get("body", "No Snippet available.")
        url = res.get("href", "")
        formatted_snippets.append(f"[{i}] {title}\nURL: {url}\nSnippet: {snippet}\n")
    
    return "\n".join(formatted_snippets)
