
export interface BlueskyPost {
  id: string;
  text: string;
  createdAt: string;
  author: {
    displayName: string;
    handle: string;
    avatar?: string;
  };
  engagement: {
    likes: number;
    reposts: number;
    replies: number;
  };
  images?: Array<{
    url: string;
    alt?: string;
    aspectRatio?: { width: number; height: number };
  }>;
  externalLink?: {
    url: string;
    title?: string;
    description?: string;
    thumb?: string;
  };
  quotedPost?: {
    text: string;
    author: string;
    handle: string;
  };
}

export interface BlueskyFeedData {
  posts: BlueskyPost[];
  error?: string;
  debug?: any;
}
