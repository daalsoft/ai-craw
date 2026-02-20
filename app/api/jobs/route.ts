import { readSiteConfig } from "@/lib/crawler/configReader";
import { crawlFromExcel } from "@/lib/crawler/genericCrawler";
import { saveJobsWithTimestamp } from "@/lib/utils/fileUtils"; 

export const runtime = "nodejs"; 

// 캐시를 절대 사용하지 않도록 강제 설정
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log("🚀 크롤링 프로세스 시작...");
  
  try {
    // 1. 엑셀 설정 읽기
    const configs = readSiteConfig("load/sites.xlsx"); 
    
    // 2. 크롤링 수행 (가장 시간이 많이 걸리는 작업)
    const jobs = await crawlFromExcel(configs);        

    // 3. [수정] 수집된 데이터가 있으면 파일 저장 수행
    if (Array.isArray(jobs) && jobs.length > 0) {
      console.log(`✅ 수집 성공: 총 ${jobs.length}건. 데이터를 파일로 저장합니다.`);
      saveJobsWithTimestamp(jobs); 
    } else {
      console.log("⚠️ 수집된 데이터가 없어 파일을 저장하지 않았습니다.");
    }

    // 4. 최종 응답 반환
    return new Response(JSON.stringify(Array.isArray(jobs) ? jobs : []), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0" // 캐시 방지 처리
      },
    });
    
  } catch (err: any) {
    console.error("❌ 크롤링 중 치명적 에러 발생:", err);
    return new Response(JSON.stringify({ 
      error: "크롤링 실패", 
      message: err.message 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}