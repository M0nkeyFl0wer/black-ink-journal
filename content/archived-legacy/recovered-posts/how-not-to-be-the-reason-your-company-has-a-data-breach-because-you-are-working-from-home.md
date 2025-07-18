---
title: "How Not to be the Reason Your Company Has a Data Breach Because You are Working From Home"
date: "2024-06-05T12:00:00+00:00"
author: "Ben West"
excerpt: "Personal infosec tips and tools for you and your company to stay secure while working from home."
featured_image: "https://miro.medium.com/v2/resize:fit:828/format:webp/0*AkWA6NAoGUZEcpgI"
tags: ["infosec","privacy","security","remote-work"]
slug: "how-not-to-be-the-reason-your-company-has-a-data-breach-because-you-are-working-from-home"
is_published: true
---

I created this list of tools years ago for friends exploring privacy and security related software and I have been updating it and editing it since the pandemic lock downs as more people began working from home. At the time many people I knew were asking me about options to better secure their devices. Why are people asking me?

I'm not a registered cybersecurity expert, I'm just a person who started paying more and more attention to this stuff after having some of my accounts compromised and learning I was being [surveilled by government and industry as an activist](https://bccla.org/secret-spy-hearings/?utm_source=vancouver+is+awesome&utm_campaign=vancouver+is+awesome%3A+outbound&utm_medium=referral) fighting the expansion of heavy oil pipelines in BC.

I have learned a lot since then and have explored using many different tools to provide safety and security for myself and for my work.

Privacy and security tools are not just for activist, celebrities and journalists. Privacy is a form of power, your personal information is valuable, and far too easily to criminals along with governments and corporations. Just like nobody questions why we have blinds on our homes the same should be true for our privacy and security.

This is perhaps especially significant when you are responsible not only for your own privacy and security but when your devices are tied to the private business information and/or user accounts associated with your employer.

Something to consider: Security and privacy and different but connected. Being good a security will increase your privacy in terms of who has access to your files and personal information. But not everything that is good for security is also good for privacy.

## Where to Start

Perhaps the most important first thing you can do in terms of security is to take a look at if your existing accounts have been part of any hacks or "data breaches". If you put your email into this tool from Mozilla it will compare it against a large database of all known data breaches and show you if any of your accounts associated with your email has been compromised. This is a free service from Firefox. You will find out if you need to go change your password anywhere right away or if any other information about you has been leaked. Its scary to see how many data breaches take place. Its a big reason the tools and tips in this article are important.

[Mozilla Monitor](https://monitor.firefox.com/?source=post_page-----cf65c38d3602---------------------------------------)

Find out if you've been part of a data breach with ⁨Mozilla Monitor⁩. We'll help you understand what to do next and…monitor.firefox.com

Its very important to not use the same user name and password on multiple different services. The most common way to get hacked is for people to use lists of emails and passwords from one breach to try to access user accounts on other services. This can be done with bots and often you won't even know you have lost access to your accounts until its too late. If nothing else use better passwords for work and banking and medical stuff. Passwords managers are a god send in terms of better password management. If you only do one thing from this article switching to using a password manager should be it.

## Password Manager

There are a ton of different options in this category. Just using the password manager built into your browser is better than nothing but ideally you would use a tool like BitWarden or 1Password. I prefer BitWarden because its open source and the pricing is better than most of the alternatives for more advanced features.

Convenient browser extensions exist for both these tools that work on Firefox or Chrome and Safari too. That makes it a really convenient way to manage all your passwords in apps and on your browser. You can also manage secure notes and credit card information for filling form fields when paying for things.

The real hardcores generally opt for KeyPass which doesn't connect to the internet but that involves a bit more work to get it set up and to transfer stuff from one place to another. I'm guessing if you are reading this you probably aren't one of those hardcore privacy focused people you are just a regular person who wants to be a bit more secure, in that case I would suggest BitWarden and their browser extension. The free version is good enough for most people and it works great on desktop and on the phone.

[Best Password Manager for Business, Enterprise & Personal | Bitwarden](https://bitwarden.com/?source=post_page-----cf65c38d3602---------------------------------------)

Bitwarden is the most trusted password manager for passwords and passkeys at home or at work, on any browser or device…bitwarden.com

## Two Factor Authentication (2FA)

Using a second way to identify you when you log into a site after you enter your password or "Two factor authentication" (2FA) might be a bit annoying when you are trying to log into something but it really is essential for anything important. Unfortunately not many banks or credit card companies have it set up on their websites which I find bizarre. But you probably can use it for many important things like your works email system and your own email (which is probably used for back up codes for anything you lose access to and can be exploited by hackers to get access to anything where its used that way). Its way better to use an app that creates authentication tokens as opposed to using SMS text messages for 2FA.

Unfortunately sharing your phone number can be a vulnerability. "Sim jacking" or sim swapping is what hackers call it when they pretend to be you and get services transferred away from your phone to their phone and then they have the ability to get around your 2FA. More on that below.

So for 2FA I like Authy. Again it works on all platforms and easy to set up and secure and easy to restore from backup (unlike Google Authenticator). Good User experience compared to other options. Some say it is more secure to use something that doesn't connect to the internet but unless you are particularly at risk of being targeted by hackers its still way better than not using 2FA and its convenient and easy to set up.

[Authy: Two-factor Authentication (2FA) App & Guides](https://authy.com/?source=post_page-----cf65c38d3602---------------------------------------)

Two-factor authentication (2FA) adds an additional layer of protection beyond passwords. Download our free app today…authy.com

## Malware Protection

Its easy to say be careful what you click on but in reality the internet was built to be a series of connections between sites based on links. Its pretty hard to avoid ever clicking on the wrong thing given the circumstances.

One of the best tools to protect yourself in this environment is MalwareBytes, you can use this tool to scan your device regularly to be sure you don't have any known malware on your device. And for extra protection consider using the paid version of MalwareBytes which will block you from clicking on successfully clicking on any links or downloading any files that put your computer at risk.

[Official Site | Malwarebytes: Antivirus, Anti-Malware & Privacy](https://malwarebytes.com/?source=post_page-----cf65c38d3602---------------------------------------)

Malwarebytes offers real-time antivirus, advanced anti-malware and privacy protection for all your devices. Launched in…malwarebytes.com

Its also important to update your device to the latest security patches as generally hackers and malware exploit these vulnerabilities that are blocked by security patches.

## Private Phone Numbers

Its generally best to not use your own cell number for online shopping or sharing it in other ways online. Sim swapping happens because hackers find your phone number associated with your name during data breaches or via data brokers. Your phone number can also be a way to track you remotely because your cellphone sends "pings" regularly to cell towers and this is actually reasonably easy information to get your hands on sadly. Even if you aren't concerned about that (and you should) but to some people the most important reason not to use your own phone number for online shopping is because it will dramatically reduce the amount of spam calls you get on your phone.

This tool is also useful for getting secondary phone numbers in different area codes, separate work/ personal numbers and it's great for online shopping or online dating. As mentioned before this is especially important as increasingly hackers use SIM hacking to take over peoples cell phones. Avoid using SMS text messages for 2 factor authentication.

[MySudo](https://mysudo.com/?source=post_page-----cf65c38d3602---------------------------------------)

Protect you r privacy and identity with MySudo. Talk, text, email, browse, and pay privately all in one place.mysudo.com

Sudo is a great app for both iPhone and Android and has a desktop version for Mac (hopefully soon on Windows as well). They give you a free phone number you can use for online shopping, dating etc. It can also be useful if you want to use a separate number for work and personal use. The paid plans are reasonable if you want to make this your primary phone. Experts suggest never giving anyone your actual phone number and just using the forwarding numbers created by a service like Sudo. There are other options but I think this one is the best and easiest to set up. Services like Twillio can do even more and are customizable but it takes some knowledge and time to set up.

## Instant Messaging and Video Calls (end to end encrypted)

A better option than traditional phone calls and text messages is using an encrypted messaging app like Signal. Instead of using WhatsApp or Facebook Messenger a lot of people are switching to Signal or other end to end encrypted apps for messaging and video calls internationally. In fairness both of those Meta (aka Facebook) apps both license Signals encryption software but given they are owned by Facebook, and their software is not open source and still sells your metadata many have decided to go with other options. Of course you can only talk to people if they are also using these platforms. The recent rush towards Signal has made that a lot easier. Signal has been one of my favourite apps for years and its just gotten better

[Signal Messenger: Speak Freely](https://signal.org/?source=post_page-----cf65c38d3602---------------------------------------)

Say "hello" to a different messaging experience. An unexpected focus on privacy, combined with all of the features you…signal.org

Signal is a non-profit project. Its an open source messaging alternative started by one of the former founders of WhatsApp. Its very popular and dependable. Until recently it didn't have video messaging on mobile but now it works well on all platforms (although you need to use linux to add it to a chromebook if you have one). That being said it is probably the most trusted and broadly used end to end encrypted messaging tool ever made. Even Edward Snowden recommends it.

Another great starting point for increased privacy is using DuckDuckGo as the search engine you use in your browser or even switching to Firefox from Google Chrome entirely so you know you won't be re-targeted and tracked everywhere you go online. Using the built in privacy settings in your browser is a good idea no matter which browser you use. This applies to phones and desktops or laptops.

## Secure email that doesn't sell your data

The leading provider of secure email is Proton, the maker of ProtonMail. ProtonMail is serious about privacy and security. They host their servers in an abandoned nuclear fall out shelter in Switzerland. Emails between Protonmail accounts is end to end encrypted meaning nobody can read them besides you and the other person you are talking to (if you both use ProtonMail or another end to end encrypted email service). That being said emails sent to any traditional email client are no more safe than anything else in the sense that your emails are still being scanned and stored on their servers and accessible by staff or others potentially.

In the last couple years Proton has expanded beyond just email and now has a full suite of tools including a file storage drive, a document writing and collaboration app, a calendar and more. All end-to-end encrypted.

[Proton: Privacy by default](https://proton.me/?source=post_page-----cf65c38d3602---------------------------------------)

Over 100 million people use Proton to stay private and secure online. Get a free Proton account and take back your…proton.me

From a security point of view Gmail and other large providers are actually very secure. The bigger concern is privacy. They scan all emails for marketing and re-targeting purposes and staff at Gmail ultimately have full access to your messages. I personally have used Gmail since it launched and will continue to for some things but I have moved all my banking, health and personal email to Protonmail.

I also use Fastmail for all my online shopping. They also don't scan your emails and I wanted to keep my email addresses separate so that if any of those services I use are hacked they don't have information about my more personal accounts. This might be a step too far for many people. It could be good enough to switch to either Fastmail or Protonmail or even to just ensure your gmail is secured properly. Again its just a matter of your priorities. If you care about your privacy than these two apps are better options than Gmail.

[Email and calendar made better](https://fastmail.com/?source=post_page-----cf65c38d3602---------------------------------------)

Fast, private email hosting for you or your business. More productive, lightning fast, simple and built to save you…fastmail.com

Secure note taking that isn't harvesting your data. This is a great simple free note taking tool that isn't scanning everything you write for their marketing purposes. The paid version has more advanced editors for html and other code languages as well as mark down and to do lists etc. The free version is just plain text but still useful.

Standard Notes was recently bought by Proton and they have expanded their offerings. That being said now that Proton Docs and Proton Drive exist you may find you have less use for an independent note taking app. Its particularly useful if you want somewhere to quickly jot down something as opposed to writing longer pieces of content or working collaboratively on a document.

[Standard Notes | End-To-End Encrypted Notes App](https://standardnotes.org/?source=post_page-----cf65c38d3602---------------------------------------)

Standard Notes helps you gain control in a world that often feels out of control. Protect your life's work with…standardnotes.org

## The gold standard for secure 2 Factor Authentication

The hardest security to bypass is a "hardware key" a small device that looks like a usb stick. The biggest company making these products is Yubico, the manufacturer of Yubikey. Still not enough sites and apps facilitate using a hardware key (most notably most banks) but importantly most password managers do, like Bitwarden (with the paid versions) as well as all Google suite products, DropBox, Facebook and some other important applications. For additional security hardware keys can also be used to log into your computers via Hello Windows on PCs.

Its a good idea to have at least two of these keys that you keep separate in case you lose one. Also never leave them plugged into your computer . Its like leaving a key in your front door.

[Yubico Home](https://www.yubico.com/?source=post_page-----cf65c38d3602---------------------------------------)

Get the YubiKey, the #1 security key, offering strong two factor authentication from industry leader Yubico.www.yubico.com

## Considering Your Devices and Operating Systems

If security is the main goal then Apple and Google products do a good job especially if you do the most important thing which is using a different strong password with each account and two factor Authentication (2FA… see below for more details) but both companies harvest your data and use it to build a profile of you for marketing and the personalization of your experience on the devices among other things. Google sells your data but Apple keeps it all for themselves. Both are good at security.

Apple claims to not share your information whereas Google sells your data as part of their business model. Apple also has more of a "walled garden" and does a fair amount to control what apps are on the platform and what information they have access to which is good in terms of security. That being said if you are on an iPhone and using Facebook tools like Messenger, WhatsApp or Instagram) or any of the Google tools like Gmail, Google Maps, Google search, Google Calendar etc you are still giving permission for a lot of your data to be tracked and sold just like if you were on an Android phone. Apple has limited tracking between apps recently which is good but still within those apps you are giving away a lot of data.

If privacy is your priority that will lead you to reducing your use of some of the services I just mentioned regardless of what kind of device you use. Personally I use all of those apps but I like to at least have privacy focused apps as secondary options that don't share your data for all the basic services. This gives me options to use for personal conversations or a place to talk strategy at work as well as better options for online shopping and keeping my personal information private.

Windows in inherently less secure than MAC OS just given the number of viruses and Malware written specifically for Windows. The least viruses are written for Linux or given how few individuals use those operating systems. All operating systems can be hacked and most of us aren't going to change devices unless we have to. Windows is also more widely used because its generally less expensive.

The important thing is being aware of the of the risks associated with the operating systems we use and finding the right tools to protect those system. Generally its the apps we use and the sites we visit or the messages we receive via email, SMS or other messaging service that create problems. Its important to be very careful about what you click on. It's also smart to have your important files stored in encrypted storage either online or offline on a hard drive.

## File Sharing

For bigger files done directly peer to peer and encrypted (no company server in the middle where others can read things). Proton Drive is a great option if you don't want to use DropBox or Google Docs. There are some other options like https://send.tresorit.com/ or Mega.nz for large file sharing and storage and they use good encryption and security features.

Often I will just use Signal to share files unless they are huge. For the real hardcore privacy you can use [Onion Share](https://onionshare.org/) on the TOR network but that requires a bit more knowledge from folks on both sides and is generally beyond the needs of most people.

If you are primarily worried about security then using Google Docs or Air Drop in the Apple ecosystem are secure as long as your passwords are secure and you are using 2FA.

## VPNs and DNS - At home and on public wifi

There are way too many Virtual Private Network (VPN) options. If you watch Youtube videos you likely have seen a ton of ads for them. Although they all might be better than using a public wifi network in a coffee shop or airport without them the problem is many VPNs actually track all of your web traffic for marketing and re-targeting purposes. I like Proton VPN, if you use ProtonMail you have access to it automatically. They also do not track your web traffic and they have a free version that works pretty well. You can pay a bit more and its really fast and private.

Finally what about the information your web service provider or your mobile phone data provider has? Your DNS records are a history of every website you ever visited that they have total access to.

According to Wikipedia the Domain Name System (DNS) is a hierarchical and decentralized naming system for computers, services, or other resources connected to the Internet or a private network. It associates various information with domain names assigned to each of the participating entities.

Long story short your DNS also contains a history of all your web traffic. The simplest way to avoid this is to use a tool like Cloudflares 1.1.1.1..

[1.1.1.1 - One of the Internet's Fastest, Privacy-First DNS Resolver](https://cloudflare-dns.com)

✌️✌️ Browse a faster, more private internet.cloudflare-dns.com

They have desktop and mobile versions. They also help speed up your internet because all the tracking etc that many website are loading behind the scenes are blocked. Cloudflare is a very popular website security tool that helps block hacking attacks like denial of service attacks if you have a website. They claim to not track any of your individual or company data. Personally I trust them more than my internet or phone company. There are other ways to do private DNS routing but this is by far the easiest. You just install the app and flip a switch to turn it on. It also works as a VPN so its like two things in one and its free.

## Conclusions

Most of us are more at risk from hackers that send phishing emails to thousands of people as opposed to more targeted attacks but that doesn't mean we shouldn't be worried about risks (if you take anything from this article remember the importance of strong passwords and 2 Factor Authentication).

For some people like activists, journalists or celebrities there may be an additional layer of concerns that lead to the need for even more caution and some specific tools not listed above. That being said the tools listed below are all useful to a wide range of people regardless of your threat model.

Wherever possible I tried to prioritize open source apps. Open source projects are generally better for security because experts can review the code and provide reassurance that the networks are secure. Also they often have a community of people looking for bugs and fixing them.

This is far from an exhaustive lists, its just tools that have worked well for me. This is not a sponsored list of tools, these aren't affiliate links I shared above. Just a list of tools that have worked well for me and many others. Most of these tools were recommended by cybersecurity experts I talked to directly or listened to podcasts or blogs. I only suggested tools I have used myself but nothing is perfect. I have some mixed feelings about a bunch of the tools that are out there. Like I said, nothing is perfect, but that doesn't mean something isn't better than nothing.

For those that want to completely do-google their lives I would suggest searching for videos (ironically on youtube which is owned by google) and you will find a lot of videos as well links to articles on website that walk you through how to set up custom ROMs on some specific Android phone. Graphene OS and variations of that code like Calyx OS are good options but they do require additional work and vigilance. Again a lot depends on your priorities and how much effort you are willing to put in.

You can also find places to buy a phone that someone else has set up with privacy and security in mind. But, that is well beyond what most people will feel the need to do in their own lives. Just taking a few steps outlined above can make safe from some serious headaches at work and in your personal life. It can actually make things more convenient and less stressful if you put a little time into setting things up like a password manager and two factor authentication. Start there and then see where it takes you.

Feel free to get in touch if you have any questions or suggestions for other tools or tips. Good luck out there.