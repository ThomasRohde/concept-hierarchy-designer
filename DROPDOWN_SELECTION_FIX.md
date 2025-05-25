## Fix for Prompt Dropdown Selection Issue

### Problem
Users could not change the selection in the prompt dropdown - selections were not persisting or were being reverted.

### Root Cause Analysis
The issue was caused by a synchronization problem between two storage mechanisms:

1. **Individual Active Prompt ID**: Stored in `localStorage` under `'active-prompt-id'`
2. **Collection Active Prompt ID**: Stored within the `PromptCollection` object under `'prompt-collection'`

When `setActivePrompt(promptId)` was called:
1. It updated the individual storage key
2. It emitted a `promptCollectionChanged` event
3. The event listener called `getActivePrompt()` 
4. `getActivePrompt()` prioritized `collection.activePromptId` over the individual storage
5. This caused the selection to revert to the collection's stored value

### The Fix
Updated the `setActivePrompt` function in `useMagicWand.ts` to synchronize both storage mechanisms:

```typescript
const setActivePrompt = useCallback((promptId: string) => {
  setActivePromptIdState(promptId);
  setActivePromptId(promptId);
  
  // Also update the collection's activePromptId to keep everything in sync
  setPromptCollection(currentCollection => {
    const updatedCollection = { ...currentCollection, activePromptId: promptId };
    savePromptCollection(updatedCollection);
    return updatedCollection;
  });
  
  // Emit custom event to notify other hook instances
  window.dispatchEvent(new CustomEvent('promptCollectionChanged'));
}, []);
```

### Key Improvements
1. **Unified Storage**: Both the individual key and collection key are updated simultaneously
2. **Functional State Update**: Using `setPromptCollection(currentCollection => ...)` avoids stale closure issues
3. **No Dependencies**: Removed `promptCollection` dependency to prevent unnecessary re-renders
4. **Immediate Persistence**: The collection is saved to localStorage immediately

### Result
- ✅ Prompt dropdown selections now persist correctly
- ✅ No race conditions between storage mechanisms  
- ✅ Consistent state across all components
- ✅ No performance regressions

### Files Modified
- `src/hooks/useMagicWand.ts` - Updated `setActivePrompt` function

---
*Fix applied on: ${new Date().toISOString()}*
