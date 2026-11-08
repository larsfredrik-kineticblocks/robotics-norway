import Image from "next/image";
import type { NewsFigure } from "@/content/news";

type NewsPhotoProps = {
  figure: NewsFigure;
  sizes: string;
  preload?: boolean;
  className?: string;
  /** Crop into a shared 3:2 frame. Used by the in-article gallery. */
  frame?: boolean;
};

export function NewsPhoto({ figure, sizes, preload = false, className, frame = false }: NewsPhotoProps) {
  if (frame) {
    return (
      <div className="relative aspect-[3/2] overflow-hidden bg-paper">
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={figure.objectPosition ? { objectPosition: figure.objectPosition } : undefined}
        />
      </div>
    );
  }

  return (
    <Image
      src={figure.src}
      alt={figure.alt}
      width={figure.width}
      height={figure.height}
      sizes={sizes}
      preload={preload || undefined}
      className={className ?? "h-auto w-full"}
    />
  );
}
