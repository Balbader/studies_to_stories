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
import Footer from '@/components/home/Footer';
import {
	Upload,
	FileText,
	Sparkles,
	CheckCircle2,
	Loader2,
	GitCompare,
	Eye,
	BookOpen,
} from 'lucide-react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ExtractedTextData, CombinedTextData } from '@/lib/text-extractor';
import TextDiffView from '@/components/story/TextDiffView';
import AudioPlayer from '@/components/story/AudioPlayer';

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
	const [processStatus, setProcessStatus] = useState<string>('');
	const [showUploadSection, setShowUploadSection] = useState(true);

	// Story creation state
	const [storytone, setStorytone] = useState<
		| 'dark'
		| 'humorous'
		| 'poetic'
		| 'epic'
		| 'adventure'
		| 'mystery'
		| 'slice-of-life'
	>('humorous');
	const [ageMode, setAgeMode] = useState<'children' | 'ya' | 'adult'>('ya');
	const [storyResult, setStoryResult] = useState<{
		story: string;
		characters: string;
		scenes: string;
		audioText?: string;
		audioUrl?: string;
	} | null>(null);
	const [isCreatingStory, setIsCreatingStory] = useState(false);
	const [storyError, setStoryError] = useState<string | null>(null);
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
			setStoryResult(null);
			setStoryError(null);
			setProcessStatus('');
			setProgress(0);
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
		setProgress(0);
		setProcessStatus('Initializing...');
		setElapsedTime(0);
		setShowUploadSection(false); // Collapse upload section when extraction starts
		startTimeRef.current = Date.now();

		try {
			const formData = new FormData();
			files.forEach((file) => {
				formData.append('files', file);
			});

			// Simulate progress during extraction with detailed status (much slower)
			setProcessStatus('Uploading files...');
			const progressInterval = setInterval(() => {
				setProgress((prev) => {
					if (prev < 10) {
						return Math.min(prev + 0.2, 10);
					} else if (prev < 20) {
						return Math.min(prev + 0.3, 20);
					} else if (prev < 35) {
						return Math.min(prev + 0.4, 35);
					} else if (prev < 45) {
						return Math.min(prev + 0.3, 45);
					}
					return prev;
				});
			}, 1200); // Much slower interval

			setProcessStatus('Extracting text from documents...');
			const response = await fetch('/api/extract-text', {
				method: 'POST',
				body: formData,
			});

			clearInterval(progressInterval);
			setProgress(45);
			setProcessStatus('Text extraction complete ✓');

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
			setProgress(50);
			setProcessStatus('Combining extracted text...');

			if (result.combined) {
				setCombinedData(result.combined);
				setProgress(52);
				setProcessStatus('Text combined ✓');

				// Automatically enhance the text after extraction
				setIsEnhancing(true);
				setEnhancedText(null);
				setProcessStatus('Enhancing lesson content...');

				// Simulate progress during enhancement (much slower)
				const enhanceProgressInterval = setInterval(() => {
					setProgress((prev) => {
						if (prev < 58) {
							return Math.min(prev + 0.3, 58);
						}
						return prev;
					});
				}, 1500); // Much slower interval

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

					const { enhanceLesson, createStory } = await import(
						'./action'
					);

					// Enhance the lesson
					const enhanced = await enhanceLesson(enhanceFormData);
					clearInterval(enhanceProgressInterval);
					setProgress(60);
					setProcessStatus('Lesson enhancement complete ✓');
					setEnhancedText(enhanced);

					// Create the story
					setIsCreatingStory(true);
					setStoryError(null);
					setStoryResult(null);
					setProcessStatus('Creating characters from lesson...');

					let lastStatusUpdate = 60;
					const storyProgressInterval = setInterval(() => {
						setProgress((prev) => {
							// Characters phase (60-65%)
							if (prev < 65) {
								return Math.min(prev + 0.25, 65);
							}
							// Scenes phase (65-85%)
							if (prev < 85) {
								if (prev >= 65 && lastStatusUpdate < 65) {
									setProcessStatus(
										'Creating scenes from characters...',
									);
									lastStatusUpdate = 65;
								}
								return Math.min(prev + 0.3, 85);
							}
							// Story phase (85-95%)
							if (prev < 95) {
								if (prev >= 85 && lastStatusUpdate < 85) {
									setProcessStatus('Weaving final story...');
									lastStatusUpdate = 85;
								}
								return Math.min(prev + 0.25, 95);
							}
							return prev;
						});
					}, 1800); // Much slower interval

					try {
						const storyFormData = new FormData();
						storyFormData.append(
							'lessonContent',
							result.combined.combinedText,
						);
						storyFormData.append('storytone', storytone);
						storyFormData.append('ageMode', ageMode);
						if (result.combined.totalDocuments) {
							storyFormData.append(
								'lessonTitle',
								`Lesson from ${result.combined.totalDocuments} document${result.combined.totalDocuments !== 1 ? 's' : ''}`,
							);
						}

						const storyResult = await createStory(storyFormData);
						clearInterval(storyProgressInterval);
						setProgress(100);
						setProcessStatus('Story creation complete ✓');
						setStoryResult(storyResult);
						setSuccess(true);
					} catch (storyErr) {
						clearInterval(storyProgressInterval);
						setProcessStatus('Story creation failed');
						setStoryError(
							storyErr instanceof Error
								? storyErr.message
								: 'Failed to create story',
						);
						// Still show success for extraction and enhancement even if story creation fails
						setSuccess(true);
					} finally {
						setIsCreatingStory(false);
					}
				} catch (enhanceErr) {
					clearInterval(enhanceProgressInterval);
					setProcessStatus('Enhancement failed');
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
				setProcessStatus('Extraction complete');
				setSuccess(true);
			}
		} catch (err) {
			setProcessStatus('Extraction failed');
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

	const handleCreateStory = async () => {
		if (!combinedData?.combinedText) {
			setStoryError(
				'No combined text available. Please extract text first.',
			);
			return;
		}

		setIsCreatingStory(true);
		setStoryError(null);
		setStoryResult(null);
		setProgress(0);
		startTimeRef.current = Date.now();

		// Simulate progress during story creation
		const storyProgressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev < 95) {
					return Math.min(prev + 1.5, 95);
				}
				return prev;
			});
		}, 500);

		try {
			const formData = new FormData();
			formData.append('lessonContent', combinedData.combinedText);
			formData.append('storytone', storytone);
			formData.append('ageMode', ageMode);
			if (combinedData.totalDocuments) {
				formData.append(
					'lessonTitle',
					`Lesson from ${combinedData.totalDocuments} document${combinedData.totalDocuments !== 1 ? 's' : ''}`,
				);
			}

			const { createStory } = await import('./action');
			const result = await createStory(formData);
			clearInterval(storyProgressInterval);
			setProgress(100);
			setStoryResult(result);
		} catch (err) {
			clearInterval(storyProgressInterval);
			setStoryError(
				err instanceof Error ? err.message : 'Failed to create story',
			);
		} finally {
			setIsCreatingStory(false);
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
							Upload your documents, choose your story settings,
							and let our AI transform your studies into engaging
							stories and enhanced lessons in one seamless flow.
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
										Select PDF or Word documents, choose
										your story settings, and get both your
										story and enhanced lesson in one go
									</CardDescription>
								</CardHeader>
								<CardContent>
									{showUploadSection && (
										<>
											<UploadComponent
												onFileSelect={handleFileSelect}
												files={files}
											/>

											{files.length > 0 && (
												<div className="mt-6 space-y-6">
													{/* Story Creation Criteria */}
													<div className="rounded-lg border border-stone-200/50 bg-stone-50/30 p-4">
														<h3
															className="mb-4 font-serif text-lg font-semibold text-stone-900"
															style={{
																fontFamily:
																	'var(--font-playfair)',
															}}
														>
															Story Creation
															Settings
														</h3>
														<div className="grid gap-4 md:grid-cols-2">
															{/* Storytone Selector */}
															<div className="space-y-2">
																<Label
																	htmlFor="storytone"
																	className="text-stone-700 font-medium"
																>
																	Storytone
																</Label>
																<Select
																	value={
																		storytone
																	}
																	onValueChange={(
																		value,
																	) =>
																		setStorytone(
																			value as typeof storytone,
																		)
																	}
																	disabled={
																		isExtracting ||
																		isEnhancing ||
																		isCreatingStory
																	}
																>
																	<SelectTrigger
																		id="storytone"
																		className="w-full bg-white"
																	>
																		<SelectValue placeholder="Select a storytone" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="dark">
																			Dark
																		</SelectItem>
																		<SelectItem value="humorous">
																			Humorous
																		</SelectItem>
																		<SelectItem value="poetic">
																			Poetic
																		</SelectItem>
																		<SelectItem value="epic">
																			Epic
																		</SelectItem>
																		<SelectItem value="adventure">
																			Adventure
																		</SelectItem>
																		<SelectItem value="mystery">
																			Mystery
																		</SelectItem>
																		<SelectItem value="slice-of-life">
																			Slice
																			of
																			Life
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>

															{/* Age Mode Selector */}
															<div className="space-y-2">
																<Label
																	htmlFor="ageMode"
																	className="text-stone-700 font-medium"
																>
																	Age Mode
																</Label>
																<Select
																	value={
																		ageMode
																	}
																	onValueChange={(
																		value,
																	) =>
																		setAgeMode(
																			value as typeof ageMode,
																		)
																	}
																	disabled={
																		isExtracting ||
																		isEnhancing ||
																		isCreatingStory
																	}
																>
																	<SelectTrigger
																		id="ageMode"
																		className="w-full bg-white"
																	>
																		<SelectValue placeholder="Select age mode" />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="children">
																			Children
																		</SelectItem>
																		<SelectItem value="ya">
																			Young
																			Adult
																			(YA)
																		</SelectItem>
																		<SelectItem value="adult">
																			Adult
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
														</div>
													</div>

													<Button
														onClick={
															handleExtractText
														}
														disabled={false}
														className="w-full bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
														size="lg"
													>
														<Sparkles className="mr-2 size-4" />
														Create Story & Enhanced
														Lesson from{' '}
														{files.length} File
														{files.length !== 1
															? 's'
															: ''}
													</Button>
												</div>
											)}
										</>
									)}

									{/* Progress bar - shown when processing */}
									{(isExtracting ||
										isEnhancing ||
										isCreatingStory) && (
										<div className="space-y-3">
											<div className="space-y-2">
												<div className="flex items-center justify-between text-sm">
													<span className="font-medium text-stone-700">
														{processStatus ||
															(isExtracting
																? 'Extracting text...'
																: isEnhancing
																	? 'Enhancing lesson...'
																	: isCreatingStory
																		? 'Creating story...'
																		: 'Processing...')}
													</span>
													<span className="text-stone-500">
														{Math.round(progress)}%
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
														elapsedTime / 60,
													)}
													:
													{String(
														elapsedTime % 60,
													).padStart(2, '0')}
												</span>
											</div>
										</div>
									)}

									{error && (
										<Alert variant="destructive">
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>
												{error}
											</AlertDescription>
										</Alert>
									)}

									{storyError && (
										<Alert variant="destructive">
											<AlertTitle>
												Story Creation Error
											</AlertTitle>
											<AlertDescription>
												{storyError}
											</AlertDescription>
										</Alert>
									)}

									{success && extractedData.length > 0 && (
										<Alert className="border-green-200 bg-green-50/50">
											<CheckCircle2 className="size-4 text-green-600" />
											<AlertTitle className="text-green-900">
												Success!
											</AlertTitle>
											<AlertDescription className="text-green-800">
												{storyResult && enhancedText
													? `Successfully created story and enhanced lesson from ${extractedData.length} file${extractedData.length !== 1 ? 's' : ''}. Both are available below.`
													: enhancedText
														? `Successfully extracted and enhanced text from ${extractedData.length} file${extractedData.length !== 1 ? 's' : ''}. ${storyError ? 'Story creation failed, but the enhanced lesson is available below.' : 'The enhanced lesson is available below.'}`
														: `Successfully extracted text from ${extractedData.length} file${extractedData.length !== 1 ? 's' : ''}. ${enhanceError ? 'Enhancement failed, but you can try manually below.' : 'The extracted data is available below.'}`}
											</AlertDescription>
										</Alert>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Story Creation Section - Hidden since story is now created automatically */}
			{false && combinedData && !storyResult && (
				<section className="border-t border-stone-200/40 py-4 md:py-6">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-6xl">
							<Card className="book-shadow border-stone-200/50 bg-white/95">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<BookOpen className="size-6 text-stone-700" />
									</div>
									<CardTitle
										className="font-serif text-stone-900"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										Create Your Story
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Transform your lesson into an engaging
										story using our multi-agent workflow
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-6">
									{/* Storytone Selector */}
									<div className="space-y-2">
										<Label
											htmlFor="storytone"
											className="text-stone-700 font-medium"
										>
											Storytone
										</Label>
										<Select
											value={storytone}
											onValueChange={(value) =>
												setStorytone(
													value as typeof storytone,
												)
											}
											disabled={isCreatingStory}
										>
											<SelectTrigger
												id="storytone"
												className="w-full"
											>
												<SelectValue placeholder="Select a storytone" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="dark">
													Dark
												</SelectItem>
												<SelectItem value="humorous">
													Humorous
												</SelectItem>
												<SelectItem value="poetic">
													Poetic
												</SelectItem>
												<SelectItem value="epic">
													Epic
												</SelectItem>
												<SelectItem value="adventure">
													Adventure
												</SelectItem>
												<SelectItem value="mystery">
													Mystery
												</SelectItem>
												<SelectItem value="slice-of-life">
													Slice of Life
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Age Mode Selector */}
									<div className="space-y-2">
										<Label
											htmlFor="ageMode"
											className="text-stone-700 font-medium"
										>
											Age Mode
										</Label>
										<Select
											value={ageMode}
											onValueChange={(value) =>
												setAgeMode(
													value as typeof ageMode,
												)
											}
											disabled={isCreatingStory}
										>
											<SelectTrigger
												id="ageMode"
												className="w-full"
											>
												<SelectValue placeholder="Select age mode" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="children">
													Children
												</SelectItem>
												<SelectItem value="ya">
													Young Adult (YA)
												</SelectItem>
												<SelectItem value="adult">
													Adult
												</SelectItem>
											</SelectContent>
										</Select>
									</div>

									{/* Create Story Button */}
									{isCreatingStory ? (
										<div className="space-y-3">
											<div className="space-y-2">
												<div className="flex items-center justify-between text-sm">
													<span className="font-medium text-stone-700">
														Creating story...
														(Lesson → Characters →
														Scene → Story)
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
														elapsedTime / 60,
													)}
													:
													{String(
														elapsedTime % 60,
													).padStart(2, '0')}
												</span>
											</div>
										</div>
									) : (
										<Button
											onClick={handleCreateStory}
											disabled={!combinedData}
											className="w-full bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
											size="lg"
										>
											<BookOpen className="mr-2 size-4" />
											Create Story
										</Button>
									)}

									{storyError && (
										<Alert variant="destructive">
											<AlertTitle>Error</AlertTitle>
											<AlertDescription>
												{storyError}
											</AlertDescription>
										</Alert>
									)}
								</CardContent>
							</Card>
						</div>
					</div>
				</section>
			)}

			{/* Combined Story and Enhanced Text Section with Tabs */}
			{(storyResult || enhancedText) && (
				<section className="border-t border-stone-200/40 py-4 md:py-6">
					<div className="container mx-auto px-4">
						<div className="mx-auto max-w-6xl">
							<div className="mb-4 text-center">
								<div className="mb-2 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-stone-50/80 backdrop-blur-sm px-5 py-2 text-sm">
									<BookOpen className="size-4 text-stone-600" />
									<span className="text-stone-700 font-medium">
										Your Content
									</span>
								</div>
								<p
									className="text-sm text-stone-500"
									style={{
										fontFamily: 'var(--font-crimson)',
									}}
								>
									{storyResult
										? `Story created: ${new Date().toLocaleString()}`
										: enhancedText
											? `Enhanced: ${new Date().toLocaleString()}`
											: ''}
								</p>
							</div>

							{/* Tabs for switching between Story and Enhanced Lesson */}
							{storyResult && enhancedText ? (
								<Tabs defaultValue="story" className="w-full">
									<TabsList className="mb-6 w-full justify-start bg-stone-100/50 border border-stone-200/50">
										<TabsTrigger
											value="story"
											className="data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm"
										>
											<BookOpen className="mr-2 size-4" />
											Story
										</TabsTrigger>
										<TabsTrigger
											value="enhanced"
											className="data-[state=active]:bg-white data-[state=active]:text-stone-900 data-[state=active]:shadow-sm"
										>
											<Sparkles className="mr-2 size-4" />
											Enhanced Lesson
										</TabsTrigger>
									</TabsList>

									<TabsContent value="story" className="mt-0">
										<div className="space-y-6">
											{/* Audio Player */}
											{(storyResult.audioText ||
												storyResult.story) && (
												<AudioPlayer
													audioText={
														storyResult.audioText ||
														storyResult.story
													}
													audioUrl={
														storyResult.audioUrl
													}
												/>
											)}

											{/* Story Content */}
											<div
												ref={enhancedRef}
												className="book-shadow relative bg-white/95 border border-stone-200/50 rounded-lg overflow-hidden"
											>
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
															{storyResult?.story
																.split('\n')
																.map(
																	(
																		line,
																		index,
																	) => {
																		// Remove all markdown characters
																		let cleanLine =
																			line
																				.replace(
																					/^#+\s*/g,
																					'',
																				)
																				.replace(
																					/\*\*/g,
																					'',
																				)
																				.replace(
																					/\*([^*]+)\*/g,
																					'$1',
																				)
																				.replace(
																					/^[-*]\s+/g,
																					'',
																				)
																				.replace(
																					/^\d+\.\s+/g,
																					'',
																				)
																				.replace(
																					/```[\s\S]*?```/g,
																					'',
																				)
																				.replace(
																					/`([^`]+)`/g,
																					'$1',
																				)
																				.replace(
																					/\[([^\]]+)\]\([^\)]+\)/g,
																					'$1',
																				)
																				.replace(
																					/!\[([^\]]*)\]\([^\)]+\)/g,
																					'',
																				)
																				.replace(
																					/^[-*_]{3,}$/g,
																					'',
																				)
																				.replace(
																					/^>\s*/g,
																					'',
																				)
																				.trim();

																		if (
																			!cleanLine
																		) {
																			return (
																				<br
																					key={
																						index
																					}
																				/>
																			);
																		}

																		return (
																			<p
																				key={
																					index
																				}
																				className="mb-4 indent-0 first:indent-0"
																			>
																				{
																					cleanLine
																				}
																			</p>
																		);
																	},
																)}
														</div>
													</div>
												</div>

												{/* Bottom page number */}
												<div className="absolute bottom-4 right-6 text-stone-400/50 font-serif text-xs tracking-wider">
													1
												</div>
											</div>
										</div>
									</TabsContent>

									<TabsContent
										value="enhanced"
										className="mt-0"
									>
										<div
											ref={enhancedRef}
											className="relative"
										>
											{/* Post-it note when story is still being created */}
											{isCreatingStory && (
												<div
													className="absolute -top-4 right-4 z-10 w-48 transform rotate-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-500"
													style={{
														background:
															'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
														border: '1px solid #f59e0b',
														borderRadius: '4px',
														padding: '12px',
														fontFamily:
															'var(--font-crimson)',
														boxShadow:
															'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(245, 158, 11, 0.2)',
													}}
												>
													<div className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
														<span>📝</span>
														<span>Note</span>
													</div>
													<div className="text-xs text-amber-800 leading-tight">
														Your story is being
														created! It will appear
														soon in the Story tab.
													</div>
													<div
														className="absolute top-0 right-0 w-0 h-0"
														style={{
															borderTop:
																'8px solid #f59e0b',
															borderLeft:
																'8px solid transparent',
														}}
													/>
												</div>
											)}
											<div className="mb-4 flex items-center justify-center gap-4">
												<Button
													ref={viewDiffButtonRef}
													onClick={() =>
														setShowDiff(!showDiff)
													}
													variant={
														showDiff
															? 'default'
															: 'outline'
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
											{showDiff &&
											combinedData &&
											enhancedText ? (
												<TextDiffView
													original={
														combinedData.combinedText
													}
													enhanced={
														enhancedText || ''
													}
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
																	?.split(
																		'\n',
																	)
																	.map(
																		(
																			line,
																			index,
																		) => {
																			// Remove all markdown characters
																			let cleanLine =
																				line
																					.replace(
																						/^#+\s*/g,
																						'',
																					)
																					.replace(
																						/\*\*/g,
																						'',
																					)
																					.replace(
																						/\*([^*]+)\*/g,
																						'$1',
																					)
																					.replace(
																						/^[-*]\s+/g,
																						'',
																					)
																					.replace(
																						/^\d+\.\s+/g,
																						'',
																					)
																					.replace(
																						/```[\s\S]*?```/g,
																						'',
																					)
																					.replace(
																						/`([^`]+)`/g,
																						'$1',
																					)
																					.replace(
																						/\[([^\]]+)\]\([^\)]+\)/g,
																						'$1',
																					)
																					.replace(
																						/!\[([^\]]*)\]\([^\)]+\)/g,
																						'',
																					)
																					.replace(
																						/^[-*_]{3,}$/g,
																						'',
																					)
																					.replace(
																						/^>\s*/g,
																						'',
																					)
																					.trim();

																			// Skip empty lines
																			if (
																				!cleanLine
																			) {
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
																					key={
																						index
																					}
																					className="mb-4 indent-0 first:indent-0"
																				>
																					{
																						cleanLine
																					}
																				</p>
																			);
																		},
																	)}
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
									</TabsContent>
								</Tabs>
							) : storyResult ? (
								// Only story available
								<div className="space-y-6">
									{/* Audio Player */}
									{(storyResult.audioText ||
										storyResult.story) && (
										<AudioPlayer
											audioText={
												storyResult.audioText ||
												storyResult.story
											}
											audioUrl={storyResult.audioUrl}
										/>
									)}

									{/* Story Content */}
									<div
										ref={enhancedRef}
										className="book-shadow relative bg-white/95 border border-stone-200/50 rounded-lg overflow-hidden"
									>
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
													{storyResult?.story
														.split('\n')
														.map((line, index) => {
															// Remove all markdown characters
															let cleanLine = line
																.replace(
																	/^#+\s*/g,
																	'',
																)
																.replace(
																	/\*\*/g,
																	'',
																)
																.replace(
																	/\*([^*]+)\*/g,
																	'$1',
																)
																.replace(
																	/^[-*]\s+/g,
																	'',
																)
																.replace(
																	/^\d+\.\s+/g,
																	'',
																)
																.replace(
																	/```[\s\S]*?```/g,
																	'',
																)
																.replace(
																	/`([^`]+)`/g,
																	'$1',
																)
																.replace(
																	/\[([^\]]+)\]\([^\)]+\)/g,
																	'$1',
																)
																.replace(
																	/!\[([^\]]*)\]\([^\)]+\)/g,
																	'',
																)
																.replace(
																	/^[-*_]{3,}$/g,
																	'',
																)
																.replace(
																	/^>\s*/g,
																	'',
																)
																.trim();

															if (!cleanLine) {
																return (
																	<br
																		key={
																			index
																		}
																	/>
																);
															}

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
								</div>
							) : (
								// Only enhanced text available
								<div ref={enhancedRef} className="relative">
									{/* Post-it note when story is still being created */}
									{isCreatingStory && (
										<div
											className="absolute -top-4 right-4 z-10 w-48 transform rotate-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-500"
											style={{
												background:
													'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
												border: '1px solid #f59e0b',
												borderRadius: '4px',
												padding: '12px',
												fontFamily:
													'var(--font-crimson)',
												boxShadow:
													'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(245, 158, 11, 0.2)',
											}}
										>
											<div className="text-xs font-semibold text-amber-900 mb-1 flex items-center gap-1">
												<span>📝</span>
												<span>Note</span>
											</div>
											<div className="text-xs text-amber-800 leading-tight">
												Your story is being created! It
												will appear soon.
											</div>
											<div
												className="absolute top-0 right-0 w-0 h-0"
												style={{
													borderTop:
														'8px solid #f59e0b',
													borderLeft:
														'8px solid transparent',
												}}
											/>
										</div>
									)}
									<div className="mb-2 flex items-center justify-center gap-4">
										<Button
											ref={viewDiffButtonRef}
											onClick={() =>
												setShowDiff(!showDiff)
											}
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
									{showDiff &&
									combinedData &&
									enhancedText ? (
										<TextDiffView
											original={combinedData.combinedText}
											enhanced={enhancedText || ''}
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
															?.split('\n')
															.map(
																(
																	line,
																	index,
																) => {
																	// Remove all markdown characters
																	let cleanLine =
																		line
																			.replace(
																				/^#+\s*/g,
																				'',
																			)
																			.replace(
																				/\*\*/g,
																				'',
																			)
																			.replace(
																				/\*([^*]+)\*/g,
																				'$1',
																			)
																			.replace(
																				/^[-*]\s+/g,
																				'',
																			)
																			.replace(
																				/^\d+\.\s+/g,
																				'',
																			)
																			.replace(
																				/```[\s\S]*?```/g,
																				'',
																			)
																			.replace(
																				/`([^`]+)`/g,
																				'$1',
																			)
																			.replace(
																				/\[([^\]]+)\]\([^\)]+\)/g,
																				'$1',
																			)
																			.replace(
																				/!\[([^\]]*)\]\([^\)]+\)/g,
																				'',
																			)
																			.replace(
																				/^[-*_]{3,}$/g,
																				'',
																			)
																			.replace(
																				/^>\s*/g,
																				'',
																			)
																			.trim();

																	// Skip empty lines
																	if (
																		!cleanLine
																	) {
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
																			key={
																				index
																			}
																			className="mb-4 indent-0 first:indent-0"
																		>
																			{
																				cleanLine
																			}
																		</p>
																	);
																},
															)}
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
							)}
						</div>
					</div>
				</section>
			)}
			<Footer />
		</div>
	);
}
