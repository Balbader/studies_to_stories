'use client';

import { useState } from 'react';
import UploadComponent from '@/components/story/UploadComponent';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ExtractedTextData } from '@/lib/text-extractor';

export default function Story() {
	const [files, setFiles] = useState<File[]>([]);
	const [extractedData, setExtractedData] = useState<ExtractedTextData[]>([]);
	const [isExtracting, setIsExtracting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	const handleFileSelect = (selectedFiles: File[]) => {
		setFiles(selectedFiles);
		setError(null);
		setSuccess(false);
		setExtractedData([]);
	};

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
			setSuccess(true);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'Failed to extract text',
			);
		} finally {
			setIsExtracting(false);
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
				</div>
			)}
		</div>
	);
}
