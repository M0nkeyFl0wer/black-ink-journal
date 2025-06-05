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
        // Update the cybersecurity article with proper image and clickable content
        await supabase
          .from('blog_posts')
          .update({
            featured_image: 'https://miro.medium.com/v2/resize:fit:828/format:webp/0*AkWA6NAoGUZEcpgI',
            content: `Working from home has fundamentally changed how we approach cybersecurity. The traditional office perimeter — with its firewalls, monitored networks, and IT support just down the hall — no longer exists for millions of workers. Your kitchen table is now your office, your home Wi-Fi is your corporate network, and your personal devices might be handling sensitive company data.

This shift isn't temporary. Remote and hybrid work are here to stay, which means the cybersecurity challenges that came with the pandemic are permanent fixtures of our professional landscape. The question isn't whether your organization will face a security incident related to remote work — it's when, and whether you'll be prepared.

Let's talk about how not to be the reason your company makes headlines for all the wrong reasons.

## The Home Office Reality Check

Your home office probably wasn't designed with enterprise security in mind. That's not your fault — most of us converted spare bedrooms, kitchen tables, or living room corners into workspaces with whatever equipment we had on hand. But this improvised setup creates security gaps that cybercriminals are eager to exploit.

Consider the typical home office setup: a personal laptop that might also be used for streaming Netflix, a home router with default security settings, family members sharing the same network, and maybe a Ring doorbell or smart TV connected to the same Wi-Fi. Each of these elements introduces potential vulnerabilities that wouldn't exist in a traditional corporate environment.

The most dangerous assumption is that working from home is inherently safer because you're in your own space. In reality, home networks are often less secure than corporate networks, personal devices may lack enterprise-grade security software, and the casual environment can lead to relaxed security practices.

## Password Security: Your First Line of Defense

We need to talk about passwords. I know, I know — everyone talks about passwords. But there's a reason cybersecurity professionals won't shut up about them: they remain the most common point of failure in security breaches.

If you're still using variations of the same password across multiple accounts, you're essentially leaving your front door unlocked. <a href="https://www.verizon.com/business/resources/reports/dbir/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Verizon's Data Breach Investigations Report</a> consistently shows that compromised passwords are involved in over 80% of data breaches.

The solution isn't to create more complex passwords that you'll inevitably forget or write down on a sticky note. The solution is to use a password manager. Full stop.

A good password manager will generate unique, complex passwords for every account, store them securely, and auto-fill them when you need to log in. Yes, it's one more thing to learn and one more subscription to pay for, but consider the alternative: being the employee who has to explain to your boss why the company's customer database was compromised because you reused your Netflix password for your work email.

Popular options include <a href="https://1password.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">1Password</a>, <a href="https://bitwarden.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Bitwarden</a>, and <a href="https://www.lastpass.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">LastPass</a> (though LastPass has had some security incidents, so do your research). Many of these offer family plans, so you can secure your personal accounts too.

## Two-Factor Authentication: Your Security Backup Plan

Even with unique passwords, you need a backup plan. Two-factor authentication (2FA) is that backup plan. It adds an extra step to your login process, but that extra step can be the difference between a failed attack and a successful breach.

2FA works by requiring something you know (your password) and something you have (usually your phone). Even if a hacker steals your password, they can't access your account without also having physical access to your phone.

But not all 2FA is created equal. SMS-based 2FA (where you receive a text message with a code) is better than nothing, but it's vulnerable to SIM swapping attacks. Authenticator apps like <a href="https://authy.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Authy</a>, <a href="https://support.google.com/accounts/answer/1066447" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Google Authenticator</a>, or <a href="https://www.microsoft.com/en-us/security/mobile-authenticator-app" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Microsoft Authenticator</a> are more secure.

The gold standard is hardware-based 2FA using devices like <a href="https://www.yubico.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">YubiKey</a>. These physical devices plug into your computer or connect via NFC, providing the strongest form of authentication available to most users.

## Securing Your Home Network

Your home Wi-Fi network is now your office network, which means it needs to be secured like one. Most home routers come with default settings that prioritize ease of setup over security. It's time to change that.

Start with your router's admin interface. If you've never logged into it, you're probably still using the default username and password, which is a massive security risk. Change these immediately, and make sure you're using a strong, unique password.

Next, check your Wi-Fi security settings. You should be using WPA3 encryption if your router supports it, or WPA2 if it doesn't. If you're still using WEP encryption or have an open network, you're essentially broadcasting an invitation to hackers.

Consider setting up a separate guest network for visitors and smart home devices. This isolates these potentially less secure devices from your work equipment. Many modern routers make this easy to configure.

Regular firmware updates are crucial but often overlooked. Router manufacturers regularly release security patches, but unlike your phone or computer, routers don't typically auto-update. Check your router manufacturer's website for firmware updates at least quarterly.

If your router is more than a few years old, it might be time for an upgrade. Newer routers have better security features and are more likely to receive ongoing security updates.

## The VPN Question

Virtual Private Networks (VPNs) encrypt your internet traffic and route it through secure servers, making it much harder for attackers to intercept your data. If your company provides a VPN, use it. Always. Even when you're working from home.

Company-provided VPNs are typically configured to route your traffic through your company's secure infrastructure, giving you many of the same protections you'd have in the office. They also allow your IT team to monitor for threats and ensure you're accessing company resources securely.

If your company doesn't provide a VPN, consider using a reputable commercial VPN service, especially when working from public locations like coffee shops or co-working spaces. Popular options include <a href="https://nordvpn.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">NordVPN</a>, <a href="https://www.expressvpn.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">ExpressVPN</a>, and <a href="https://www.surfshark.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Surfshark</a>.

However, be cautious about free VPN services. Many make money by selling your browsing data or serving ads, which defeats the purpose of using a VPN for privacy and security.

## Software Updates: The Boring But Critical Task

Keeping your software updated is probably the least exciting aspect of cybersecurity, but it's one of the most important. Software updates often include security patches that fix vulnerabilities hackers are actively exploiting.

Enable automatic updates wherever possible. This includes your operating system, web browsers, antivirus software, and any applications you use for work. Yes, updates can be inconvenient and sometimes break things, but the risk of not updating is much higher than the risk of updating.

Pay special attention to your web browser, as it's likely your primary tool for accessing cloud-based work applications. Modern browsers like Chrome, Firefox, Safari, and Edge update automatically by default, but it's worth checking that this feature is enabled.

Don't forget about plugins and extensions. These small add-ons can have significant security implications. Regularly review what you have installed and remove anything you don't actively use. Be especially cautious about browser extensions that request broad permissions.

## Email Security: The Gateway for Most Attacks

Email remains the primary vector for cyberattacks, and remote workers are particularly vulnerable to sophisticated phishing campaigns. Attackers know that remote workers may be more isolated from IT support and more likely to handle sensitive communications via email.

The classic advice about "don't click suspicious links" isn't enough anymore. Modern phishing emails can be incredibly sophisticated, often impersonating colleagues, vendors, or even your CEO. They might include accurate personal information gleaned from social media or previous data breaches.

Instead of trying to identify every possible phishing email, focus on verification practices. If you receive an urgent request via email — especially one involving money, sensitive information, or changes to security settings — verify it through a separate communication channel. Call the person directly, or use a different messaging platform to confirm the request is legitimate.

Be particularly wary of emails that create a sense of urgency or fear. Phrases like "immediate action required," "your account will be suspended," or "urgent security update" are red flags. Legitimate communications from your company or service providers rarely require immediate action via email.

When in doubt, forward suspicious emails to your IT security team. Most organizations would rather receive false alarms than miss a real threat.

## Physical Security in the Home Office

Digital security is only part of the equation. Physical security matters too, especially when your home doubles as your office.

Your work laptop or desktop computer should be secured when you're not using it. This might seem obvious, but it's easy to get comfortable and leave your computer unlocked when you step away for a few minutes. Set your computer to lock automatically after a short period of inactivity.

Consider who else has access to your workspace. Family members, roommates, visitors, and service workers might all have opportunities to access your work equipment. This doesn't mean you can't trust the people in your life, but it does mean you should be mindful of what's accessible.

If you're working with particularly sensitive information, consider additional physical security measures like a privacy screen that prevents shoulder surfing, or a webcam cover to prevent unauthorized access to your camera.

## Backup Your Data (Before You Need To)

Data backup isn't just about hardware failure — it's also about cybersecurity. Ransomware attacks, where criminals encrypt your files and demand payment for the decryption key, are increasingly common and sophisticated.

The best defense against ransomware is having recent, secure backups of your important data. Follow the 3-2-1 rule: keep three copies of important data, store them on two different types of media, and keep one copy offsite.

Cloud backup services like <a href="https://www.backblaze.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Backblaze</a>, <a href="https://www.carbonite.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Carbonite</a>, or <a href="https://aws.amazon.com/backup/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">AWS Backup</a> can automate much of this process. Many also include versioning, which allows you to recover previous versions of files if they become corrupted or encrypted by malware.

Test your backups regularly. A backup system that you've never tested is just a backup system that you hope works. Set a quarterly reminder to verify that you can actually restore files from your backup.

## Incident Response: When Things Go Wrong

Despite your best efforts, security incidents can still happen. Having a plan for when things go wrong is just as important as trying to prevent them in the first place.

If you suspect your computer has been compromised, disconnect it from the internet immediately. This can prevent further data theft and stop malware from communicating with its controllers. Then contact your IT security team right away.

Don't try to "fix" the problem yourself unless you have specific training in incident response. Well-meaning attempts to clean up malware or secure compromised accounts can sometimes make the situation worse by destroying evidence or allowing the attack to continue.

Keep a list of important contacts and procedures somewhere you can access them even if your primary computer is compromised. This might include phone numbers for your IT helpdesk, instructions for changing critical passwords, and contact information for your manager or security team.

## The Human Element

Technology can only protect you so far. The most sophisticated security systems in the world are vulnerable to human error, social engineering, and simple mistakes.

Stay informed about current threats. Cybersecurity landscapes change rapidly, and attackers constantly develop new techniques. Consider following reputable cybersecurity news sources like <a href="https://krebsonsecurity.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Krebs on Security</a>, <a href="https://www.schneier.com/" target="_blank" rel="noopener noreferrer" class="text-red-400 hover:text-red-300 underline">Schneier on Security</a>, or your organization's internal security communications.

If your company offers cybersecurity training, take it seriously. These programs might seem boring or repetitive, but they're designed to address the most common and current threats your organization faces.

Remember that cybersecurity is a shared responsibility. You're not just protecting yourself — you're protecting your colleagues, your customers, and your organization's reputation.

## Looking Forward

The remote work revolution has permanently changed how we think about workplace security. The traditional perimeter-based security model, where everything inside the corporate network was trusted and everything outside was suspect, no longer applies when the workplace is everywhere.

This shift requires us to think differently about security. Instead of securing a building, we need to secure individual devices, connections, and behaviors. Instead of relying on IT teams to maintain security for us, we need to become active participants in our own cybersecurity.

The good news is that the tools and practices I've outlined here aren't just about preventing cyberattacks — they're about creating a more secure, reliable, and efficient work environment. Strong passwords and 2FA make account takeovers nearly impossible. Regular backups protect against both cyberattacks and hardware failures. Updated software runs more smoothly and securely.

Working from home doesn't have to make you a cybersecurity liability. With the right tools, practices, and mindset, you can be just as secure at home as you were in the office — maybe even more so.

The key is to think of cybersecurity not as a burden or an obstacle, but as an enabler. Good security practices give you the confidence to work from anywhere, knowing that you're protecting yourself, your work, and your organization from the very real threats that exist in our increasingly connected world.

Because in the end, the goal isn't perfect security — it's resilient security. It's building systems and habits that can adapt to new threats, recover from incidents, and continue to protect what matters most as the world of work continues to evolve.
          })
          .eq('slug', 'how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home');

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
