import { useState } from "react";
import { getInitials } from "@/lib/utils/getInitials";

interface ListingThumbnailProps {
  url: string | null;
  title: string;
  size?: "sm" | "md";
}

const sizeClass = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
};

export default function ListingThumbnail({
  url,
  title,
  size = "sm",
}: ListingThumbnailProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!url || failed) {
    return (
      <span
        className={`${sizeClass[size]} rounded-lg flex items-center justify-center font-semibold text-white shrink-0 bg-gradient-to-br from-[#D19E00] to-[#2563EB]`}
      >
        {getInitials(title)}
      </span>
    );
  }

  return (
    <span
      className={`${sizeClass[size]} rounded-lg shrink-0 block overflow-hidden bg-gray-200 dark:bg-gray-700 ${
        loaded ? "" : "animate-pulse"
      }`}
    >
      <img
        src={url}
        alt=""
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}