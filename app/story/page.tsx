'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import UploadComponent from '@/components/story/UploadComponent';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/home/Navbar';
import {
	Upload,
	FileText,
	Sparkles,
	CheckCircle2,
	Loader2,
	GitCompare,
	Eye,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ExtractedTextData, CombinedTextData } from '@/lib/text-extractor';
import TextDiffView from '@/components/story/TextDiffView';

gsap.registerPlugin(ScrollTrigger);

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
	const [showDiff, setShowDiff] = useState(false);
	const [progress, setProgress] = useState(0);
	const [elapsedTime, setElapsedTime] = useState(0);
	const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number | null>(null);

	// Refs for animations and scrolling
	const heroRef = useRef<HTMLDivElement>(null);
	const uploadRef = useRef<HTMLDivElement>(null);
	const enhancedRef = useRef<HTMLDivElement>(null);
	const viewDiffButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Hero section animation
			if (heroRef.current) {
				gsap.from(heroRef.current.children, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.15,
					ease: 'power3.out',
					delay: 0.3,
				});
			}

			// Upload section animation
			if (uploadRef.current) {
				gsap.from(uploadRef.current, {
					opacity: 0,
					y: 50,
					scale: 0.95,
					duration: 0.7,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: uploadRef.current,
						start: 'top 85%',
					},
				});
			}

			// Enhanced text animation
			if (enhancedRef.current) {
				gsap.from(enhancedRef.current, {
					opacity: 0,
					y: 50,
					scale: 0.95,
					duration: 0.8,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: enhancedRef.current,
						start: 'top 85%',
					},
				});
			}
		});

		return () => ctx.revert();
	}, [enhancedText]);

	// Auto-scroll to enhanced text when it's ready
	useEffect(() => {
		if (enhancedText && enhancedRef.current) {
			setTimeout(() => {
				enhancedRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}, 100);
		}
	}, [enhancedText]);

	// Timer and progress tracking
	useEffect(() => {
		if (isExtracting || isEnhancing) {
			// Start timer
			if (!startTimeRef.current) {
				startTimeRef.current = Date.now();
			}

			timerIntervalRef.current = setInterval(() => {
				if (startTimeRef.current) {
					const elapsed = Math.floor(
						(Date.now() - startTimeRef.current) / 1000,
					);
					setElapsedTime(elapsed);
				}
			}, 1000);

			// Update progress based on state
			// Progress will be updated more granularly in the extraction/enhancement handlers
		} else {
			// Reset when done
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
				timerIntervalRef.current = null;
			}
			if (!isExtracting && !isEnhancing) {
				setElapsedTime(0);
				setProgress(0);
				startTimeRef.current = null;
			}
		}

		return () => {
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
			}
		};
	}, [isExtracting, isEnhancing]);

	// Continuous animation for View Diff button
	useEffect(() => {
		if (!viewDiffButtonRef.current || !enhancedText) return;

		const button = viewDiffButtonRef.current;

		// Only animate when showDiff is false (showing "View Diff")
		if (!showDiff) {
			// Create a continuous pulse animation
			const pulseAnimation = gsap.to(button, {
				scale: 1.05,
				duration: 1.2,
				ease: 'power2.inOut',
				repeat: -1,
				yoyo: true,
			});

			// Add a subtle glow effect
			const glowAnimation = gsap.to(button, {
				boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)',
				duration: 1.5,
				ease: 'power2.inOut',
				repeat: -1,
				yoyo: true,
			});

			// Animate the icon with a subtle pulse
			const icon = button.querySelector('svg');
			let iconAnimation: gsap.core.Tween | null = null;
			if (icon) {
				iconAnimation = gsap.to(icon, {
					scale: 1.15,
					duration: 1,
					ease: 'power2.inOut',
					repeat: -1,
					yoyo: true,
				});
			}

			return () => {
				pulseAnimation.kill();
				glowAnimation.kill();
				if (iconAnimation) {
					iconAnimation.kill();
				}
				gsap.set(button, { scale: 1, boxShadow: 'none' });
				if (icon) {
					gsap.set(icon, { rotation: 0 });
				}
			};
		} else {
			// Reset animations when showDiff is true
			gsap.set(button, { scale: 1, boxShadow: 'none' });
			const icon = button.querySelector('svg');
			if (icon) {
				gsap.set(icon, { rotation: 0 });
			}
		}
	}, [enhancedText, showDiff]);

	const handleFileSelect = useCallback((selectedFiles: File[]) => {
		// Update files state
		setFiles(selectedFiles);
		setError(null);

		// Only reset success and extracted data if we're clearing files
		if (selectedFiles.length === 0) {
			setSuccess(false);
			setExtractedData([]);
			setCombinedData(null);
			setEnhancedText(null);
			setEnhanceError(null);
			setShowDiff(false);
		}
	}, []);

	const handleExtractText = async () => {
		if (files.length === 0) {
			setError('Please select at least one file to extract text from.');
			return;
		}

		// Check total file size (serverless functions typically have a 4.5MB limit, but we allow up to 5MB with a buffer)
		const MAX_TOTAL_SIZE_MB = 5;
		const totalSizeMB =
			files.reduce((sum, file) => sum + file.size, 0) / (1024 * 1024);

		if (totalSizeMB > MAX_TOTAL_SIZE_MB) {
			setError(
				`Total file size (${totalSizeMB.toFixed(2)}MB) exceeds the maximum allowed size of ${MAX_TOTAL_SIZE_MB}MB. Please select smaller files or process them one at a time.`,
			);
			return;
		}

		setIsExtracting(true);
		setError(null);
		setSuccess(false);
		setEnhanceError(null);
		setProgress(5); // Start with small progress
		setElapsedTime(0);
		startTimeRef.current = Date.now();

		try {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});

			// Simulate progress during extraction
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev < 45) {
						return Math.min(prev + 2, 45);
					}
					return prev;
				});
			}, 500);

			const response = await fetch('/api/extract-text', {
				method: 'POST',
				body: formData,
			});

			clearInterval(progressInterval);

			// Get content type once before reading body
			const contentType = response.headers.get('content-type') || '';

			if (!response.ok) {
				let errorMessage = 'Failed to extract text';

				// Handle specific status codes
				if (response.status === 413 || response.status === 429) {
					errorMessage =
						'File size too large. The total size of your files exceeds the server limit. Please try uploading smaller files or process them one at a time.';
				} else {
					try {
						if (contentType.includes('application/json')) {
							const errorData = await response.json();
							errorMessage =
								errorData.message ||
								errorData.error ||
								errorMessage;
						} else {
							const text = await response.text();
							// Check for common payload too large errors
							if (
								text.includes('Request Entity Too Large') ||
								text.includes('FUNCTION_PAYLOAD_TOO_LARGE') ||
								text.includes('Payload Too Large')
							) {
								errorMessage =
									'File size too large. The total size of your files exceeds the server limit. Please try uploading smaller files or process them one at a time.';
							} else {
								errorMessage = text || errorMessage;
							}
						}
					} catch (parseError) {
						// If we can't parse the error, use the status text
						errorMessage = response.statusText || errorMessage;
					}
				}
				throw new Error(errorMessage);
			}

			// Ensure response is JSON before parsing
			if (!contentType.includes('application/json')) {
				const text = await response.text();
				throw new Error(
					`Unexpected response format: ${text.substring(0, 100)}`,
				);
			}

			let result;
			try {
				result = await response.json();
			} catch (jsonError) {
				// Response body already consumed, can't read again
				throw new Error(
					`Failed to parse JSON response. The server may have returned invalid JSON.`,
				);
			}

			if (!result || !result.data) {
				throw new Error('Invalid response format from server');
			}

			setExtractedData(result.data);
			setProgress(50); // Extraction complete

			if (result.combined) {
				setCombinedData(result.combined);

				// Automatically enhance the text after extraction
				setIsEnhancing(true);
				setEnhancedText(null);

				// Simulate progress during enhancement
				const enhanceProgressInterval = setInterval(() => {
					setProgress((prev) => {
						if (prev < 95) {
							return Math.min(prev + 1.5, 95);
						}
						return prev;
					});
				}, 500);

				try {
					const enhanceFormData = new FormData();
					enhanceFormData.append(
						'lessonContent',
						result.combined.combinedText,
					);
					if (result.combined.totalDocuments) {
						enhanceFormData.append(
							'lessonTitle',
							`Lesson from ${result.combined.totalDocuments} document${result.combined.totalDocuments !== 1 ? 's' : ''}`,
						);
					}

					const { enhanceLesson } = await import('./action');
					const enhanced = await enhanceLesson(enhanceFormData);
					clearInterval(enhanceProgressInterval);
					setProgress(100); // Complete
					setEnhancedText(enhanced);
					setSuccess(true);
				} catch (enhanceErr) {
					clearInterval(enhanceProgressInterval);
					setEnhanceError(
						enhanceErr instanceof Error
							? enhanceErr.message
							: 'Failed to enhance lesson',
					);
					// Still show success for extraction even if enhancement fails
					setSuccess(true);
				} finally {
					setIsEnhancing(false);
				}
			} else {
				setSuccess(true);
			}
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
		<div className="min-h-screen w-full book-page">
			<Navbar />
			{/* Hero Section */}
			<section
				ref={heroRef}
				className="relative overflow-hidden border-b border-stone-200/40 pt-16 md:pt-20"
			>
				{/* Book binding decoration */}
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />
				<div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />

				{/* Page number */}
				<div className="absolute top-8 right-8 text-stone-400/50 font-serif text-xs tracking-wider">
					1
				</div>

				<div className="container mx-auto px-4 py-4 md:py-6">
					<div className="mx-auto max-w-6xl text-center">
						<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-stone-50/80 backdrop-blur-sm px-5 py-2 text-sm">
							<Sparkles className="size-4 text-stone-600" />
							<span className="text-stone-700 font-medium">
								Transform Your Documents
							</span>
						</div>
						<h1
							className="mb-4 font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl"
							style={{ fontFamily: 'var(--font-playfair)' }}
						>
							Create Your Story
						</h1>
						<p
							className="mx-auto mb-6 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-crimson)' }}
						>
							Upload your documents, extract the content, and let
							our AI transform your studies into engaging,
							enhanced lessons.
						</p>
					</div>
				</div>
			</section>

			{/* Upload Section */}
			<section className="py-4 md:py-6">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<div ref={uploadRef}>
							<Card className="book-shadow border-stone-200/50 bg-white/95">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<Upload className="size-6 text-stone-700" />
									</div>
									<CardTitle
										className="font-serif text-stone-900"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										Upload Your Documents
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Select PDF or Word documents to begin
										your transformation journey
									</CardDescription>
								</CardHeader>
								<CardContent>
									<UploadComponent
										onFileSelect={handleFileSelect}
										files={files}
									/>

									{files.length > 0 && (
										<div className="mt-6 space-y-4">
											{isExtracting || isEnhancing ? (
												<div className="space-y-3">
													<div className="space-y-2">
														<div className="flex items-center justify-between text-sm">
															<span className="font-medium text-stone-700">
																{isExtracting
																	? 'Extracting text...'
																	: 'Enhancing lesson...'}
															</span>
															<span className="text-stone-500">
																{progress}%
															</span>
														</div>
														<Progress
															value={progress}
															className="h-3 bg-stone-200"
														/>
													</div>
													<div className="flex items-center justify-center gap-2 text-sm text-stone-500">
														<Loader2 className="size-4 animate-spin" />
														<span>
															{Math.floor(
																elapsedTime /
																	60,
															)}
															:
															{String(
																elapsedTime %
																	60,
															).padStart(2, '0')}
														</span>
													</div>
												</div>
											) : (
												<Button
													onClick={handleExtractText}
													disabled={false}
													className="w-full bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
													size="lg"
												>
													<Sparkles className="mr-2 size-4" />
													Extract & Enhance from{' '}
													{files.length} File
													{files.length !== 1
														? 's'
														: ''}
												</Button>
											)}

											{error && (
												<Alert variant="destructive">
													<AlertTitle>
														Error
													</AlertTitle>
													<AlertDescription>
														{error}
													</AlertDescription>
												</Alert>
											)}

											{success &&
												extractedData.length > 0 && (
													<Alert className="border-green-200 bg-green-50/50">
														<CheckCircle2 className="size-4 text-green-600" />
														<AlertTitle className="text-green-900">
															Success!
														</AlertTitle>
														<AlertDescription className="text-green-800">
															{enhancedText
																? `Successfully extracted and enhanced text from ${extractedData.length} file${extractedData.length !== 1 ? 's' : ''}. The enhanced lesson is available below.`
																: `Successfully extracted text from ${extractedData.length} file${extractedData.length !== 1 ? 's' : ''}. ${enhanceError ? 'Enhancement failed, but you can try manually below.' : 'The extracted data is available below.'}`}
														</AlertDescription>
													</Alert>
												)}
										</div>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Enhanced Text Section */}
			{enhancedText && (
				<section className="border-t border-stone-200/40 py-4 md:py-6">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-6xl">
							<div className="mb-4 text-center">
								<div className="mb-2 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-stone-50/80 backdrop-blur-sm px-5 py-2 text-sm">
									<Sparkles className="size-4 text-stone-600" />
									<span className="text-stone-700 font-medium">
										Enhanced Lesson
									</span>
								</div>
								<div className="mb-2 flex items-center justify-center gap-4">
									<Button
										ref={viewDiffButtonRef}
										onClick={() => setShowDiff(!showDiff)}
										variant={
											showDiff ? 'default' : 'outline'
										}
										className="gap-2 relative overflow-visible"
										size="sm"
									>
										{showDiff ? (
											<>
												<Eye className="size-4" />
												View Enhanced
											</>
										) : (
											<>
												<GitCompare className="size-4" />
												View Diff
											</>
										)}
									</Button>
								</div>
								<p
									className="text-sm text-stone-500"
									style={{
										fontFamily: 'var(--font-crimson)',
									}}
								>
									Enhanced: {new Date().toLocaleString()}
								</p>
							</div>
							<div ref={enhancedRef}>
								{showDiff && combinedData ? (
									<TextDiffView
										original={combinedData.combinedText}
										enhanced={enhancedText}
										title="Before / After Enhancement"
									/>
								) : (
									/* Book Page Container */
									<div className="book-shadow relative bg-white/95 border border-stone-200/50 rounded-lg overflow-hidden">
										{/* Book binding decoration */}
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />
										<div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />

										{/* Page number */}
										<div className="absolute top-4 right-6 text-stone-400/50 font-serif text-xs tracking-wider">
											1
										</div>

										{/* Book page content */}
										<div className="px-8 md:px-12 py-10 md:py-16">
											{/* Left margin line (like a notebook) */}
											<div className="absolute left-16 top-0 bottom-0 w-0.5 bg-stone-200/40" />

											{/* Main content area with book-like typography */}
											<div
												className="prose prose-stone max-w-none book-content"
												style={{
													fontFamily:
														'var(--font-crimson)',
												}}
											>
												<div
													className="text-stone-800 leading-relaxed text-base md:text-lg"
													style={{
														fontFamily:
															'var(--font-crimson)',
													}}
												>
													{enhancedText
														.split('\n')
														.map((line, index) => {
															// Remove all markdown characters
															let cleanLine = line
																// Remove heading markers
																.replace(
																	/^#+\s*/g,
																	'',
																)
																// Remove bold markers
																.replace(
																	/\*\*/g,
																	'',
																)
																// Remove italic markers (but be careful not to remove asterisks in content)
																.replace(
																	/\*([^*]+)\*/g,
																	'$1',
																)
																// Remove list markers
																.replace(
																	/^[-*]\s+/g,
																	'',
																)
																.replace(
																	/^\d+\.\s+/g,
																	'',
																)
																// Remove code blocks
																.replace(
																	/```[\s\S]*?```/g,
																	'',
																)
																.replace(
																	/`([^`]+)`/g,
																	'$1',
																)
																// Remove links [text](url)
																.replace(
																	/\[([^\]]+)\]\([^\)]+\)/g,
																	'$1',
																)
																// Remove images ![alt](url)
																.replace(
																	/!\[([^\]]*)\]\([^\)]+\)/g,
																	'',
																)
																// Remove horizontal rules
																.replace(
																	/^[-*_]{3,}$/g,
																	'',
																)
																// Remove blockquotes
																.replace(
																	/^>\s*/g,
																	'',
																)
																.trim();

															// Skip empty lines
															if (!cleanLine) {
																return (
																	<br
																		key={
																			index
																		}
																	/>
																);
															}

															// Display as paragraph
															return (
																<p
																	key={index}
																	className="mb-4 indent-0 first:indent-0"
																>
																	{cleanLine}
																</p>
															);
														})}
												</div>
											</div>
										</div>

										{/* Bottom page number */}
										<div className="absolute bottom-4 right-6 text-stone-400/50 font-serif text-xs tracking-wider">
											1
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			)}
		</div>
	);
}
