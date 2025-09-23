import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // highlight.js theme

type Props = { content: string };

export default function MarkdownMessage({ content }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configure marked once per render
    marked.setOptions({
      gfm: true,
      breaks: true,
      mangle: false,
      
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

    // Parse markdown to HTML string
    const rawHtml = marked.parse(content ?? "") as string;

    // Sanitize the HTML (DOMPurify returns string, TS knows it)
    const clean: string = DOMPurify.sanitize(rawHtml) as string;

    // Inject into DOM
    containerRef.current.innerHTML = clean;

    // Add copy buttons for each code block
    const preEls = containerRef.current.querySelectorAll("pre");
    preEls.forEach((pre) => {
      // avoid duplicates
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
        padding: "4px 8px",
        cursor: "pointer",
        opacity: "0",
        transition: "opacity 150ms",
        zIndex: "10",
      });

      pre.addEventListener("mouseenter", () => (btn.style.opacity = "1"));
      pre.addEventListener("mouseleave", () => (btn.style.opacity = "0"));

      btn.addEventListener("click", async () => {
        const codeEl = pre.querySelector("code");
        const text = codeEl ? codeEl.textContent ?? "" : "";
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

    // highlight any remaining code blocks (fallback)
    containerRef.current.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [content]);

  return <div ref={containerRef} className="markdown-body prose max-w-none" />;
}
