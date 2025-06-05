
import { BlueskyPost } from './types';
import { Link as LinkIcon } from 'lucide-react';

interface ImageGalleryProps {
  images: BlueskyPost['images'];
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  if (!images || images.length === 0) return null;

  const getGridClass = (count: number) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count === 3) return 'grid-cols-2';
    return 'grid-cols-2';
  };

  return (
    <div className={`grid gap-2 mt-3 ${getGridClass(images.length)}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-lg ${
            images.length === 3 && index === 0 ? 'col-span-2' : ''
          }`}
        >
          <img
            src={image.url}
            alt={image.alt || 'Post image'}
            className="w-full h-auto object-cover hover:opacity-90 transition-opacity cursor-pointer"
            onClick={() => window.open(image.url, '_blank')}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

interface ExternalLinkPreviewProps {
  link: BlueskyPost['externalLink'];
}

export const ExternalLinkPreview = ({ link }: ExternalLinkPreviewProps) => {
  if (!link) return null;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-3 border border-gray-700 rounded-lg hover:border-gray-600 transition-colors"
    >
      <div className="flex">
        {link.thumb && (
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={link.thumb}
              alt=""
              className="w-full h-full object-cover rounded-l-lg"
              loading="lazy"
            />
          </div>
        )}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start space-x-2">
            <LinkIcon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              {link.title && (
                <p className="text-sm font-medium text-white truncate">
                  {link.title}
                </p>
              )}
              {link.description && (
                <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                  {link.description}
                </p>
              )}
              <p className="text-xs text-gray-500 truncate mt-1">
                {new URL(link.url).hostname}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

interface QuotedPostProps {
  quote: BlueskyPost['quotedPost'];
}

export const QuotedPost = ({ quote }: QuotedPostProps) => {
  if (!quote) return null;

  return (
    <div className="mt-3 border border-gray-700 rounded-lg p-3 bg-gray-900/50">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-sm font-medium text-white">{quote.author}</span>
        <span className="text-xs text-gray-400">@{quote.handle}</span>
      </div>
      <p className="text-sm text-gray-300">{quote.text}</p>
    </div>
  );
};
