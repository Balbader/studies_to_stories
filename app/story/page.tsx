'use client';

import { useState, useCallback } from 'react';
import UploadComponent from '@/components/story/UploadComponent';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ExtractedTextData, CombinedTextData } from '@/lib/text-extractor';

export default function Story() {
	const [files, setFiles] = useState<File[]>([]);
	const [extractedData, setExtractedData] = useState<ExtractedTextData[]>([]);
	const [combinedData, setCombinedData] = useState<CombinedTextData | null>(
		null,
	);
	const [isExtracting, setIsExtracting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [enhancedText, setEnhancedText] = useState<string | null>(null);
	const [isEnhancing, setIsEnhancing] = useState(false);
	const [enhanceError, setEnhanceError] = useState<string | null>(null);

	const handleFileSelect = useCallback((selectedFiles: File[]) => {
		setFiles(selectedFiles);
		setError(null);
		setSuccess(false);
		setExtractedData([]);
		setCombinedData(null);
		setEnhancedText(null);
		setEnhanceError(null);
	}, []);

	const handleExtractText = async () => {
		if (files.length === 0) {
			setError('Please select at least one file to extract text from.');
			return;
		}

		setIsExtracting(true);
		setError(null);
		setSuccess(false);

		try {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});

			const response = await fetch('/api/extract-text', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to extract text');
			}

			const result = await response.json();
			setExtractedData(result.data);
			if (result.combined) {
				setCombinedData(result.combined);
			}
			setSuccess(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to extract text',
			);
		} finally {
			setIsExtracting(false);
		}
	};

	const handleEnhanceLesson = async () => {
		if (!combinedData?.combinedText) {
			setEnhanceError(
				'No combined text available. Please extract text first.',
			);
			return;
		}

		setIsEnhancing(true);
		setEnhanceError(null);
		setEnhancedText(null);

		try {
			const formData = new FormData();
			formData.append('lessonContent', combinedData.combinedText);
			// Optionally add metadata if available
			if (combinedData.totalDocuments) {
				formData.append(
					'lessonTitle',
					`Lesson from ${combinedData.totalDocuments} document${combinedData.totalDocuments !== 1 ? 's' : ''}`,
				);
			}

			const { enhanceLesson } = await import('./action');
			const enhanced = await enhanceLesson(formData);
			setEnhancedText(enhanced);
		} catch (err) {
			setEnhanceError(
				err instanceof Error ? err.message : 'Failed to enhance lesson',
			);
		} finally {
			setIsEnhancing(false);
		}
	};

	return (
		<div className="container mx-auto py-8 px-4 max-w-4xl">
			<h1 className="text-3xl font-bold mb-6">Upload Your Documents</h1>
			<UploadComponent onFileSelect={handleFileSelect} />

			{files.length > 0 && (
				<div className="mt-6 space-y-4">
					<Button
						onClick={handleExtractText}
						disabled={isExtracting}
						className="w-full"
					>
						{isExtracting
							? 'Extracting text...'
							: `Extract Text from ${files.length} File${files.length !== 1 ? 's' : ''}`}
					</Button>

					{error && (
						<Alert variant="destructive">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{success && extractedData.length > 0 && (
						<Alert>
							<AlertTitle>Success!</AlertTitle>
							<AlertDescription>
								Successfully extracted text from{' '}
								{extractedData.length} file
								{extractedData.length !== 1 ? 's' : ''}. The
								extracted data is available in JSON format
								below.
							</AlertDescription>
						</Alert>
					)}

					{extractedData.length > 0 && (
						<div className="space-y-4">
							<h2 className="text-xl font-semibold">
								Extracted Text Data (JSON)
							</h2>
							<div className="space-y-4">
								{extractedData.map((data, index) => (
									<div
										key={index}
										className="border rounded-lg p-4 bg-muted/50"
									>
										<h3 className="font-medium mb-2">
											{data.fileName}
										</h3>
										<div className="text-sm text-muted-foreground mb-2">
											Type: {data.fileType.toUpperCase()}{' '}
											• Extracted:{' '}
											{new Date(
												data.extractedAt,
											).toLocaleString()}
										</div>
										<details className="mt-2">
											<summary className="cursor-pointer text-sm font-medium">
												View Extracted Text
											</summary>
											<pre className="mt-2 p-3 bg-background border rounded text-xs overflow-auto max-h-64">
												{JSON.stringify(data, null, 2)}
											</pre>
										</details>
									</div>
								))}
							</div>
						</div>
					)}

					{combinedData && (
						<div className="space-y-4 mt-6">
							<h2 className="text-xl font-semibold">
								Combined Text (For Lesson Agent)
							</h2>
							<div className="border rounded-lg p-4 bg-muted/50">
								<div className="text-sm text-muted-foreground mb-4">
									Total Documents:{' '}
									{combinedData.totalDocuments} • Total
									Characters:{' '}
									{combinedData.totalCharacters.toLocaleString()}{' '}
									• Combined:{' '}
									{new Date(
										combinedData.combinedAt,
									).toLocaleString()}
								</div>
								<details className="mt-2" open>
									<summary className="cursor-pointer text-sm font-medium mb-2">
										View Combined Text
									</summary>
									<div className="mt-2 p-3 bg-background border rounded text-sm overflow-auto max-h-96 whitespace-pre-wrap">
										{combinedData.combinedText}
									</div>
								</details>
								<details className="mt-4">
									<summary className="cursor-pointer text-sm font-medium">
										View Combined JSON Object
									</summary>
									<pre className="mt-2 p-3 bg-background border rounded text-xs overflow-auto max-h-64">
										{JSON.stringify(combinedData, null, 2)}
									</pre>
								</details>
							</div>

							<div className="mt-4">
								<Button
									onClick={handleEnhanceLesson}
									disabled={isEnhancing}
									className="w-full"
									variant="default"
								>
									{isEnhancing
										? 'Enhancing lesson...'
										: 'Enhance Lesson with AI'}
								</Button>

								{enhanceError && (
									<Alert
										variant="destructive"
										className="mt-4"
									>
										<AlertTitle>
											Enhancement Error
										</AlertTitle>
										<AlertDescription>
											{enhanceError}
										</AlertDescription>
									</Alert>
								)}

								{enhancedText && (
									<div className="mt-6 space-y-4">
										<h2 className="text-xl font-semibold">
											Enhanced Lesson
										</h2>
										<div className="border rounded-lg p-4 bg-muted/50">
											<div className="text-sm text-muted-foreground mb-4">
												Enhanced:{' '}
												{new Date().toLocaleString()}
											</div>
											<div className="mt-2 p-4 bg-background border rounded text-sm overflow-auto max-h-[600px] whitespace-pre-wrap leading-relaxed">
												{enhancedText}
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
