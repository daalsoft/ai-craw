import { crawlSite } from "./crawlerEngine";
import { createDriver } from "./driver";
import { SiteConfig } from "@/lib/config/SiteConfig"; 

// 단일 사이트 크롤링
export async function crawlByConfig(config: SiteConfig) {
  const driver = await createDriver(); // 로컬 Chrome
  try {
    return await crawlSite(driver, config);
  } finally {
    await driver.quit();
  }
}
