import { site } from "@/config/site";

/**
 * `sizes` for the logo <Image> from its CSS heights in px: below 1024px, from 1024px (`lg`) and the
 * largest from 1280px (`xl`). The widths follow the logo file's proportions (config/site.ts →
 * brand), so the srcset picks a file near the rendered size (≈ 86–125px wide), not the 640 / 1440px
 * ones that `width={logoWidth}` alone selects.
 */
export function logoSizes(base: number, lg?: number, xl?: number): string {
  const width = (height: number) => `${Math.ceil((height * site.brand.logoWidth) / site.brand.logoHeight)}px`;
  return [xl ? `(min-width: 1280px) ${width(xl)}` : "", lg ? `(min-width: 1024px) ${width(lg)}` : "", width(base)]
    .filter(Boolean)
    .join(", ");
}
