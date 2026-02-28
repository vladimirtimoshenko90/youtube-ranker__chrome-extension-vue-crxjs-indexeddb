import type { AuthorReview } from '../../infrastructure/storage';

/**
 * In-memory cache for author reviews to reduce database queries
 * Caches both existing authors and null values to avoid repeated DB queries
 */
class AuthorReviewsCache {
	private _cache = new Map<string, AuthorReview | null>();

	/**
	 * Get author from cache
	 * Returns undefined if not cached, null if cached as non-existent, or AuthorReview if cached
	 */
	get(authorUrl: string): AuthorReview | null | undefined {
		return this._cache.has(authorUrl) ? (this._cache.get(authorUrl) ?? null) : undefined;
	}

	/**
	 * Get author from cache or fetch using callback if not cached
	 * If cache miss, calls the callback to fetch/compute the value, caches it, and returns it
	 */
	async getOrAdd(authorUrl: string, getData: () => Promise<AuthorReview | null>): Promise<AuthorReview | null> {
		const cached = this.get(authorUrl);
		if (cached !== undefined) {
			return cached;
		}

		const author = await getData();
		this._cache.set(authorUrl, author);
		return author;
	}

	/**
	 * Upsert author in cache (update if exists, insert if not)
	 * Stores both AuthorReview objects and null values
	 */
	upsert(authorUrl: string, author: AuthorReview | null): void {
		this._cache.set(authorUrl, author);
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
