// app/page.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
        {/* 아이콘 영역 */}
        <div className="text-5xl mb-6">🔍</div>
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">
          AI 채용 정보 수집기
        </h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          설정된 사이트들을 실시간으로 크롤링하여<br />
          최신 채용 정보를 한곳에서 관리하세요.
        </p>

        {/* 버튼 영역 */}
        <Link 
          href="/jobs" 
          className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:-translate-y-1 shadow-lg active:scale-95"
        >
          실시간 크롤링 시작하기 →
        </Link>

        {/* 하단 안내 */}
        <p className="mt-6 text-xs text-gray-400">
          * 엑셀 설정(load/sites.xlsx)에 따라 수집 데이터가 달라집니다.
        </p>
      </div>
    </div>
  );
}