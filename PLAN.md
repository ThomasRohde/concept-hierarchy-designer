# Capability Card Implementation Plan

## Overview
This plan outlines the implementation approach for adding BIZBOK-style capability cards to the concept hierarchy designer application. The capability card will provide a detailed view of a selected node along with its children and grandchildren in a responsive layout.

## Goals
- Allow users to view a detailed capability card for any node in the hierarchy
- Make the capability card accessible from both the burger menu (for root node) and directly from node cards in the tree view
- Ensure the card is responsive and displays well on various screen sizes
- Follow the BIZBOK standard for capability card content and structure

## Technical Requirements

### Data Model Extensions
1. Extend the existing `NodeData` interface to support additional capability card fields:
   ```typescript
   interface CapabilityCardData extends NodeData {
     outcomes?: string[];
     keyMetrics?: {
       customer?: string[];
       process?: string[];
       learning?: string[];
       finance?: string[];
     };
     source?: string;
     people?: string[];
     process?: string[];
     technology?: string[];
     maturity?: {
       people: number; // 1-5 scale
       process: number;
       data: number;
       tech: number;
     };
     strategyAlignment?: string[];
   }
   ```

### Component Structure
1. Create a new `CapabilityCard` component
2. Create a `CapabilityTile` sub-component for rendering individual capability tiles
3. Implement a modal/page container for displaying the capability card
4. Add navigation controls to access the capability card

## Implementation Steps

### Phase 1: Core Component Development
1. Create the base `CapabilityCard` component implementing the algorithm from the reference document
   - Set up the responsive grid layout
   - Implement the data preparation functions
   - Create the three-generation view (current node, children, grandchildren)

2. Implement the `CapabilityTile` component
   - Design the tile layout (header, body, footer)
   - Implement maturity visualization
   - Add styling for different levels in the hierarchy

3. Add a resize observer to handle responsive layout changes

### Phase 2: Integration with Existing UI
1. Add a "View Capability Card" button to each node in the tree view
   - Position the button in a convenient location on node cards
   - Add appropriate icon and tooltip

2. Add an entry in the burger menu to view the capability card for the root node
   - Create a menu item with descriptive text
   - Add an appropriate icon

3. Implement the modal/page container for displaying the capability card
   - Create an overlay or dedicated route
   - Add close/back button
   - Ensure proper sizing and scrolling behavior

### Phase 3: Data Management
1. Update the data store to handle extended node data for capability cards
2. Create forms/UIs for editing the additional capability card fields
3. Implement persistence and retrieval of extended data

### Phase 4: Polish and Refinement
1. Implement maturity visualization with color-coding
2. Add heat-map mode for strategic importance visualization
3. Add navigation between related capabilities
4. Improve print/export functionality for capability cards

## UI/UX Flow
1. **Access Points:**
   - User clicks on "View Capability Card" button on a node in the tree view
   - User selects "View Root Capability Card" from the burger menu

2. **Card Display:**
   - Modal/page opens showing the capability card for the selected node
   - Card displays the selected node prominently at the top
   - Children nodes display in the middle row
   - Grandchildren nodes display in the bottom row
   - Layout automatically adjusts based on available screen space

3. **Interaction:**
   - User can click on child/grandchild nodes to navigate to their capability cards
   - User can close the card to return to the tree view
   - Optional: User can edit capability information directly on the card (if editing permissions exist)

## Implementation Timeline
1. **Week 1:** Core component development
   - Build basic `CapabilityCard` and `CapabilityTile` components
   - Implement responsive layout algorithm

2. **Week 2:** UI integration
   - Add access points in the UI
   - Create modal/page container
   - Connect to the data store

3. **Week 3:** Extended data and refinement
   - Implement extended data model
   - Add editing capabilities
   - Final styling and testing

## Testing Approach
1. **Unit Tests:**
   - Test data preparation functions
   - Validate layout calculations

2. **Integration Tests:**
   - Verify proper display of multi-generation capability cards
   - Test responsiveness across different screen sizes

3. **User Acceptance Testing:**
   - Validate that the card matches BIZBOK standards
   - Ensure the information is presented clearly and efficiently
   - Test navigation between capability cards

## Future Enhancements
1. Export capability cards to PDF/image formats
2. Add capability comparison view
3. Implement strategic importance heat maps
4. Integrate with external business architecture tools
5. Add version history tracking for capability evolution
