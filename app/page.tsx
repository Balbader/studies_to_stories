'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/home/Navbar';
import {
	BookOpen,
	Sparkles,
	Users,
	BarChart3,
	Brain,
	Video,
	Headphones,
	FileText,
	CheckCircle2,
	ArrowRight,
	GraduationCap,
	TrendingUp,
	MessageSquare,
	Target,
	ClipboardCheck,
	Lightbulb,
	Zap,
	PlayCircle,
	BookMarked,
	Mic,
	Film,
	Search,
	Users2,
	ChartLine,
	AlertCircle,
	Star,
	Rocket,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function page() {
	const heroRef = useRef<HTMLDivElement>(null);
	const featuresRef = useRef<HTMLDivElement>(null);
	const studentToolsRef = useRef<HTMLDivElement>(null);
	const teacherToolsRef = useRef<HTMLDivElement>(null);
	const howItWorksRef = useRef<HTMLDivElement>(null);
	const benefitsRef = useRef<HTMLDivElement>(null);
	const ctaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Hero animations
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

			// Features section
			if (featuresRef.current) {
				gsap.from(featuresRef.current.children, {
					opacity: 0,
					y: 50,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: featuresRef.current,
						start: 'top 80%',
					},
				});
			}

			// Student tools section
			if (studentToolsRef.current) {
				gsap.from(studentToolsRef.current.children, {
					opacity: 0,
					x: -50,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: studentToolsRef.current,
						start: 'top 80%',
					},
				});
			}

			// Teacher tools section
			if (teacherToolsRef.current) {
				gsap.from(teacherToolsRef.current.children, {
					opacity: 0,
					x: 50,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: teacherToolsRef.current,
						start: 'top 80%',
					},
				});
			}

			// How it works section
			if (howItWorksRef.current) {
				gsap.from(howItWorksRef.current.children, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.15,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: howItWorksRef.current,
						start: 'top 80%',
					},
				});
			}

			// Benefits section
			if (benefitsRef.current) {
				gsap.from(benefitsRef.current.children, {
					opacity: 0,
					scale: 0.9,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: benefitsRef.current,
						start: 'top 80%',
					},
				});
			}

			// CTA section
			if (ctaRef.current) {
				gsap.from(ctaRef.current.children, {
					opacity: 0,
					y: 30,
					duration: 0.8,
					stagger: 0.1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: ctaRef.current,
						start: 'top 80%',
					},
				});
			}
		});

		return () => ctx.revert();
	}, []);

	return (
		<div className="min-h-screen w-full book-page">
			<Navbar />
			{/* Hero Section */}
			<section
				ref={heroRef}
				className="relative overflow-hidden border-b border-stone-200/40 pt-24 pb-16 md:pt-32 md:pb-24"
			>
				{/* Book binding decoration */}
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />
				<div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-stone-400/30 via-stone-300/20 to-stone-400/30" />
				<div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30" />
				<div className="container mx-auto px-4 relative z-10">
					<div className="mx-auto max-w-4xl text-center">
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white/80 backdrop-blur-sm px-5 py-2 text-sm shadow-sm">
							<GraduationCap className="size-4 text-blue-600" />
							<span className="text-stone-700 font-medium">
								Transform Education with AI
							</span>
						</div>
						<h1
							className="mb-6 font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl lg:text-7xl"
							style={{ fontFamily: 'var(--font-playfair)' }}
						>
							Your Agentic Teaching
							<br />
							<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
								Assistant Platform
							</span>
						</h1>
						<p
							className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-stone-600 sm:text-xl"
							style={{ fontFamily: 'var(--font-crimson)' }}
						>
							Record every class, generate correlated content in 4
							formats, and empower both teachers and students with
							powerful AI-driven tools for enhanced learning
							experiences.
						</p>
						<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
							<Button
								asChild
								size="lg"
								className="bg-stone-900 text-white hover:bg-stone-800 shadow-lg"
							>
								<Link
									href="/story"
									className="flex items-center gap-2"
								>
									<Rocket className="size-4" />
									Get Started Free
								</Link>
							</Button>
							<Button
								asChild
								size="lg"
								variant="outline"
								className="border-stone-300 bg-white/80"
							>
								<Link
									href="#how-it-works"
									className="flex items-center gap-2"
								>
									<PlayCircle className="size-4" />
									Watch Demo
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Four Content Formats Section */}
			<section
				ref={featuresRef}
				id="content-formats"
				className="py-16 md:py-24 book-page border-b border-stone-200/40"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<div className="text-center mb-12">
							<h2
								className="mb-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Four Correlated Content Formats
							</h2>
							<p
								className="mx-auto max-w-2xl text-lg text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Every class recording automatically generates
								content in multiple formats, all perfectly
								synchronized and correlated for comprehensive
								learning.
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							<Card className="border-stone-200/50 bg-gradient-to-br from-blue-50/50 to-blue-100/30 hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100 border border-blue-200">
										<FileText className="size-6 text-blue-600" />
									</div>
									<CardTitle className="text-stone-900">
										Enhanced Lesson
									</CardTitle>
									<CardDescription className="text-stone-600">
										AI-enhanced study materials with
										real-world examples, metaphors, and
										interactive activities
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-purple-50/50 to-purple-100/30 hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100 border border-purple-200">
										<BookOpen className="size-6 text-purple-600" />
									</div>
									<CardTitle className="text-stone-900">
										Novel Format
									</CardTitle>
									<CardDescription className="text-stone-600">
										Engaging stories that transform lessons
										into memorable narratives with
										characters and plotlines
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-pink-50/50 to-pink-100/30 hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-pink-100 border border-pink-200">
										<Headphones className="size-6 text-pink-600" />
									</div>
									<CardTitle className="text-stone-900">
										Audible Format
									</CardTitle>
									<CardDescription className="text-stone-600">
										Audio versions perfect for learning on
										the go, with natural narration and
										engaging storytelling
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-orange-50/50 to-orange-100/30 hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100 border border-orange-200">
										<Film className="size-6 text-orange-600" />
									</div>
									<CardTitle className="text-stone-900">
										Netflix Series Style
									</CardTitle>
									<CardDescription className="text-stone-600">
										Binge-worthy educational series with
										episodes, cliffhangers, and cinematic
										storytelling
									</CardDescription>
								</CardHeader>
							</Card>
						</div>

						<div className="mt-8 text-center">
							<p className="text-sm text-stone-500">
								<CheckCircle2 className="inline size-4 mr-1 text-green-600" />
								All formats are automatically synchronized and
								correlated from the same class recording
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Student Tools Section */}
			<section
				ref={studentToolsRef}
				id="for-students"
				className="py-16 md:py-24 book-page border-b border-stone-200/40"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<div className="text-center mb-12">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white/80 backdrop-blur-sm px-5 py-2 text-sm">
								<Users className="size-4 text-blue-600" />
								<span className="text-stone-700 font-medium">
									For Students
								</span>
							</div>
							<h2
								className="mb-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Empower Your Learning Journey
							</h2>
							<p
								className="mx-auto max-w-2xl text-lg text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Interactive tools designed to help you master
								every lesson through multiple learning
								modalities
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<Card className="border-stone-200/50 bg-white hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100 border border-blue-200">
										<ClipboardCheck className="size-6 text-blue-600" />
									</div>
									<CardTitle className="text-stone-900">
										Knowledge Testing
									</CardTitle>
									<CardDescription className="text-stone-600">
										Interactive quizzes and assessments
										based on the series you watched. Test
										your understanding with adaptive
										questions
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-stone-600">
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>
												Adaptive question difficulty
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>
												Instant feedback and
												explanations
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Progress tracking</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border-stone-200/50 bg-white hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100 border border-purple-200">
										<Users2 className="size-6 text-purple-600" />
									</div>
									<CardTitle className="text-stone-900">
										Peer-to-Peer Learning
									</CardTitle>
									<CardDescription className="text-stone-600">
										Connect with classmates, form study
										groups, and learn together through
										collaborative features
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-stone-600">
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Study group formation</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>
												Peer discussions and Q&A
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>
												Collaborative note-taking
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border-stone-200/50 bg-white hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-pink-100 border border-pink-200">
										<Search className="size-6 text-pink-600" />
									</div>
									<CardTitle className="text-stone-900">
										Smart Search & Review
									</CardTitle>
									<CardDescription className="text-stone-600">
										Quickly find specific topics across all
										formats. Jump to exact moments in
										videos, audio, or text
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-stone-600">
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Cross-format search</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>
												Bookmark important moments
											</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>
												Personalized review sessions
											</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border-stone-200/50 bg-white hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100 border border-green-200">
										<Brain className="size-6 text-green-600" />
									</div>
									<CardTitle className="text-stone-900">
										AI Study Assistant
									</CardTitle>
									<CardDescription className="text-stone-600">
										Get instant answers to questions,
										concept explanations, and personalized
										study recommendations
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-stone-600">
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>24/7 AI tutor support</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Concept clarification</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Study plan generation</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border-stone-200/50 bg-white hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100 border border-orange-200">
										<TrendingUp className="size-6 text-orange-600" />
									</div>
									<CardTitle className="text-stone-900">
										Progress Dashboard
									</CardTitle>
									<CardDescription className="text-stone-600">
										Track your learning progress, see your
										strengths and areas for improvement with
										visual analytics
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-stone-600">
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Learning analytics</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Performance insights</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Achievement badges</span>
										</li>
									</ul>
								</CardContent>
							</Card>

							<Card className="border-stone-200/50 bg-white hover:shadow-lg transition-all duration-300">
								<CardHeader>
									<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-indigo-100 border border-indigo-200">
										<MessageSquare className="size-6 text-indigo-600" />
									</div>
									<CardTitle className="text-stone-900">
										Interactive Discussions
									</CardTitle>
									<CardDescription className="text-stone-600">
										Engage in class discussions, ask
										questions, and participate in
										peer-reviewed activities
									</CardDescription>
								</CardHeader>
								<CardContent>
									<ul className="space-y-2 text-sm text-stone-600">
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Real-time Q&A</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Discussion forums</span>
										</li>
										<li className="flex items-start gap-2">
											<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
											<span>Peer feedback system</span>
										</li>
									</ul>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* Teacher Tools Section */}
			<section
				ref={teacherToolsRef}
				id="for-teachers"
				className="py-16 md:py-24 book-page border-b border-stone-200/40"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<div className="text-center mb-12">
							<div className="mb-4 inline-flex items-center gap-2 rounded-full border border-stone-200/60 bg-white/80 backdrop-blur-sm px-5 py-2 text-sm">
								<GraduationCap className="size-4 text-purple-600" />
								<span className="text-stone-700 font-medium">
									For Teachers
								</span>
							</div>
							<h2
								className="mb-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Comprehensive Teaching Analytics
							</h2>
							<p
								className="mx-auto max-w-2xl text-lg text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Powerful insights and tools to help you
								understand your students better and improve
								teaching effectiveness
							</p>
						</div>

						<Tabs defaultValue="analytics" className="w-full">
							<TabsList className="mb-8 w-full justify-start bg-stone-100/50 border border-stone-200/50">
								<TabsTrigger
									value="analytics"
									className="data-[state=active]:bg-white data-[state=active]:text-stone-900"
								>
									<BarChart3 className="mr-2 size-4" />
									Analytics
								</TabsTrigger>
								<TabsTrigger
									value="performance"
									className="data-[state=active]:bg-white data-[state=active]:text-stone-900"
								>
									<TrendingUp className="mr-2 size-4" />
									Performance
								</TabsTrigger>
								<TabsTrigger
									value="insights"
									className="data-[state=active]:bg-white data-[state=active]:text-stone-900"
								>
									<Lightbulb className="mr-2 size-4" />
									Insights
								</TabsTrigger>
							</TabsList>

							<TabsContent value="analytics" className="mt-0">
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-blue-100 border border-blue-200">
												<BarChart3 className="size-6 text-blue-600" />
											</div>
											<CardTitle className="text-stone-900">
												Class Analytics
											</CardTitle>
											<CardDescription className="text-stone-600">
												Comprehensive overview of class
												engagement, participation, and
												content consumption patterns
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Engagement metrics
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Content format
														preferences
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Time spent per topic
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-purple-100 border border-purple-200">
												<Users className="size-6 text-purple-600" />
											</div>
											<CardTitle className="text-stone-900">
												Student Participation
											</CardTitle>
											<CardDescription className="text-stone-600">
												Track individual and group
												participation in discussions,
												quizzes, and peer activities
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Discussion contributions
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Quiz completion rates
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Peer interaction metrics
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-pink-100 border border-pink-200">
												<ChartLine className="size-6 text-pink-600" />
											</div>
											<CardTitle className="text-stone-900">
												Learning Trends
											</CardTitle>
											<CardDescription className="text-stone-600">
												Identify learning patterns,
												popular topics, and areas where
												students spend the most time
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Topic popularity
														analysis
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Learning velocity
														tracking
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Content effectiveness
														metrics
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							<TabsContent value="performance" className="mt-0">
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-green-100 border border-green-200">
												<Target className="size-6 text-green-600" />
											</div>
											<CardTitle className="text-stone-900">
												Individual Performance
											</CardTitle>
											<CardDescription className="text-stone-600">
												Detailed performance tracking
												for each student with strengths,
												weaknesses, and progress over
												time
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Test and quiz scores
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Assignment completion
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Progress reports
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-orange-100 border border-orange-200">
												<Star className="size-6 text-orange-600" />
											</div>
											<CardTitle className="text-stone-900">
												Class Comparisons
											</CardTitle>
											<CardDescription className="text-stone-600">
												Compare performance across
												different classes, identify best
												practices, and benchmark results
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Class-wide statistics
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Peer group analysis
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Historical comparisons
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-indigo-100 border border-indigo-200">
												<TrendingUp className="size-6 text-indigo-600" />
											</div>
											<CardTitle className="text-stone-900">
												Growth Tracking
											</CardTitle>
											<CardDescription className="text-stone-600">
												Monitor student improvement over
												time, celebrate achievements,
												and identify areas needing
												attention
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Learning curve analysis
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Milestone achievements
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Predictive analytics
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							<TabsContent value="insights" className="mt-0">
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-red-100 border border-red-200">
												<AlertCircle className="size-6 text-red-600" />
											</div>
											<CardTitle className="text-stone-900">
												Pain Point Detection
											</CardTitle>
											<CardDescription className="text-stone-600">
												AI-powered identification of
												concepts students struggle with,
												allowing for targeted
												intervention
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Struggle area
														identification
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Common misconception
														alerts
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Early warning system
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-yellow-100 border border-yellow-200">
												<Lightbulb className="size-6 text-yellow-600" />
											</div>
											<CardTitle className="text-stone-900">
												Teaching Recommendations
											</CardTitle>
											<CardDescription className="text-stone-600">
												AI suggestions for improving
												teaching methods based on
												student performance and
												engagement data
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Content optimization
														tips
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Engagement strategies
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Intervention suggestions
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>

									<Card className="border-stone-200/50 bg-white">
										<CardHeader>
											<div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-teal-100 border border-teal-200">
												<Zap className="size-6 text-teal-600" />
											</div>
											<CardTitle className="text-stone-900">
												Automated Insights
											</CardTitle>
											<CardDescription className="text-stone-600">
												Get weekly and monthly reports
												with key insights, trends, and
												actionable recommendations
											</CardDescription>
										</CardHeader>
										<CardContent>
											<ul className="space-y-2 text-sm text-stone-600">
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Weekly summary reports
													</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>Trend analysis</span>
												</li>
												<li className="flex items-start gap-2">
													<CheckCircle2 className="size-4 text-green-600 mt-0.5 shrink-0" />
													<span>
														Actionable insights
													</span>
												</li>
											</ul>
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section
				ref={howItWorksRef}
				id="how-it-works"
				className="py-16 md:py-24 book-page border-b border-stone-200/40"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<div className="text-center mb-12">
							<h2
								className="mb-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								How It Works
							</h2>
							<p
								className="mx-auto max-w-2xl text-lg text-stone-600"
								style={{ fontFamily: 'var(--font-crimson)' }}
							>
								Simple, automated, and powerful. Transform your
								classes into engaging learning experiences in
								just a few steps.
							</p>
						</div>

						<div className="grid gap-8 md:grid-cols-4">
							<div className="text-center">
								<div className="mb-4 mx-auto flex size-16 items-center justify-center rounded-full bg-blue-100 border-4 border-blue-200">
									<Video className="size-8 text-blue-600" />
								</div>
								<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
									Record Class
								</h3>
								<p className="text-stone-600">
									Automatically record your class sessions.
									Our AI captures everything - audio, video,
									and screen content.
								</p>
							</div>

							<div className="text-center">
								<div className="mb-4 mx-auto flex size-16 items-center justify-center rounded-full bg-purple-100 border-4 border-purple-200">
									<Sparkles className="size-8 text-purple-600" />
								</div>
								<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
									AI Processing
								</h3>
								<p className="text-stone-600">
									Our agentic AI processes the recording and
									generates all 4 content formats
									automatically, all perfectly correlated.
								</p>
							</div>

							<div className="text-center">
								<div className="mb-4 mx-auto flex size-16 items-center justify-center rounded-full bg-pink-100 border-4 border-pink-200">
									<BookOpen className="size-8 text-pink-600" />
								</div>
								<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
									Content Available
								</h3>
								<p className="text-stone-600">
									Students access Enhanced lessons, Novels,
									Audible versions, and Netflix-style series -
									all synchronized.
								</p>
							</div>

							<div className="text-center">
								<div className="mb-4 mx-auto flex size-16 items-center justify-center rounded-full bg-green-100 border-4 border-green-200">
									<BarChart3 className="size-8 text-green-600" />
								</div>
								<h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
									Track & Improve
								</h3>
								<p className="text-stone-600">
									Monitor student progress, identify pain
									points, and get insights to improve teaching
									effectiveness.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Benefits Section */}
			<section
				ref={benefitsRef}
				id="benefits"
				className="py-16 md:py-24 book-page border-b border-stone-200/40"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-6xl">
						<div className="text-center mb-12">
							<h2
								className="mb-4 font-serif text-3xl font-bold text-stone-900 sm:text-4xl md:text-5xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Why Choose Studies to Stories?
							</h2>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							<Card className="border-stone-200/50 bg-gradient-to-br from-blue-50/50 to-white">
								<CardHeader>
									<CheckCircle2 className="mb-2 size-6 text-blue-600" />
									<CardTitle className="text-stone-900">
										Multi-Format Learning
									</CardTitle>
									<CardDescription className="text-stone-600">
										Cater to different learning styles with
										text, audio, video, and narrative
										formats - all from one class recording.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-purple-50/50 to-white">
								<CardHeader>
									<CheckCircle2 className="mb-2 size-6 text-purple-600" />
									<CardTitle className="text-stone-900">
										Automated Content Creation
									</CardTitle>
									<CardDescription className="text-stone-600">
										Save hours of preparation time. Our AI
										handles content generation, leaving you
										to focus on teaching.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-pink-50/50 to-white">
								<CardHeader>
									<CheckCircle2 className="mb-2 size-6 text-pink-600" />
									<CardTitle className="text-stone-900">
										Data-Driven Insights
									</CardTitle>
									<CardDescription className="text-stone-600">
										Make informed decisions with
										comprehensive analytics on student
										performance and engagement.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-green-50/50 to-white">
								<CardHeader>
									<CheckCircle2 className="mb-2 size-6 text-green-600" />
									<CardTitle className="text-stone-900">
										Engagement Boost
									</CardTitle>
									<CardDescription className="text-stone-600">
										Transform dry lessons into engaging
										series that students actually want to
										watch and learn from.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-orange-50/50 to-white">
								<CardHeader>
									<CheckCircle2 className="mb-2 size-6 text-orange-600" />
									<CardTitle className="text-stone-900">
										Personalized Learning
									</CardTitle>
									<CardDescription className="text-stone-600">
										AI-powered recommendations help students
										focus on areas they need most, at their
										own pace.
									</CardDescription>
								</CardHeader>
							</Card>

							<Card className="border-stone-200/50 bg-gradient-to-br from-indigo-50/50 to-white">
								<CardHeader>
									<CheckCircle2 className="mb-2 size-6 text-indigo-600" />
									<CardTitle className="text-stone-900">
										Collaborative Environment
									</CardTitle>
									<CardDescription className="text-stone-600">
										Foster peer-to-peer learning with
										built-in discussion forums, study
										groups, and collaborative tools.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section
				ref={ctaRef}
				className="py-16 md:py-24 bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white"
			>
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-4xl text-center">
						<h2
							className="mb-6 font-serif text-3xl font-bold sm:text-4xl md:text-5xl"
							style={{ fontFamily: 'var(--font-playfair)' }}
						>
							Ready to Transform Your Classroom?
						</h2>
						<p
							className="mb-8 text-lg text-stone-300 sm:text-xl"
							style={{ fontFamily: 'var(--font-crimson)' }}
						>
							Join schools already using Studies to Stories to
							create engaging,
							<br />
							multi-format learning experiences that students
							love.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
