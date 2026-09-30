import { TextPage } from "@/components/text-page";
import { creatorPage } from "@/content/pages/creator";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(creatorPage.meta, routes.creator);

/** /content-creator — creator collaborations (no design; text page in the site's style). */
export default function ContentCreatorPage() {
  return <TextPage content={creatorPage} id="creator" />;
}
