import { AUTHOR_REVIEWS_DB_CONFIG } from './AuthorReviewsDbConfig';

/**
 * Manages IndexedDB connection and initialization for AuthorReviews
 */
export class AuthorReviewsDbManager {
	private db: IDBDatabase | null = null;

	/**
	 * Initialize and open the IndexedDB database
	 */
	async init(): Promise<IDBDatabase> {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(AUTHOR_REVIEWS_DB_CONFIG.name, AUTHOR_REVIEWS_DB_CONFIG.version);

			request.onerror = () => {
				reject(new Error(`Failed to open IndexedDB: ${request.error}`));
			};

			request.onsuccess = () => {
				this.db = request.result;
				resolve(this.db);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;

				// Create stores
				if (!db.objectStoreNames.contains('authorReviews')) {
					const store = db.createObjectStore('authorReviews', {
						keyPath: AUTHOR_REVIEWS_DB_CONFIG.stores.authorReviews.keyPath
					});

					// Create indexes
					for (const index of AUTHOR_REVIEWS_DB_CONFIG.stores.authorReviews.indexes) {
						store.createIndex(index.name, index.keyPath, index.options);
					}
				}
			};
		});
	}

	/**
	 * Get the database instance, initializes if needed
	 */
	async getDB(): Promise<IDBDatabase> {
		if (!this.db) {
			await this.init();
		}
		return this.db!;
	}

	/**
	 * Close the database connection
	 */
	close(): void {
		if (this.db) {
			this.db.close();
			this.db = null;
		}
	}
}

/**
 * Singleton instance
 */
export const dbManager = new AuthorReviewsDbManager();
