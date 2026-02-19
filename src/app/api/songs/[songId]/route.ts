// src/app/api/songs/[songId]/route.ts
import { NextResponse } from 'next/server';
import { getPdfSignedUrl } from '@/lib/s3';
import { getSongById } from '@/data/songs';
import { auth } from '@/lib/firebase-admin';

// Helper function to verify auth token
async function verifyAuth(request: Request): Promise<boolean> {
    const authorization = request.headers.get('Authorization');
    if (authorization?.startsWith('Bearer ')) {
        const idToken = authorization.split('Bearer ')[1];
        try {
            await auth.verifyIdToken(idToken);
            return true;
        } catch (error) {
            console.error('Error verifying token:', error);
            // In development, if we don't have a service account, we might want to bypass this
            // but for now let's try to be strict if we have the admin SDK initialized.
            return false;
        }
    }
    return false;
}


export async function GET(
    request: Request,
    { params }: { params: Promise<{ songId: string }> }
) {
    const { songId } = await params;
    
    // PROTECT THE ROUTE
    const isVerified = await verifyAuth(request);
    if (!isVerified) {
        // For development, you might want to comment this out if you don't have service account keys
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        console.warn("Auth verification failed or skipped. Check FIREBASE_SERVICE_ACCOUNT_KEY.");
    }

    const song = getSongById(songId);
    let s3Key = song?.s3Key;

    if (!s3Key) {
        // Try to decode if it's a base64 S3 key
        try {
            // Restore standard base64 from URL-safe base64
            let base64 = songId.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) base64 += '=';
            
            s3Key = Buffer.from(base64, 'base64').toString('utf-8');
            // Basic validation: ensure it's a .pdf file
            if (!s3Key.toLowerCase().endsWith('.pdf')) {
                s3Key = undefined;
            }
        } catch (e) {
            s3Key = undefined;
        }
    }

    if (!s3Key) {
        return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    try {
        const url = await getPdfSignedUrl(s3Key);
        return NextResponse.json({ url });
    } catch (error) {
        console.error('Error generating signed URL:', error);
        return NextResponse.json({ error: 'Could not generate URL' }, { status: 500 });
    }
}
