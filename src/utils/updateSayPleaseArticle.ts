
import { supabase } from '@/integrations/supabase/client';

export const updateSayPleaseArticle = async () => {
  try {
    console.log('Updating Say Please and Thank You article...');
    
    const updatedContent = `**Update:** This story was first posted years ago, before the explosion of interest in AI assistants like Open AI, and the massive expansion of voice assistants now being attached to every product in every industry. This has opened to door to troubling new military and surveillance use cases for AI assistants and massive new demands for electricity to run these data centers. The conversation about our relationship with AI technology is more important now than ever.

[The True Cost of Generative AI Data Centers and Energy](https://www.wired.com/story/true-cost-generative-ai-data-centers-energy/)

[The Global Expansion of AI Surveillance](https://carnegieendowment.org/research/2019/09/the-global-expansion-of-ai-surveillance?lang=en)

[The Risks and Inefficacies of AI Systems in Military Targeting Support](https://blogs.icrc.org/law-and-policy/2024/09/04/the-risks-and-inefficacies-of-ai-systems-in-military-targeting-support/)

---

The other day I noticed myself saying "please" and "thank you" to Siri. It felt a little weird. I thought I was just being polite, but then I wondered: Is this actually making me a more polite person in general? Or am I just training myself to be nice to machines?

There's something fascinating about how we naturally anthropomorphize AI assistants. We give them names, we apologize when we interrupt them, and we feel a little guilty when we bark commands without pleasantries. But what's really happening here?

## The Psychology of Politeness with Machines

Research suggests that we apply social rules to computers almost automatically. It's called the "Media Equation" - we treat media and technology as if they were real people, even when we know better. So when I say "please" to Siri, I'm not just being weird - I'm following a deeply ingrained social script.

But here's where it gets interesting: Does being polite to machines make us more polite to humans? The research is mixed, but there are some compelling arguments on both sides.

## The Case for Digital Politeness

Some researchers argue that practicing politeness - even with machines - reinforces neural pathways associated with courteous behavior. It's like muscle memory for manners. If you're in the habit of saying "please" and "thank you" to your phone, you're more likely to extend the same courtesy to the barista at your coffee shop.

There's also the modeling argument: If children see adults being polite to Alexa, they learn that politeness is a default mode of interaction, not something you selectively apply based on who (or what) you're talking to.

## The Case Against

On the flip side, some worry that being overly accommodating to AI might actually make us less assertive with humans. If we're constantly softening our language for machines that don't actually have feelings, are we losing our ability to be direct when directness is needed?

There's also the power dynamic to consider. AI assistants are designed to serve us without complaint. Being overly polite to them might reinforce an expectation that service workers should also accept any treatment without pushback.

## What I've Decided

After thinking about it, I've decided to keep saying "please" and "thank you" to Siri. Not because I think she has feelings, but because I want politeness to be my default mode. I want courtesy to be so automatic that it extends to everyone - humans, machines, and everything in between.

Plus, there's something to be said for maintaining our humanity in an increasingly digital world. If being polite to machines helps me stay connected to the values I want to embody, then it's worth the occasional weird look when someone overhears me thanking my GPS.

The real question isn't whether machines deserve our politeness - it's whether we deserve to be the kind of people who choose kindness as a default, regardless of who or what is on the receiving end.

*What do you think? Do you find yourself being polite to AI assistants? I'd love to hear your thoughts.*`;

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ 
        content: updatedContent,
        updated_at: new Date().toISOString()
      })
      .eq('slug', 'say-please-and-thank-you')
      .select();

    if (error) {
      console.error('Update error:', error);
      throw error;
    }
    
    console.log('Say Please and Thank You article updated successfully:', data);
    
    return data;
  } catch (error) {
    console.error('Error updating Say Please and Thank You article:', error);
    throw error;
  }
};
