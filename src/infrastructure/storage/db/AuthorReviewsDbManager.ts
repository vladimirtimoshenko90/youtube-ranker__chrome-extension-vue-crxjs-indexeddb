import { AUTHOR_REVIEWS_DB_CONFIG } from './AuthorReviewsDbConfig';

/**
 * Manages IndexedDB connection and initialization for AuthorReviews
 */
export class AuthorReviewsDbManager {
	private _instance: IDBDatabase | null = null;
	private _initPromise: Promise<IDBDatabase> | null = null;

	/**
	 * Get the database instance, initializes if needed
	 * Handles concurrent calls by reusing the same initialization promise
	 */
	async getDB(): Promise<IDBDatabase> {
		if (this._instance) {
			return this._instance;
		}

		// If initialization is already in progress, wait for it
		if (this._initPromise) {
			return this._initPromise;
		}

		// Start initialization and cache the promise for concurrent calls
		this._initPromise = new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(AUTHOR_REVIEWS_DB_CONFIG.name, AUTHOR_REVIEWS_DB_CONFIG.version);

			request.onerror = () => {
				reject(new Error(`Failed to open IndexedDB: ${request.error}`));
			};

			request.onsuccess = () => {
				this._instance = request.result;
				resolve(this._instance);
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

		return this._initPromise;
	}

	/**
	 * Close the database connection
	 */
	close(): void {
		if (this._instance) {
			this._instance.close();
			this._instance = null;
			this._initPromise = null;
		}
	}
}

/**
 * Singleton instance
 */
export const dbManager = new AuthorReviewsDbManager();
