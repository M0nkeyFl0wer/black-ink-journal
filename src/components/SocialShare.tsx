
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, MessageSquare, AtSign, Linkedin, Twitter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

const SocialShare = ({ title, url, description }: SocialShareProps) => {
  const shareText = `${title}${description ? ` - ${description}` : ''}`;
  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;

  const shareLinks = {
    bluesky: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
    mastodon: `https://mastodon.social/share?text=${encodeURIComponent(`${shareText} ${fullUrl}`)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&summary=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`,
  };

  const handleShare = (platform: string) => {
    const link = shareLinks[platform as keyof typeof shareLinks];
    window.open(link, '_blank', 'width=600,height=400');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: fullUrl,
        });
      } catch (error) {
        // Fallback to dropdown if native share fails
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-900 border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleShare('bluesky')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 mr-2 text-blue-400" />
          Share on Bluesky
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('mastodon')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <AtSign className="w-4 h-4 mr-2 text-purple-400" />
          Share on Mastodon
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('linkedin')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
          Share on LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleShare('twitter')}
          className="text-white hover:bg-gray-800 cursor-pointer"
        >
          <Twitter className="w-4 h-4 mr-2 text-blue-400" />
          Share on Twitter
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem 
            onClick={handleNativeShare}
            className="text-white hover:bg-gray-800 cursor-pointer"
          >
            <Share2 className="w-4 h-4 mr-2" />
            More options...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SocialShare;
