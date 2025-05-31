// File: app/admin/components/CloudinaryUploader.tsx
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface CloudinaryUploaderProps {
    onImageUpload: (url: string) => void;
    previewImage: string | null;
    className?: string;
    aspectRatio?: 'square' | 'rectangle' | 'circle';
    placeholderText?: string;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({
    onImageUpload,
    previewImage,
    className = '',
    aspectRatio = 'square',
    placeholderText = 'Upload Image'
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Define container classes based on aspect ratio
    const containerClasses = {
        square: 'w-full h-40',
        rectangle: 'w-full h-40 md:h-60',
        circle: 'w-24 h-24 rounded-full'
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setUploadError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'default_preset');

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            console.log('Upload response:', data);

            onImageUpload(data.secure_url);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadError('Failed to upload image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className={`${containerClasses[aspectRatio]} bg-background overflow-hidden mb-2 cursor-pointer relative ${className}`}
                onClick={() => fileInputRef.current?.click()}
            >
                {previewImage ? (
                  <Image
                  src={previewImage}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw" // You can adjust this based on actual layout
                  className="object-cover"
                />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Upload size={aspectRatio === 'circle' ? 24 : 32} className="text-gray-400" />
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="loader w-8 h-8 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {uploadError && (
                <p className="text-sm text-red-500 mb-2">{uploadError}</p>
            )}

            <button
                type="button"
                className="text-sm text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : previewImage ? 'Change Image' : placeholderText}
            </button>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
            />
        </div>
    );
};

export default CloudinaryUploader;