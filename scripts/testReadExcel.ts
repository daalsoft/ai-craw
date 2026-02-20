import path from "path";
import fs from "fs";
import { SiteConfig } from "@/lib/config/SiteConfig"; 
import XLSXModule from "xlsx";
const XLSX = (XLSXModule as any).default || XLSXModule; // TSX + 스크립트 호환

// 2. 엑셀 읽기 함수 정의
export function readSiteConfig(relativeFilePath: string): SiteConfig[] {
  const filePath = path.join(process.cwd(), relativeFilePath);
  console.log("📂 Reading Excel from:", filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
  }

  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // JSON 변환
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // 데이터 보정 (문자열 "TRUE"를 실제 boolean으로 변환)
    const configs: SiteConfig[] = rawData.map((item: any) => ({
      ...item,
      is_modal: String(item.is_modal).toUpperCase() === "TRUE",
      is_infinite_scroll: String(item.is_infinite_scroll).toUpperCase() === "TRUE",
    }));

    console.log(`✅ Excel 데이터 로드 완료: ${configs.length}건`);
    return configs;
  } catch (err: any) {
    console.error("❌ Failed to read Excel file:", err.message);
    return [];
  }
}

// ---------------------------------------------------------
// 🚀 [추가된 실행부] 직접 실행 시 동작하는 테스트 코드
// ---------------------------------------------------------
try {
  // 실제 엑셀 파일이 있는 상대 경로를 입력하세요
  const result = readSiteConfig("data/sites.xlsx");

  console.log("\n=========================================");
  console.log("📊 엑셀 데이터 로드 테스트 결과");
  console.log("=========================================");

  if (result.length > 0) {
    // 터미널에 표 형태로 예쁘게 출력
    console.table(result);

    // 첫 번째 데이터 상세 확인
    console.log("\n🔍 첫 번째 행 상세 구조:");
    console.dir(result[0], { depth: null, colors: true });
  } else {
    console.log("⚠️ 엑셀은 읽었으나 데이터가 없습니다. 시트 내용을 확인하세요.");
  }
} catch (error: any) {
  console.error("\n❌ 테스트 실행 중 오류 발생:", error.message);
}