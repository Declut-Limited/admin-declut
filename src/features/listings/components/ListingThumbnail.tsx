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
    <img
      src={url}
      alt=""
      onError={() => setFailed(true)}
      className={`${sizeClass[size]} rounded-lg object-cover shrink-0`}
    />
  );
}