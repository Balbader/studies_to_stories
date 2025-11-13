// Polyfill browser APIs for Node.js environment (required by pdfjs-dist)
// This file MUST be imported before any code that uses pdf-parse or pdfjs-dist

if (typeof window === 'undefined') {
	// Polyfill DOMMatrix
	if (typeof globalThis.DOMMatrix === 'undefined') {
		globalThis.DOMMatrix = class DOMMatrix {
			a = 1;
			b = 0;
			c = 0;
			d = 1;
			e = 0;
			f = 0;
			m11 = 1;
			m12 = 0;
			m21 = 0;
			m22 = 1;
			m41 = 0;
			m42 = 0;

			constructor(init?: string | number[]) {
				if (init) {
					// Minimal parsing - just enough to not crash
				}
			}

			static fromMatrix() {
				return new DOMMatrix();
			}

			static fromFloat32Array() {
				return new DOMMatrix();
			}

			multiply() {
				return new DOMMatrix();
			}

			translate() {
				return new DOMMatrix();
			}

			scale() {
				return new DOMMatrix();
			}

			rotate() {
				return new DOMMatrix();
			}

			inverse() {
				return new DOMMatrix();
			}
		} as any;
	}

	// Polyfill ImageData
	if (typeof globalThis.ImageData === 'undefined') {
		globalThis.ImageData = class ImageData {
			data: Uint8ClampedArray;
			width: number;
			height: number;

			constructor(
				dataOrWidth: Uint8ClampedArray | number,
				height?: number,
			) {
				if (typeof dataOrWidth === 'number') {
					this.width = dataOrWidth;
					this.height = height || 0;
					this.data = new Uint8ClampedArray(
						dataOrWidth * (height || 0) * 4,
					);
				} else {
					this.data = dataOrWidth;
					this.width = height || 0;
					this.height = dataOrWidth.length / ((height || 0) * 4);
				}
			}
		} as any;
	}

	// Polyfill Path2D
	if (typeof globalThis.Path2D === 'undefined') {
		globalThis.Path2D = class Path2D {
			// Minimal implementation for pdfjs-dist
			// Most methods are not needed for text extraction
		} as any;
	}
}
