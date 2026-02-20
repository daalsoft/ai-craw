import { NextResponse } from 'next/server';
// 예시: 이제 타입을 명시적으로 사용할 수 있습니다.
import nodemailer, { Transporter } from 'nodemailer';


export async function POST(req: Request) {
  const { to, subject, text } = await req.json();

  // 1. 전송 객체(Transporter) 설정
  const transporter: Transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });

  try {
    // 2. 메일 옵션 설정 및 전송
    await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,      // 받는 사람
      subject, // 제목
      text,    // 내용
      // html: `<b>${text}</b>`, // HTML 형식으로 보낼 경우
    });

    return NextResponse.json({ message: "메일 발송 성공!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "메일 발송 실패", error }, { status: 500 });
  }
}