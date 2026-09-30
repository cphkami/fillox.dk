import Link from "next/link";
import { Photo } from "@/components/ui";
import { teamMemberHref } from "@/content/team";
import type { TeamMember } from "@/content/types";
import { cn } from "@/lib/cn";
import { Responsive } from "./Responsive";

/**
 * One practitioner on /om-os.
 *
 * - Mobile (mo): every member is a white card — portrait 340px (radius 18), name,
 *   short title, short bio and a 44px arrow link. The portrait scales with the card up
 *   to 400px high. From 560px (no design) the cards sit two per row and the featured
 *   member's card turns horizontal across both columns.
 * - Desktop (6om): the featured member (Dr. Tom) is a wide two-column block with the
 *   zoomed wide portrait; the others are borderless grid cards with the 6om crops.
 * - Tablet 768–1023 (no design): the grid cards sit two per row with the uncropped
 *   portrait at 4:5, capped at 440px high (the 6om crops only fit the 246×340 slot).
 * - `quote` (6om spec note: "et personligt citat") renders as a small blockquote when set.
 *
 * The whole card links to the practitioner's profile (/behandlere/<slug>). When the
 * card's CTA goes elsewhere (Dr. Tom: "Book tid hos Dr. Tom"), the name carries the
 * profile link and the CTA stays a separate link on top.
 */
export function TeamMemberCard({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  const profileHref = teamMemberHref(member.slug);
  const cta = member.link ?? { label: member.name, href: profileHref };
  const ctaIsProfile = cta.href === profileHref;
  const name = member.fullName ?? member.name;
  const desktopImage = member.crops?.about ?? member.image;

  // Stretched link: its ::after covers the whole card (the <article> is the positioned box).
  const stretched = "after:absolute after:inset-0 after:rounded-[24px]";

  return (
    <article
      className={cn(
        "relative flex w-full flex-col rounded-[24px] bg-white px-2.5 pt-2.5 pb-5 md:rounded-none md:bg-transparent md:p-0",
        // 560–767 (no design): horizontal white card spanning both columns.
        featured &&
          "min-[560px]:grid min-[560px]:grid-cols-2 min-[560px]:items-center min-[560px]:gap-x-4 min-[560px]:pb-2.5",
        featured && "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 md:pb-0 lg:gap-14",
      )}
    >
      {/*
        Uncropped, centred portrait. Mobile: 330×340 at 390px (radius 18), scaling with the
        card up to 400px high. Grid cards keep it on tablets (4:5, radius 24, max 440px high).
      */}
      <Photo
        image={member.image}
        sizes="(min-width: 560px) 50vw, 100vw"
        radius="var(--team-photo-radius)"
        className={cn(
          "aspect-[33/34] max-h-[400px] [--team-photo-radius:18px]",
          featured ? "md:hidden" : "md:aspect-[4/5] md:max-h-[440px] md:[--team-photo-radius:24px] lg:hidden",
        )}
        // 449–559 (single column, no design): the 400px cap makes the slot wider than tall, so
        // a centred portrait would cut off the face; anchor it near the top instead.
        imgClassName="min-[449px]:max-[560px]:object-[50%_15%]!"
      />
      {/* Desktop portrait (6om crop): featured from 768px, grid cards from 1024px. */}
      <Photo
        image={desktopImage}
        // Slot width × the crop's zoom (up to ~1.6), so the zoomed crop stays sharp.
        sizes={featured ? "(min-width: 1180px) 920px, 90vw" : "(min-width: 1180px) 340px, 30vw"}
        radius={24}
        // Grid cards keep the 6om slot ratio (246×340 at 1180px) so the stored crops stay put.
        className={featured ? "h-[420px] max-md:hidden lg:h-[520px]" : "aspect-[246/340] max-lg:hidden"}
      />

      <div
        className={cn(
          "flex flex-1 flex-col gap-1.5 px-2.5 pt-4 md:gap-0 md:p-0",
          featured && "min-[560px]:py-2 min-[560px]:pl-0 md:block",
        )}
      >
        <h3
          className={cn(
            "text-[22px] font-semibold tracking-display text-plum",
            featured
              ? "md:mb-1.5 md:text-[32px] md:leading-[1.1] lg:text-[40px]"
              : "md:mt-[22px] md:mb-1 md:text-[24px]",
          )}
        >
          {ctaIsProfile ? (
            name
          ) : (
            <Link
              href={profileHref}
              className={cn(stretched, "decoration-1 underline-offset-4 hover:underline")}
            >
              {name}
            </Link>
          )}
        </h3>
        <p className={cn("text-[13px] text-muted md:text-[14px]", featured ? "md:mb-5" : "md:mb-3.5")}>
          <Responsive mobile={member.titleShort} desktop={member.title ?? member.role} />
        </p>
        {member.bio ? (
          <p
            className={cn(
              "text-[15px] leading-[1.65] text-muted md:text-[16px] md:leading-[1.75]",
              featured && "md:mb-[18px] md:max-w-[50ch]",
            )}
          >
            <Responsive mobile={member.bioShort} desktop={member.bio} />
          </p>
        ) : null}
        {member.quote ? (
          <blockquote
            className={cn(
              "mt-1.5 border-l-2 border-plum pl-3 text-[15px] leading-[1.6] font-medium text-ink md:text-[16px]",
              featured ? "md:mt-0 md:mb-[18px] md:max-w-[50ch]" : "md:mt-3.5",
            )}
          >
            <p>{member.quote}</p>
          </blockquote>
        ) : null}
        <div className={cn("mt-auto md:text-[14px]", !featured && "md:pt-4")}>
          <Link
            href={cta.href}
            className={cn(
              "inline-flex h-11 items-center text-[15px] font-semibold whitespace-nowrap text-plum transition-colors hover:text-plum-deep",
              "md:h-auto md:border-b md:pb-[3px] md:text-[14px] md:font-normal",
              // 6om: Dr. Tom's link is an ink inline-block; the grid cards use an inline plum span.
              featured ? "md:inline-block md:border-ink md:text-ink md:hover:text-plum" : "md:inline md:border-plum",
              ctaIsProfile ? stretched : "relative z-10",
            )}
          >
            {cta.label}
            <span aria-hidden="true">&nbsp;→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
