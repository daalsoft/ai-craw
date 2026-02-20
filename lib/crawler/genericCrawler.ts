import { SiteConfig } from "@/lib/config/SiteConfig";
import { crawlByConfig } from "./crawlerService";

// 여러 사이트 순회
export async function crawlFromExcel(configs: SiteConfig[]) {
  const allJobs = [];

  for (const config of configs) {
    console.log("크롤링 시작:", config.site_name);
    const jobs = await crawlByConfig(config);
    allJobs.push(...jobs);
  }

  return allJobs;
}
