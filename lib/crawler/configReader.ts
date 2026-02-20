import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";
//import XLSX from "xlsx";
import { SiteConfig } from "@/lib/config/SiteConfig";

export function readSiteConfig(relativeFilePath: string): SiteConfig[] {
  const filePath = path.join(process.cwd(), relativeFilePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`파일을 찾을 수 없습니다: ${filePath}`);
  }

  try {
// 2. [핵심] readFile 대신 readFileSync를 사용해 메모리로 먼저 읽어옵니다.
    // 이렇게 하면 엑셀 프로그램이 파일을 잡고 있어도 읽기가 가능할 확률이 높습니다.
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet);

    // 데이터 보정: 엑셀의 문자열/숫자를 인터페이스 형식에 맞게 변환
if (rawData.length === 0) {
      console.warn("⚠️ [경고] 엑셀 파일에 데이터가 비어 있습니다.");
      return [];
    }

    const configs: SiteConfig[] = rawData.map((item: any) => ({
      ...item,
      is_infinite_scroll: String(item.is_infinite_scroll).toUpperCase() === "TRUE" || item.is_infinite_scroll === true,
      // 필요한 다른 불리언 값들도 여기서 변환
    }));

    console.log(`✅ [Excel 로드 성공] ${configs.length}개의 설정을 읽어왔습니다.`);
    return configs;
  } catch (err: any) {
    console.error("❌ 엑셀 읽기 실패:", err.message);
    return [];
  }
}