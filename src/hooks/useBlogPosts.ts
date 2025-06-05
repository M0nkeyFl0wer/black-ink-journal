
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

        // Update the cybersecurity article with full HTML content, infosec tag and proper hero image
        await supabase
          .from('blog_posts')
          .update({
            tags: ['infosec'],
            featured_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3543&q=80',
            content: `<div class="prose prose-lg prose-invert max-w-none">
              <p>Working from home has become the new normal for millions of people worldwide. But with this shift comes a host of cybersecurity challenges that many remote workers—and their employers—are only beginning to understand. The comfort of your home office might feel safe, but when it comes to digital security, that comfort can be deceiving.</p>
              
              <h2>The Home Office: A Cybersecurity Minefield</h2>
              
              <p>Your home network wasn't designed with enterprise security in mind. Unlike corporate environments with dedicated IT teams, firewalls, and security protocols, home networks often run on default settings with minimal protection. This creates numerous vulnerabilities that cybercriminals are eager to exploit.</p>
              
              <h3>Common Home Network Vulnerabilities</h3>
              
              <ul>
                <li><strong>Weak or Default Router Passwords:</strong> Many home routers still use factory default passwords like "admin" or "password," making them easy targets for attackers.</li>
                <li><strong>Outdated Firmware:</strong> Unlike corporate networks that receive regular updates, home routers often run outdated firmware with known security flaws.</li>
                <li><strong>Unsecured IoT Devices:</strong> Smart home devices—from cameras to thermostats—often have poor security and can serve as entry points into your network.</li>
                <li><strong>Shared Networks:</strong> Family members using the same network for personal activities can inadvertently introduce malware or compromise security.</li>
              </ul>
              
              <h2>The Human Factor: Your Biggest Vulnerability</h2>
              
              <p>Technology is only as secure as the humans using it. Working from home introduces new behavioral risks that can compromise both personal and corporate security.</p>
              
              <h3>Dangerous Home Working Habits</h3>
              
              <p><strong>Password Reuse and Weak Passwords:</strong> Without IT enforcement, many remote workers fall back on familiar but insecure password practices. Using the same password across multiple accounts or choosing easily guessable passwords puts everything at risk.</p>
              
              <p><strong>Unsecured Video Calls:</strong> The rush to adopt video conferencing tools led many to skip security settings. Unprotected meetings can be "Zoombombed" or eavesdropped upon, potentially exposing sensitive company information.</p>
              
              <p><strong>Physical Security Lapses:</strong> In the office, physical security is managed centrally. At home, you might leave your laptop unlocked, work in view of windows, or discuss confidential matters within earshot of family members or neighbors.</p>
              
              <p><strong>Personal Device Mixing:</strong> Using personal devices for work—or vice versa—creates security blindspots. Personal devices may lack corporate security controls, while work devices used for personal activities can be exposed to additional risks.</p>
              
              <h2>The Phishing Evolution</h2>
              
              <p>Cybercriminals have adapted their tactics for the work-from-home era. Phishing attacks have become more sophisticated and targeted, often leveraging the isolation and uncertainty that remote workers experience.</p>
              
              <h3>COVID-Era Phishing Tactics</h3>
              
              <ul>
                <li><strong>Fake IT Support:</strong> Scammers pose as company IT support, claiming they need to update security software or verify credentials for remote access.</li>
                <li><strong>Video Conferencing Scams:</strong> Fake meeting invitations or urgent requests to join "security briefings" that actually harvest login credentials.</li>
                <li><strong>Supply Chain Attacks:</strong> Targeting the tools and services that remote workers depend on, from VPN providers to cloud storage services.</li>
                <li><strong>Business Email Compromise (BEC):</strong> Criminals impersonate executives or clients in email communications, often requesting urgent wire transfers or sensitive information.</li>
              </ul>
              
              <h2>VPN Vulnerabilities and Misconfigurations</h2>
              
              <p>Virtual Private Networks (VPNs) became essential overnight for many organizations. However, rapid deployment often led to security shortcuts and misconfigurations that create new vulnerabilities.</p>
              
              <h3>Common VPN Security Issues</h3>
              
              <p><strong>Split Tunneling Risks:</strong> When configured incorrectly, split tunneling can allow malware to bypass VPN protection, potentially accessing both personal and corporate networks simultaneously.</p>
              
              <p><strong>Credential Stuffing:</strong> Attackers use stolen credentials from other breaches to try accessing VPN systems, banking on password reuse habits.</p>
              
              <p><strong>Inadequate Authentication:</strong> VPNs without multi-factor authentication (MFA) rely solely on username and password combinations, which can be compromised through various means.</p>
              
              <h2>Cloud Security in the Home Office Era</h2>
              
              <p>The shift to remote work accelerated cloud adoption, but it also introduced new risks around data storage and access management.</p>
              
              <h3>Cloud-Related Risks</h3>
              
              <p><strong>Shadow IT:</strong> Employees using unauthorized cloud services for work creates visibility gaps and potential data leakage points.</p>
              
              <p><strong>Misconfigured Access Controls:</strong> Rapid deployment of cloud services often leads to overly permissive access controls, giving employees access to data they don't need.</p>
              
              <p><strong>Data Residency and Compliance:</strong> Working from different locations can inadvertently violate data residency requirements or compliance regulations.</p>
              
              <h2>Building Your Home Office Defense</h2>
              
              <p>Protecting yourself and your organization while working from home requires a multi-layered approach that addresses both technical and behavioral security aspects.</p>
              
              <h3>Technical Security Measures</h3>
              
              <p><strong>Secure Your Router:</strong></p>
              <ul>
                <li>Change default passwords to strong, unique credentials</li>
                <li>Enable WPA3 encryption (or WPA2 if WPA3 isn't available)</li>
                <li>Regularly update firmware</li>
                <li>Disable unnecessary features like WPS and remote management</li>
                <li>Set up a guest network for personal devices and visitors</li>
              </ul>
              
              <p><strong>Implement Network Segmentation:</strong></p>
              <ul>
                <li>Use a separate network for work devices</li>
                <li>Isolate IoT devices on their own network segment</li>
                <li>Consider using a dedicated work computer that isn't used for personal activities</li>
              </ul>
              
              <p><strong>Endpoint Security:</strong></p>
              <ul>
                <li>Install and maintain updated antivirus/anti-malware software</li>
                <li>Enable automatic security updates</li>
                <li>Use full-disk encryption on work devices</li>
                <li>Implement screen locks with short timeout periods</li>
              </ul>
              
              <h3>Behavioral Security Practices</h3>
              
              <p><strong>Master Password Management:</strong></p>
              <ul>
                <li>Use a reputable password manager</li>
                <li>Generate unique, complex passwords for every account</li>
                <li>Enable two-factor authentication wherever possible</li>
                <li>Regularly audit and update passwords</li>
              </ul>
              
              <p><strong>Email and Communication Security:</strong></p>
              <ul>
                <li>Verify unexpected requests through alternative communication channels</li>
                <li>Be suspicious of urgent requests for sensitive information or money transfers</li>
                <li>Check email addresses carefully for spoofing attempts</li>
                <li>Use encrypted communication tools for sensitive discussions</li>
              </ul>
              
              <p><strong>Physical Security Awareness:</strong></p>
              <ul>
                <li>Position screens away from windows and high-traffic areas</li>
                <li>Use privacy screens when working in shared spaces</li>
                <li>Secure physical documents and devices when not in use</li>
                <li>Be mindful of what's visible during video calls</li>
              </ul>
              
              <h2>The Shared Responsibility Model</h2>
              
              <p>Securing the work-from-home environment isn't solely the employee's responsibility. Organizations must also adapt their security strategies to support remote workers effectively.</p>
              
              <h3>Organizational Responsibilities</h3>
              
              <p><strong>Provide Clear Security Policies:</strong> Remote work policies should explicitly address home office security requirements, acceptable use guidelines, and incident reporting procedures.</p>
              
              <p><strong>Invest in Security Tools:</strong> Organizations should provide or subsidize security tools like VPN access, endpoint protection, and secure communication platforms.</p>
              
              <p><strong>Regular Security Training:</strong> Remote workers need ongoing security awareness training that addresses home-specific risks and scenarios.</p>
              
              <p><strong>Incident Response Planning:</strong> Organizations need protocols for security incidents that occur in home environments, including device theft, suspected compromise, or family member involvement.</p>
              
              <h2>The Future of Home Office Security</h2>
              
              <p>As remote work becomes a permanent fixture of the modern workplace, security practices will continue to evolve. Emerging technologies like Zero Trust architectures, improved endpoint detection and response (EDR) solutions, and better integration between personal and professional security tools will help address current challenges.</p>
              
              <p>However, the human element will always remain critical. No amount of technology can compensate for poor security habits or lack of awareness. The most secure home office is one where technology and human behavior work together to create multiple layers of protection.</p>
              
              <h2>Conclusion: Your Role in the Security Chain</h2>
              
              <p>Working from home doesn't have to mean compromising security. By understanding the risks and implementing appropriate countermeasures, you can create a home office environment that protects both your personal and professional digital assets.</p>
              
              <p>Remember, cybersecurity is not a destination but a journey. Threats evolve, technology changes, and new vulnerabilities emerge regularly. The key is to stay informed, remain vigilant, and treat security as an ongoing responsibility rather than a one-time setup task.</p>
              
              <p>Your home office might not have the same security infrastructure as a corporate headquarters, but with the right knowledge and practices, it can be just as secure. Don't let your remote work setup become the weak link that compromises your organization's security—or your own digital safety.</p>
              
              <p>In the age of remote work, we're all cybersecurity professionals now. The question is: are you ready to take on that responsibility?</p>
            </div>`
          })
          .eq('slug', 'how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home');

        // Update the kids article with full HTML content and proper computer/tech hero image
        await supabase
          .from('blog_posts')
          .update({
            featured_image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=6000&q=80',
            content: `<div class="prose prose-lg prose-invert max-w-none">
              <p>It starts with a simple question from a curious seven-year-old: "How do computers work?" You open your mouth to answer, then pause. How do you explain something so fundamentally complex to someone who still thinks WiFi is magic and that the internet lives inside the router?</p>
              
              <p>As a parent in the digital age, you're faced with an interesting challenge. Your child exists in a world where computers are as natural as breathing, yet the inner workings of these devices remain as mysterious to them as they probably are to you. Here's how to bridge that gap without needing a computer science degree.</p>
              
              <h2>Start with What They Know: The Computer as a Really Smart Assistant</h2>
              
              <p>Children understand the concept of following instructions. They know that when you ask them to clean their room, there's a specific set of steps involved (even if they choose to ignore them). Computers work the same way—they're just really, really good at following very detailed instructions, and they never get distracted or decide they'd rather play video games instead.</p>
              
              <p>Explain that a computer is like having the world's most obedient assistant who can do millions of tiny tasks per second, but only if you tell them exactly what to do in a language they understand. This assistant never gets tired, never gets bored, and never says "I don't want to."</p>
              
              <h2>The Brain and the Body: Making Anatomy Relatable</h2>
              
              <p>Kids understand their own bodies, so use that as a starting point. The computer has a "brain" (the CPU - Central Processing Unit) that thinks and makes decisions. It has "memory" (RAM) where it keeps things it's thinking about right now, like how you might remember what you had for breakfast this morning.</p>
              
              <p>The computer also has "long-term memory" (the hard drive or SSD) where it stores things it wants to remember forever, like photos, games, and videos—similar to how you remember your best friend's name or your favorite song.</p>
              
              <p>The screen is like the computer's mouth—it's how the computer talks to us. The keyboard and mouse are like the computer's ears—they're how we talk to the computer.</p>
              
              <h3>A Simple Body Analogy</h3>
              
              <ul>
                <li><strong>CPU (Brain):</strong> Makes all the decisions and does the thinking</li>
                <li><strong>RAM (Short-term memory):</strong> Remembers what it's working on right now</li>
                <li><strong>Hard Drive (Long-term memory):</strong> Stores everything important for later</li>
                <li><strong>Screen (Mouth):</strong> Shows us what the computer is thinking</li>
                <li><strong>Keyboard/Mouse (Ears):</strong> Listens to what we want</li>
              </ul>
              
              <h2>The Magic of Electricity: Why Computers Need Power</h2>
              
              <p>Children know that toys need batteries and cars need gas. Computers need electricity, but unlike a toy car that just moves, computers use electricity in a special way. They use it to create tiny electrical signals that can be either "on" or "off"—like a light switch.</p>
              
              <p>These on-and-off signals are like a secret code that the computer uses to think. It's similar to how you might create a secret code with your friends using flashlights—one blink means "yes" and two blinks mean "no." The computer uses billions of these tiny electrical switches to create all the amazing things you see on the screen.</p>
              
              <h2>Binary: The Computer's Secret Language</h2>
              
              <p>Once your child grasps the on/off concept, you can introduce binary—though you don't need to use that scary word. It's just the computer's way of using only two "letters" to spell everything: 0 (off) and 1 (on).</p>
              
              <p>Try this activity: Create a simple code where 1 = "clap" and 0 = "silence." Then "spell" their name using claps and pauses. This demonstrates how you can create complex messages using just two simple signals.</p>
              
              <p>For example, if A = 1 and B = 0, you could spell "ABA" as "clap-pause-clap." Computers do something similar but with millions of these signals happening incredibly fast.</p>
              
              <h2>Programs: The Computer's Recipe Book</h2>
              
              <p>Kids understand recipes. If you want to make cookies, you follow specific steps in a specific order. Computer programs are like recipes, but instead of making cookies, they tell the computer how to play a game, edit a photo, or browse the internet.</p>
              
              <p>Just like how a recipe might say "First, preheat the oven to 350 degrees, then mix the flour and sugar," a computer program might say "First, show the login screen, then wait for the user to type their password, then check if the password is correct."</p>
              
              <p>Programmers are like really detailed recipe writers who have to think of everything that could possibly happen and write instructions for each situation.</p>
              
              <h2>The Internet: The World's Biggest Library</h2>
              
              <p>Children understand the concept of libraries—places where information is stored and shared. The internet is like a giant library that connects all the computers in the world, allowing them to share information instantly.</p>
              
              <p>When you search for something online, it's like asking a librarian who can check every library in the world simultaneously and bring back all the relevant books in seconds. The "books" in this case are websites, videos, photos, and all the other information stored on computers around the globe.</p>
              
              <p>WiFi is like invisible roads that carry messages between your computer and this giant library. Just like how mail carriers use roads to deliver letters, your computer uses WiFi to send and receive digital messages.</p>
              
              <h2>Making It Hands-On: Activities That Bring Concepts to Life</h2>
              
              <h3>The Human Computer Game</h3>
              
              <p>Turn your child into a computer for a few minutes. Give them simple, very specific instructions like:</p>
              <ul>
                <li>"Walk to the kitchen"</li>
                <li>"Open the refrigerator"</li>
                <li>"Look for an apple"</li>
                <li>"If you see an apple, pick it up. If not, say 'apple not found'"</li>
                <li>"Bring the apple back to me"</li>
              </ul>
              
              <p>This demonstrates how computers need very specific, step-by-step instructions and can't make assumptions about what you "really meant."</p>
              
              <h3>The Binary Name Game</h3>
              
              <p>Help your child spell their name using only 1s and 0s. You can make it simple by assigning each letter of the alphabet a unique combination of 1s and 0s. For example:</p>
              <ul>
                <li>A = 1</li>
                <li>B = 10</li>
                <li>C = 11</li>
                <li>D = 100</li>
              </ul>
              
              <p>This shows how computers can represent complex information using just two symbols.</p>
              
              <h3>The Memory Palace</h3>
              
              <p>Set up a physical demonstration of computer memory using boxes or containers:</p>
              <ul>
                <li><strong>RAM boxes:</strong> Use a few small boxes that you can quickly put things in and take things out of</li>
                <li><strong>Hard drive box:</strong> Use a large box where things can be stored for a long time</li>
                <li><strong>CPU (you):</strong> You act as the processor, moving items between boxes and making decisions</li>
              </ul>
              
              <p>Demonstrate how the "CPU" needs to move information from long-term storage to working memory before it can use it.</p>
              
              <h2>Addressing the "Why" Questions</h2>
              
              <p>Children are naturally curious about the purpose behind things. Here's how to handle some common follow-up questions:</p>
              
              <p><strong>"Why can't computers think like people?"</strong><br>
              Computers are incredibly fast at following instructions, but they can't decide what they want to do or change their minds like people can. They need humans to tell them what problems to solve and how to solve them.</p>
              
              <p><strong>"Why do computers sometimes break or freeze?"</strong><br>
              Just like how you might get confused if someone gave you contradictory instructions, computers can get "confused" when they receive conflicting directions or when their parts get tired (overheated) or damaged.</p>
              
              <p><strong>"Will computers take over the world?"</strong><br>
              Computers are tools, like hammers or cars. They can only do what humans program them to do. They're really good tools, but they still need humans to decide what jobs need to be done.</p>
              
              <h2>Age-Appropriate Complexity</h2>
              
              <p>Remember to adjust your explanations based on your child's age and interest level:</p>
              
              <p><strong>Ages 4-6:</strong> Focus on basic concepts like "the computer follows instructions" and "it uses electricity to think." Use lots of physical analogies and simple activities.</p>
              
              <p><strong>Ages 7-9:</strong> Introduce concepts like binary (as a secret code), programs (as recipes), and the internet (as a giant library). They can handle slightly more abstract thinking.</p>
              
              <p><strong>Ages 10-12:</strong> Dive deeper into how different parts work together, introduce basic programming concepts, and discuss how computers solve problems step-by-step.</p>
              
              <h2>Encouraging Exploration</h2>
              
              <p>Once you've planted the seeds of understanding, encourage your child to explore further:</p>
              
              <ul>
                <li><strong>Scratch Programming:</strong> Introduce visual programming languages designed for children</li>
                <li><strong>Computer Building Videos:</strong> Watch age-appropriate videos showing how computers are assembled</li>
                <li><strong>Coding Games:</strong> Play games that introduce programming logic without requiring actual coding</li>
                <li><strong>Take Apart Old Electronics:</strong> (Safely, with supervision) explore the inside of old, broken devices</li>
              </ul>
              
              <h2>The Bigger Picture: Digital Citizenship</h2>
              
              <p>Understanding how computers work is just the beginning. As your child grows up in an increasingly digital world, this foundational knowledge becomes the basis for more important conversations about:</p>
              
              <ul>
                <li>How their personal information travels through computers</li>
                <li>Why some websites and apps are free (and what that really means)</li>
                <li>How to recognize when computers might be used to manipulate or deceive</li>
                <li>The environmental impact of our digital choices</li>
                <li>How to be a creator, not just a consumer, of digital content</li>
              </ul>
              
              <h2>Embracing the Wonder</h2>
              
              <p>Perhaps the most important thing to convey to your child is that computers, for all their complexity, are fundamentally human creations. Every app they use, every game they play, every video they watch exists because humans imagined it, designed it, and built it.</p>
              
              <p>Computers haven't eliminated the need for human creativity, problem-solving, and innovation—they've amplified it. By understanding how these tools work, your child is better positioned to use them intentionally and maybe even to create the next generation of digital innovations.</p>
              
              <p>The goal isn't to turn every child into a programmer or computer engineer. It's to demystify the digital world they're growing up in, helping them become thoughtful digital citizens who understand the tools that increasingly shape our world.</p>
              
              <p>So the next time your child asks how computers work, remember: you don't need to explain quantum mechanics or advanced algorithms. You just need to help them see that behind all the apparent magic is human ingenuity, clever engineering, and the simple but powerful idea that you can solve almost any problem if you break it down into small enough steps.</p>
              
              <p>After all, that's a lesson that goes well beyond computers—it's a lesson for life.</p>
            </div>`
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
