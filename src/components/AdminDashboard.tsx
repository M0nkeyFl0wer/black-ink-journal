
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogPosts } from '@/hooks/useBlogPosts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar, Clock, User, LogOut } from 'lucide-react';
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
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post deleted",
        description: "The post has been successfully removed",
      });
      
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Edit className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Blog Admin</h1>
                <p className="text-gray-600 text-sm">Welcome back, {username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleNewPost} 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                className="rounded-xl border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">All Posts</CardTitle>
              <div className="text-sm text-gray-500">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'} total
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading posts...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 font-medium">Error loading posts</div>
                <p className="text-gray-600 mt-1">{error}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 truncate">{post.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {post.excerpt ? post.excerpt.substring(0, 150) + '...' : 'No excerpt available'}
                      </p>
                      <div className="flex items-center space-x-6 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Created {new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Published {new Date(post.publish_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {post.author}
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          post.is_published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {post.is_published ? 'Published' : 'Draft'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTogglePublished(post)}
                        className="rounded-lg border-gray-300 hover:bg-gray-50"
                      >
                        {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPost(post)}
                        className="rounded-lg border-gray-300 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeletePost(post.id)}
                        className="rounded-lg border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && !loading && !error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Edit className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Get started by creating your first blog post</p>
                <Button 
                  onClick={handleNewPost}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
