"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { FontSize, FONT_SIZE_OPTIONS } from "@/lib/tiptap/font-size";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "rounded px-2 py-1 text-xs font-semibold transition-colors",
        active ? "bg-[#00aeef] text-white" : "bg-white text-[#334] hover:bg-[#eef4fa]",
      )}
    >
      {children}
    </button>
  );
}

function getActiveFontSize(editor: NonNullable<ReturnType<typeof useEditor>>) {
  const attrs = editor.getAttributes("textStyle");
  return typeof attrs.fontSize === "string" ? attrs.fontSize : "";
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      TextStyle,
      FontSize,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#00aeef] underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "outline-none",
        "data-placeholder": "Write your blog post content here...",
      },
    },
    onUpdate: ({ editor: current }) => {
      onChange(current.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className={cn("rounded-md border border-[#d5dee7] bg-white px-4 py-8 text-sm text-[#5b6b7a]", className)}>
        Loading editor...
      </div>
    );
  }

  function setLink() {
    const previous = editor?.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL", previous || "https://");
    if (url === null) {
      return;
    }
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const activeFontSize = getActiveFontSize(editor);

  return (
    <div className={cn("rich-text-editor overflow-hidden rounded-md border border-[#d5dee7] bg-white", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b border-[#e8eef4] bg-[#f7fafc] p-2">
        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-[#d5dee7]" aria-hidden />

        <ToolbarButton
          title="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Body
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>

        <label className="ml-1 flex items-center gap-1 text-xs font-semibold text-[#334]">
          <span className="sr-only">Font size</span>
          <select
            value={activeFontSize}
            onChange={(event) => {
              const nextSize = event.target.value;
              if (!nextSize) {
                editor.chain().focus().unsetFontSize().run();
                return;
              }
              editor.chain().focus().setFontSize(nextSize).run();
            }}
            className="rounded border border-[#d5dee7] bg-white px-2 py-1 text-xs font-semibold text-[#334] outline-none focus:border-[#00aeef]"
          >
            <option value="">Size</option>
            {FONT_SIZE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <span className="mx-1 h-5 w-px bg-[#d5dee7]" aria-hidden />

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive("link")} onClick={setLink}>
          Link
        </ToolbarButton>
        <ToolbarButton
          title="Align left"
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          Left
        </ToolbarButton>
        <ToolbarButton
          title="Align center"
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          Center
        </ToolbarButton>
        <ToolbarButton
          title="Align right"
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          Right
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
