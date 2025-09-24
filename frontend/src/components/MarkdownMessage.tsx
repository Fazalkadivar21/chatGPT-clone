import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // highlight.js theme
import "github-markdown-css/github-markdown.css"; // optional: for nice markdown styles

type Props = { content: string };

export default function MarkdownMessage({ content }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure marked for advanced markdown rendering
    marked.setOptions({
      gfm: true,
      breaks: true,
      headerIds: true,
      mangle: false,
      smartLists: true,
      smartypants: true,
      highlight: (code: string, lang?: string): string => {
        try {
          if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          }
          return hljs.highlightAuto(code).value;
        } catch {
          return code;
        }
      },
    } as any);

    // Convert markdown to HTML
    const rawHtml = marked.parse(content ?? "");

    // Sanitize the HTML
    const cleanHtml = DOMPurify.sanitize(rawHtml as string);

    // Inject sanitized HTML
    containerRef.current.innerHTML = cleanHtml;

    // Add copy buttons to code blocks
    containerRef.current.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return;

      pre.style.position = pre.style.position || "relative";

      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = "Copy";

      Object.assign(btn.style, {
        position: "absolute",
        top: "8px",
        right: "8px",
        background: "#111827",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "4px 8px",
        cursor: "pointer",
        fontSize: "12px",
        opacity: "0",
        transition: "opacity 150ms",
        zIndex: "10",
      });

      pre.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
      pre.addEventListener("mouseleave", () => (btn.style.opacity = "0"));

      btn.addEventListener("click", async () => {
        const codeEl = pre.querySelector("code");
        const text = codeEl?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          const old = btn.textContent;
          btn.textContent = "Copied";
          setTimeout(() => (btn.textContent = old), 1400);
        } catch {
          btn.textContent = "Failed";
          setTimeout(() => (btn.textContent = "Copy"), 1400);
        }
      });

      pre.appendChild(btn);
    });

    // Highlight remaining code blocks
    containerRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="markdown-body prose max-w-none break-words text-sm leading-relaxed"
      style={{
        background: "#1E1E2D", // subtle LLM chat-like background
        color: "#E0E0E0",
        padding: "12px 16px",
        borderRadius: "8px",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
        overflowX: "auto",
      }}
    />
  );
}
