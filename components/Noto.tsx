'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NotoProps {
	className?: string;
}

export default function Noto({ className = '' }: NotoProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLDivElement>(null);
	const eyesRef = useRef<HTMLDivElement>(null);
	const paperclipRef = useRef<HTMLDivElement>(null);
	const bookmarkRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current || !imageRef.current) return;

		const ctx = gsap.context(() => {
			// Base floating animation (continuous, independent of scroll)
			// This will be combined with scroll-based transforms by GSAP
			gsap.to(imageRef.current, {
				y: -15,
				duration: 2.5,
				repeat: -1,
				yoyo: true,
				ease: 'sine.inOut',
			});

			// Scroll-based rotation - varies with scroll position
			ScrollTrigger.create({
				trigger: 'body',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1,
				onUpdate: (self) => {
					const scrollProgress = self.progress;
					// Create a wave-like rotation pattern
					const rotation = Math.sin(scrollProgress * Math.PI * 2) * 8;
					gsap.to(imageRef.current, {
						rotation: rotation,
						duration: 0.3,
					});
				},
			});

			// Horizontal drift based on scroll
			ScrollTrigger.create({
				trigger: 'body',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1.5,
				onUpdate: (self) => {
					const scrollProgress = self.progress;
					// Smooth horizontal movement
					const xMovement = Math.sin(scrollProgress * Math.PI) * 40;
					gsap.to(imageRef.current, {
						x: xMovement,
						duration: 0.3,
					});
				},
			});

			// Scale animation - grows and shrinks with scroll
			ScrollTrigger.create({
				trigger: 'body',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1.2,
				onUpdate: (self) => {
					const scrollProgress = self.progress;
					// Scale between 0.9 and 1.1
					const scale =
						0.9 + Math.sin(scrollProgress * Math.PI) * 0.2;
					gsap.to(imageRef.current, {
						scale: scale,
						duration: 0.3,
					});
				},
			});

			// Eyes blink animation (independent of scroll, but faster when scrolling)
			if (eyesRef.current) {
				const blinkTimeline = gsap.timeline({ repeat: -1 });
				blinkTimeline.to(eyesRef.current, {
					scaleY: 0.05,
					duration: 0.1,
					ease: 'power2.in',
				});
				blinkTimeline.to(eyesRef.current, {
					scaleY: 1,
					duration: 0.15,
					ease: 'power2.out',
				});
				blinkTimeline.to({}, { duration: 3 }); // Wait before next blink
			}

			// Paperclip wiggle - more active when scrolling
			if (paperclipRef.current) {
				ScrollTrigger.create({
					trigger: 'body',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 0.8,
					onUpdate: (self) => {
						const scrollProgress = self.progress;
						const wiggle =
							Math.sin(scrollProgress * Math.PI * 6) * 12;
						gsap.to(paperclipRef.current, {
							rotation: wiggle,
							duration: 0.2,
						});
					},
				});
			}

			// Bookmark flutter - gentle movement
			if (bookmarkRef.current) {
				ScrollTrigger.create({
					trigger: 'body',
					start: 'top top',
					end: 'bottom bottom',
					scrub: 1.3,
					onUpdate: (self) => {
						const scrollProgress = self.progress;
						gsap.to(bookmarkRef.current, {
							rotation:
								Math.sin(scrollProgress * Math.PI * 4) * 6,
							y: Math.cos(scrollProgress * Math.PI * 3) * 10,
							duration: 0.3,
						});
					},
				});
			}

			// Parallax effect on container - moves at different speed than scroll
			ScrollTrigger.create({
				trigger: 'body',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 2.5,
				onUpdate: (self) => {
					const scrollProgress = self.progress;
					// Parallax moves container slower than scroll
					gsap.to(containerRef.current, {
						y: scrollProgress * -40,
						duration: 0.3,
					});
				},
			});

			// Opacity fade based on scroll position
			ScrollTrigger.create({
				trigger: containerRef.current,
				start: 'top 100%',
				end: 'top 50%',
				scrub: true,
				onUpdate: (self) => {
					const progress = self.progress;
					gsap.to(imageRef.current, {
						opacity: 0.6 + progress * 0.4,
						duration: 0.3,
					});
				},
			});

			// Entrance animation when first visible
			ScrollTrigger.create({
				trigger: containerRef.current,
				start: 'top 90%',
				once: true,
				onEnter: () => {
					gsap.fromTo(
						imageRef.current,
						{
							scale: 0.5,
							opacity: 0,
							rotation: -20,
						},
						{
							scale: 1,
							opacity: 1,
							rotation: 0,
							duration: 1,
							ease: 'back.out(1.7)',
						},
					);
				},
			});

			// Subtle tilt based on scroll position (wave pattern)
			ScrollTrigger.create({
				trigger: 'body',
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1.1,
				onUpdate: (self) => {
					const scrollProgress = self.progress;
					// Create a subtle tilt wave
					const tilt = Math.cos(scrollProgress * Math.PI * 2.5) * 3;
					gsap.to(imageRef.current, {
						rotationZ: tilt,
						duration: 0.2,
						ease: 'power2.out',
					});
				},
			});
		}, containerRef);

		return () => ctx.revert();
	}, []);

	return (
		<div
			ref={containerRef}
			className={`relative inline-block ${className}`}
		>
			<div
				ref={imageRef}
				className="relative will-change-transform"
				style={{ transformStyle: 'preserve-3d' }}
			>
				<Image
					src="/DALL·E 2025-11-12 16.00.47 - A cute original character named 'Noto', a whimsical and wise study buddy. Noto is shaped like a hovering note card with soft rounded edges and pastel .webp"
					alt="Noto - Your Study Buddy"
					width={300}
					height={300}
					className="relative z-10 drop-shadow-lg"
					priority
					style={{
						objectFit: 'contain',
					}}
				/>
				{/* Animated elements overlay */}
				<div
					ref={eyesRef}
					className="absolute inset-0 z-20 pointer-events-none"
					style={{
						transformOrigin: 'center 40%',
					}}
				>
					{/* Eyes will be animated via CSS transform */}
				</div>
				<div
					ref={paperclipRef}
					className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
					style={{
						transformOrigin: 'center center',
					}}
				>
					{/* Paperclip area for animation */}
				</div>
				<div
					ref={bookmarkRef}
					className="absolute top-2 right-8 z-20 pointer-events-none"
					style={{
						transformOrigin: 'top center',
					}}
				>
					{/* Bookmark area for animation */}
				</div>
			</div>
		</div>
	);
}
