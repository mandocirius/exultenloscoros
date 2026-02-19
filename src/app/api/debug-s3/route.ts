// src/app/api/debug-s3/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET() {
  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      MaxKeys: 20 // Veamos los primeros 20
    });

    const data = await s3Client.send(command);
    
    return NextResponse.json({
      status: 'success',
      bucket: process.env.AWS_S3_BUCKET_NAME,
      files: data.Contents?.map(c => c.Key) || []
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
    }, { status: 500 });
  }
}
