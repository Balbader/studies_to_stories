'use client';

import UploadComponent from '@/components/story/UploadComponent';

export default function Story() {
	const handleFileSelect = (file: File) => {
		console.log('File selected:', file.name);
		// TODO: Handle file upload/processing here
	};

	return (
		<div className="container mx-auto py-8 px-4 max-w-2xl">
			<h1 className="text-3xl font-bold mb-6">Upload Your Document</h1>
			<UploadComponent onFileSelect={handleFileSelect} />
		</div>
	);
}
