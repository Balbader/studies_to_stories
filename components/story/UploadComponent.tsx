'use client';

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
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
	onFileSelect?: (file: File) => void;
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
	const [file, setFile] = useState<File | null>(null);
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

	const handleFileSelect = (selectedFile: File) => {
		setError(null);
		const validationError = validateFile(selectedFile);

		if (validationError) {
			setError(validationError);
			setFile(null);
			return;
		}

		setFile(selectedFile);
		onFileSelect?.(selectedFile);
	};

	const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) {
			handleFileSelect(selectedFile);
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

		const droppedFile = e.dataTransfer.files?.[0];
		if (droppedFile) {
			handleFileSelect(droppedFile);
		}
	};

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleRemove = () => {
		setFile(null);
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
					<CardTitle>Upload Document</CardTitle>
					<CardDescription>
						Upload a PDF or Word document (.pdf, .doc, .docx). Max
						size: {maxSizeMB}MB
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{!file ? (
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
											? 'Drop your file here'
											: 'Click to upload or drag and drop'}
									</p>
									<p className="text-xs text-muted-foreground mt-1">
										PDF or Word document (max {maxSizeMB}MB)
									</p>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
								>
									Select File
								</Button>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.doc,.docx"
								onChange={handleFileInputChange}
								className="hidden"
							/>
						</div>
					) : (
						<div className="border rounded-lg p-4 bg-muted/50">
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
											{formatFileSize(file.size)}
										</p>
									</div>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={handleRemove}
								>
									Remove
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
