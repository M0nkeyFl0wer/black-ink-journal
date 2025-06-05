
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Clock, Trash2, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Draft {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

interface DraftsManagerProps {
  username: string;
  onEditDraft: (draft: Draft) => void;
}

const DraftsManager = ({ username, onEditDraft }: DraftsManagerProps) => {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDrafts();
  }, [username]);

  const loadDrafts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_drafts')
        .select('*')
        .eq('created_by', username)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load drafts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDraft = async (draftId: string) => {
    try {
      const { error } = await supabase
        .from('blog_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(drafts.filter(draft => draft.id !== draftId));
      toast({
        title: "Draft deleted",
        description: "The draft has been permanently deleted",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete draft",
        variant: "destructive",
      });
    }
  };

  const cleanupOldDrafts = async () => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { error } = await supabase
        .from('blog_drafts')
        .delete()
        .eq('created_by', username)
        .lt('updated_at', thirtyDaysAgo.toISOString());

      if (error) throw error;

      await loadDrafts();
      toast({
        title: "Cleanup complete",
        description: "Old drafts (30+ days) have been removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to cleanup old drafts",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Drafts ({drafts.length})
        </h2>
        {drafts.length > 0 && (
          <Button
            onClick={cleanupOldDrafts}
            variant="outline"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Cleanup Old Drafts
          </Button>
        )}
      </div>

      {drafts.length === 0 ? (
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No drafts found</p>
            <p className="text-sm text-gray-500 mt-2">
              Drafts are automatically saved while you write
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <Card key={draft.id} className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-1">
                      {draft.title || 'Untitled Draft'}
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-400 space-x-4">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDistanceToNow(new Date(draft.updated_at), { addSuffix: true })}
                      </span>
                      <span>
                        {Math.round(draft.content.length / 5)} words
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => onEditDraft(draft)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteDraft(draft.id)}
                      size="sm"
                      variant="outline"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-gray-300 text-sm line-clamp-2">
                  {draft.content.replace(/<[^>]*>/g, '').substring(0, 200)}...
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DraftsManager;
