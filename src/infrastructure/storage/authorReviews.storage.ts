import type { AuthorReview } from './entities/AuthorReview';
import type { VideoReview } from './entities/VideoReview';
import { dbManager } from './db/AuthorReviewsDbManager';

/**
 * Provides storage operations for AuthorReview records in IndexedDB
 */
export class AuthorReviewsStorage {
	private storeName = 'authorReviews';

	/**
	 * Get an author review by URL
	 */
	async getAuthor(authorUrl: string): Promise<AuthorReview | null> {
		const db = await dbManager.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readonly');
			const store = transaction.objectStore(this.storeName);
			const request = store.get(authorUrl);

			request.onerror = () => {
				reject(new Error(`Failed to get author: ${request.error}`));
			};

			request.onsuccess = () => {
				resolve(request.result || null);
			};
		});
	}

	/**
	 * Delete an author review by URL
	 */
	async deleteAuthor(authorUrl: string): Promise<void> {
		const db = await dbManager.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);
			const request = store.delete(authorUrl);

			request.onerror = () => {
				reject(new Error(`Failed to delete author: ${request.error}`));
			};

			request.onsuccess = () => {
				resolve();
			};
		});
	}

	/**
	 * Upsert a video review for an author
	 * If author doesn't exist, creates it with the video review
	 * If author exists, adds or updates the video review
	 */
	async upsertVideoReview(authorUrl: string, authorName: string, videoReview: VideoReview): Promise<void> {
		let author = await this.getAuthor(authorUrl);

		if (!author) {
			// Create new author with this video review
			author = {
				authorUrl,
				authorName,
				lastUpdated: Date.now(),
				reviews: [videoReview]
			};
		} else {
			// Update existing author - add or update video review
			const videoIndex = author.reviews.findIndex((v) => v.videoUrl === videoReview.videoUrl);
			if (videoIndex >= 0) {
				// Update existing video review
				author.reviews[videoIndex] = {
					...author.reviews[videoIndex],
					...videoReview,
					lastUpdated: Date.now()
				};
			} else {
				// Add new video review
				author.reviews.push(videoReview);
			}
			author.lastUpdated = Date.now();
		}

		await this.upsertAuthorReview(author);
	}

	/**
	 * Delete a video review from an author
	 * If this is the last video review, removes the author entirely
	 */
	async deleteVideoReview(authorUrl: string, videoUrl: string): Promise<void> {
		const author = await this.getAuthor(authorUrl);
		if (!author) {
			throw new Error(`Author not found: ${authorUrl}`);
		}

		// Remove the video review
		author.reviews = author.reviews.filter((v) => v.videoUrl !== videoUrl);
		author.lastUpdated = Date.now();

		// If no reviews left, delete the author entirely
		if (author.reviews.length === 0) {
			await this.deleteAuthor(authorUrl);
		} else {
			await this.upsertAuthorReview(author);
		}
	}

	/**
	 * Internal: Add or update an author review record
	 */
	private async upsertAuthorReview(review: AuthorReview): Promise<string> {
		const db = await dbManager.getDB();
		return new Promise((resolve, reject) => {
			const transaction = db.transaction([this.storeName], 'readwrite');
			const store = transaction.objectStore(this.storeName);

			// Use put to insert or update
			const request = store.put(review);

			request.onerror = () => {
				reject(new Error(`Failed to upsert author: ${request.error}`));
			};

			request.onsuccess = () => {
				resolve(request.result as string);
			};
		});
	}
}

// Export singleton instance
export const authorReviewsStorage = new AuthorReviewsStorage();
