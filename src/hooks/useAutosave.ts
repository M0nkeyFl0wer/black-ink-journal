
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutosaveData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  tags: string;
  publishDate: string;
  isPublished: boolean;
}

interface UseAutosaveProps {
  data: AutosaveData;
  username: string;
  postId?: string;
  enabled?: boolean;
}

export const useAutosave = ({ data, username, postId, enabled = true }: UseAutosaveProps) => {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [draftId, setDraftId] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');
  const { toast } = useToast();

  const saveDraft = useCallback(async (forceUpdate = false) => {
    if (!enabled || !username) return;

    const currentData = JSON.stringify(data);
    if (!forceUpdate && currentData === lastSavedRef.current) return;

    setSaveStatus('saving');

    try {
      const draftData = {
        title: data.title || 'Untitled',
        slug: data.slug || '',
        content: data.content || '',
        excerpt: data.excerpt || '',
        featured_image: data.featuredImage || '',
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        publish_date: data.publishDate,
        is_published: data.isPublished,
        created_by: username,
        metadata: { 
          original_post_id: postId,
          auto_saved: true,
          last_modified: new Date().toISOString()
        }
      };

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from('blog_drafts')
          .update(draftData)
          .eq('id', draftId);

        if (error) throw error;
      } else {
        // Create new draft
        const { data: newDraft, error } = await supabase
          .from('blog_drafts')
          .insert(draftData)
          .select('id')
          .single();

        if (error) throw error;
        if (newDraft) setDraftId(newDraft.id);
      }

      lastSavedRef.current = currentData;
      setSaveStatus('saved');
    } catch (error: any) {
      console.error('Autosave failed:', error);
      setSaveStatus('unsaved');
      toast({
        title: "Autosave failed",
        description: "Your changes are saved locally. Please save manually.",
        variant: "destructive",
      });
    }
  }, [data, username, postId, draftId, enabled, toast]);

  // Debounced autosave
  useEffect(() => {
    if (!enabled) return;

    setSaveStatus('unsaved');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, 3000); // Save after 3 seconds of inactivity

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, saveDraft, enabled]);

  const loadDraft = useCallback(async (draftIdToLoad: string) => {
    try {
      const { data: draft, error } = await supabase
        .from('blog_drafts')
        .select('*')
        .eq('id', draftIdToLoad)
        .single();

      if (error) throw error;
      return draft;
    } catch (error) {
      console.error('Failed to load draft:', error);
      return null;
    }
  }, []);

  const deleteDraft = useCallback(async () => {
    if (!draftId) return;

    try {
      const { error } = await supabase
        .from('blog_drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;
      setDraftId(null);
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  }, [draftId]);

  return {
    saveStatus,
    saveDraft: () => saveDraft(true),
    loadDraft,
    deleteDraft,
    draftId
  };
};
