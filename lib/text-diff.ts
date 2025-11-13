/**
 * Text diff utility for comparing original and enhanced text
 * Adapted for text content (not code)
 */

export interface DiffLine {
	type: 'removed' | 'added' | 'unchanged';
	content: string;
	lineNumber?: number;
}

export interface DiffResult {
	lines: DiffLine[];
	addedCount: number;
	removedCount: number;
	unchangedCount: number;
}

/**
 * Line-based diff algorithm for text comparison
 * Uses a simple matching strategy to identify unchanged, added, and removed lines
 */
export function computeTextDiff(
	original: string,
	enhanced: string,
): DiffResult {
	const originalLines = original.split('\n');
	const enhancedLines = enhanced.split('\n');

	const diff: DiffLine[] = [];
	let addedCount = 0;
	let removedCount = 0;
	let unchangedCount = 0;

	// Create a map of original lines to their indices for faster lookup
	const originalLineMap = new Map<string, number[]>();
	originalLines.forEach((line, idx) => {
		const trimmed = line.trim();
		if (trimmed) {
			if (!originalLineMap.has(trimmed)) {
				originalLineMap.set(trimmed, []);
			}
			originalLineMap.get(trimmed)!.push(idx);
		}
	});

	// Track which lines have been matched
	const originalMatched = new Set<number>();
	const enhancedMatched = new Set<number>();

	// First pass: find exact matches
	for (let enhIdx = 0; enhIdx < enhancedLines.length; enhIdx++) {
		const enhLine = enhancedLines[enhIdx].trim();
		if (!enhLine) continue;

		const matchingIndices = originalLineMap.get(enhLine);
		if (matchingIndices && matchingIndices.length > 0) {
			// Find the closest unmatched original line
			let bestMatch = -1;
			let minDistance = Infinity;

			for (const origIdx of matchingIndices) {
				if (!originalMatched.has(origIdx)) {
					const distance = Math.abs(origIdx - enhIdx);
					if (distance < minDistance) {
						minDistance = distance;
						bestMatch = origIdx;
					}
				}
			}

			if (bestMatch !== -1) {
				originalMatched.add(bestMatch);
				enhancedMatched.add(enhIdx);
			}
		}
	}

	// Second pass: build the diff output
	let origIdx = 0;
	let enhIdx = 0;

	while (origIdx < originalLines.length || enhIdx < enhancedLines.length) {
		const origMatched =
			origIdx < originalLines.length && originalMatched.has(origIdx);
		const enhMatched =
			enhIdx < enhancedLines.length && enhancedMatched.has(enhIdx);

		if (origMatched && enhMatched) {
			// Both lines are matched - they're unchanged
			diff.push({
				type: 'unchanged',
				content: originalLines[origIdx],
				lineNumber: origIdx + 1,
			});
			unchangedCount++;
			origIdx++;
			enhIdx++;
		} else if (origIdx >= originalLines.length) {
			// Only enhanced lines remain
			diff.push({
				type: 'added',
				content: enhancedLines[enhIdx],
				lineNumber: enhIdx + 1,
			});
			addedCount++;
			enhIdx++;
		} else if (enhIdx >= enhancedLines.length) {
			// Only original lines remain
			diff.push({
				type: 'removed',
				content: originalLines[origIdx],
				lineNumber: origIdx + 1,
			});
			removedCount++;
			origIdx++;
		} else if (!origMatched && !enhMatched) {
			// Both lines are unmatched - show as removed then added
			diff.push({
				type: 'removed',
				content: originalLines[origIdx],
				lineNumber: origIdx + 1,
			});
			removedCount++;
			origIdx++;

			diff.push({
				type: 'added',
				content: enhancedLines[enhIdx],
				lineNumber: enhIdx + 1,
			});
			addedCount++;
			enhIdx++;
		} else if (!origMatched) {
			// Original line is unmatched - removed
			diff.push({
				type: 'removed',
				content: originalLines[origIdx],
				lineNumber: origIdx + 1,
			});
			removedCount++;
			origIdx++;
		} else {
			// Enhanced line is unmatched - added
			diff.push({
				type: 'added',
				content: enhancedLines[enhIdx],
				lineNumber: enhIdx + 1,
			});
			addedCount++;
			enhIdx++;
		}
	}

	return {
		lines: diff,
		addedCount,
		removedCount,
		unchangedCount,
	};
}

/**
 * Word-level diff for more granular comparison
 * Useful for showing changes within lines
 */
export interface WordDiff {
	type: 'removed' | 'added' | 'unchanged';
	content: string;
}

export function computeWordDiff(
	original: string,
	enhanced: string,
): WordDiff[] {
	const originalWords = original.split(/(\s+)/);
	const enhancedWords = enhanced.split(/(\s+)/);
	const diff: WordDiff[] = [];

	// Simple word-by-word comparison
	const maxLen = Math.max(originalWords.length, enhancedWords.length);
	let origIdx = 0;
	let enhIdx = 0;

	while (origIdx < originalWords.length || enhIdx < enhancedWords.length) {
		const origWord = originalWords[origIdx] || '';
		const enhWord = enhancedWords[enhIdx] || '';

		if (origIdx >= originalWords.length) {
			diff.push({ type: 'added', content: enhWord });
			enhIdx++;
		} else if (enhIdx >= enhancedWords.length) {
			diff.push({ type: 'removed', content: origWord });
			origIdx++;
		} else if (origWord === enhWord) {
			diff.push({ type: 'unchanged', content: origWord });
			origIdx++;
			enhIdx++;
		} else {
			// Words differ
			diff.push({ type: 'removed', content: origWord });
			diff.push({ type: 'added', content: enhWord });
			origIdx++;
			enhIdx++;
		}
	}

	return diff;
}
