import { NextRequest, NextResponse } from 'next/server';
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { getVoiceIdForCharacter } from '@/lib/character-voices';

// Increase timeout for long audio generation
export const maxDuration = 300; // 5 minutes

// Default voice ID - you can change this to any voice ID from Eleven Labs
const DEFAULT_VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb'; // Default voice

// Maximum text length (Eleven Labs has limits, and very long text can timeout)
const MAX_TEXT_LENGTH = 5000; // characters

export async function POST(request: NextRequest) {
	try {
		// Check API key
		const apiKey = process.env.ELEVENLABS_API_KEY;
		if (!apiKey) {
			console.error('ELEVENLABS_API_KEY is not set');
			return NextResponse.json(
				{ error: 'Eleven Labs API key is not configured' },
				{ status: 500 },
			);
		}

		// Initialize Eleven Labs client
		const elevenlabs = new ElevenLabsClient({
			apiKey: apiKey,
		});

		const { text, characterVoice } = await request.json();

		if (!text || typeof text !== 'string') {
			return NextResponse.json(
				{ error: 'Text is required and must be a string' },
				{ status: 400 },
			);
		}

		// Truncate text if too long to avoid timeouts
		const textToConvert =
			text.length > MAX_TEXT_LENGTH
				? text.substring(0, MAX_TEXT_LENGTH) + '...'
				: text;

		console.log(
			`Generating audio for text length: ${textToConvert.length} characters`,
		);

		// Get voice ID for character voice
		const voiceId = characterVoice
			? getVoiceIdForCharacter(characterVoice)
			: DEFAULT_VOICE_ID;

		console.log(
			`Using voice ID: ${voiceId} for character: ${characterVoice || 'default'}`,
		);

		// Generate audio using Eleven Labs
		console.log('Calling Eleven Labs API...');
		const audio = await elevenlabs.textToSpeech.convert(voiceId, {
			text: textToConvert,
			modelId: 'eleven_multilingual_v2',
			outputFormat: 'mp3_44100_128',
		});
		console.log('Received audio stream from Eleven Labs');

		// Convert the stream to a buffer
		console.log('Reading audio stream...');
		const chunks: Uint8Array[] = [];
		const reader = audio.getReader();

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (value) {
					chunks.push(value);
				}
			}
			console.log(
				`Read ${chunks.length} chunks, total size: ${chunks.reduce((acc, chunk) => acc + chunk.length, 0)} bytes`,
			);
		} catch (streamError) {
			console.error('Error reading audio stream:', streamError);
			throw new Error(
				`Failed to read audio stream: ${streamError instanceof Error ? streamError.message : 'Unknown error'}`,
			);
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

		// Provide more specific error messages
		let errorMessage = 'Failed to generate audio';
		if (error instanceof Error) {
			errorMessage = error.message;
			// Check for specific error types
			if (
				error.message.includes('401') ||
				error.message.includes('Unauthorized')
			) {
				errorMessage = 'Invalid Eleven Labs API key';
			} else if (
				error.message.includes('429') ||
				error.message.includes('rate limit')
			) {
				errorMessage =
					'Eleven Labs API rate limit exceeded. Please try again later.';
			} else if (
				error.message.includes('timeout') ||
				error.message.includes('fetch failed')
			) {
				errorMessage =
					'Audio generation timed out. The text might be too long.';
			}
		}

		return NextResponse.json(
			{
				error: 'Failed to generate audio',
				message: errorMessage,
				details: error instanceof Error ? error.stack : String(error),
			},
			{ status: 500 },
		);
	}
}
