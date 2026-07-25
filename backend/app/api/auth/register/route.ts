import { NextRequest } from 'next/server';
import { POST as signupPOST } from '../signup/route';

export async function POST(req: NextRequest) {
  return signupPOST(req);
}
