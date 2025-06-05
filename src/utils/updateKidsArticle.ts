
import { supabase } from '@/integrations/supabase/client';

export const updateKidsArticle = async () => {
  const formattedContent = `<p>One of Professor Kathryn Harrison's posts caught my eye recently. It raised the question of whether having fewer children is an effective response to climate change. Her kids, Sophie and Sam Harrison, have been fighting climate change since they were young—a heartening reminder that the next generation is passionately involved. The post got me thinking about how we frame responsibility for the climate crisis. All too often, we hear that <em>personal</em> choices are the key: drive less, fly less, recycle, even have fewer children.</p>

<p>Spoiler alert: I don't think focusing on personal choices—<strong>especially</strong> the decision to have kids—is the right way to address this emergency. We need to talk about the bigger picture and the systemic drivers of the crisis.</p>

<h2>Personal Choices vs. Systemic Change</h2>

<p>A 2017 <em>Guardian</em> article <a href="https://www.theguardian.com/environment/2017/jul/12/want-to-fight-climate-change-have-fewer-children">claimed</a> that the single most effective thing you can do to reduce your carbon footprint is to have one fewer child. On the surface, it sounds logical—but it's also a distraction. David Roberts at <em>Vox</em> <a href="https://www.vox.com/energy-and-environment/2017/7/26/16004062/kids-climate-change">called this framing</a> "goofy," and he's right. The idea of attributing all of a hypothetical child's emissions to a parent is not just impractical—it's misleading.</p>

<p>If you're not having 10 kids this year, are you suddenly a climate hero? Obviously not.</p>

<p>Even if population growth matters, targeting family size in wealthy countries misses the point. Emissions aren't distributed equally. A single American child will emit more carbon than dozens of children in poorer countries. And it's not just about which country you live in—the richest 10% globally are responsible for nearly half of all lifestyle emissions. The problem isn't people having kids. It's the ultra-wealthy and the corporations that profit from climate destruction.</p>

<h2>Beyond Personal Virtue: Solidarity Over Shame</h2>

<p>Bethany Hindmarsh, writing in <a href="http://gutsmagazine.ca/motherearth-on/">GUTS Magazine</a>, captures the moral tension perfectly. Many young people are forgoing children—not because they don't want them, but because they've internalized the guilt of contributing to climate change. That guilt is misplaced. As she notes, the only moral arguments that hold water are those based on <em>solidarity and imagination</em>.</p>

<p>Having children can be a radical act of hope. And for many parents in the climate movement, it's also fuel for the fire—a reason to fight harder. Let's focus on what kind of world we're building <em>for</em> children, rather than framing them as carbon liabilities.</p>

<h2>The Pitfall of "DIY Climate Action"</h2>

<p>A <a href="https://phys.org/news/2017-06-emphasizing-individual-solutions-big-issues.html">study from Stanford</a> found that when people are encouraged to take personal climate action, they often become <em>less</em> likely to support systemic solutions like a carbon tax. Why? Because it makes them feel like they've already done their part. This isn't hypothetical—it's a documented psychological effect.</p>

<p>We need both individual and systemic action. But the more we focus on solo lifestyle changes, the more we risk weakening public pressure for real policy reform.</p>

<h2>The Long History of Blaming Individuals</h2>

<p>This isn't a new trick. The packaging industry created the "Keep America Beautiful" campaign in the 1950s to fight back against anti-littering laws. That famous "Crying Indian" ad? Pure corporate deflection. The real goal wasn't to stop pollution—it was to stop regulation.</p>

<p>As <a href="https://orionmagazine.org/article/the-new-abolitionists/">Orion Magazine</a> detailed, industry leaders rebranded waste as a <em>personal</em> problem. They trained the public to blame "litterbugs" instead of questioning the rise of single-use packaging. It worked. The same thing happened when BP pushed the concept of a "carbon footprint." They weren't doing that out of the goodness of their hearts—they wanted to make <em>you</em> feel responsible, not them.</p>

<h2>Bernays, Corporate Personhood & the Consent Machine</h2>

<p>Edward Bernays—father of modern PR—literally wrote the book on this strategy. He helped sell cigarettes to women by branding smoking as feminist liberation. He invented the idea of bacon as a health food by convincing doctors to endorse it. His playbook: appeal to emotion, manipulate public perception, use "experts" to do your bidding.</p>

<p>Fast forward: the same tactics are being used by fossil fuel companies today. And they're protected by law. Thanks to the doctrine of <em>corporate personhood</em>, companies can spend unlimited money on politics, claim free speech rights, and avoid meaningful accountability. They've rewritten the rules of democracy to serve themselves.</p>

<h2>Surveillance Capitalism and the New Oligarchy</h2>

<p>If you think this ends with oil execs, think again. Tech billionaires like Peter Thiel—who once said "I no longer believe that freedom and democracy are compatible"—are reshaping public life through companies like Palantir. They're building the infrastructure of surveillance, profiting from ICE raids and predictive policing, while quietly pushing anti-democratic ideals.</p>

<p>It's not just what they <em>do</em>—it's what they <em>believe</em>. Many of these figures see democracy as an obstacle, not a virtue. They prefer governance by algorithm, insulated from public accountability. And they've got the data, dollars, and platforms to make it happen.</p>

<h2>From "Me" to "We"</h2>

<p>It's time to shift the conversation. Climate action isn't about shame or guilt—it's about power. About who holds it, who uses it, and who gets left behind. Individual choices can be meaningful, but they're most powerful when they feed into collective movements.</p>

<p>So yes—change your lightbulbs. Ride your bike. Eat less meat. But more importantly: <strong>organize</strong>, <strong>vote</strong>, <strong>protest</strong>, and <strong>build the systems</strong> that make low-carbon living the norm, not the exception. Let's stop letting corporations write the rules while we argue over composting bins.</p>

<p>This isn't about being perfect. It's about being together.</p>

<hr>

<p><strong>Further Reading:</strong></p>

<ul>
<li>Guardian: <a href="https://www.theguardian.com/environment/2017/jul/12/want-to-fight-climate-change-have-fewer-children">"Want to fight climate change? Have fewer children"</a></li>
<li>Vox (David Roberts): <a href="https://www.vox.com/energy-and-environment/2017/7/26/16004062/kids-climate-change">"Having kids brings up uncomfortable questions about climate change"</a></li>
<li>GUTS Magazine: <a href="http://gutsmagazine.ca/motherearth-on/">"Mother/Earth: On Choosing" by Bethany Hindmarsh</a></li>
<li>Phys.org: <a href="https://phys.org/news/2017-06-emphasizing-individual-solutions-big-issues.html">"Emphasizing individual solutions can reduce support for government efforts"</a></li>
<li>Orion Magazine: <a href="https://orionmagazine.org/article/the-new-abolitionists/">"The Crying Indian" and the roots of personal responsibility propaganda</a></li>
<li>The Guardian (Rebecca Solnit): <a href="https://www.theguardian.com/commentisfree/2021/aug/23/big-oil-coined-carbon-footprints-to-blame-us-for-their-greed">"Big oil coined 'carbon footprints' to blame us for their greed"</a></li>
</ul>

<hr>

<p><em>Ben West is a campaigner, strategist, and writer working at the intersection of climate, justice, and democracy.</em></p>`;

  const { error } = await supabase
    .from('blog_posts')
    .update({
      content: formattedContent,
      featured_image: '/lovable-uploads/58592d84-6d39-4136-afd9-c9d9421724fa.png',
      title: 'Is Having Fewer Kids the Best Response to the Climate Emergency? (Spoiler: No)',
      slug: 'fewer-kids-climate-emergency',
      publish_date: '2019-05-19 12:00:00+00',
      excerpt: 'Climate change isn\'t about individual choices—it\'s about confronting corporate power, public manipulation, and systemic design.',
      tags: ['climate', 'essays', 'systemic-change']
    })
    .eq('slug', 'fewer-kids-climate-emergency');

  if (error) {
    console.error('Error updating kids article:', error);
  } else {
    console.log('Kids article updated successfully with correct content');
    // Trigger a page reload to see the changes
    window.location.reload();
  }
};

// Auto-run the update when this file is loaded
updateKidsArticle();
