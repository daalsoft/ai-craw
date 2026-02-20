import { By, until, WebDriver } from "selenium-webdriver";
import { SiteConfig } from "@/lib/config/SiteConfig";

/**
 * [네이버 전용] 섹션별 텍스트 추출 헬퍼 (Python 로직 이식)
 */
async function getSectionText(driver: WebDriver, titles: string[]): Promise<string> {
  try {
    const boxes = await driver.findElements(By.css(".detail_box, .detail_togglebox"));
    for (const box of boxes) {
      const text = await box.getText();
      if (titles.some(title => text.includes(title))) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l !== "");
        if (titles.some(title => lines[0]?.includes(title))) lines.shift();
        return lines.join('\n');
      }
    }
  } catch (e) { return ""; }
  return "";
}

export async function crawlSite(driver: WebDriver, config: SiteConfig) {
  const jobs = [];
  const MAX_TEST_PAGES = 1; // 사람인 등 페이지네이션용
  let currentPage = 0;

  try {
    await driver.manage().setTimeouts({ pageLoad: 30000, implicit: 5000 });
    await driver.get(config.url);

    // --- 1. 전처리 (무한 스크롤 / 페이징) ---
    if (config.is_infinite_scroll) {
      let lastHeight = await driver.executeScript("return document.body.scrollHeight");
      while (true) {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(2000);
        let newHeight = await driver.executeScript("return document.body.scrollHeight");
        if (newHeight === lastHeight) break;
        lastHeight = newHeight;
      }
    }

    // --- 2. 수집 루프 ---
    let hasNextPage = true;
    while (hasNextPage && currentPage < MAX_TEST_PAGES) {
      currentPage++;
      console.log(`${config.site_name}: ${currentPage}페이지 분석 중...`);

      // 목록 로딩 대기
      await driver.wait(until.elementLocated(By.css(config.list_item)), 15000);
      const items = await driver.findElements(By.css(config.list_item));

      if (config.site_name === "naver") {
        // [네이버 고도화] 상세 페이지 진입형 수집
        const targetLinks = [];
        for (const item of items) {
          try {
            const titleEl = await item.findElement(By.css(config.title_selector));
            const title = (await titleEl.getAttribute("innerText")).trim();
            const linkEl = await item.findElement(By.css("a.card_link"));
            const onclick = await linkEl.getAttribute("onclick");
            const match = onclick?.match(/'(\d+)'/);
            if (match) {
              targetLinks.push({ title, url: `https://recruit.navercorp.com/rcrt/view.do?annoId=${match[1]}`, id: match[1] });
            }
          } catch (e) { continue; }
        }

        for (const target of targetLinks) {
          try {
            await driver.get(target.url);
            await driver.wait(until.elementLocated(By.className("detail_wrap")), 10000);
            
            const jobData = {
              site: "naver",
              title: target.title,
              link: target.url,
              job_id: target.id,
              company_name: "네이버", 
              team_introduction: await getSectionText(driver, ["조직 소개", "부서 소개"]),
              job_duties: await getSectionText(driver, ["담당 업무", "What You'll Do"]),
              qualifications: await getSectionText(driver, ["자격 요건", "지원자격"]),
              preferred_qualifications: await getSectionText(driver, ["우대 사항"]),
              date: "공고 참조",
              crawling_datetime: new Date().toISOString()
            };
            jobs.push(jobData);
            // 여기서 JSON 저장 로직 호출 가능
          } catch (err) { console.error(`네이버 상세 에러: ${target.url}`, err); }
        }
      } 
      else if (config.site_name === "saramin") {
        // [사람인] 기존 목록 기반 추출 로직 유지
        for (const item of items) {
          try {
            const titleEl = await item.findElement(By.css(config.title_selector));
            const title = (await titleEl.getAttribute("innerText")).trim();
            const link = await titleEl.getAttribute("href") || await (await item.findElement(By.css("a"))).getAttribute("href");
            
            let corpName = "회사명 확인불가";
            try {
              const corpEl = await item.findElement(By.css("span.corp, strong.corp_name, .area_corp .name"));
              corpName = (await corpEl.getAttribute("innerText")).trim();
            } catch (e) {}

            let conditions = "";
            try {
              const condEl = await item.findElement(By.css("ul.desc, div.job_condition"));
              conditions = (await condEl.getAttribute("innerText")).replace(/\n/g, " ").trim();
            } catch (e) {}

            // [사람인 데이터 네이버 기준으로 항목 통일]
            jobs.push({
              site: "saramin",
              title: title,
              link: link,
              company_name: corpName,
              // 사람인의 '경력/학력/지역' 정보를 네이버의 qualifications 필드로 통일
              qualifications: conditions, 
              // 상세페이지가 아니므로 기본값 할당
              job_duties: "상세 공고 참조",
              date: "채용 시 마감",
              crawling_datetime: new Date().toISOString()
            });
          } catch (err) { continue; }
        }
      }
      
      hasNextPage = false; // 테스트를 위해 1페이지만 수행
    }
  } catch (error) {
    console.error("크롤링 중 에러 발생:", error);
  }

  return jobs;
}