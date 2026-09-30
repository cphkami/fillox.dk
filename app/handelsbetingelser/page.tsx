import { TextPage, textPageMetadata } from "@/components/text-page";
import { termsPage } from "@/content/pages/legal";

export const metadata = textPageMetadata(termsPage, "/handelsbetingelser");

/** /handelsbetingelser — terms of trade (no design; text page in the site's style). */
export default function TermsPage() {
  return <TextPage content={termsPage} id="handelsbetingelser" />;
}
