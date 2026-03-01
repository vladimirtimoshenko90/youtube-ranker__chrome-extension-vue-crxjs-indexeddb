import type { AuthorReview } from '../../infrastructure/storage';

/**
 * In-memory cache for author reviews to reduce database queries
 * Caches promises to prevent duplicate DB queries when multiple concurrent requests hit the same key
 */
class AuthorReviewsCache {
	private _cache = new Map<string, Promise<AuthorReview | null>>();

	/**
	 * Get author from cache
	 * Returns cached promise if available, or resolved promise with null if not cached
	 */
	get(authorUrl: string): Promise<AuthorReview | null> {
		return this._cache.get(authorUrl) ?? Promise.resolve(null);
	}

	/**
	 * Get author from cache or fetch using callback if not cached
	 * Caches the promise to ensure concurrent calls share the same DB query
	 * Clears cache on rejection to allow retry on next call
	 */
	getOrAdd(authorUrl: string, getData: () => Promise<AuthorReview | null>): Promise<AuthorReview | null> {
		const cached = this._cache.get(authorUrl);
		if (cached) {
			return cached;
		}

		const promise = getData().catch((error) => {
			// On error, remove from cache to allow retry
			this._cache.delete(authorUrl);
			throw error;
		});
		this._cache.set(authorUrl, promise);

		return promise;
	}

	/**
	 * Upsert author in cache
	 * Stores a resolved value as a cached promise
	 */
	upsert(authorUrl: string, author: AuthorReview | null): void {
		this._cache.set(authorUrl, Promise.resolve(author));
	}

	/**
	 * Remove author from cache
	 */
	remove(authorUrl: string): void {
		this._cache.delete(authorUrl);
	}
}

/**
 * Singleton cache instance
 */
export const authorReviewsCache = new AuthorReviewsCache();
