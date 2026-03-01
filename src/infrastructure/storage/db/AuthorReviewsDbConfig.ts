/**
 * Database configuration type definition for AuthorReviews store
 */
export interface AuthorReviewsDbConfig {
	name: string;
	version: number;
	stores: {
		authorReviews: {
			keyPath: string;
			indexes: { name: string; keyPath: string; options?: IDBIndexParameters }[];
		};
	};
}

/**
 * IndexedDB configuration for youtube-ranker extension
 */
export const AUTHOR_REVIEWS_DB_CONFIG: AuthorReviewsDbConfig = {
	name: 'authorReviewsDb',
	version: 3,
	stores: {
		authorReviews: {
			keyPath: 'authorUrl',
			indexes: [
				{
					name: 'lastUpdated',
					keyPath: 'lastUpdated',
					options: { unique: false }
				},
				{
					name: 'authorName',
					keyPath: 'authorName',
					options: { unique: false }
				},
				{
					name: 'videoUrl',
					keyPath: 'reviews.videoUrl',
					options: { unique: true }
				}
			]
		}
	}
};
