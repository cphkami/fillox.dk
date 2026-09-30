import { TextPage } from "@/components/text-page";
import { termsPage } from "@/content/pages/legal";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(termsPage.meta, routes.terms);

/** /handelsbetingelser — terms of trade (no design; text page in the site's style). */
export default function TermsPage() {
  return <TextPage content={termsPage} id="terms" />;
}
