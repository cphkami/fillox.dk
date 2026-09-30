import { Container } from "@/components/ui";
import type { HomePage } from "@/content/pages/home";
import { cn } from "@/lib/cn";

/**
 * Plum USP band under the hero. Desktop (6a): four columns with title + text.
 * Mobile (mf): 2 × 2 grid of centred titles; the text returns from 768px.
 */
export function UspBand({ usps }: { usps: HomePage["usps"] }) {
  return (
    <Container gutter="surface" className="my-3 md:mt-6 md:mb-0">
      <ul data-surface="plum" className="grid grid-cols-2 rounded-[24px] bg-plum lg:grid-cols-4 lg:px-7 lg:py-[30px]">
        {usps.map((usp, i) => (
          <li
            key={usp.title}
            className={cn(
              "flex flex-col justify-center border-cream/18 px-[18px] py-5 text-center",
              i % 2 === 0 && "border-r",
              i < 2 && "border-b",
              "lg:justify-start lg:border-b-0 lg:px-7 lg:py-0 lg:text-left",
              i < usps.length - 1 ? "lg:border-r lg:border-[rgba(243,237,228,.16)]" : "lg:border-r-0",
            )}
          >
            <p className="text-[15px] font-semibold text-cream lg:text-[16px] lg:font-normal">{usp.title}</p>
            <p className="mt-[3px] text-[14px] text-blush max-md:hidden">{usp.text}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
