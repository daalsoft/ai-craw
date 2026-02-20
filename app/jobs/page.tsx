"use client";

import { useState, useEffect } from "react";
import { Job } from "@/types/job";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCrawling();
  }, []);

  const startCrawling = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setJobs([]);

    try {
      const res = await fetch("/api/jobs", { cache: "no-store" });
      if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }
    } catch (err: any) {
      setError(err.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      {/* 헤더 영역: 네이버 느낌의 깔끔한 디자인 */}
      <div className="flex justify-between items-end mb-8 pb-4 border-b-2 border-gray-200">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e1e23] tracking-tight">
            채용정보 <span className="text-[#03c75a] text-lg ml-1">수집기</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">네이버 검색 결과 표준 항목으로 통합된 리스트입니다.</p>
        </div>
        <button
          onClick={startCrawling}
          disabled={loading}
          className={`px-5 py-2 rounded-md font-bold text-sm transition-all ${
            loading 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-[#03c75a] text-white hover:bg-[#02b350] shadow-sm"
          }`}
        >
          {loading ? "데이터 불러오는 중..." : "새로고침"}
        </button>
      </div>

      {/* 상태 메시지 */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex justify-between items-center">
          <span>⚠️ {error}</span>
          <button onClick={startCrawling} className="font-bold underline">재시도</button>
        </div>
      )}

      {/* 로딩/데이터 없음 레이아웃 생략 (기존 로직 유지) */}

      {/* 네이버 스타일 리스트 테이블 */}
      {!loading && jobs.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#f9fafb]">
              <tr>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 w-24">출처</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-600">공고 내용</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-600">자격요건 및 근무조건</th>
                <th className="px-6 py-4 text-[13px] font-bold text-gray-600 text-right w-32">마감/등록일</th>
              </tr>
            </thead>
            {/* 데이터 테이블 부분 */}
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job, idx) => (
                <tr key={idx} className="hover:bg-green-50/30 transition-colors">
                  <td className="px-6 py-4 align-top">
                    <span className="text-[11px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-500 uppercase">
                      {job.site}
                    </span>
                  </td>
                  <td className="px-6 py-4 align-top">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-green-600 mb-1">{job.company_name}</span>
                      <a href={job.link} target="_blank" className="text-[15px] font-bold text-gray-900 hover:underline hover:text-[#03c75a]">
                        {job.title}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 align-top">
                    {/* 네이버/사람인 구분 없이 qualifications 필드를 메인 정보로 표시 */}
                    <div className="flex flex-wrap gap-1">
                      {job.qualifications?.split('|').map((q, i) => (
                        <span key={i} className="bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-[12px]">
                          {q.trim()}
                        </span>
                      ))}
                    </div>
                    {/* 네이버 데이터만 있는 경우 추가 정보 노출 */}
                    {job.job_duties && job.site === 'naver' && (
                      <p className="mt-2 text-[12px] text-gray-400 line-clamp-1 italic">
                        업무: {job.job_duties}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right align-top font-medium">
                    {job.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 데이터 없음 상태 UI는 기존 유지 */}
    </div>
  );
}