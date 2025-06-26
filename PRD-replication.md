# Product Requirements Document - Concept Hierarchy Designer Recreation

## Overview
Rebuild the "Themis" concept hierarchy designer as an offline-first Progressive Web App. Users create, edit, and visualize hierarchical concept trees with the aid of AI-generated suggestions. The application should run entirely in the browser, storing data locally and working offline. Cloud sync via GitHub Gist is **out of scope**.

## Goals
- Allow users to build and reorganize concept trees with drag-and-drop
- Provide AI-assisted generation of child nodes via customizable prompts
- Persist data using browser storage (IndexedDB with localStorage fallback)
- Support offline operation and PWA installation
- Offer exports in common formats (SVG, PNG, PDF, HTML, JSON)
- Deliver a responsive interface with full keyboard navigation

## Non-Goals
- GitHub Gist synchronization or any cloud backup functionality
- Real-time multi-user collaboration
- Advanced authentication beyond optional PAT storage for future expansion

## User Stories
1. **As a user**, I can create and manage a hierarchy of concepts.
2. **As a user**, I can drag nodes to restructure the tree.
3. **As a user**, I can navigate nodes entirely via the keyboard.
4. **As a user**, I can generate child concepts using AI prompts.
5. **As a user**, my trees persist in the browser and load when I return.
6. **As a user**, I can install the app on my device and use it offline.
7. **As a user**, I can export capability cards in multiple formats.

## Functional Requirements
- Tree data model stored in IndexedDB; migrate to localStorage if IndexedDB unavailable.
- Service worker caching for offline usage and PWA install prompts.
- Drag-and-drop interactions for rearranging nodes.
- Keyboard shortcuts for navigation, editing, and trigger actions.
- AI "Magic Wand" system with configurable prompts.
- Markdown-supported node descriptions with rich text formatting and LaTeX math.
- Export utilities for capability cards to SVG, PNG, PDF, HTML, and JSON.

## UX Considerations
- Modern responsive layout with animations.
- Visible offline status indicator.
- Modal dialogs for prompt management and exports.
- Tooltips for node descriptions.
- Accessible design ensuring keyboard-only usability.

## Success Metrics
- Trees persist across browser sessions without account signup.
- PWA installable on Chrome and Safari with offline functionality verified.
- AI-generated suggestions reduce manual node creation by at least 50% in user tests.

