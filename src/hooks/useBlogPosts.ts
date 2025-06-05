
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author: string;
  publish_date: string;
  tags: string[] | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Update the "Still Crowned" article with full HTML content and proper hero image
        await supabase
          .from('blog_posts')
          .update({
            content: `<div class="prose prose-lg prose-invert max-w-none">
              <p>In the pantheon of technological achievements, few devices have commanded as much reverence—and terror—as the smartphone. It arrived not with fanfare but with the quiet confidence of a revolution disguised as convenience. We welcomed it into our pockets, our homes, our most intimate moments, never suspecting that we were crowning a new king.</p>
              
              <div class="my-8">
                <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Person using smartphone on bed" class="w-full h-64 object-cover rounded-lg" />
              </div>
              
              <p>Today, more than a decade into this reign, we find ourselves subjects in a kingdom we helped build but no longer recognize. The smartphone sits enthroned not just in our hands but in our minds, dictating the rhythm of our days with the subtle tyranny of the perpetually urgent.</p>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">The Coronation We Didn't See Coming</h2>
              
              <p>The smartphone's ascension wasn't dramatic. There were no coups, no manifestos, no clear moment when power changed hands. Instead, it was a gradual seduction—each new feature, each app, each notification training us to bow a little lower, reach a little faster, depend a little more completely.</p>
              
              <div class="my-8">
                <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Circuit board macro photography" class="w-full h-64 object-cover rounded-lg" />
              </div>
              
              <p>We traded our autonomy for convenience, our attention for entertainment, our presence for connection. The bargain seemed fair at the time. Who wouldn't want the world's information at their fingertips? Who could resist the allure of never being truly alone?</p>
              
              <p>But somewhere between the first iPhone and the latest iteration, the relationship shifted. We stopped using our phones and started serving them. The device that was supposed to enhance our lives began to define them.</p>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">The Kingdom's New Rules</h2>
              
              <p>In this new realm, the smartphone has established its own set of laws, as insidious as they are effective:</p>
              
              <ul class="my-6 space-y-3">
                <li><strong class="text-red-400">The Law of Immediate Response:</strong> Every ping, buzz, and flash demands instant attention. To ignore a notification is to commit a minor act of rebellion that feels increasingly difficult to sustain.</li>
                
                <li><strong class="text-red-400">The Law of Perpetual Availability:</strong> We are always on call, always reachable, always expected to respond. The boundaries between work and rest, public and private, have dissolved into the ether of constant connectivity.</li>
                
                <li><strong class="text-red-400">The Law of Manufactured Urgency:</strong> Everything feels urgent because the phone makes it so. The line between what requires immediate attention and what can wait has been deliberately blurred.</li>
                
                <li><strong class="text-red-400">The Law of Artificial Intimacy:</strong> We confide in our phones more than we confide in people. They know our secrets, our desires, our fears—and they use this knowledge to keep us coming back for more.</li>
              </ul>
              
              <div class="my-8">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Woman using laptop computer" class="w-full h-64 object-cover rounded-lg" />
              </div>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">The Psychology of Digital Devotion</h2>
              
              <p>The smartphone's power doesn't rest solely in its technology but in its understanding of human psychology. It exploits our deepest needs and vulnerabilities with surgical precision:</p>
              
              <p><strong class="text-red-400">The Need for Connection:</strong> We are social creatures, hardwired to seek bonds with others. The smartphone promises connection but delivers a simulation—likes instead of love, comments instead of conversation, followers instead of friends.</p>
              
              <p><strong class="text-red-400">The Fear of Missing Out:</strong> FOMO isn't just a millennial affliction; it's a primal anxiety that the smartphone amplifies. Every moment we're not scrolling is a moment we might miss something important, something life-changing, something that defines us as relevant.</p>
              
              <p><strong class="text-red-400">The Dopamine Economy:</strong> Each notification, each new piece of content, each social media interaction triggers a small release of dopamine—the brain's reward chemical. The smartphone has become a slot machine we carry everywhere, offering random rewards that keep us pulling the lever.</p>
              
              <p><strong class="text-red-400">The Illusion of Productivity:</strong> The smartphone convinces us that being busy is the same as being productive, that having access to everything means we're accomplishing something. We mistake motion for progress, scrolling for learning, consuming for creating.</p>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">Life Under the New Monarchy</h2>
              
              <p>Consider how the smartphone has reshaped even our most basic experiences:</p>
              
              <p><strong class="text-red-400">Walking:</strong> Once a time for observation, reflection, or simple movement, walking has become another opportunity for consumption. We listen to podcasts, scroll through feeds, or conduct calls, rarely allowing ourselves the luxury of unmediated experience.</p>
              
              <p><strong class="text-red-400">Waiting:</strong> The art of waiting—once a space for thought, observation, or rest—has been eliminated. Any pause in activity is immediately filled with the phone's offerings. We've lost the ability to be alone with our thoughts.</p>
              
              <div class="my-8">
                <img src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Laptop computer on desk" class="w-full h-64 object-cover rounded-lg" />
              </div>
              
              <p><strong class="text-red-400">Conversation:</strong> Even our interactions with others are mediated by the phone's presence. It sits on the table during dinner, beeps during intimate conversations, and lurks in our pockets during meetings, always ready to steal our attention from the person in front of us.</p>
              
              <p><strong class="text-red-400">Sleep:</strong> The smartphone has colonized even our rest. It's the last thing we see at night and the first thing we reach for in the morning. It tracks our sleep, promises to optimize it, and then disrupts it with blue light and late-night scrolling sessions.</p>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">The Resistance</h2>
              
              <p>Yet for all its power, the smartphone's reign is not absolute. Across the kingdom, small acts of rebellion are emerging:</p>
              
              <p><strong class="text-red-400">Digital Detoxes:</strong> More people are recognizing the need to step away, even temporarily. Weekend phone fasts, app-free hours, and notification purges are becoming acts of self-preservation.</p>
              
              <p><strong class="text-red-400">Intentional Design:</strong> Some are reclaiming agency by redesigning their digital environments—turning phones to grayscale, removing social media apps, using physical alarm clocks instead of phone alarms.</p>
              
              <p><strong class="text-red-400">Analog Renaissance:</strong> Books, vinyl records, film cameras, and handwritten letters are experiencing a revival among those seeking experiences that can't be digitized, shared, or optimized.</p>
              
              <p><strong class="text-red-400">Mindful Usage:</strong> A growing movement advocates for conscious consumption of digital content—asking not just what we can access, but what we should access, and when.</p>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">The Path Forward</h2>
              
              <p>The smartphone is not inherently evil, nor is our relationship with it irredeemably broken. The device itself is merely a tool—extraordinarily sophisticated, undeniably useful, but still just a tool. The problem lies not in the technology but in our abdication of choice over how we use it.</p>
              
              <p>Reclaiming our autonomy requires us to:</p>
              
              <p><strong class="text-red-400">Acknowledge the Phone's Power:</strong> We can't resist what we don't recognize. Admitting that the smartphone has more influence over our behavior than we'd like to believe is the first step toward regaining control.</p>
              
              <p><strong class="text-red-400">Define Our Own Terms:</strong> Instead of letting the phone dictate when and how we interact with it, we must establish our own boundaries. This means deciding when to be available, what notifications deserve our attention, and how much of our mental space we're willing to rent out.</p>
              
              <p><strong class="text-red-400">Practice Digital Minimalism:</strong> Not every app needs to be installed, not every notification needs to be enabled, and not every moment needs to be documented or optimized. Sometimes, less is exponentially more.</p>
              
              <p><strong class="text-red-400">Cultivate Real-World Richness:</strong> The smartphone's appeal partly stems from the poverty of our offline experiences. By enriching our physical world—through relationships, hobbies, nature, art—we reduce our dependence on digital stimulation.</p>
              
              <p><strong class="text-red-400">Remember What We've Lost:</strong> Boredom, solitude, undivided attention, unmediated experience—these aren't bugs in the human experience but features. They're spaces where creativity, reflection, and genuine connection flourish.</p>
              
              <h2 class="text-3xl font-bold mt-12 mb-6 text-white">The Long Game</h2>
              
              <p>The smartphone revolution is still young, and its ultimate impact on human society remains to be written. We stand at a crossroads where we can either accept our role as subjects in the smartphone's kingdom or work to ensure that technology serves humanity rather than the reverse.</p>
              
              <p>This isn't about rejecting progress or returning to a pre-digital age. It's about being intentional, conscious, and selective about how we integrate these powerful tools into our lives. It's about remembering that we are still the ones with the power to choose—if we're willing to exercise it.</p>
              
              <p>The smartphone may still be crowned, but we need not kneel. In the end, the most radical act might be the simplest one: putting the phone down and looking up at the world that exists beyond the screen.</p>
              
              <p>After all, the kingdom we really want to live in is the one we build with our own hands, our own voices, and our own presence—not the one that fits in our pocket.</p>
            </div>`,
            featured_image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
          })
          .eq('slug', 'still-crowned');

        // Update the cybersecurity article with infosec tag and proper hero image
        await supabase
          .from('blog_posts')
          .update({
            tags: ['infosec'],
            featured_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3543&q=80'
          })
          .eq('slug', 'how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home');

        // Update the kids article with proper computer/tech hero image
        await supabase
          .from('blog_posts')
          .update({
            featured_image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=6000&q=80'
          })
          .eq('slug', 'when-your-kid-asks-how-computers-work');

        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('is_published', true)
          .order('publish_date', { ascending: false });

        if (error) throw error;
        
        setPosts(data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return { posts, loading, error };
};

export const useBlogPost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .maybeSingle();

        if (error) throw error;
        setPost(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  return { post, loading, error };
};
