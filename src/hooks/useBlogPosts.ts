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
        // Update the "Still Crowned" article with the original formatting and your uploaded images
        await supabase
          .from('blog_posts')
          .update({
            content: `<div class="prose prose-lg prose-invert max-w-none">
              <img src="/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png" alt="Banner image" class="w-full h-64 object-cover rounded-lg mb-8" />
              
              <p><strong>By Ben West</strong></p>
              
              <p>At the recent swearing-in ceremony for Canada's newest ministers, one detail stood out. Not the cabinet picks (we could talk about that too), but the words they were made to say: a solemn pledge of allegiance to "His Majesty King Charles the Third, his heirs and successors."</p>
              
              <p>In 2025. In a modern democracy. In a country where we pride ourselves on being independent, progressive, and self-governing, we are still asking ministers to pledge fealty not to the people, not even to the Constitution, but to a literal king.</p>
              
              <div class="my-8">
                <img src="/lovable-uploads/df044dcd-032f-40de-9ec9-74a2eee4d38a.png" alt="Still here. Still crowned." class="w-full h-64 object-cover rounded-lg" />
                <p class="text-sm text-gray-400 italic mt-2">Still here. Still crowned.</p>
              </div>
              
              <p>And not just a king. This king. The guy who couldn't even get his own pens to work during his coronation tour. The guy who wears jewels stolen from colonized nations and sits atop an institution built on centuries of slavery, imperialism, and violent dispossession.</p>
              
              <p>Let's be clear. This isn't just ceremonial fluff. Canada may pretend to be a modern democracy with a decorative crown, but the reality is more twisted. We are a monarchy pretending not to be one. The consequences of that show up in subtle and not-so-subtle ways.</p>
              
              <p>Today, King Charles III is delivering the Speech from the Throne. This marks the first time in 48 years that a reigning monarch has done so in Canada, and only the third time ever. Queen Elizabeth II read the speech in 1957 and again in 1977, both during symbolic royal tours. But this one hits differently. It is not just a visit. It is a reminder.</p>
              
              <p>A symbolic move, sure. But symbols matter. And in the context of a rising authoritarian wave south of the border, the timing feels more than ironic.</p>
              
              <p>Because while the Republican Party in the U.S. has rallied behind a man who believes he is a king, here we are in Canada claiming we are not one, while having our ministers swear loyalty to a royal family. It is cosplay constitutionalism. And I say this with respect to cosplay.</p>
              
              <p>The irony goes deeper. People who oppose monarchy are often labeled republicans, as if rejecting hereditary power aligns them with the authoritarian brand now controlling the U.S. Republican Party. We need a better word. Because the answer to one totalitarian regime is not to run back to the mothership of imperial institutions and a deeply corrupt family.</p>
              
              <p>Now, you might be saying, "Ben, come on. The monarchy doesn't really have power in Canada." But it does. Not in the daily business of government, no. But in moments of crisis, the Crown's representatives, our Governor General and the Lieutenant Governors, hold real reserve powers. They have exercised them before. They could again.</p>
              
              <p>Remember 2017? Christy Clark, then Premier of British Columbia, lost the confidence of the Legislature. Rather than dissolve Parliament as she requested, Lieutenant Governor Judith Guichon invited John Horgan to form government. That is not just a ribbon-cutting role. That is power.</p>
              
              <p>Or take Stephen Harper's 2008 prorogation crisis. Facing a confidence vote he was likely to lose, he asked the Governor General to prorogue Parliament. Michaëlle Jean agreed. Many framed it as a wise avoidance of crisis. But in truth, a majority of MPs had signed a letter expressing their desire to form an alternative government. The Governor General made a choice. She backed the sitting Prime Minister instead of the stated will of the majority. That is not democratic restraint. That is institutional bias dressed up as neutrality.</p>
              
              <p>Mark Carney, now Prime Minister and former head of both the Bank of Canada and the Bank of England, has defended this arrangement as a bulwark of Canadian sovereignty. But is it? Or is it just stability through tradition? Are we clinging to symbols of empire to avoid real conversations about democratic renewal?</p>
              
              <p>Then there is the Privy Council, the constitutional club you join when you become a Cabinet Minister. The oath is not about transparency. It includes lifelong secrecy to the monarch, not to the public. There is no mention of whistleblower protections or conscience exceptions. Just loyalty. Just silence.</p>
              
              <p>While no minister has likely been prosecuted for breaking that oath, the structure is chilling. The Crown remains the legal embodiment of the state. That is why criminal cases are "R v. You." R for Rex. You are not up against the state. You are up against the King.</p>
              
              <p>The spectacle is everywhere. Take the ceremonial mace, or sceptre, that sits in Parliament. It is not just a shiny prop. It is a symbol of royal authority. The House of Commons cannot legally sit without it. Before each session, it is marched in to signal the King's blessing. Yes. Still.</p>
              
              <p>Here is the kicker. Changing this is hard. Every province must agree. It is constitutional trench warfare. Abolishing the monarchy would require a kind of national consensus we can barely achieve on anything.</p>
              
              <p>But we do not need full abolition to act. There are workarounds.</p>
              
              <p>We can amend legislation to remove unnecessary royal language in pledges and oaths. We can emphasize allegiance to the Constitution, to the Charter, or to the people of Canada, rather than to a monarch. We can reform the use of reserve powers to ensure transparency and democratic accountability.</p>
              
              <p>Most of all, we can talk about it. The Speech from the Throne is a perfect opportunity. Not just to ask who reads the speech, but who the speech is for.</p>
              
              <p>We can respect the King as a human being, especially during a difficult chapter of his life and health. But respect does not require submission. And a modern democracy cannot define its legitimacy through inherited power, even politely.</p>
              
              <p>Our sovereignty should reflect our values. It should be rooted in accountability, justice, and the will of the people, not a colonial tradition or a crown passed down by birthright. We are more than a subject nation, and our future depends on acting like it.</p>
              
              <div class="my-8">
                <img src="/lovable-uploads/6def8f02-867c-4f10-ae29-87a5c29c4322.png" alt="Minister pledging allegiance to King Charles III" class="w-full h-64 object-cover rounded-lg" />
                <p class="text-sm text-gray-400 italic mt-2">Marjorie Michel being sworn in as Minister of Health, pledging "true allegiance" to King Charles III — as seen in CBC's live broadcast of Carney's new cabinet.</p>
              </div>
            </div>`,
            featured_image: '/lovable-uploads/82867a2d-c687-4042-992d-c0841d74606e.png'
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
