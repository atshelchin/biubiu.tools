// Main coordinator worker that manages multiple sub-workers
class ValidationCoordinator {
    constructor() {
        this.workers = [];
        this.activeJobs = new Map();
        this.completedBatches = 0;
        this.totalBatches = 0;
        this.totalKeys = 0;
        this.processedKeys = 0;
        this.results = {
            validWallets: [],
            invalidKeys: []
        };
        this.onProgressCallback = null;
        this.resolveCallback = null;
        this.cancelled = false;
    }

    // Initialize workers based on available CPU cores
    initializeWorkers() {
        // Get number of logical processors
        const numCores = navigator.hardwareConcurrency || 4;

        // Use min 2, max (cores - 2) workers, with absolute max of 16
        const numWorkers = Math.min(16, Math.max(2, numCores - 2));

        console.log(`Initializing ${numWorkers} worker threads (detected ${numCores} cores)`);

        for (let i = 0; i < numWorkers; i++) {
            const worker = new Worker('/wallet-validator-sub-worker.js');

            worker.addEventListener('message', (e) => {
                this.handleWorkerMessage(e.data, i);
            });

            worker.addEventListener('error', (error) => {
                console.error(`Worker ${i} error:`, error);
                this.handleWorkerError(i);
            });

            this.workers.push({
                id: i,
                worker,
                busy: false,
                processedCount: 0
            });
        }

        return numWorkers;
    }

    // Handle messages from sub-workers
    handleWorkerMessage(message, workerId) {
        const { type, data } = message;

        if (type === 'BATCH_COMPLETE') {
            // Collect results
            this.results.validWallets.push(...data.validWallets);
            this.results.invalidKeys.push(...data.invalidKeys);

            // Update progress
            this.completedBatches++;
            this.processedKeys += data.batchSize;
            const progress = (this.processedKeys / this.totalKeys) * 100;

            // Mark worker as available
            const worker = this.workers[workerId];
            worker.busy = false;
            worker.processedCount += data.batchSize;

            // Remove from active jobs
            this.activeJobs.delete(workerId);

            // Report detailed progress
            if (this.onProgressCallback) {
                this.onProgressCallback({
                    progress,
                    processedKeys: this.processedKeys,
                    totalKeys: this.totalKeys,
                    validCount: this.results.validWallets.length,
                    invalidCount: this.results.invalidKeys.length
                });
            }

            // Check if all batches are complete
            if (this.completedBatches >= this.totalBatches) {
                this.completeValidation();
            } else {
                // Assign next batch to this worker
                this.assignNextBatch(workerId);
            }
        } else if (type === 'BATCH_ERROR') {
            console.error(`Worker ${workerId} batch error:`, data.error);
            this.handleWorkerError(workerId);
        }
    }

    // Handle worker errors
    handleWorkerError(workerId) {
        const worker = this.workers[workerId];
        worker.busy = false;

        // Try to reassign the batch to another worker
        const job = this.activeJobs.get(workerId);
        if (job) {
            this.activeJobs.delete(workerId);
            this.batchQueue.unshift(job);
            this.assignNextBatch();
        }
    }

    // Validate keys using multiple workers
    async validate(keys, onProgress) {
        this.cancelled = false;
        this.onProgressCallback = onProgress;
        this.completedBatches = 0;
        this.totalKeys = keys.length;
        this.processedKeys = 0;
        this.results = {
            validWallets: [],
            invalidKeys: []
        };

        return new Promise((resolve, reject) => {
            this.resolveCallback = resolve;

            // Initialize workers if not already done
            if (this.workers.length === 0) {
                const numWorkers = this.initializeWorkers();
                self.postMessage({
                    type: 'WORKERS_INITIALIZED',
                    data: { count: numWorkers }
                });
            }

            // Create smaller batches for more frequent progress updates
            const batchSize = Math.ceil(keys.length / (this.workers.length * 50)); // More batches for smoother progress
            const minBatchSize = 100; // Smaller minimum for faster initial feedback
            const maxBatchSize = 5000; // Smaller max for more frequent updates

            const actualBatchSize = Math.max(minBatchSize, Math.min(maxBatchSize, batchSize));

            // Create batch queue
            this.batchQueue = [];
            for (let i = 0; i < keys.length; i += actualBatchSize) {
                this.batchQueue.push({
                    keys: keys.slice(i, i + actualBatchSize),
                    startIndex: i
                });
            }

            this.totalBatches = this.batchQueue.length;
            console.log(`Processing ${keys.length} keys in ${this.totalBatches} batches of ~${actualBatchSize} keys`);

            // Start processing
            this.workers.forEach((worker, index) => {
                this.assignNextBatch(index);
            });
        });
    }

    // Assign next batch to a worker
    assignNextBatch(workerId) {
        if (this.cancelled || this.batchQueue.length === 0) {
            return;
        }

        const worker = this.workers[workerId];
        if (worker.busy) {
            return;
        }

        const batch = this.batchQueue.shift();
        if (!batch) {
            return;
        }

        worker.busy = true;
        this.activeJobs.set(workerId, batch);

        worker.worker.postMessage({
            type: 'VALIDATE_BATCH',
            data: {
                keys: batch.keys,
                startIndex: batch.startIndex,
                workerId
            }
        });
    }

    // Complete validation
    completeValidation() {
        if (this.resolveCallback) {
            // Sort results by original index to maintain order
            this.results.validWallets.sort((a, b) => a.index - b.index);
            this.results.invalidKeys.sort((a, b) => a.index - b.index);

            // Remove index from final results
            const finalResults = {
                validWallets: this.results.validWallets.map(w => ({
                    privateKey: w.privateKey,
                    address: w.address
                })),
                invalidKeys: this.results.invalidKeys.map(k => k.key)
            };

            this.resolveCallback(finalResults);
            this.resolveCallback = null;
        }
    }

    // Cancel validation
    cancel() {
        this.cancelled = true;
        this.batchQueue = [];

        // Clear active jobs
        this.activeJobs.clear();

        // Mark all workers as not busy
        this.workers.forEach(w => {
            w.busy = false;
        });

        if (this.resolveCallback) {
            this.resolveCallback({
                validWallets: [],
                invalidKeys: [],
                cancelled: true
            });
            this.resolveCallback = null;
        }
    }

    // Cleanup workers
    destroy() {
        this.cancel();
        this.workers.forEach(w => {
            w.worker.terminate();
        });
        this.workers = [];
    }
}

// Create coordinator instance
const coordinator = new ValidationCoordinator();

// Handle messages from main thread
self.addEventListener('message', async (e) => {
    const { type, data } = e.data;

    switch (type) {
        case 'VALIDATE':
            const { keys } = data;

            try {
                const result = await coordinator.validate(keys, (progressData) => {
                    self.postMessage({
                        type: 'PROGRESS',
                        data: progressData
                    });
                });

                self.postMessage({
                    type: 'COMPLETE',
                    data: result
                });
            } catch (error) {
                self.postMessage({
                    type: 'ERROR',
                    data: { error: error.message }
                });
            }
            break;

        case 'CANCEL':
            coordinator.cancel();
            self.postMessage({
                type: 'CANCELLED',
                data: {}
            });
            break;

        case 'DESTROY':
            coordinator.destroy();
            break;

        default:
            break;
    }
});