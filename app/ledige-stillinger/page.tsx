import { TextPage } from "@/components/text-page";
import { jobsPage } from "@/content/pages/jobs";
import { routes } from "@/content/routes";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(jobsPage.meta, routes.jobs);

/** /ledige-stillinger — jobs (no design; text page in the site's style). */
export default function JobsPage() {
  return <TextPage content={jobsPage} id="jobs" />;
}
