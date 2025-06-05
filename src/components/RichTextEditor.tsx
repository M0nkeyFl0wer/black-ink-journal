
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

const RichTextEditor = ({ content, onChange, onImageUpload }: RichTextEditorProps) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-400 hover:text-blue-300 underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editor) {
      try {
        const imageUrl = await onImageUpload(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    }
  };

  const handleAddLink = () => {
    if (linkUrl && editor) {
      if (linkText) {
        editor.chain().focus().insertContent(`<a href="${linkUrl}">${linkText}</a>`).run();
      } else {
        editor.chain().focus().setLink({ href: linkUrl }).run();
      }
      setShowLinkDialog(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-600 rounded-lg bg-gray-800">
      <div className="border-b border-gray-600 p-3 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-600' : ''}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-600' : ''}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-600' : ''}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-600' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-600' : ''}
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowLinkDialog(true)}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" className="relative">
          <ImageIcon className="w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </Button>
        <div className="border-l border-gray-600 mx-2" />
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>
      
      <EditorContent editor={editor} className="text-white" />
      
      {showLinkDialog && (
        <div className="border-t border-gray-600 p-3 space-y-2">
          <Input
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
          <Input
            placeholder="Link text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="bg-gray-700 border-gray-600"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddLink}>
              Add Link
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
