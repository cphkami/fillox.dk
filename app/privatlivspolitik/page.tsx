import { TextPage, textPageMetadata } from "@/components/text-page";
import { privacyPage } from "@/content/pages/legal";

export const metadata = textPageMetadata(privacyPage, "/privatlivspolitik");

/** /privatlivspolitik — privacy policy (no design; text page in the site's style). */
export default function PrivacyPage() {
  return <TextPage content={privacyPage} id="privatlivspolitik" />;
}
