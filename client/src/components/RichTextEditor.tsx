import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link as LinkIcon, Image as ImageIcon,
  Undo, Redo, AlignLeft,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

function ToolbarButton({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "30px",
        height: "30px",
        borderRadius: "3px",
        border: "none",
        background: active ? "#2c7df7" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.7)",
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.background = "transparent";
      }}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.15)", margin: "0 4px", flexShrink: 0 }} />;
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "editor-link" } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: "4px", overflow: "hidden" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "2px",
        padding: "6px 8px",
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1"><Heading1 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2"><Heading2 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3"><Heading3 size={14} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold"><Bold size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic"><Italic size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough"><Strikethrough size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} title="Inline code"><Code size={14} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list"><List size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list"><ListOrdered size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote"><Quote size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule"><Minus size={14} /></ToolbarButton>
        <Divider />
        <ToolbarButton onClick={addLink} active={editor.isActive("link")} title="Add link"><LinkIcon size={14} /></ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add image"><ImageIcon size={14} /></ToolbarButton>
      </div>

      {/* Editor area */}
      <EditorContent
        editor={editor}
        style={{
          minHeight: "400px",
          padding: "1rem",
          background: "rgba(255,255,255,0.02)",
          color: "#fff",
          fontSize: "0.95rem",
          lineHeight: 1.7,
          outline: "none",
        }}
      />

      <style>{`
        .tiptap {
          outline: none;
          min-height: 400px;
        }
        .tiptap p { margin-bottom: 1rem; }
        .tiptap h1 { font-size: 1.75rem; font-weight: 900; margin: 1.5rem 0 0.75rem; }
        .tiptap h2 { font-size: 1.4rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
        .tiptap h3 { font-size: 1.15rem; font-weight: 700; margin: 1.25rem 0 0.5rem; }
        .tiptap ul, .tiptap ol { padding-left: 1.5rem; margin-bottom: 1rem; }
        .tiptap li { margin-bottom: 0.3rem; }
        .tiptap blockquote { border-left: 3px solid #2c7df7; padding: 0.5rem 1rem; margin: 1rem 0; background: rgba(44,125,247,0.08); color: rgba(255,255,255,0.8); font-style: italic; }
        .tiptap code { background: rgba(255,255,255,0.1); padding: 0.1rem 0.4rem; border-radius: 3px; font-size: 0.85em; }
        .tiptap pre { background: rgba(0,0,0,0.4); padding: 1rem; border-radius: 4px; overflow-x: auto; margin-bottom: 1rem; }
        .tiptap pre code { background: none; padding: 0; }
        .tiptap hr { border: none; border-top: 1px solid rgba(255,255,255,0.15); margin: 1.5rem 0; }
        .tiptap img { max-width: 100%; border-radius: 4px; margin: 1rem 0; }
        .tiptap a, .editor-link { color: #2c7df7; text-decoration: underline; }
        .tiptap p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: rgba(255,255,255,0.3); pointer-events: none; float: left; height: 0; }
      `}</style>
    </div>
  );
}
