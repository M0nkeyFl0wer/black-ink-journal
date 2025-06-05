
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Plus, Edit, Trash2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/hooks/useBlogPosts";

const Admin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetchPosts();
    
    // Check if we should open editor for specific post
    const editId = searchParams.get('edit');
    if (editId) {
      setShowEditor(true);
    }
  }, [searchParams]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setFeaturedImage("");
    setTags("");
    setIsPublished(false);
    setEditingPost(null);
  };

  const handleNewPost = () => {
    resetForm();
    setShowEditor(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt || "");
    setContent(post.content);
    setFeaturedImage(post.featured_image || "");
    setTags(post.tags?.join(", ") || "");
    setIsPublished(post.is_published);
    setShowEditor(true);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    const finalSlug = slug || generateSlug(title);
    const tagsArray = tags.split(",").map(tag => tag.trim()).filter(tag => tag);

    try {
      const postData = {
        title,
        slug: finalSlug,
        excerpt: excerpt || null,
        content,
        featured_image: featuredImage || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        is_published: isPublished,
        publish_date: new Date().toISOString(),
      };

      if (editingPost) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Post updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Post created successfully",
        });
      }

      setShowEditor(false);
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  if (showEditor) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="flex items-center justify-between p-6 border-b border-gray-800">
          <Button
            variant="ghost"
            onClick={() => setShowEditor(false)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsPublished(!isPublished)}
            >
              {isPublished ? "Published" : "Draft"}
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Post title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slug) setSlug(generateSlug(e.target.value));
              }}
              className="text-2xl font-bold bg-gray-900 border-gray-700"
            />
            
            <Input
              placeholder="URL slug (auto-generated from title)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="bg-gray-900 border-gray-700"
            />
            
            <Input
              placeholder="Featured image URL (optional)"
              value={featuredImage}
              onChange={(e) => setFeaturedImage(e.target.value)}
              className="bg-gray-900 border-gray-700"
            />
            
            <Input
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="bg-gray-900 border-gray-700"
            />
            
            <Textarea
              placeholder="Excerpt (optional)"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="bg-gray-900 border-gray-700"
              rows={3}
            />
            
            <Textarea
              placeholder="Content (supports HTML)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="bg-gray-900 border-gray-700 min-h-96"
              rows={20}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between p-6 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-bold">Blog Admin</h1>
        </div>
        <Button onClick={handleNewPost}>
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="text-center text-gray-400">Loading posts...</div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="border border-gray-800 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-bold">{post.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        post.is_published
                          ? "bg-green-600 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}
                    >
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    {post.excerpt || "No excerpt"}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    Created: {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {post.is_published && (
                    <Link to={`/post/${post.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPost(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
