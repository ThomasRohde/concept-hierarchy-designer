# Product Requirements Document - Real-Time Collaboration

## Overview
Enable multiple users to collaboratively edit a concept hierarchy in real time. Changes should sync instantly across all connected clients with conflict resolution and user presence indicators.

## Goals
- Allow users to share trees with others for simultaneous editing
- Provide visual indicators of other users' selections and edits
- Support basic access control (owner vs. collaborators)
- Maintain smooth performance with optimistic UI updates

## Non-Goals
- Complex role-based permissions beyond owner/collaborator
- Enterprise-level administration tools

## User Stories
1. **As a user**, I can share a tree link with collaborators so they can edit with me live.
2. **As a collaborator**, I see real-time cursors or highlights showing others' selections.
3. **As a user**, I am notified of conflicts and can resolve them seamlessly.
4. **As an owner**, I can revoke access to collaborators at any time.

## Functional Requirements
- WebSocket-based sync service to broadcast node updates, additions, and deletions.
- Presence channel to track active users and their current focus node.
- Locking or merge strategy to resolve simultaneous edits on the same node.
- Shared tree storage in a cloud database with authentication (e.g., Firebase, Supabase).
- Fallback to local storage when offline, syncing once connection is restored.

## UX Considerations
- Display avatars or colored indicators for each active collaborator.
- Smooth, minimal-latency updates to maintain the feeling of live collaboration.
- Notification system for join/leave events and conflict resolution prompts.

## Success Metrics
- Less than 200ms average latency for remote updates.
- At least 95% conflict-free merges during simultaneous editing sessions.
- Positive feedback in user testing around collaborative usability.

