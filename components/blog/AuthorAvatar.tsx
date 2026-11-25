import { Photo } from "@/components/ui";
import type { PostAuthor } from "./postView";
import { TeamMark } from "./TeamMark";

/**
 * The author's round avatar in the bylines and the author box: the practitioner's portrait,
 * or the Fillox mark for the team. Decorative (`alt=""`): the name is always next to it.
 * `className` sizes it (e.g. "size-10 md:size-11"); `sizes` is the portrait's next/image sizes.
 */
export function AuthorAvatar({ author, sizes, className }: { author: PostAuthor; sizes: string; className: string }) {
  if (!author.image) return <TeamMark className={className} />;
  return <Photo image={{ ...author.image, alt: "" }} sizes={sizes} radius="50%" className={`shrink-0 ${className}`} />;
}
