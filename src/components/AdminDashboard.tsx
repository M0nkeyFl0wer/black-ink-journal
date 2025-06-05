
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminPostEditor from './AdminPostEditor';

interface AdminDashboardProps {
  username: string;
  onLogout: () => void;
}

const AdminDashboard = ({ username, onLogout }: AdminDashboardProps) => {
  const { posts, loading, error } = useBlogPosts();
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_username');
    onLogout();
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted",
      });
      
      // Refresh the page to update the posts list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handleTogglePublished = async (post: any) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          is_published: !post.is_published,
          modified_by: username 
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post updated",
        description: `Post ${!post.is_published ? 'published' : 'unpublished'}`,
      });
      
      // Refresh the page to update the posts list
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update post",
        variant: "destructive",
      });
    }
  };

  if (showEditor) {
    return (
      <AdminPostEditor
        post={editingPost}
        username={username}
        onSave={() => {
          setShowEditor(false);
          window.location.reload();
        }}
        onCancel={() => setShowEditor(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Button onClick={handleNewPost} className="bg-red-600 hover:bg-red-700">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Blog Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && <p className="text-gray-400">Loading posts...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}
            
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-white">{post.title}</h3>
                      <p className="text-gray-400 text-sm">
                        {post.excerpt ? post.excerpt.substring(0, 100) + '...' : 'No excerpt'}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Created: {new Date(post.created_at).toLocaleDateString()}</span>
                        <span>Published: {new Date(post.publish_date).toLocaleDateString()}</span>
                        <span className={post.is_published ? 'text-green-400' : 'text-red-400'}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePublished(post)}
                      >
                        {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPost(post)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
