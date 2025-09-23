// later we will use fastAPI

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();

  const responseMessage = `Echo: ${message}`;

  return NextResponse.json({ reply: responseMessage });
}
