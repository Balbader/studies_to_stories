'use client';

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface UploadComponentProps {
	onFileSelect?: (files: File[]) => void;
	maxSizeMB?: number;
	className?: string;
}

const ACCEPTED_FILE_TYPES = {
	'application/pdf': ['.pdf'],
	'application/msword': ['.doc'],
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
		'.docx',
	],
};

const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const DEFAULT_MAX_SIZE_MB = 10;

export default function UploadComponent({
	onFileSelect,
	maxSizeMB = DEFAULT_MAX_SIZE_MB,
	className,
}: UploadComponentProps) {
	const [files, setFiles] = useState<File[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const validateFile = (selectedFile: File): string | null => {
		// Check file type
		const fileExtension = selectedFile.name
			.substring(selectedFile.name.lastIndexOf('.'))
			.toLowerCase();

		if (!ACCEPTED_EXTENSIONS.includes(fileExtension)) {
			return `Invalid file type. Please upload a PDF or Word document (.pdf, .doc, .docx)`;
		}

		// Check file size
		const fileSizeMB = selectedFile.size / (1024 * 1024);
		if (fileSizeMB > maxSizeMB) {
			return `File size exceeds ${maxSizeMB}MB. Please choose a smaller file.`;
		}

		return null;
	};

	const handleFilesSelect = (selectedFiles: File[]) => {
		setError(null);
		const validFiles: File[] = [];
		const errors: string[] = [];

		selectedFiles.forEach((file) => {
			const validationError = validateFile(file);
			if (validationError) {
				errors.push(`${file.name}: ${validationError}`);
			} else {
				validFiles.push(file);
			}
		});

		if (errors.length > 0) {
			setError(errors.join('\n'));
		}

		if (validFiles.length > 0) {
			setFiles((prev) => {
				return [...prev, ...validFiles];
			});
		}
	};

	// Call onFileSelect after files state has been updated
	// Use a ref to track if this is the initial mount
	const isInitialMount = useRef(true);

	useEffect(() => {
		// Skip on initial mount
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		// Only call onFileSelect when files change (not on initial mount)
		onFileSelect?.(files);
	}, [files, onFileSelect]);

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = Array.from(e.target.files || []);
		if (selectedFiles.length > 0) {
			handleFilesSelect(selectedFiles);
		}
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const droppedFiles = Array.from(e.dataTransfer.files || []);
		if (droppedFiles.length > 0) {
			handleFilesSelect(droppedFiles);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemove = (indexToRemove: number) => {
		setFiles((prev) => {
			return prev.filter((_, index) => index !== indexToRemove);
		});
		setError(null);
	};

	const handleRemoveAll = () => {
		setFiles([]);
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	const formatFileSize = (bytes: number): string => {
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
	};

	const getFileIcon = (fileName: string): string => {
		const extension = fileName
			.substring(fileName.lastIndexOf('.'))
			.toLowerCase();
		if (extension === '.pdf') return '📄';
		if (extension === '.doc' || extension === '.docx') return '📝';
		return '📎';
	};

	return (
		<div className={cn('w-full', className)}>
			<Card>
				<CardHeader>
					<CardTitle>Upload Documents</CardTitle>
					<CardDescription>
						Upload one or more PDF or Word documents (.pdf, .doc,
						.docx). Max size per file: {maxSizeMB}MB
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					<div
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onClick={handleClick}
						className={cn(
							'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
							isDragging
								? 'border-primary bg-primary/5'
								: 'border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/50',
						)}
					>
						<div className="flex flex-col items-center gap-4">
							<div className="text-4xl">📤</div>
							<div>
								<p className="text-sm font-medium">
									{isDragging
										? 'Drop your files here'
										: 'Click to upload or drag and drop'}
								</p>
								<p className="text-xs text-muted-foreground mt-1">
									PDF or Word documents (max {maxSizeMB}MB per
									file)
								</p>
							</div>
							<Button type="button" variant="outline" size="sm">
								Select Files
							</Button>
						</div>
						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf,.doc,.docx"
							multiple
							onChange={handleFileInputChange}
							className="hidden"
						/>
					</div>

					{files.length > 0 && (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<p className="text-sm font-medium">
									{files.length} file
									{files.length !== 1 ? 's' : ''} selected
								</p>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={handleRemoveAll}
								>
									Remove All
								</Button>
							</div>
							<div className="space-y-2 max-h-64 overflow-y-auto">
								{files.map((file, index) => (
									<div
										key={`${file.name}-${index}`}
										className="border rounded-lg p-4 bg-muted/50"
									>
										<div className="flex items-center justify-between gap-4">
											<div className="flex items-center gap-3 flex-1 min-w-0">
												<span className="text-2xl">
													{getFileIcon(file.name)}
												</span>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{file.name}
													</p>
													<p className="text-xs text-muted-foreground">
														{formatFileSize(
															file.size,
														)}
													</p>
												</div>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={() =>
													handleRemove(index)
												}
											>
												Remove
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
