import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { prompt, to } = await req.json();

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ message: "API 키가 설정되지 않았습니다." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `${prompt}에 대한 정중한 이메일 내용을 작성해줘.`
    });

    const mailContent = response.text;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.GOOGLE_EMAIL,
      to,
      subject: `[AI 생성 메일] ${prompt} 관련 건`,
      text: mailContent,
    });

    return NextResponse.json({ message: "AI 메일 발송 완료!", content: mailContent });

  } catch (error: any) {
    console.error("에러 상세 정보:", error);
    return NextResponse.json({ message: "실패", error: error.message }, { status: 500 });
  }
}