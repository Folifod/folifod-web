import DOMPurify from "isomorphic-dompurify";

const FONT_SIZE_PATTERN = /^\d+(?:\.\d+)?(?:px|em|rem|%)$/;
const TEXT_ALIGN_PATTERN = /^(?:left|right|center|justify)$/;

function sanitizeInlineStyle(style: string) {
  const allowed: string[] = [];

  for (const rule of style.split(";")) {
    const separatorIndex = rule.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }

    const property = rule.slice(0, separatorIndex).trim().toLowerCase();
    const value = rule.slice(separatorIndex + 1).trim().toLowerCase();

    if (property === "font-size" && FONT_SIZE_PATTERN.test(value)) {
      allowed.push(`font-size: ${value}`);
    }

    if (property === "text-align" && TEXT_ALIGN_PATTERN.test(value)) {
      allowed.push(`text-align: ${value}`);
    }
  }

  return allowed.join("; ");
}

let styleHookRegistered = false;

function ensureStyleSanitizerHook() {
  if (styleHookRegistered) {
    return;
  }

  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName !== "style") {
      return;
    }

    const sanitizedStyle = sanitizeInlineStyle(data.attrValue);
    if (!sanitizedStyle) {
      data.keepAttr = false;
      return;
    }

    data.attrValue = sanitizedStyle;
  });

  styleHookRegistered = true;
}

export function sanitizeBlogHtml(html: string) {
  ensureStyleSanitizerHook();

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
}
