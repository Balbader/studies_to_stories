// Character voice mapping for Eleven Labs
// Note: These voice IDs are placeholders and should be updated with actual Eleven Labs voice IDs
// You can find voice IDs in your Eleven Labs dashboard or by using their API

export interface CharacterVoice {
	id: string;
	name: string;
	description: string;
	voiceId: string; // Eleven Labs voice ID
}

export const CHARACTER_VOICES: CharacterVoice[] = [
	{
		id: 'bradford',
		name: 'Bradford',
		description: 'Deep, authoritative, and wise narrator',
		voiceId: 'NNl6r8mD7vthiJatiJt1', // TODO: Get voice ID from Eleven Labs dashboard
	},
	{
		id: 'sabrina',
		name: 'Sabrina',
		description: 'Charming, playful, and curious narrator',
		voiceId: 'oJebhZNaPllxk6W0LSBA', // TODO: Get voice ID from Eleven Labs dashboard
	},
	{
		id: 'jane',
		name: 'Jane',
		description: 'Gentle, compassionate, and wise narrator',
		voiceId: '1tJ6400V2Y3m0xmtFkj6', // TODO: Get voice ID from Eleven Labs dashboard
	},
	{
		id: 'tom',
		name: 'Tom',
		description: 'Gentle, compassionate, and wise narrator',
		voiceId: 'GTtzqc49rk4I6RwPWgd4', // TODO: Get voice ID from Eleven Labs dashboard
	},
	{
		id: 'sam',
		name: 'Sam',
		description: 'Gentle, compassionate, and wise narrator',
		voiceId: 'CrUgYsIsJviHDLBi9vXo', // TODO: Get voice ID from Eleven Labs dashboard
	},
];

// Helper function to get voice by ID
export function getCharacterVoiceById(id: string): CharacterVoice | undefined {
	return CHARACTER_VOICES.find((voice) => voice.id === id);
}

// Helper function to get voice ID for Eleven Labs
export function getVoiceIdForCharacter(characterId: string): string {
	const voice = getCharacterVoiceById(characterId);
	return voice?.voiceId || 'JBFqnCBsd6RMkjVDRZzb'; // Default fallback
}
