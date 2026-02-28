/**
 * VideoReview entity
 */

export interface VideoReview {
	videoUrl: string; // 50-100 characters
	videoTitle: string; // 100-200 characters
	rating: number; // 1-5 stars
	skipped: boolean;
	comment: string; // 100-200 characters
	lastUpdated: number; // Timestamp
}
