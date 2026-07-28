import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import type { ListingImage } from "@/features/listings/types";

interface ImageGalleryProps {
  images: ListingImage[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) return null;
  const activeImage = images[activeIndex];

  return (
    <div>
      <div className="w-full h-64 rounded-xl overflow-hidden bg-gray-900">
        <img src={activeImage.url} alt="" className="w-full h-full object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex items-center gap-2 mt-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setActiveIndex(index)}
              className={`w-9 h-9 rounded-full overflow-hidden border-2 shrink-0 relative ${
                index === activeIndex ? "border-brand-blue" : "border-transparent"
              }`}
            >
              <img src={image.url} alt="" className="w-full h-full object-cover" />
              {image.isVideo && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <FiPlay className="w-3 h-3 text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}