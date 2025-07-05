import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Type, FolderOpen } from 'lucide-react';
import ImageBrowser from './ImageBrowser';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload: (file: File) => Promise<string>;
}

const RichTextEditor = ({ content, onChange, onImageUpload }: RichTextEditorProps) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageBrowser, setShowImageBrowser] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-700 underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none min-h-[400px] p-6 focus:outline-none',
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

  const handleSelectImageFromBrowser = (url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
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
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex flex-wrap gap-1">
          <div className="flex items-center space-x-1 pr-3 border-r border-gray-300">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`rounded-lg h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`rounded-lg h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
              <Italic className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 px-3 border-r border-gray-300">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`rounded-lg h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`rounded-lg h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`rounded-lg h-8 w-8 p-0 ${editor.isActive('blockquote') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200'}`}
            >
              <Quote className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 px-3 border-r border-gray-300">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowLinkDialog(true)}
              className="rounded-lg h-8 w-8 p-0 hover:bg-gray-200"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="relative rounded-lg h-8 w-8 p-0 hover:bg-gray-200"
              title="Upload new image"
            >
              <ImageIcon className="w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowImageBrowser(true)}
              className="rounded-lg h-8 w-8 p-0 hover:bg-gray-200"
              title="Browse existing images"
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 pl-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="rounded-lg h-8 w-8 p-0 hover:bg-gray-200 disabled:opacity-50"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="rounded-lg h-8 w-8 p-0 hover:bg-gray-200 disabled:opacity-50"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
      
      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
          <Input
            placeholder="Enter URL (https://example.com)"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="rounded-lg border-gray-300"
          />
          <Input
            placeholder="Link text (optional)"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className="rounded-lg border-gray-300"
          />
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAddLink}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Add Link
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowLinkDialog(false)}
              className="rounded-lg border-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Image Browser Modal */}
      {showImageBrowser && (
        <ImageBrowser
          onSelectImage={handleSelectImageFromBrowser}
          onClose={() => setShowImageBrowser(false)}
        />
      )}
    </div>
  );
};

export default RichTextEditor;
