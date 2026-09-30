import { TextPage, textPageMetadata } from "@/components/text-page";
import { creatorPage } from "@/content/pages/creator";

export const metadata = textPageMetadata(creatorPage, "/content-creator");

/** /content-creator — creator collaborations (no design; text page in the site's style). */
export default function ContentCreatorPage() {
  return <TextPage content={creatorPage} id="content-creator" />;
}
