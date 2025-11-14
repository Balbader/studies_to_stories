'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import gsap from 'gsap';

export default function Navbar() {
	const navRef = useRef<HTMLElement>(null);
	const logoRef = useRef<HTMLDivElement>(null);
	const linksRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const ctx = gsap.context(() => {
			// Animate navbar on mount
			if (navRef.current) {
				gsap.from(navRef.current, {
					y: -100,
					opacity: 0,
					duration: 0.8,
					ease: 'power3.out',
				});
			}

			// Stagger animation for nav items
			if (logoRef.current) {
				gsap.from(logoRef.current, {
					opacity: 0,
					x: -20,
					duration: 0.6,
					ease: 'power2.out',
					delay: 0.2,
				});
			}

			if (linksRef.current) {
				gsap.from(linksRef.current.children, {
					opacity: 0,
					y: -10,
					duration: 0.5,
					stagger: 0.1,
					ease: 'power2.out',
					delay: 0.3,
				});
			}

			if (buttonRef.current) {
				gsap.from(buttonRef.current, {
					opacity: 0,
					x: 20,
					scale: 0.9,
					duration: 0.6,
					ease: 'back.out(1.7)',
					delay: 0.4,
				});
			}
		});

		// Scroll-triggered navbar background change
		let lastScroll = 0;
		const handleScroll = () => {
			if (!navRef.current) return;

			const currentScroll = window.scrollY;

			if (currentScroll > 50) {
				gsap.to(navRef.current, {
					backgroundColor: 'rgba(255, 255, 255, 0.95)',
					backdropFilter: 'blur(12px)',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					duration: 0.3,
					ease: 'power2.out',
				});
			} else {
				gsap.to(navRef.current, {
					backgroundColor: 'rgba(255, 255, 255, 0.8)',
					backdropFilter: 'blur(8px)',
					boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
					duration: 0.3,
					ease: 'power2.out',
				});
			}

			// Hide/show navbar on scroll direction
			if (currentScroll > lastScroll && currentScroll > 100) {
				gsap.to(navRef.current, {
					y: -100,
					duration: 0.3,
					ease: 'power2.inOut',
				});
			} else {
				gsap.to(navRef.current, {
					y: 0,
					duration: 0.3,
					ease: 'power2.inOut',
				});
			}
			lastScroll = currentScroll;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });

		return () => {
			ctx.revert();
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<nav
			ref={navRef}
			className="fixed top-0 left-0 right-0 z-50 border-b border-stone-200/50 bg-white/80 backdrop-blur-md transition-all duration-300"
		>
			<div className="container mx-auto px-4">
				<div className="flex h-16 items-center justify-between md:h-20">
					{/* Logo */}
					<div ref={logoRef}>
						<Link
							href="/"
							className="flex items-center gap-2 group"
						>
							<div className="flex size-10 items-center justify-center rounded-lg bg-stone-100/80 border border-stone-200/50 group-hover:bg-stone-200/80 transition-colors overflow-hidden">
								<Image
									src="/book.gif"
									alt="Studies to Stories Logo"
									width={40}
									height={40}
									className="object-contain"
									unoptimized
								/>
							</div>
							<span
								className="font-serif text-xl font-bold text-stone-900 sm:text-2xl"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Studies to Stories
							</span>
						</Link>
					</div>

					{/* Navigation Links */}
					<div
						ref={linksRef}
						className="hidden items-center gap-6 md:flex"
					>
						<Link
							href="#features"
							className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-900"
						>
							Features
						</Link>
						<Link
							href="#how-it-works"
							className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-900"
						>
							How It Works
						</Link>
						<Link
							href="/story"
							className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-900"
						>
							Get Started
						</Link>
						<Link
							href="#for-educators"
							className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-900"
						>
							For Educators
						</Link>
						<Link
							href="/for-schools"
							className="text-sm font-medium text-stone-700 transition-colors hover:text-stone-900"
						>
							For Schools
						</Link>
					</div>

					{/* CTA Button */}
					<div ref={buttonRef}>
						<Button
							asChild
							size="lg"
							className="bg-stone-900 text-white hover:bg-stone-800 shadow-sm"
						>
							<Link
								href="/story"
								className="flex items-center gap-2"
							>
								<Sparkles className="size-4" />
								<span>Create Story</span>
							</Link>
						</Button>
					</div>
				</div>
			</div>
		</nav>
	);
}
