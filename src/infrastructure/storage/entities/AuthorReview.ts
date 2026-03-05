import type { VideoReview } from './VideoReview';

/**
 * AuthorReview entity
 */

export interface AuthorReview {
	authorUrl: string; // Primary key
	authorName: string;
	reviews: VideoReview[];
}
