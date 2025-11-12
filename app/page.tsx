'use client';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	BookOpen,
	Sparkles,
	Upload,
	FileText,
	Wand2,
	Zap,
	CheckCircle2,
	ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Noto from '@/components/Noto';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
	const heroRef = useRef<HTMLDivElement>(null);
	const badgeRef = useRef<HTMLDivElement>(null);
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLParagraphElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);
	const featuresTitleRef = useRef<HTMLDivElement>(null);
	const featureCardsRef = useRef<HTMLDivElement>(null);
	const howItWorksRef = useRef<HTMLDivElement>(null);
	const stepsRef = useRef<HTMLDivElement>(null);
	const benefitsRef = useRef<HTMLDivElement>(null);
	const benefitsItemsRef = useRef<HTMLDivElement>(null);
	const finalCtaRef = useRef<HTMLDivElement>(null);
	const bookCoverRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Book cover opening animation
			if (bookCoverRef.current) {
				gsap.from(bookCoverRef.current, {
					rotationY: -90,
					transformOrigin: 'left center',
					duration: 1.5,
					ease: 'power3.out',
					delay: 0.3,
				});
			}

			// Hero animations with book page turn effect
			if (
				badgeRef.current &&
				titleRef.current &&
				subtitleRef.current &&
				ctaRef.current
			) {
				const tl = gsap.timeline({ delay: 0.5 });
				tl.from(badgeRef.current, {
					opacity: 0,
					y: -20,
					duration: 0.8,
					ease: 'power3.out',
				})
					.from(
						titleRef.current,
						{
							opacity: 0,
							y: 30,
							rotationX: 15,
							duration: 1,
							ease: 'power3.out',
						},
						'-=0.4',
					)
					.from(
						subtitleRef.current,
						{
							opacity: 0,
							y: 20,
							duration: 0.8,
							ease: 'power3.out',
						},
						'-=0.5',
					)
					.from(
						ctaRef.current.children,
						{
							opacity: 0,
							y: 20,
							duration: 0.6,
							stagger: 0.15,
							ease: 'power3.out',
						},
						'-=0.4',
					);

				// Subtle page flutter animation
				gsap.to(heroRef.current, {
					rotation: 0.5,
					duration: 3,
					repeat: -1,
					yoyo: true,
					ease: 'sine.inOut',
				});
			}

			// Features section - page turn effect
			if (featuresTitleRef.current) {
				gsap.from(featuresTitleRef.current.children, {
					opacity: 0,
					x: -30,
					rotationY: -10,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: featuresTitleRef.current,
						start: 'top 80%',
					},
				});
			}

			if (featureCardsRef.current) {
				const cards = Array.from(
					featureCardsRef.current.children,
				) as HTMLElement[];

				// Animate in on scroll - use immediateRender: false so cards stay visible until animation starts
				gsap.fromTo(
					cards,
					{
						opacity: 0,
						y: 50,
						rotationX: 10,
						scale: 0.95,
					},
					{
						opacity: 1,
						y: 0,
						rotationX: 0,
						scale: 1,
						duration: 0.7,
						stagger: 0.1,
						ease: 'power3.out',
						immediateRender: false,
						scrollTrigger: {
							trigger: featureCardsRef.current,
							start: 'top 85%',
							toggleActions: 'play none none none',
						},
					},
				);

				// Book page flip on hover
				Array.from(featureCardsRef.current.children).forEach((card) => {
					const cardElement = card as HTMLElement;

					cardElement.addEventListener('mouseenter', () => {
						gsap.to(cardElement, {
							y: -12,
							rotationY: 5,
							scale: 1.02,
							duration: 0.4,
							ease: 'power2.out',
						});
					});
					cardElement.addEventListener('mouseleave', () => {
						gsap.to(cardElement, {
							y: 0,
							rotationY: 0,
							scale: 1,
							duration: 0.4,
							ease: 'power2.out',
						});
					});
				});
			}

			// How it works section
			if (howItWorksRef.current) {
				gsap.from(howItWorksRef.current.children, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: howItWorksRef.current,
						start: 'top 80%',
					},
				});
			}

			if (stepsRef.current) {
				gsap.from(stepsRef.current.children, {
					opacity: 0,
					x: -50,
					rotationY: -15,
					duration: 0.9,
					stagger: 0.2,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: stepsRef.current,
						start: 'top 80%',
					},
				});

				// Animate step numbers like page numbers
				gsap.from(
					stepsRef.current.querySelectorAll('div > div:first-child'),
					{
						scale: 0,
						rotation: -180,
						duration: 0.7,
						stagger: 0.2,
						ease: 'back.out(1.7)',
						scrollTrigger: {
							trigger: stepsRef.current,
							start: 'top 80%',
						},
					},
				);
			}

			// Benefits section
			if (benefitsRef.current) {
				gsap.from(benefitsRef.current.children, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: benefitsRef.current,
						start: 'top 80%',
					},
				});
			}

			if (benefitsItemsRef.current) {
				gsap.from(benefitsItemsRef.current.children, {
					opacity: 0,
					x: -30,
					duration: 0.7,
					stagger: 0.15,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: benefitsItemsRef.current,
						start: 'top 80%',
					},
				});

				// Animate checkmarks
				gsap.from(benefitsItemsRef.current.querySelectorAll('svg'), {
					scale: 0,
					rotation: -180,
					duration: 0.6,
					stagger: 0.15,
					ease: 'back.out(1.7)',
					scrollTrigger: {
						trigger: benefitsItemsRef.current,
						start: 'top 80%',
					},
				});
			}

			// Final CTA
			if (finalCtaRef.current) {
				gsap.from(finalCtaRef.current.children, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: finalCtaRef.current,
						start: 'top 80%',
					},
				});

				// Gentle pulse for CTA buttons
				const buttons = finalCtaRef.current.querySelectorAll('a');
				gsap.to(buttons[0], {
					scale: 1.03,
					duration: 2.5,
					repeat: -1,
					yoyo: true,
					ease: 'power2.inOut',
				});
			}
		});

		return () => ctx.revert();
	}, []);

	return (
		<div className="min-h-screen bg-gradient-to-b from-stone-50 via-neutral-50 to-stone-50/80">
			{/* Book Cover Effect - Hero Section */}
			<section
				ref={heroRef}
				className="relative overflow-hidden border-b border-stone-200/40 book-page"
			>
				{/* Noto - Floating Study Buddy (Desktop) */}
				<div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:block">
					<Noto className="w-32 h-32 lg:w-48 lg:h-48 xl:w-64 xl:h-64" />
				</div>
				{/* Subtle book binding */}
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />
				<div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />

				{/* Page number decoration - more subtle */}
				<div className="absolute top-8 right-8 text-stone-400/50 font-serif text-xs tracking-wider">
					1
				</div>

				{/* Subtle bookmark ribbon */}
				<div className="absolute top-0 right-20 w-0.5 h-20 bg-gradient-to-b from-rose-400/40 to-rose-500/40" />

				<div className="container mx-auto px-4 py-20 md:py-32">
					<div className="mx-auto max-w-4xl">
						<div
							ref={bookCoverRef}
							className="book-shadow rounded-xl bg-white/90 backdrop-blur-sm p-8 md:p-12 border border-stone-200/50 relative"
						>
							<div className="mx-auto max-w-3xl text-center">
								<div
									ref={badgeRef}
									className="mb-8 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-stone-50/80 backdrop-blur-sm px-5 py-2 text-sm"
								>
									<Sparkles className="size-4 text-stone-600" />
									<span className="text-stone-700 font-medium">
										Powered by AI Agents
									</span>
								</div>
								<h1
									ref={titleRef}
									className="mb-8 font-serif text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl md:text-7xl lg:text-8xl"
									style={{
										fontFamily: 'var(--font-playfair)',
									}}
								>
									Turn Your{' '}
									<span className="text-stone-700 italic">
										Studies
									</span>{' '}
									Into{' '}
									<span className="text-stone-700 italic">
										Stories
									</span>
								</h1>
								{/* Noto - Mobile version */}
								<div className="flex justify-center mb-6 md:hidden">
									<Noto className="w-32 h-32" />
								</div>
								<p
									ref={subtitleRef}
									className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl"
									style={{
										fontFamily: 'var(--font-crimson)',
									}}
								>
									Transform your recorded classes and notes
									into captivating novels. Our AI agents
									analyze your content and craft engaging
									narratives that bring your learning to life.
								</p>
								<div
									ref={ctaRef}
									className="flex flex-col items-center justify-center gap-4 sm:flex-row"
								>
									<Button
										size="lg"
										className="w-full bg-stone-900 text-white hover:bg-stone-800 sm:w-auto shadow-sm"
										asChild
									>
										<Link href="#get-started">
											Get Started Free
											<ArrowRight className="ml-2 size-4" />
										</Link>
									</Button>
									<Button
										size="lg"
										variant="outline"
										className="w-full border-stone-300 text-stone-700 hover:bg-stone-50 sm:w-auto"
										asChild
									>
										<Link href="#how-it-works">
											See How It Works
										</Link>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section - Book Pages */}
			<section id="features" className="book-page py-20 md:py-32">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						{/* Page number */}
						<div className="mb-4 text-right text-stone-400/50 font-serif text-xs tracking-wider">
							2
						</div>

						<div
							ref={featuresTitleRef}
							className="mb-16 text-center"
						>
							<h2
								className="mb-6 font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Everything You Need to Transform Learning
							</h2>
							<p
								className="mx-auto max-w-2xl text-lg text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Our intelligent platform handles everything from
								transcription to narrative creation
							</p>
						</div>
						<div
							ref={featureCardsRef}
							className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
						>
							<Card className="book-shadow border-stone-200/50 bg-white/95 hover:bg-white transition-all hover:border-stone-300/50">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<Upload className="size-6 text-stone-700" />
									</div>
									<CardTitle className="font-serif text-stone-900">
										Easy Upload
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Upload audio recordings, video lectures,
										or text notes. We support multiple
										formats and automatically transcribe
										your content.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="book-shadow border-stone-200/50 bg-white/95 hover:bg-white transition-all hover:border-stone-300/50">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<Wand2 className="size-6 text-stone-700" />
									</div>
									<CardTitle className="font-serif text-stone-900">
										AI-Powered Analysis
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Our agents understand context, extract
										key concepts, and identify narrative
										opportunities in your educational
										content.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="book-shadow border-stone-200/50 bg-white/95 hover:bg-white transition-all hover:border-stone-300/50">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<BookOpen className="size-6 text-stone-700" />
									</div>
									<CardTitle className="font-serif text-stone-900">
										Novel Generation
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Watch as your studies transform into
										compelling narratives with rich
										characters, engaging plots, and vivid
										storytelling.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="book-shadow border-stone-200/50 bg-white/95 hover:bg-white transition-all hover:border-stone-300/50">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<FileText className="size-6 text-stone-700" />
									</div>
									<CardTitle className="font-serif text-stone-900">
										Multiple Formats
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Export your novels in various
										formats—PDF, EPUB, or continue editing
										in our platform.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="book-shadow border-stone-200/50 bg-white/95 hover:bg-white transition-all hover:border-stone-300/50">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<Zap className="size-6 text-stone-700" />
									</div>
									<CardTitle className="font-serif text-stone-900">
										Fast Processing
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Get your novel ready in minutes, not
										days. Our optimized AI pipeline delivers
										results quickly.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="book-shadow border-stone-200/50 bg-white/95 hover:bg-white transition-all hover:border-stone-300/50">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50">
										<Sparkles className="size-6 text-stone-700" />
									</div>
									<CardTitle className="font-serif text-stone-900">
										Customizable Style
									</CardTitle>
									<CardDescription
										className="text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Choose your narrative style, genre, and
										tone. Make each novel uniquely yours
										while preserving your original content.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works Section - Book Chapter */}
			<section
				id="how-it-works"
				className="border-y border-stone-200/40 book-page py-20 md:py-32"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						{/* Page number */}
						<div className="mb-4 text-right text-stone-400/50 font-serif text-xs tracking-wider">
							3
						</div>

						<div ref={howItWorksRef} className="mb-16 text-center">
							<h2
								className="mb-6 font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								How It Works
							</h2>
							<p
								className="mx-auto max-w-2xl text-lg text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Three simple steps from your studies to a
								published novel
							</p>
						</div>
						<div className="mx-auto max-w-4xl">
							<div
								ref={stepsRef}
								className="grid gap-12 md:grid-cols-3"
							>
								<div className="relative">
									{/* Decorative line like book margin */}
									<div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-stone-200/40" />
									<div
										className="mb-6 flex size-14 items-center justify-center rounded-full border-2 border-stone-300 bg-stone-50 text-xl font-bold text-stone-700"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										1
									</div>
									<h3 className="mb-3 font-serif text-2xl font-semibold text-stone-900">
										Upload Your Content
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Upload your recorded classes, lecture
										notes, or study materials. Our platform
										supports audio, video, and text formats.
									</p>
								</div>
								<div className="relative">
									<div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-stone-200/40" />
									<div
										className="mb-6 flex size-14 items-center justify-center rounded-full border-2 border-stone-300 bg-stone-50 text-xl font-bold text-stone-700"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										2
									</div>
									<h3 className="mb-3 font-serif text-2xl font-semibold text-stone-900">
										AI Agents Work Their Magic
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Our intelligent agents analyze your
										content, extract themes, and craft a
										cohesive narrative structure that
										transforms learning into storytelling.
									</p>
								</div>
								<div className="relative">
									<div className="absolute -left-8 top-0 bottom-0 w-0.5 bg-stone-200/40" />
									<div
										className="mb-6 flex size-14 items-center justify-center rounded-full border-2 border-stone-300 bg-stone-50 text-xl font-bold text-stone-700"
										style={{
											fontFamily: 'var(--font-playfair)',
										}}
									>
										3
									</div>
									<h3 className="mb-3 font-serif text-2xl font-semibold text-stone-900">
										Receive Your Novel
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Download your completed novel, review
										and edit as needed, and share your
										transformed learning journey with the
										world.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="book-page py-20 md:py-32">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						{/* Page number */}
						<div className="mb-4 text-right text-stone-400/50 font-serif text-xs tracking-wider">
							4
						</div>

						<div ref={benefitsRef} className="mb-16 text-center">
							<h2
								className="mb-6 font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Why Choose Studies to Stories?
							</h2>
						</div>
						<div
							ref={benefitsItemsRef}
							className="grid gap-8 md:grid-cols-2"
						>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-7 shrink-0 text-stone-600" />
								<div>
									<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
										Preserve Your Learning
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Transform your educational journey into
										a lasting narrative that you can revisit
										and share.
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-7 shrink-0 text-stone-600" />
								<div>
									<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
										Enhance Understanding
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										The narrative format helps reinforce
										concepts and makes complex topics more
										accessible.
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-7 shrink-0 text-stone-600" />
								<div>
									<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
										Save Time
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										No need to manually write or structure
										your content. Our AI handles the heavy
										lifting.
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-7 shrink-0 text-stone-600" />
								<div>
									<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
										Creative Expression
									</h3>
									<p
										className="leading-relaxed text-stone-600"
										style={{
											fontFamily: 'var(--font-crimson)',
										}}
									>
										Express your learning journey in a
										creative, engaging format that goes
										beyond traditional notes.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section - Final Page */}
			<section
				id="get-started"
				className="border-t border-stone-200/40 book-page py-20 md:py-32"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-2xl">
						{/* Page number */}
						<div className="mb-4 text-right text-stone-400/50 font-serif text-xs tracking-wider">
							5
						</div>

						<div
							ref={finalCtaRef}
							className="book-shadow rounded-xl bg-white/90 backdrop-blur-sm p-8 md:p-12 border border-stone-200/50 text-center"
						>
							<h2
								className="mb-6 font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Ready to Transform Your Studies?
							</h2>
							<p
								className="mb-10 text-lg leading-relaxed text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Join thousands of students and educators turning
								their learning into compelling narratives. Start
								your free trial today.
							</p>
							<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
								<Button
									size="lg"
									className="w-full bg-stone-900 text-white hover:bg-stone-800 sm:w-auto shadow-sm"
									asChild
								>
									<Link href="/signup">
										Start Free Trial
										<ArrowRight className="ml-2 size-4" />
									</Link>
								</Button>
								<Button
									size="lg"
									variant="outline"
									className="w-full border-stone-300 text-stone-700 hover:bg-stone-50 sm:w-auto"
									asChild
								>
									<Link href="/demo">Watch Demo</Link>
								</Button>
							</div>
							<p
								className="mt-8 text-sm text-stone-500"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								No credit card required • Free 14-day trial •
								Cancel anytime
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
