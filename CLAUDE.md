# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Concept

This is a React TypeScript PWA for creating and managing hierarchical concept maps with AI-powered generation capabilities. Users build tree structures of concepts, then use AI prompts to generate child concepts. The app supports offline functionality, multiple export formats, and comprehensive keyboard navigation.

## Key Development Commands

- `npm run dev` - Start development server (Vite on localhost:5173)
- `npm run build` - Production build
- `npm run build-preview` - Preview build for testing
- `npm run preview` - Build and serve preview locally
- `npm run deploy` - Build and deploy to GitHub Pages

## Architecture Overview

### State Management
- **TreeContext** (`src/context/TreeContext.tsx`): Central state management for the tree data and UI state
  - Manages `nodes` (NodeData[]) and `collapsed` (Set<string>) state
  - Implements auto-saving with debouncing (1 second delay)
  - Handles initialization from localStorage/IndexedDB with fallback to initial data
  - Custom setters automatically persist changes to storage

### Data Layer
- **Types** (`src/types.ts`): Core data structures
  - `NodeData`: Tree node with id, name, description, parent relationship
  - `Prompt`: AI prompt configuration with metadata and usage tracking
  - `PromptCollection`: Container for prompts with active selection
- **Storage Strategy**: Dual storage system
  - **localStorage**: Legacy support and fallback
  - **IndexedDB**: Primary storage via `src/utils/offlineStorage.ts`
  - Automatic migration from localStorage to IndexedDB on first load

### Key Components Architecture
- **App.tsx** → **AppRouter.tsx**: Minimal root, router provides TreeProvider context
- **Layout.tsx**: Main layout wrapper with navigation
- **HomePage**: Primary interface with tree view and controls
- **VirtualizedTree**: High-performance tree rendering with react-window
- **NodeRow**: Individual tree node with drag-drop, edit, and magic wand capabilities

### AI Integration (Magic Wand)
- **useMagicWand hook** (`src/hooks/useMagicWand.ts`): Manages prompt system
- **Multiple prompts support**: Users can create/manage different AI generation strategies
- **Workflow**: Select node → Choose prompt → Copy to clipboard → Paste AI response
- **Prompt categories**: general, academic, business, creative, technical

### Export System
- **modular exporters** in `src/utils/exportUtils/`: SVG, PNG, PDF, HTML, JSON
- **Capability cards**: Special 3-generation view export format
- **Export triggers**: Both from tree controls and capability card modal

## Development Patterns

### Component Organization
- **Pages/**: Route-level components (HomePage, AboutPage, PromptsPage, AdminPage)
- **ui/**: Reusable UI primitives (Button, Modal, Input, etc.)
- **Layout/**: Layout-specific components
- Root level: Feature-specific components (modals, specialized controls)

### State Updates
- Always use TreeContext setters, never direct state mutation
- Context setters automatically handle persistence
- Loading states (`isLoading`, `isInitializing`) prevent premature saves

### Storage Operations
- Use `offlineStorage.ts` utilities for persistence
- Handle both IndexedDB and localStorage scenarios
- Migration happens automatically on app initialization

### PWA Features
- Service worker in `public/sw.js`
- Offline queue system for background sync
- Database debugging tools in admin page
- Workbox integration for caching strategies

## Critical Implementation Notes

### Tree Data Integrity
- Parent-child relationships maintained via `parent` field in NodeData
- Tree utilities in `src/utils/treeUtils.ts` handle tree operations safely
- Drag-drop operations must preserve tree structure validity

### Auto-Save Behavior
- TreeContext implements 1-second debounced auto-save
- Manual saves on window close/component unmount
- Separate save streams for tree data and UI state (collapsed nodes)

### Keyboard Navigation
- Full arrow key navigation implemented in `src/hooks/useKeyboardNavigation.ts`
- Visual selection state independent of focus
- Modal shortcuts (Ctrl+Enter to submit, ESC to cancel)

### Performance Considerations
- Virtualized rendering for large trees via react-window
- Debounced save operations to prevent excessive storage writes
- Efficient tree traversal algorithms in treeUtils

## Testing & Debugging

### Admin Tools
- Admin page (`/admin`) provides database debugging interface
- IndexedDB viewer for inspecting stored data
- Database diagnostic and repair utilities

### Storage Debugging
- Detailed console logging in TreeContext for storage operations
- Migration status logging in offlineStorage utilities
- Storage prefix utilities for environment-specific data isolation