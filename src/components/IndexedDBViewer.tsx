import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { DB_NAME } from '../utils/offlineStorage';
import { Button } from './ui/Button';

interface DatabaseRecord {
  key: string;
  value: any;
}

const IndexedDBViewer: React.FC = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDB, setSelectedDB] = useState<string | null>(DB_NAME);
  const [stores, setStores] = useState<string[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [records, setRecords] = useState<DatabaseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // List all databases in the browser
  useEffect(() => {
    const listDatabases = async () => {
      if ('indexedDB' in window) {
        try {
          // @ts-ignore - indexedDB.databases() is not in the TypeScript types but works in modern browsers
          const dbList = await indexedDB.databases();
          const dbNames = dbList.map(db => db.name).filter(Boolean) as string[];
          setDatabases(dbNames);
          if (dbNames.length > 0 && !selectedDB) {
            setSelectedDB(dbNames[0]);
          }
        } catch (err) {
          console.error('Failed to list databases:', err);
          // Fallback to our known database
          setDatabases([DB_NAME]);
        }
      }
    };
    
    listDatabases();
  }, [selectedDB]);

  // Get stores for selected database
  useEffect(() => {
    const getStores = async () => {
      if (!selectedDB) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const db = await openDB(selectedDB);
        const storeNames = Array.from(db.objectStoreNames);
        setStores(storeNames);
        
        if (storeNames.length > 0) {
          setSelectedStore(storeNames[0]);
        } else {
          setSelectedStore(null);
          setRecords([]);
        }
        
        db.close();
      } catch (err) {
        console.error(`Error opening database ${selectedDB}:`, err);
        setError(`Failed to open database: ${err instanceof Error ? err.message : String(err)}`);
        setStores([]);
        setSelectedStore(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    getStores();
  }, [selectedDB]);

  // Get records for selected store
  useEffect(() => {
    const getRecords = async () => {
      if (!selectedDB || !selectedStore) {
        setRecords([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const db = await openDB(selectedDB);
        const tx = db.transaction(selectedStore, 'readonly');
        const store = tx.objectStore(selectedStore);
        
        const allKeys = await store.getAllKeys();
        const allValues = await store.getAll();
        
        const recordsData: DatabaseRecord[] = [];
        for (let i = 0; i < allKeys.length; i++) {
          recordsData.push({
            key: String(allKeys[i]),
            value: allValues[i]
          });
        }
        
        setRecords(recordsData);
        await tx.done;
        db.close();
      } catch (err) {
        console.error(`Error reading from ${selectedStore}:`, err);
        setError(`Failed to read data: ${err instanceof Error ? err.message : String(err)}`);
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    getRecords();
  }, [selectedDB, selectedStore]);

  const refreshData = () => {
    const getStores = async () => {
      if (selectedDB) {
        setIsLoading(true);
        try {
          const db = await openDB(selectedDB);
          setStores(Array.from(db.objectStoreNames));
          db.close();
        } catch (err) {
          setError(`Failed to refresh: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    getStores();
  };

  return (
    <div className="border rounded-md p-4 bg-white">
      <h3 className="text-lg font-medium mb-4">IndexedDB Inspector</h3>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-2 mb-4">
          {error}
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Database</label>
          <div className="flex gap-2">
            <select
              className="border rounded-md p-1 text-sm flex-1"
              value={selectedDB || ''}
              onChange={(e) => setSelectedDB(e.target.value)}
              disabled={isLoading}
            >
              {databases.length === 0 && <option value="">No databases found</option>}
              {databases.map(dbName => (
                <option key={dbName} value={dbName}>{dbName}</option>
              ))}
            </select>
            <Button onClick={refreshData} disabled={isLoading} size="sm">
              Refresh
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Object Store</label>
          <select
            className="border rounded-md p-1 w-full text-sm"
            value={selectedStore || ''}
            onChange={(e) => setSelectedStore(e.target.value)}
            disabled={isLoading || stores.length === 0}
          >
            {stores.length === 0 && <option value="">No stores found</option>}
            {stores.map(storeName => (
              <option key={storeName} value={storeName}>{storeName}</option>
            ))}
          </select>
        </div>
        
        {isLoading && (
          <div className="text-center py-4">
            Loading...
          </div>
        )}
        
        {!isLoading && selectedStore && (
          <div>
            <h4 className="text-sm font-medium mb-2">Records ({records.length})</h4>
            {records.length === 0 ? (
              <div className="text-gray-500 text-sm">No records found</div>
            ) : (
              <div className="overflow-auto max-h-80 border rounded">
                {records.map((record, index) => (
                  <div key={index} className="border-b p-2 text-sm">
                    <div className="font-semibold">{record.key}</div>
                    <div className="mt-1 overflow-hidden text-ellipsis">
                      <pre className="text-xs bg-gray-50 p-1 rounded overflow-auto max-h-40">
                        {JSON.stringify(record.value, null, 2)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IndexedDBViewer;