import React, { useState } from 'react';
import { runDatabaseDiagnostic } from '../utils/dbFixer';
import { Button } from './ui/Button';
import IndexedDBViewer from './IndexedDBViewer';

const DatabaseDebugger: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const handleRunDiagnostic = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      await runDatabaseDiagnostic();
      setResult('Diagnostic completed - check console for details');
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleViewer = () => {
    setShowViewer(prev => !prev);
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">IndexedDB Diagnostics</h3>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          onClick={handleRunDiagnostic}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run Database Diagnostic'}
        </Button>
        
        <Button 
          onClick={handleToggleViewer}
          variant="outline"
        >
          {showViewer ? 'Hide Database Inspector' : 'Show Database Inspector'}
        </Button>
      </div>
      
      {result && (
        <div className="mt-2 p-2 bg-gray-100 rounded mb-4">
          {result}
        </div>
      )}
      
      {!showViewer && (
        <div className="text-sm text-gray-600">
          Open browser console to see detailed diagnostic results
        </div>
      )}
      
      {showViewer && (
        <div className="mt-4">
          <IndexedDBViewer />
        </div>
      )}
    </div>
  );
};

export default DatabaseDebugger;
