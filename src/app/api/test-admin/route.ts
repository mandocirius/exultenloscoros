// src/app/api/test-admin/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function GET() {
  const envKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const hasKey = !!envKey;
  const keyLength = envKey ? envKey.length : 0;

  try {
    // Intentamos listar una pequeña cantidad de usuarios
    const listUsersResult = await auth.listUsers(5);
    
    return NextResponse.json({
      status: 'success',
      debug: { hasKey, keyLength },
      usersFound: listUsersResult.users.length,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      debug: { 
        hasKey, 
        keyLength,
        node_env: process.env.NODE_ENV,
        firstChars: envKey ? envKey.substring(0, 20) + "..." : "null"
      },
      error: error.message,
    }, { status: 500 });
  }
}
