import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// Initialize Eleven Labs client
const elevenlabs = new ElevenLabsClient({
	apiKey: process.env.ELEVENLABS_API_KEY,
});

// Default voice ID - you can change this to any voice ID from Eleven Labs
const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // Default voice

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text || typeof text !== 'string') {
			return NextResponse.json(
				{ error: 'Text is required and must be a string' },
				{ status: 400 },
			);
		}

		// Generate audio using Eleven Labs
		const audio = await elevenlabs.textToSpeech.convert(DEFAULT_VOICE_ID, {
			text: text,
			modelId: 'eleven_multilingual_v2',
			outputFormat: 'mp3_44100_128',
		});

		// Convert the stream to a buffer
		const chunks: Uint8Array[] = [];
		const reader = audio.getReader();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (value) {
				chunks.push(value);
			}
		}

		// Combine all chunks into a single buffer
		const totalLength = chunks.reduce(
			(acc, chunk) => acc + chunk.length,
			0,
		);
		const audioBuffer = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			audioBuffer.set(chunk, offset);
			offset += chunk.length;
		}

		// Convert to base64 for easy transfer
		const base64Audio = Buffer.from(audioBuffer).toString('base64');
		const dataUrl = `data:audio/mp3;base64,${base64Audio}`;

		return NextResponse.json({
			audioUrl: dataUrl,
			success: true,
		});
	} catch (error) {
		console.error('Error generating audio:', error);
		return NextResponse.json(
			{
				error: 'Failed to generate audio',
				message:
					error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		);
	}
}
