'use client';

import { useMemo, useRef, useEffect } from 'react';
import { computeTextDiff, type DiffResult } from '@/lib/text-diff';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Sparkles } from 'lucide-react';

interface TextDiffViewProps {
	original: string;
	enhanced: string;
	title?: string;
}

export default function TextDiffView({
	original,
	enhanced,
	title = 'Text Enhancement Comparison',
}: TextDiffViewProps) {
	const diffResult: DiffResult = useMemo(() => {
		return computeTextDiff(original, enhanced);
	}, [original, enhanced]);

	// Split text into lines for side-by-side display
	const originalLines = original.split('\n');
	const enhancedLines = enhanced.split('\n');
	const maxLines = Math.max(originalLines.length, enhancedLines.length);

	// Refs for synchronized scrolling
	const beforeScrollRef = useRef<HTMLDivElement>(null);
	const afterScrollRef = useRef<HTMLDivElement>(null);
	const isScrolling = useRef(false);

	// Synchronized scrolling effect
	useEffect(() => {
		const beforeEl = beforeScrollRef.current;
		const afterEl = afterScrollRef.current;

		if (!beforeEl || !afterEl) return;

		const handleBeforeScroll = () => {
			if (!isScrolling.current && afterEl) {
				isScrolling.current = true;
				afterEl.scrollTop = beforeEl.scrollTop;
				requestAnimationFrame(() => {
					isScrolling.current = false;
				});
			}
		};

		const handleAfterScroll = () => {
			if (!isScrolling.current && beforeEl) {
				isScrolling.current = true;
				beforeEl.scrollTop = afterEl.scrollTop;
				requestAnimationFrame(() => {
					isScrolling.current = false;
				});
			}
		};

		beforeEl.addEventListener('scroll', handleBeforeScroll);
		afterEl.addEventListener('scroll', handleAfterScroll);

		return () => {
			beforeEl.removeEventListener('scroll', handleBeforeScroll);
			afterEl.removeEventListener('scroll', handleAfterScroll);
		};
	}, [original, enhanced]);

	return (
		<Card className="book-shadow border-stone-200/50 bg-white/95">
			<CardHeader>
				<CardTitle
					className="font-serif text-stone-900"
					style={{ fontFamily: 'var(--font-playfair)' }}
				>
					{title}
				</CardTitle>
				<div className="flex gap-4 text-sm text-stone-600">
					<div className="flex items-center gap-2 rounded-full bg-stone-100/80 px-3 py-1">
						<FileText className="size-4 text-stone-600" />
						<span className="font-medium">
							{diffResult.removedCount} changes
						</span>
					</div>
					<div className="flex items-center gap-2 rounded-full bg-green-50/80 px-3 py-1">
						<Sparkles className="size-4 text-green-600" />
						<span className="font-medium text-green-700">
							{diffResult.addedCount} enhancements
						</span>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-stone-200/50">
					{/* Before Column */}
					<div className="border-r border-stone-200/50">
						<div className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-sm border-b border-stone-200/50 px-6 py-4">
							<div className="flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-lg bg-stone-200/60">
									<FileText className="size-4 text-stone-700" />
								</div>
								<div>
									<h3
										className="font-serif text-lg font-semibold text-stone-900"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										Before
									</h3>
									<p className="text-xs text-stone-500">
										Original text
									</p>
								</div>
							</div>
						</div>
						<div
							ref={beforeScrollRef}
							className="overflow-auto max-h-[600px] px-6 py-6 scroll-smooth"
						>
							<div
								className="prose prose-stone max-w-none text-stone-700 leading-relaxed"
								style={{
									fontFamily: 'var(--font-crimson)',
								}}
							>
								{originalLines.map((line, index) => {
									const trimmed = line.trim();
									if (!trimmed) {
										return <br key={index} />;
									}
									return (
										<p
											key={index}
											className="mb-3 text-base"
										>
											{line}
										</p>
									);
								})}
							</div>
						</div>
					</div>

					{/* After Column */}
					<div>
						<div className="sticky top-0 z-10 bg-green-50/95 backdrop-blur-sm border-b border-green-200/50 px-6 py-4">
							<div className="flex items-center gap-2">
								<div className="flex size-8 items-center justify-center rounded-lg bg-green-200/60">
									<Sparkles className="size-4 text-green-700" />
								</div>
								<div>
									<h3
										className="font-serif text-lg font-semibold text-green-900"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										After
									</h3>
									<p className="text-xs text-green-700/70">
										Enhanced text
									</p>
								</div>
							</div>
						</div>
						<div
							ref={afterScrollRef}
							className="overflow-auto max-h-[600px] px-6 py-6 scroll-smooth"
						>
							<div
								className="prose prose-stone max-w-none text-stone-700 leading-relaxed"
								style={{
									fontFamily: 'var(--font-crimson)',
								}}
							>
								{enhancedLines.map((line, index) => {
									// Remove markdown formatting for cleaner display
									let cleanLine = line
										.replace(/^#+\s*/g, '')
										.replace(/\*\*/g, '')
										.replace(/\*([^*]+)\*/g, '$1')
										.replace(/^[-*]\s+/g, '')
										.replace(/^\d+\.\s+/g, '')
										.replace(/```[\s\S]*?```/g, '')
										.replace(/`([^`]+)`/g, '$1')
										.replace(
											/\[([^\]]+)\]\([^\)]+\)/g,
											'$1',
										)
										.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
										.replace(/^[-*_]{3,}$/g, '')
										.replace(/^>\s*/g, '')
										.trim();

									if (!cleanLine) {
										return <br key={index} />;
									}
									return (
										<p
											key={index}
											className="mb-3 text-base"
										>
											{cleanLine}
										</p>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
