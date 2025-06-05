
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

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
        // Update existing post
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
        // Create new post
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

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
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

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Post Details</CardTitle>
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
                className="w-full h-20 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white resize-none"
                placeholder="Brief description of the post"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white resize-none font-mono text-sm"
                placeholder="Write your post content here. You can use HTML tags."
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

            <div className="flex space-x-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
              </Button>
              <Button
                onClick={onCancel}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPostEditor;
