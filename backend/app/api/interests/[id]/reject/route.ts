import { NextRequest, NextResponse } from 'next/server';
import { POST as passHandler } from '../pass/route';

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  return passHandler(req, context);
}
