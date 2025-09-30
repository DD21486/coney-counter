import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const coneyCount = formData.get('coneyCount') as string;
    const date = formData.get('date') as string;
    const isCorrect = formData.get('isCorrect') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Only save if user confirmed the data is correct
    if (isCorrect !== 'true') {
      return NextResponse.json({ message: 'Image not saved - user indicated incorrect data' }, { status: 200 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create training data directory
    const trainingDir = join(process.cwd(), 'training-data', 'receipts');
    await mkdir(trainingDir, { recursive: true });

    // Generate filename with timestamp and metadata
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `receipt-${timestamp}-${coneyCount}coneys-${date || 'nodate'}.jpg`;
    const filepath = join(trainingDir, filename);

    // Save the image
    await writeFile(filepath, buffer);

    // Also save metadata
    const metadata = {
      filename,
      coneyCount: coneyCount ? parseInt(coneyCount) : null,
      date: date || null,
      uploadedAt: new Date().toISOString(),
      originalName: file.name,
      fileSize: file.size,
      fileType: file.type
    };

    const metadataFilename = `receipt-${timestamp}-metadata.json`;
    const metadataPath = join(trainingDir, metadataFilename);
    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));

    console.log('Training image saved:', {
      filename,
      coneyCount,
      date,
      fileSize: file.size
    });

    return NextResponse.json({ 
      message: 'Training image saved successfully',
      filename,
      metadata: metadata
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving training image:', error);
    return NextResponse.json({ error: error.message || 'Failed to save training image' }, { status: 500 });
  }
}
