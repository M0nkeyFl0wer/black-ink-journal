
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Trash2, Copy, Search, Image as ImageIcon, X } from 'lucide-react';

interface ImageFile {
  name: string;
  url: string;
  size: number;
  created_at: string;
}

const ImageManager = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list('', {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      const imageList = data.map(file => ({
        name: file.name,
        url: supabase.storage.from('blog-images').getPublicUrl(file.name).data.publicUrl,
        size: file.metadata?.size || 0,
        created_at: file.created_at || ''
      }));

      setImages(imageList);
    } catch (error: any) {
      toast({
        title: "Error loading images",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file`,
            variant: "destructive",
          });
          continue;
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error } = await supabase.storage
          .from('blog-images')
          .upload(fileName, file);

        if (error) throw error;

        toast({
          title: "Upload successful",
          description: `${file.name} has been uploaded`,
        });
      }

      // Refresh the image list
      await loadImages();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (fileName: string) => {
    if (!confirm('Are you sure you want to delete this image? This action cannot be undone.')) return;

    try {
      const { error } = await supabase.storage
        .from('blog-images')
        .remove([fileName]);

      if (error) throw error;

      toast({
        title: "Image deleted",
        description: "The image has been successfully removed",
      });

      // Refresh the image list
      await loadImages();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copied",
      description: "Image URL has been copied to clipboard",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Image Manager</h1>
            <p className="text-gray-400">Upload and manage images for your blog posts</p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="bg-gray-900 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload Images
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-white mb-2">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-gray-400 text-sm">
                  Supports JPG, PNG, GIF, WebP (max 10MB each)
                </p>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Search and Gallery */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Image Gallery</CardTitle>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white w-64"
                  />
                </div>
                <span className="text-gray-400 text-sm">
                  {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-400">Loading images...</span>
              </div>
            ) : filteredImages.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  {searchTerm ? 'No images found' : 'No images uploaded yet'}
                </h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? 'Try adjusting your search term' : 'Upload your first image to get started'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredImages.map((image) => (
                  <div key={image.name} className="group relative bg-gray-800 rounded-lg overflow-hidden">
                    <div className="aspect-square">
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setSelectedImage(image.url)}
                      />
                    </div>
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyImageUrl(image.url)}
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteImage(image.name)}
                          className="bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image info */}
                    <div className="p-3 bg-gray-800">
                      <p className="text-white text-sm font-medium truncate" title={image.name}>
                        {image.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatFileSize(image.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Preview Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 bg-black/50 border-white/20 text-white hover:bg-black/70"
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={selectedImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;
