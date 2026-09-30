import { TextPage, textPageMetadata } from "@/components/text-page";
import { jobsPage } from "@/content/pages/jobs";

export const metadata = textPageMetadata(jobsPage, "/ledige-stillinger");

/** /ledige-stillinger — jobs (no design; text page in the site's style). */
export default function JobsPage() {
  return <TextPage content={jobsPage} id="ledige-stillinger" />;
}
