import fs from "fs";
import path from "path";

/**
 * 수집된 데이터를 'YYYY-MM-DD_HH-mm-ss' 형식의 폴더를 생성하여 저장합니다.
 * @param jobs 크롤링된 데이터 배열
 */
export function saveJobsWithTimestamp(jobs: any[]) {
  if (!jobs || jobs.length === 0) {
    console.log("⚠️ 저장할 데이터가 없습니다.");
    return null;
  }

  try {
    // 1. 한국 시간(KST) 기준 시간 생성
    const now = new Date();
    const kstOffset = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + kstOffset);
    
    // 파일명에 사용할 수 없는 문자(:)를 하이픈(-)으로 변경
    const timestamp = kstDate.toISOString()
      .replace(/T/, '_')      // 날짜와 시간 구분
      .replace(/\..+/, '')    // 밀리초 제거
      .replace(/:/g, '-')     // 시간 구분자 변경
      .slice(0, 19);          // 초까지만 절삭

    // 2. 저장 경로 설정 (프로젝트 루트/crawled_data/날짜_시간)
    const dirPath = path.join(process.cwd(), "crawled_data", timestamp);

    // 3. 폴더가 없으면 생성 (recursive: true 옵션으로 중간 경로까지 자동 생성)
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 4. JSON 파일 저장
    const filePath = path.join(dirPath, "jobs.json");
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), "utf-8");
    
    console.log(`\n=========================================`);
    console.log(`✅ [파일 저장 완료]`);
    console.log(`📍 경로: ${filePath}`);
    console.log(`📊 데이터 수: ${jobs.length}건`);
    console.log(`=========================================\n`);

    return filePath;
  } catch (err) {
    console.error("❌ 파일 저장 중 오류 발생:", err);
    return null;
  }
}