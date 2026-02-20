export interface Job {
  // --- 필수 기본 정보 ---
  site: string;                // 출처 (naver, saramin 등)
  title: string;               // 공고 제목
  link: string;                // 상세 페이지 URL
  crawling_datetime: string;   // 수집 일시 (ISO String)

  // --- 핵심 상세 정보 (네이버 기준 통일) ---
  company_name?: string;       // 회사명 또는 계열사명
  job_duties?: string;         // 담당 업무
  qualifications?: string;     // 지원 자격 및 요구 조건 (사람인의 'info' 데이터가 여기로 매핑됨)
  preferred_qualifications?: string; // 우대 사항
  work_location?: string;      // 근무 지역/장소

  // --- 채용 관리 정보 ---
  job_id?: string;             // 각 사이트별 고유 공고 ID
  date?: string;               // 마감일 또는 게시일
  experience_level?: string;   // 경력 요건 (신입/경력/경력무관)
  employment_type?: string;    // 고용 형태 (정규직/계약직 등)
  
  // --- 기타 (확장용) ---
  team_introduction?: string;  // 조직/팀 소개
  recruitment_process?: string; // 전형 절차
}