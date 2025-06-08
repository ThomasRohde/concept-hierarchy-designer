import { addToQueue, getQueue, clearQueue, OfflineQueueItem } from './offlineStorage';

export const enqueueChange = async (type: string, payload: any): Promise<void> => {
  const item: OfflineQueueItem = {
    type,
    payload,
    timestamp: Date.now()
  };
  await addToQueue(item);
};

export const drainQueue = async (): Promise<OfflineQueueItem[]> => {
  const items = await getQueue();
  await clearQueue();
  return items;
};
