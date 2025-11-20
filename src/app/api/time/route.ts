import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Defaults to auto, but we want to ensure it's not cached

export async function GET() {
  return NextResponse.json({
    time: new Date().toISOString(),
    timestamp: Date.now(),
  });
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
  });
}

