import { TextPage } from "@/components/text-page";
import { privacyPage } from "@/content/pages/legal";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(privacyPage.meta, routes.privacy);

/** /privatlivspolitik — privacy policy (no design; text page in the site's style). */
export default function PrivacyPage() {
  return <TextPage content={privacyPage} id="privacy" />;
}
