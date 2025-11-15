'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Volume2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioPlayerProps {
	audioText?: string;
	audioUrl?: string;
}

export default function AudioPlayer({ audioText, audioUrl }: AudioPlayerProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(
		audioUrl || null,
	);
	const [progress, setProgress] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Generate audio if we have audioText but no audioUrl
	useEffect(() => {
		if (audioText && !currentAudioUrl && !isLoading) {
			generateAudio();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [audioText, currentAudioUrl, isLoading]);

	// Update audio URL when prop changes
	useEffect(() => {
		if (audioUrl && audioUrl !== currentAudioUrl) {
			setCurrentAudioUrl(audioUrl);
		}
	}, [audioUrl, currentAudioUrl]);

	const generateAudio = async () => {
		if (!audioText) return;

		setIsLoading(true);
		try {
			const response = await fetch('/api/audio/generate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ text: audioText }),
			});

			if (!response.ok) {
				throw new Error('Failed to generate audio');
			}

			const data = await response.json();
			if (data.audioUrl) {
				setCurrentAudioUrl(data.audioUrl);
			}
		} catch (error) {
			console.error('Error generating audio:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const togglePlay = () => {
		if (!audioRef.current || !currentAudioUrl) {
			if (audioText && !currentAudioUrl) {
				generateAudio();
			}
			return;
		}

		if (isPlaying) {
			audioRef.current.pause();
			setIsPlaying(false);
		} else {
			audioRef.current.play();
			setIsPlaying(true);
		}
	};

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateProgress = () => {
			if (audio.duration) {
				setProgress((audio.currentTime / audio.duration) * 100);
			}
		};

		const handleLoadedMetadata = () => {
			setDuration(audio.duration);
		};

		const handleEnded = () => {
			setIsPlaying(false);
			setProgress(0);
		};

		const handleTimeUpdate = () => {
			updateProgress();
		};

		audio.addEventListener('loadedmetadata', handleLoadedMetadata);
		audio.addEventListener('ended', handleEnded);
		audio.addEventListener('timeupdate', handleTimeUpdate);

		return () => {
			audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
			audio.removeEventListener('ended', handleEnded);
			audio.removeEventListener('timeupdate', handleTimeUpdate);
		};
	}, [currentAudioUrl]);

	const formatTime = (seconds: number) => {
		if (!isFinite(seconds)) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	};

	if (!audioText && !currentAudioUrl) {
		return null;
	}

	return (
		<Card className="mb-6 border-stone-200/50 bg-gradient-to-br from-stone-50 to-stone-100/50">
			<CardContent className="p-6">
				<div className="flex items-center gap-4">
					{/* Play/Pause Button */}
					<Button
						onClick={togglePlay}
						disabled={isLoading || (!currentAudioUrl && !audioText)}
						className="h-12 w-12 rounded-full bg-stone-800 hover:bg-stone-700 disabled:opacity-50"
						size="icon"
					>
						{isLoading ? (
							<Loader2 className="h-5 w-5 animate-spin text-white" />
						) : isPlaying ? (
							<Pause className="h-5 w-5 text-white" />
						) : (
							<Play className="h-5 w-5 text-white ml-0.5" />
						)}
					</Button>

					{/* Audio Info and Progress */}
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-2">
							<Volume2 className="h-4 w-4 text-stone-600" />
							<span className="text-sm font-medium text-stone-700">
								Audio Narration
							</span>
							{isLoading && (
								<span className="text-xs text-stone-500">
									Generating...
								</span>
							)}
						</div>
						{currentAudioUrl && (
							<>
								<Progress
									value={progress}
									className="h-1.5 mb-1"
								/>
								<div className="flex justify-between text-xs text-stone-500">
									<span>
										{audioRef.current
											? formatTime(
													audioRef.current
														.currentTime,
												)
											: '0:00'}
									</span>
									<span>
										{audioRef.current &&
										audioRef.current.duration
											? formatTime(
													audioRef.current.duration,
												)
											: '0:00'}
									</span>
								</div>
							</>
						)}
					</div>

					{/* Hidden audio element */}
					{currentAudioUrl && (
						<audio
							ref={audioRef}
							src={currentAudioUrl}
							preload="metadata"
							className="hidden"
						/>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
