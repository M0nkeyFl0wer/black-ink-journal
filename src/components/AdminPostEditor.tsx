import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, Code, Type } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import { uploadImage } from '@/utils/imageUpload';

interface AdminPostEditorProps {
  post?: any;
  username: string;
  onSave: () => void;
  onCancel: () => void;
}

const AdminPostEditor = ({ post, username, onSave, onCancel }: AdminPostEditorProps) => {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [featuredImage, setFeaturedImage] = useState(post?.featured_image || '');
  const [tags, setTags] = useState(post?.tags?.join(', ') || '');
  const [publishDate, setPublishDate] = useState(
    post?.publish_date ? new Date(post.publish_date).toISOString().slice(0, 16) : 
    new Date().toISOString().slice(0, 16)
  );
  const [isPublished, setIsPublished] = useState(post?.is_published ?? true);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isMarkdownMode, setIsMarkdownMode] = useState(false);
  const { toast } = useToast();

  // Auto-generate slug from title
  useEffect(() => {
    if (title && !post) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setSlug(generatedSlug);
    }
  }, [title, post]);

  // Detect if content is markdown when loading
  useEffect(() => {
    if (post?.content) {
      const hasMarkdown = post.content.includes('**') || post.content.includes('[') || post.content.includes('##');
      const isHtml = post.content.includes('<p>') || post.content.includes('<div>');
      if (hasMarkdown && !isHtml) {
        setIsMarkdownMode(true);
      }
    }
  }, [post]);

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      return await uploadImage(file);
    } catch (error: any) {
      toast({
        title: "Image upload failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Function to convert markdown to HTML for preview
  const convertMarkdownToHtml = (content: string): string => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h2>')
      .replace(/^---$/gm, '<hr class="border-gray-600 my-8" />')
      .split('\n\n')
      .map(paragraph => {
        if (paragraph.trim() === '') return '';
        if (paragraph.includes('<h2>') || paragraph.includes('<hr')) return paragraph;
        return `<p class="mb-4 leading-relaxed">${paragraph.replace(/\n/g, '<br>')}</p>`;
      })
      .join('\n');
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title, slug, and content are required",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const postData = {
        title,
        slug,
        excerpt: excerpt.trim() || null,
        content,
        featured_image: featuredImage.trim() || null,
        tags: tags.trim() ? tags.split(',').map(tag => tag.trim()) : null,
        publish_date: publishDate,
        is_published: isPublished,
        author: 'Ben West',
        modified_by: username,
      };

      if (post) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);

        if (error) throw error;

        toast({
          title: "Post updated",
          description: "The post has been successfully updated",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert({
            ...postData,
            created_by: username,
          });

        if (error) throw error;

        toast({
          title: "Post created",
          description: "The post has been successfully created",
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showPreview) {
    const previewContent = isMarkdownMode ? convertMarkdownToHtml(content) : content;
    
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              onClick={() => setShowPreview(false)} 
              variant="ghost" 
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Editor
            </Button>
          </div>
          
          <article className="prose prose-invert max-w-none">
            <h1>{title}</h1>
            {featuredImage && (
              <img src={featuredImage} alt={title} className="w-full rounded-lg" />
            )}
            <div dangerouslySetInnerHTML={{ __html: previewContent }} />
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              onClick={onCancel} 
              variant="ghost" 
              className="mr-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">
              {post ? 'Edit Post' : 'New Post'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="mr-4"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Content</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setIsMarkdownMode(false)}
                      variant={!isMarkdownMode ? "default" : "ghost"}
                      size="sm"
                      className="text-xs"
                    >
                      <Type className="w-3 h-3 mr-1" />
                      Rich
                    </Button>
                    <Button
                      onClick={() => setIsMarkdownMode(true)}
                      variant={isMarkdownMode ? "default" : "ghost"}
                      size="sm"
                      className="text-xs"
                    >
                      <Code className="w-3 h-3 mr-1" />
                      Markdown
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Content *
                  </label>
                  {isMarkdownMode ? (
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white min-h-[400px] font-mono"
                      placeholder="Write your content in markdown..."
                    />
                  ) : (
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      onImageUpload={handleImageUpload}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Post Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Slug *
                  </label>
                  <Input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="post-url-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white resize-none text-sm"
                    placeholder="Brief description of the post"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Featured Image URL
                  </label>
                  <Input
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="essays, commentary, politics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Publish Date
                  </label>
                  <Input
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="published" className="text-gray-300">
                    Publish immediately
                  </label>
                </div>

                <div className="pt-4 space-y-2">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-red-600 hover:bg-red-700"
                  >
                    {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
                  </Button>
                  <Button
                    onClick={onCancel}
                    variant="outline"
                    disabled={loading}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPostEditor;
