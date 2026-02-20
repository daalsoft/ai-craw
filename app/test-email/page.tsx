'use client';

import { useState } from 'react';

export default function TestEmailPage() {
  const [status, setStatus] = useState('');
  const [prompt, setPrompt] = useState(''); // AI에게 시킬 내용

  const sendAiEmail = async () => {
    if (!prompt) return alert('AI에게 시킬 내용을 입력하세요!');
    
    setStatus('AI가 메일 작성 및 전송 중...');
    
    try {
      const response = await fetch('/api/ai-mail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'daalsoft@gmail.com', // 받는 사람
          prompt: prompt,            // 예: "사과하는 내용", "회의 요청"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`✅ 발송 성공! AI가 쓴 내용: ${data.content.substring(0, 30)}...`);
      } else {
        setStatus('❌ 실패: ' + data.message);
      }
    } catch (error) {
      setStatus('⚠️ 에러: ' + error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      <h1>AI 메일 전송 테스트</h1>
      
      <div style={{ marginBottom: '10px' }}>
        <label>AI에게 시킬 메일 주제:</label>
        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 프로젝트 마감 연장 부탁"
          style={{ width: '100%', padding: '10px', marginTop: '5px', color: 'black' }}
        />
      </div>

      <button 
        onClick={sendAiEmail} 
        style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        AI 메일 생성 및 보내기
      </button>

      <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '10px' }}>
        <strong>상태:</strong> {status}
      </div>
    </div>
  );
}