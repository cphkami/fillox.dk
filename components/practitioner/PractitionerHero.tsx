import Link from "next/link";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";
import { practitionerPage } from "@/content/pages/practitioner";
import { CropPhoto } from "./CropPhoto";
import { PORTRAIT_TOP_POSITION, type ResolvedProfile } from "./profile";
import { Responsive } from "./Responsive";

type PractitionerHeroProps = { profile: ResolvedProfile; titleId: string };

/**
 * Profile hero (6alb / ma).
 *
 * - Desktop: sand panel, text left (breadcrumb, H1, title, intro, CTAs), portrait right;
 *   fact cards in a 3-column row underneath.
 * - Mobile: portrait card on top, then breadcrumb, title as eyebrow, H1, short intro,
 *   full-width CTA and the facts as label/value rows.
 */
export function PractitionerHero({ profile, titleId }: PractitionerHeroProps) {
  const { breadcrumb } = practitionerPage;
  const hasFacts = profile.facts.length > 0;
  // The photo is half the surface band: 768px on the 1600px canvas (1600 − 2 × 32 surface
  // margin, halved), about 50vw − 24px below. The zoomed desktop crop draws the photo `zoom`
  // times wider than its slot, so request that width to keep it sharp.
  const zoom = profile.desktopImage.zoom ?? 1;
  const sizes = [
    `(min-width: 1600px) ${Math.ceil(768 * zoom)}px`,
    zoom === 1 ? "(min-width: 768px) calc(50vw - 24px)" : `(min-width: 768px) calc((50vw - 24px) * ${zoom})`,
    "calc(100vw - 24px)",
  ].join(", ");

  return (
    <Container as="section" gutter="surface" aria-labelledby={titleId} className="max-md:pb-7">
      <div className="md:grid md:grid-cols-2 md:overflow-hidden md:rounded-[24px] md:bg-sand">
        <CropPhoto
          mobile={profile.mobileImage}
          desktop={profile.desktopImage}
          // 640–767px: the mobile slot turns landscape, so keep the top of the portrait.
          sm={{ position: PORTRAIT_TOP_POSITION }}
          sizes={sizes}
          priority
          // From 1024px the slot keeps at least the design's 566:620 shape (height = photo
          // width × 1.095, 620 → 800px), so the portrait's crop, and the headroom above the
          // face, stays as designed while the column grows (620px up to 1180px).
          className="mt-2 h-[440px] rounded-[24px] sm:h-[560px] md:order-last md:mt-0 md:h-auto md:min-h-[540px] md:rounded-none lg:min-h-[clamp(620px,calc((50vw-24px)*1.095),800px)]"
        />

        <div className="flex flex-col gap-4 px-2 pt-7 md:justify-center md:gap-0 md:px-10 md:py-14 lg:px-14 lg:py-fluid-72 xl:px-16 2xl:px-20">
          <nav aria-label={breadcrumb.label} className="text-[13px] text-muted md:mb-[18px] md:text-[14px]">
            <ol>
              {breadcrumb.items.map((item, i) => (
                <li key={item.href} className="inline">
                  {i > 0 ? <span aria-hidden="true">{" → "}</span> : null}
                  <Link href={item.href} className="transition-colors hover:text-plum">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="inline max-md:hidden">
                <span aria-hidden="true">{" → "}</span>
                <span aria-current="page" className="text-plum">
                  {profile.name}
                </span>
              </li>
            </ol>
          </nav>

          <Eyebrow className="md:hidden">
            <Responsive mobile={profile.titleShort} desktop={profile.title} />
          </Eyebrow>

          <h1
            id={titleId}
            className="text-[36px] leading-[1.08] font-semibold tracking-display text-plum md:mb-2 md:text-[52px] md:leading-[1.02] lg:text-h1"
          >
            {profile.displayName}
          </h1>

          <p className="text-lead text-muted max-md:hidden md:mb-[22px]">{profile.title}</p>

          {profile.intro ? (
            <p className="text-[16px] leading-[1.7] text-muted md:mb-[30px] md:max-w-[44ch] md:text-lead md:leading-[1.75]">
              <Responsive mobile={profile.introShort} desktop={profile.intro} />
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3">
            <ButtonLink href={profile.primaryCta.href} size="md" mobileSize="lg" fullWidth="mobile">
              {profile.primaryCta.label}
            </ButtonLink>
            {profile.secondaryCta ? (
              <ButtonLink href={profile.secondaryCta.href} variant="textLink" className="max-md:hidden">
                {profile.secondaryCta.label}
                <span aria-hidden="true" className="-ml-1">
                  ↓
                </span>
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </div>

      {hasFacts ? (
        <dl className="mt-4 flex flex-col gap-2 px-2 md:mt-surface md:grid md:grid-cols-3 md:gap-4 md:px-0 lg:gap-surface">
          {profile.facts.map((fact) => (
            <div
              key={fact.label}
              className="flex justify-between gap-3 rounded-2xl bg-white px-[18px] py-3.5 text-[15px] md:flex-col md:justify-start md:gap-0 md:rounded-[24px] md:px-6 md:py-6 lg:px-[30px] lg:py-7"
            >
              <dt className="text-muted md:mb-2 md:text-[12px] md:font-bold md:tracking-[2px] md:text-plum md:uppercase">
                {fact.label}
              </dt>
              <dd className="text-right font-semibold md:text-left md:text-[20px] md:tracking-display lg:text-h3">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Container>
  );
}
