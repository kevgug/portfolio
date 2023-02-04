export interface ImageOptions {
	src: string;
	avifSrc?: string;
	webpSrc?: string;
	alt: string;
	loading?: "eager" | "lazy";
}