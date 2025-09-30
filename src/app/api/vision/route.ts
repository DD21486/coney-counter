import { NextRequest, NextResponse } from 'next/server';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Initialize Google Vision client with credentials from environment
let client: ImageAnnotatorClient;

try {
  // Parse the JSON credentials from environment variable
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credentialsJson) {
    const credentials = JSON.parse(credentialsJson);
    client = new ImageAnnotatorClient({
      credentials: credentials
    });
  } else {
    // Fallback to default credentials
    client = new ImageAnnotatorClient();
  }
} catch (error) {
  console.error('Failed to initialize Google Vision client:', error);
  // Fallback to default credentials
  client = new ImageAnnotatorClient();
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Call Google Vision API
    const [result] = await client.textDetection({
      image: { content: imageBuffer }
    });

    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) {
      return NextResponse.json({ error: 'No text detected in image' }, { status: 400 });
    }

    // Get the full text (first detection contains all text)
    const fullText = detections[0].description || '';
    
    // Calculate average confidence from all text detections
    const confidenceScores = detections.slice(1).map(detection => 
      detection.score || 0
    );
    const averageConfidence = confidenceScores.length > 0 
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length
      : 0.9; // Default high confidence if no individual scores

    return NextResponse.json({
      text: fullText,
      confidence: averageConfidence,
      processingTime: Date.now()
    });

  } catch (error: any) {
    console.error('Google Vision API error:', error);
    
    // Check for specific Google Cloud errors
    if (error.message.includes('quota') || error.message.includes('limit')) {
      return NextResponse.json({ error: 'API quota exceeded. Please try again later.' }, { status: 429 });
    } else if (error.message.includes('authentication') || error.message.includes('credentials')) {
      return NextResponse.json({ error: 'Authentication failed. Please check your Google Cloud credentials.' }, { status: 401 });
    } else if (error.message.includes('billing')) {
      return NextResponse.json({ error: 'Billing account required. Please set up billing for Google Cloud Vision API.' }, { status: 402 });
    } else {
      return NextResponse.json({ error: `Failed to process image: ${error.message}` }, { status: 500 });
    }
  }
}
