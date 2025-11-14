import type { Metadata } from 'next';
import {
	Geist,
	Geist_Mono,
	Playfair_Display,
	Crimson_Pro,
	Caveat,
} from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

const playfairDisplay = Playfair_Display({
	variable: '--font-playfair',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

const crimsonPro = Crimson_Pro({
	variable: '--font-crimson',
	subsets: ['latin'],
	weight: ['400', '500', '600'],
});

const caveat = Caveat({
	variable: '--font-handwritten',
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Studies to Stories - Transform Your Learning Into Novels',
	description:
		'Turn your recorded classes and notes into captivating novels with AI-powered agents. Transform your educational journey into compelling narratives.',
	icons: {
		icon: '/book.png',
		shortcut: '/book.png',
		apple: '/book.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${crimsonPro.variable} ${caveat.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
