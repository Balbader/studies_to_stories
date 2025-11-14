'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
	BookOpen,
	Mail,
	Twitter,
	Linkedin,
	Github,
	Facebook,
	Sparkles,
} from 'lucide-react';

export default function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-stone-200/50 bg-gradient-to-br from-stone-50 to-white">
			<div className="container mx-auto px-4 py-12 md:py-16">
				<div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
					{/* Brand Section */}
					<div className="space-y-4">
						<Link
							href="/"
							className="flex items-center gap-2 group"
						>
							<div className="flex size-10 items-center justify-center rounded-lg overflow-hidden">
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
								className="font-serif text-xl font-bold text-stone-900"
								style={{ fontFamily: 'var(--font-playfair)' }}
							>
								Studies to Stories
							</span>
						</Link>
						<p
							className="text-sm leading-relaxed text-stone-600"
							style={{ fontFamily: 'var(--font-crimson)' }}
						>
							Transforming educational content into engaging
							multi-format learning experiences for students and
							teachers.
						</p>
						<div className="flex items-center gap-4">
							<a
								href="https://twitter.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-stone-400 transition-colors hover:text-stone-900"
								aria-label="Twitter"
							>
								<Twitter className="size-5" />
							</a>
							<a
								href="https://linkedin.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-stone-400 transition-colors hover:text-stone-900"
								aria-label="LinkedIn"
							>
								<Linkedin className="size-5" />
							</a>
							<a
								href="https://github.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-stone-400 transition-colors hover:text-stone-900"
								aria-label="GitHub"
							>
								<Github className="size-5" />
							</a>
							<a
								href="https://facebook.com"
								target="_blank"
								rel="noopener noreferrer"
								className="text-stone-400 transition-colors hover:text-stone-900"
								aria-label="Facebook"
							>
								<Facebook className="size-5" />
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div className="space-y-4">
						<h3
							className="font-serif text-lg font-semibold text-stone-900"
							style={{ fontFamily: 'var(--font-playfair)' }}
						>
							Quick Links
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="/story"
									className="flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									<Sparkles className="size-4" />
									Create Story
								</Link>
							</li>
							<li>
								<Link
									href="#for-students"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									For Students
								</Link>
							</li>
							<li>
								<Link
									href="#for-teachers"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									For Teachers
								</Link>
							</li>
							<li>
								<Link
									href="#content-formats"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Content Formats
								</Link>
							</li>
							<li>
								<Link
									href="#how-it-works"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									How It Works
								</Link>
							</li>
						</ul>
					</div>

					{/* Resources */}
					<div className="space-y-4">
						<h3
							className="font-serif text-lg font-semibold text-stone-900"
							style={{ fontFamily: 'var(--font-playfair)' }}
						>
							Resources
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Documentation
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									API Reference
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Tutorials
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Case Studies
								</Link>
							</li>
						</ul>
					</div>

					{/* Support */}
					<div className="space-y-4">
						<h3
							className="font-serif text-lg font-semibold text-stone-900"
							style={{ fontFamily: 'var(--font-playfair)' }}
						>
							Support
						</h3>
						<ul className="space-y-3">
							<li>
								<Link
									href="#"
									className="flex items-center gap-2 text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									<Mail className="size-4" />
									Contact Us
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Help Center
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									Terms of Service
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="text-sm text-stone-600 transition-colors hover:text-stone-900"
								>
									FAQ
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="mt-12 border-t border-stone-200/50 pt-8">
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<p
							className="text-sm text-stone-500"
							style={{ fontFamily: 'var(--font-crimson)' }}
						>
							&copy; {currentYear} Studies to Stories. All rights
							reserved.
						</p>
						<div className="flex items-center gap-6 text-sm text-stone-500">
							<Link
								href="#"
								className="transition-colors hover:text-stone-900"
							>
								Privacy
							</Link>
							<Link
								href="#"
								className="transition-colors hover:text-stone-900"
							>
								Terms
							</Link>
							<Link
								href="#"
								className="transition-colors hover:text-stone-900"
							>
								Cookies
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
