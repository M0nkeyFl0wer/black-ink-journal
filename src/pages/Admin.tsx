
import { useState, useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import AdminPostEditor from '@/components/AdminPostEditor';
import DraftsManager from '@/components/DraftsManager';
import PasswordManager from '@/components/PasswordManager';

type AdminView = 'dashboard' | 'editor' | 'drafts' | 'settings';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editingDraft, setEditingDraft] = useState<any>(null);

  useEffect(() => {
    // Check if admin is already logged in
    const loggedIn = localStorage.getItem('admin_logged_in');
    const savedUsername = localStorage.getItem('admin_username');
    
    if (loggedIn === 'true' && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setCurrentView('dashboard');
    setEditingPost(null);
    setEditingDraft(null);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setEditingDraft(null);
    setCurrentView('editor');
  };

  const handleEditDraft = (draft: any) => {
    setEditingDraft(draft);
    setEditingPost(null);
    setCurrentView('editor');
  };

  const handleNewPost = () => {
    setEditingPost(null);
    setEditingDraft(null);
    setCurrentView('editor');
  };

  const handleSavePost = () => {
    setCurrentView('dashboard');
    setEditingPost(null);
    setEditingDraft(null);
  };

  const handleCancelEdit = () => {
    setCurrentView('dashboard');
    setEditingPost(null);
    setEditingDraft(null);
  };

  const renderNavigation = () => (
    <div className="bg-gray-900 border-b border-gray-700 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex space-x-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentView('drafts')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'drafts' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              currentView === 'settings' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            Settings
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome, {username}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (currentView === 'editor') {
    return (
      <AdminPostEditor
        post={editingPost}
        draft={editingDraft}
        username={username}
        onSave={handleSavePost}
        onCancel={handleCancelEdit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {renderNavigation()}
      
      {currentView === 'dashboard' && (
        <AdminDashboard 
          username={username} 
          onLogout={handleLogout}
          onEditPost={handleEditPost}
          onNewPost={handleNewPost}
        />
      )}
      
      {currentView === 'drafts' && (
        <DraftsManager 
          username={username}
          onEditDraft={handleEditDraft}
        />
      )}
      
      {currentView === 'settings' && (
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PasswordManager username={username} />
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Username:</strong> {username}</p>
                  <p><strong>Role:</strong> Administrator</p>
                  <p><strong>Status:</strong> Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
