import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  FiBold,
  FiItalic,
  FiList,
  FiCode,
} from "react-icons/fi";
import { LuHeading2, LuListOrdered, LuQuote, LuUndo, LuRedo } from "react-icons/lu";

interface RichTextEditorProps {
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  label,
  required,
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] px-3 py-2.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none prose prose-sm dark:prose-invert max-w-none",
      },
    },
  });

  if (!editor) return null;

  const toolbarButton = (
    icon: React.ReactNode,
    onClick: () => void,
    isActive: boolean,
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
        isActive ? "bg-gray-100 dark:bg-gray-700 text-brand-blue" : "text-brand-gray-dark dark:text-gray-300"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div>
      {label && (
        <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="flex items-center gap-1 border-b border-gray-100 dark:border-gray-800 px-2 py-1.5 flex-wrap">
          {toolbarButton(<FiBold className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleBold().run(), editor.isActive("bold"))}
          {toolbarButton(<FiItalic className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleItalic().run(), editor.isActive("italic"))}
          {toolbarButton(<FiCode className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleCode().run(), editor.isActive("code"))}

          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

          {toolbarButton(<LuHeading2 className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive("heading", { level: 2 }))}
          {toolbarButton(<FiList className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleBulletList().run(), editor.isActive("bulletList"))}
          {toolbarButton(<LuListOrdered className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive("orderedList"))}
          {toolbarButton(<LuQuote className="w-3.5 h-3.5" />, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive("blockquote"))}

          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

          {toolbarButton(<LuUndo className="w-3.5 h-3.5" />, () => editor.chain().focus().undo().run(), false)}
          {toolbarButton(<LuRedo className="w-3.5 h-3.5" />, () => editor.chain().focus().redo().run(), false)}
        </div>

        <EditorContent editor={editor} />
      </div>
    </div>
  );
}