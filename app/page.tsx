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

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Hero animations
			if (
				badgeRef.current &&
				titleRef.current &&
				subtitleRef.current &&
				ctaRef.current
			) {
				const tl = gsap.timeline();
				tl.from(badgeRef.current, {
					opacity: 0,
					y: -20,
					duration: 0.6,
					ease: 'power3.out',
				})
					.from(
						titleRef.current,
						{
							opacity: 0,
							y: 30,
							duration: 0.8,
							ease: 'power3.out',
						},
						'-=0.3',
					)
					.from(
						subtitleRef.current,
						{
							opacity: 0,
							y: 20,
							duration: 0.6,
							ease: 'power3.out',
						},
						'-=0.4',
					)
					.from(
						ctaRef.current.children,
						{
							opacity: 0,
							y: 20,
							duration: 0.5,
							stagger: 0.1,
							ease: 'power3.out',
						},
						'-=0.3',
					);

				// Add subtle floating animation to sparkles icon
				gsap.to(badgeRef.current?.querySelector('svg'), {
					rotation: 360,
					duration: 20,
					repeat: -1,
					ease: 'none',
				});

				// Animate background blobs
				const blobs = heroRef.current?.querySelectorAll(
					'.absolute.rounded-full',
				);
				if (blobs) {
					gsap.to(blobs, {
						x: (i) => (i % 2 === 0 ? 30 : -30),
						y: (i) => (i % 2 === 0 ? -30 : 30),
						duration: 8,
						repeat: -1,
						yoyo: true,
						ease: 'sine.inOut',
						stagger: 0.5,
					});
				}
			}

			// Features section
			if (featuresTitleRef.current) {
				gsap.from(featuresTitleRef.current.children, {
					opacity: 0,
					y: 30,
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
				gsap.from(featureCardsRef.current.children, {
					opacity: 0,
					y: 50,
					scale: 0.9,
					duration: 0.6,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: featureCardsRef.current,
						start: 'top 80%',
					},
				});

				// Add hover animations to feature cards
				Array.from(featureCardsRef.current.children).forEach((card) => {
					const cardElement = card as HTMLElement;
					const iconContainer =
						cardElement.querySelector('[class*="size-12"]');

					cardElement.addEventListener('mouseenter', () => {
						gsap.to(cardElement, {
							y: -8,
							scale: 1.02,
							duration: 0.3,
							ease: 'power2.out',
						});
						if (iconContainer) {
							gsap.to(iconContainer, {
								rotation: 180,
								scale: 1.1,
								duration: 0.5,
								ease: 'back.out(1.7)',
							});
						}
					});
					cardElement.addEventListener('mouseleave', () => {
						gsap.to(cardElement, {
							y: 0,
							scale: 1,
							duration: 0.3,
							ease: 'power2.out',
						});
						if (iconContainer) {
							gsap.to(iconContainer, {
								rotation: 0,
								scale: 1,
								duration: 0.3,
								ease: 'power2.out',
							});
						}
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
					duration: 0.8,
					stagger: 0.2,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: stepsRef.current,
						start: 'top 80%',
					},
				});

				// Animate step numbers
				gsap.from(
					stepsRef.current.querySelectorAll('div > div:first-child'),
					{
						scale: 0,
						rotation: -180,
						duration: 0.6,
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
					duration: 0.6,
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
					duration: 0.5,
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

				// Pulse animation for CTA buttons
				const buttons = finalCtaRef.current.querySelectorAll('a');
				gsap.to(buttons[0], {
					scale: 1.05,
					duration: 2,
					repeat: -1,
					yoyo: true,
					ease: 'power2.inOut',
				});
			}
		});

		return () => ctx.revert();
	}, []);

	return (
		<div className="flex min-h-screen flex-col">
			{/* Hero Section */}
			<section
				ref={heroRef}
				className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/20 py-20 md:py-32"
			>
				{/* Animated background elements */}
				<div className="absolute inset-0 -z-10">
					<div className="absolute left-1/4 top-1/4 size-64 rounded-full bg-primary/5 blur-3xl" />
					<div className="absolute right-1/4 bottom-1/4 size-96 rounded-full bg-primary/5 blur-3xl" />
				</div>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl text-center">
						<div
							ref={badgeRef}
							className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm"
						>
							<Sparkles className="size-4 text-primary" />
							<span className="text-muted-foreground">
								Powered by AI Agents
							</span>
						</div>
						<h1
							ref={titleRef}
							className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
						>
							Turn Your{' '}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Studies
							</span>{' '}
							Into{' '}
							<span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
								Stories
							</span>
						</h1>
						<p
							ref={subtitleRef}
							className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
						>
							Transform your recorded classes and notes into
							captivating novels. Our AI agents analyze your
							content and craft engaging narratives that bring
							your learning to life.
						</p>
						<div
							ref={ctaRef}
							className="flex flex-col items-center justify-center gap-4 sm:flex-row"
						>
							<Button
								size="lg"
								className="w-full sm:w-auto"
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
								className="w-full sm:w-auto"
								asChild
							>
								<Link href="#how-it-works">
									See How It Works
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 md:py-32">
				<div className="container mx-auto px-4">
					<div ref={featuresTitleRef} className="mb-16 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Everything You Need to Transform Learning
						</h2>
						<p className="mx-auto max-w-2xl text-muted-foreground">
							Our intelligent platform handles everything from
							transcription to narrative creation
						</p>
					</div>
					<div
						ref={featureCardsRef}
						className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
					>
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Upload className="size-6 text-primary" />
								</div>
								<CardTitle>Easy Upload</CardTitle>
								<CardDescription>
									Upload audio recordings, video lectures, or
									text notes. We support multiple formats and
									automatically transcribe your content.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Wand2 className="size-6 text-primary" />
								</div>
								<CardTitle>AI-Powered Analysis</CardTitle>
								<CardDescription>
									Our agents understand context, extract key
									concepts, and identify narrative
									opportunities in your educational content.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<BookOpen className="size-6 text-primary" />
								</div>
								<CardTitle>Novel Generation</CardTitle>
								<CardDescription>
									Watch as your studies transform into
									compelling narratives with rich characters,
									engaging plots, and vivid storytelling.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<FileText className="size-6 text-primary" />
								</div>
								<CardTitle>Multiple Formats</CardTitle>
								<CardDescription>
									Export your novels in various formats—PDF,
									EPUB, or continue editing in our platform.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Zap className="size-6 text-primary" />
								</div>
								<CardTitle>Fast Processing</CardTitle>
								<CardDescription>
									Get your novel ready in minutes, not days.
									Our optimized AI pipeline delivers results
									quickly.
								</CardDescription>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader>
								<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
									<Sparkles className="size-6 text-primary" />
								</div>
								<CardTitle>Customizable Style</CardTitle>
								<CardDescription>
									Choose your narrative style, genre, and
									tone. Make each novel uniquely yours while
									preserving your original content.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				id="how-it-works"
				className="border-y bg-muted/30 py-20 md:py-32"
			>
				<div className="container mx-auto px-4">
					<div ref={howItWorksRef} className="mb-16 text-center">
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							How It Works
						</h2>
						<p className="mx-auto max-w-2xl text-muted-foreground">
							Three simple steps from your studies to a published
							novel
						</p>
					</div>
					<div className="mx-auto max-w-4xl">
						<div
							ref={stepsRef}
							className="grid gap-8 md:grid-cols-3"
						>
							<div className="relative">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">
									1
								</div>
								<h3 className="mb-2 text-xl font-semibold">
									Upload Your Content
								</h3>
								<p className="text-muted-foreground">
									Upload your recorded classes, lecture notes,
									or study materials. Our platform supports
									audio, video, and text formats.
								</p>
							</div>
							<div className="relative">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">
									2
								</div>
								<h3 className="mb-2 text-xl font-semibold">
									AI Agents Work Their Magic
								</h3>
								<p className="text-muted-foreground">
									Our intelligent agents analyze your content,
									extract themes, and craft a cohesive
									narrative structure that transforms learning
									into storytelling.
								</p>
							</div>
							<div className="relative">
								<div className="mb-4 flex size-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">
									3
								</div>
								<h3 className="mb-2 text-xl font-semibold">
									Receive Your Novel
								</h3>
								<p className="text-muted-foreground">
									Download your completed novel, review and
									edit as needed, and share your transformed
									learning journey with the world.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-20 md:py-32">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl">
						<div ref={benefitsRef} className="mb-16 text-center">
							<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
								Why Choose Studies to Stories?
							</h2>
						</div>
						<div
							ref={benefitsItemsRef}
							className="grid gap-6 md:grid-cols-2"
						>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-6 shrink-0 text-primary" />
								<div>
									<h3 className="mb-2 font-semibold">
										Preserve Your Learning
									</h3>
									<p className="text-muted-foreground">
										Transform your educational journey into
										a lasting narrative that you can revisit
										and share.
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-6 shrink-0 text-primary" />
								<div>
									<h3 className="mb-2 font-semibold">
										Enhance Understanding
									</h3>
									<p className="text-muted-foreground">
										The narrative format helps reinforce
										concepts and makes complex topics more
										accessible.
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-6 shrink-0 text-primary" />
								<div>
									<h3 className="mb-2 font-semibold">
										Save Time
									</h3>
									<p className="text-muted-foreground">
										No need to manually write or structure
										your content. Our AI handles the heavy
										lifting.
									</p>
								</div>
							</div>
							<div className="flex gap-4">
								<CheckCircle2 className="mt-1 size-6 shrink-0 text-primary" />
								<div>
									<h3 className="mb-2 font-semibold">
										Creative Expression
									</h3>
									<p className="text-muted-foreground">
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

			{/* CTA Section */}
			<section
				id="get-started"
				className="border-t bg-gradient-to-b from-muted/50 to-background py-20 md:py-32"
			>
				<div className="container mx-auto px-4">
					<div
						ref={finalCtaRef}
						className="mx-auto max-w-2xl text-center"
					>
						<h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
							Ready to Transform Your Studies?
						</h2>
						<p className="mb-8 text-lg text-muted-foreground">
							Join thousands of students and educators turning
							their learning into compelling narratives. Start
							your free trial today.
						</p>
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								className="w-full sm:w-auto"
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
								className="w-full sm:w-auto"
								asChild
							>
								<Link href="/demo">Watch Demo</Link>
							</Button>
						</div>
						<p className="mt-6 text-sm text-muted-foreground">
							No credit card required • Free 14-day trial • Cancel
							anytime
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
