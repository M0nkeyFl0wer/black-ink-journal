
import { supabase } from '@/integrations/supabase/client';

export const updateKidsArticle = async () => {
  try {
    console.log('Starting article update...');
    
    const content = `One of Professor Kathryn Harrison's posts caught my eye recently. It raised the question of whether having fewer children is an effective response to climate change. Her kids, Sophie and Sam Harrison, have been fighting climate change since they were young—a heartening reminder that the next generation is passionately involved. The post got me thinking about how we frame responsibility for the climate crisis. All too often, we hear that *personal* choices are the key: drive less, fly less, recycle, even have fewer children.

Spoiler alert: I don't think focusing on personal choices—**especially** the decision to have kids—is the right way to address this emergency. We need to talk about the bigger picture and the systemic drivers of the crisis.

## Personal Choices vs. Systemic Change

A 2017 *Guardian* article [claimed](https://www.theguardian.com/environment/2017/jul/12/want-to-fight-climate-change-have-fewer-children) that the single most effective thing you can do to reduce your carbon footprint is to have one fewer child. On the surface, it sounds logical—but it's also a distraction. David Roberts at *Vox* [called this framing](https://www.vox.com/energy-and-environment/2017/7/26/16004062/kids-climate-change) "goofy," and he's right. The idea of attributing all of a hypothetical child's emissions to a parent is not just impractical—it's misleading.

If you're not having 10 kids this year, are you suddenly a climate hero? Obviously not.

Even if population growth matters, targeting family size in wealthy countries misses the point. Emissions aren't distributed equally. A single American child will emit more carbon than dozens of children in poorer countries. And it's not just about which country you live in—the richest 10% globally are responsible for nearly half of all lifestyle emissions. The problem isn't people having kids. It's the ultra-wealthy and the corporations that profit from climate destruction.

## Beyond Personal Virtue: Solidarity Over Shame

Bethany Hindmarsh, writing in [GUTS Magazine](http://gutsmagazine.ca/motherearth-on/), captures the moral tension perfectly. Many young people are forgoing children—not because they don't want them, but because they've internalized the guilt of contributing to climate change. That guilt is misplaced. As she notes, the only moral arguments that hold water are those based on *solidarity and imagination*.

Having children can be a radical act of hope. And for many parents in the climate movement, it's also fuel for the fire—a reason to fight harder. Let's focus on what kind of world we're building *for* children, rather than framing them as carbon liabilities.

## The Pitfall of "DIY Climate Action"

A [study from Stanford](https://phys.org/news/2017-06-emphasizing-individual-solutions-big-issues.html) found that when people are encouraged to take personal climate action, they often become *less* likely to support systemic solutions like a carbon tax. Why? Because it makes them feel like they've already done their part. This isn't hypothetical—it's a documented psychological effect.

We need both individual and systemic action. But the more we focus on solo lifestyle changes, the more we risk weakening public pressure for real policy reform.

## The Long History of Blaming Individuals

This isn't a new trick. The packaging industry created the "Keep America Beautiful" campaign in the 1950s to fight back against anti-littering laws. That famous "Crying Indian" ad? Pure corporate deflection. The real goal wasn't to stop pollution—it was to stop regulation.

As [Orion Magazine](https://orionmagazine.org/article/the-new-abolitionists/) detailed, industry leaders rebranded waste as a *personal* problem. They trained the public to blame "litterbugs" instead of questioning the rise of single-use packaging. It worked. The same thing happened when BP pushed the concept of a "carbon footprint." They weren't doing that out of the goodness of their hearts—they wanted to make *you* feel responsible, not them.

## Bernays, Corporate Personhood & the Consent Machine

Edward Bernays—father of modern PR—literally wrote the book on this strategy. He helped sell cigarettes to women by branding smoking as feminist liberation. He invented the idea of bacon as a health food by convincing doctors to endorse it. His playbook: appeal to emotion, manipulate public perception, use "experts" to do your bidding.

Fast forward: the same tactics are being used by fossil fuel companies today. And they're protected by law. Thanks to the doctrine of *corporate personhood*, companies can spend unlimited money on politics, claim free speech rights, and avoid meaningful accountability. They've rewritten the rules of democracy to serve themselves.

## Surveillance Capitalism and the New Oligarchy

If you think this ends with oil execs, think again. Tech billionaires like Peter Thiel—who once said "I no longer believe that freedom and democracy are compatible"—are reshaping public life through companies like Palantir. They're building the infrastructure of surveillance, profiting from ICE raids and predictive policing, while quietly pushing anti-democratic ideals.

It's not just what they *do*—it's what they *believe*. Many of these figures see democracy as an obstacle, not a virtue. They prefer governance by algorithm, insulated from public accountability. And they've got the data, dollars, and platforms to make it happen.

## From "Me" to "We"

It's time to shift the conversation. Climate action isn't about shame or guilt—it's about power. About who holds it, who uses it, and who gets left behind. Individual choices can be meaningful, but they're most powerful when they feed into collective movements.

So yes—change your lightbulbs. Ride your bike. Eat less meat. But more importantly: **organize**, **vote**, **protest**, and **build the systems** that make low-carbon living the norm, not the exception. Let's stop letting corporations write the rules while we argue over composting bins.

This isn't about being perfect. It's about being together.

---

**Further Reading:**

- Guardian: ["Want to fight climate change? Have fewer children"](https://www.theguardian.com/environment/2017/jul/12/want-to-fight-climate-change-have-fewer-children)
- Vox (David Roberts): ["Having kids brings up uncomfortable questions about climate change"](https://www.vox.com/energy-and-environment/2017/7/26/16004062/kids-climate-change)
- GUTS Magazine: ["Mother/Earth: On Choosing" by Bethany Hindmarsh](http://gutsmagazine.ca/motherearth-on/)
- Phys.org: ["Emphasizing individual solutions can reduce support for government efforts"](https://phys.org/news/2017-06-emphasizing-individual-solutions-big-issues.html)
- Orion Magazine: ["The Crying Indian" and the roots of personal responsibility propaganda](https://orionmagazine.org/article/the-new-abolitionists/)
- The Guardian (Rebecca Solnit): ["Big oil coined 'carbon footprints' to blame us for their greed"](https://www.theguardian.com/commentisfree/2021/aug/23/big-oil-coined-carbon-footprints-to-blame-us-for-their-greed)

---

*Ben West is a campaigner, strategist, and writer working at the intersection of climate, justice, and democracy.*`;

    // First check if the article exists and what its current content is
    const { data: currentPost } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', 'fewer-kids-climate-emergency')
      .single();

    console.log('Current post content length:', currentPost?.content?.length || 0);
    console.log('New content length:', content.length);

    // Use upsert to ensure the update happens
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert({ 
        slug: 'fewer-kids-climate-emergency',
        title: 'Fewer Kids, Climate Emergency? A Critical Look at Personal vs. Systemic Solutions',
        content: content,
        excerpt: "A critical look at why focusing on having fewer children misses the real drivers of climate change - corporate power and systemic inequality.",
        featured_image: 'https://www.ecowatch.com/wp-content/uploads/2021/10/1543172645-origin.jpg',
        author: 'Ben West',
        publish_date: '2024-12-15',
        tags: ['climate change', 'politics', 'corporate responsibility', 'population', 'systemic change'],
        is_published: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'slug'
      })
      .select();

    if (error) {
      console.error('Upsert error:', error);
      throw error;
    }
    
    console.log('Article upserted successfully:', data);
    
    // Verify the update worked
    const { data: verifyData } = await supabase
      .from('blog_posts')
      .select('content')
      .eq('slug', 'fewer-kids-climate-emergency')
      .single();
    
    console.log('Verification - content length after update:', verifyData?.content?.length || 0);
    
    return data;
  } catch (error) {
    console.error('Error updating kids climate article:', error);
    throw error;
  }
};
