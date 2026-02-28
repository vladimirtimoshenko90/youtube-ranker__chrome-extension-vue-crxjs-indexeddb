import { AuthorReview } from '@/infrastructure/storage';

export const SERVICE_WORKER_NOTIFICATION_TYPES = {
	AUTHOR_REVIEW_CHANGED: 'authorReviewChanged'
} as const;

export interface AuthorReviewChangedPayload {
	entity: AuthorReview | null;
	authorUrl: string;
}
