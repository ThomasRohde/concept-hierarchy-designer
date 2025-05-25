import { NodeData } from '../types';

export const genId = (): string => Math.random().toString(36).substring(2, 15);

// Create initial data in the flat structure - Comprehensive Documentation
export const createInitialData = (): NodeData[] => {
  // Generate IDs first to establish proper parent-child relationships
  const rootId = genId();
  const coreSystemId = genId();
  const userInterfaceId = genId();
  const dataManagementId = genId();
  const aiIntegrationId = genId();
  const exportSystemId = genId();
  const keyboardNavigationId = genId();
  const dragDropId = genId();
  const utilsId = genId();
  const adminId = genId();
  
  // Level 2 IDs - Core System
  const treeContextId = genId();
  const nodeDataId = genId();
  const stateManagementId = genId();
  
  // Level 2 IDs - User Interface
  const mainContentId = genId();
  const nodeRowId = genId();
  const modalsId = genId();
  const controlsId = genId();
  const layoutId = genId();
  
  // Level 2 IDs - Data Management
  const storageId = genId();
  const importExportId = genId();
  const clipboardId = genId();
  
  // Level 2 IDs - AI Integration
  const magicWandId = genId();
  const promptManagementId = genId();
  
  // Level 2 IDs - Export System
  const capabilityCardsId = genId();
  const formatOptionsId = genId();
  const exportUtilsId = genId();
  
  // Level 2 IDs - Keyboard Navigation
  const navigationHooksId = genId();
  const shortcutsId = genId();
  const accessibilityId = genId();
  
  // Level 2 IDs - Drag and Drop
  const dndSystemId = genId();
  const visualFeedbackId = genId();
  const hierarchyReorganizationId = genId();
  
  // Level 2 IDs - Utils
  const treeUtilsId = genId();
  const validationId = genId();
  const helpersId = genId();
  
  // Level 2 IDs - Admin
  const statisticsId = genId();
  const performanceId = genId();
  const debuggingId = genId();
  
  // Level 3 IDs - Tree Context & State Management
  const nodeArrayId = genId();
  const collapsedStateId = genId();
  const loadingStateId = genId();
  const persistenceId = genId();
  
  // Level 3 IDs - Main Content & UI
  const virtualizationId = genId();
  const renderingId = genId();
  const eventHandlingId = genId();
  const responsiveDesignId = genId();
  
  // Level 3 IDs - Modals
  const addChildModalId = genId();
  const editNodeModalId = genId();
  const confirmDeleteModalId = genId();
  const newTreeModalId = genId();
  const magicWandSettingsModalId = genId();
  const capabilityCardModalId = genId();
  
  // Level 3 IDs - Controls
  const treeControlsId = genId();
  const saveLoadButtonsId = genId();
  const expandCollapseId = genId();
  
  // Level 3 IDs - Node Row Features
  const nodeDisplayId = genId();
  const actionButtonsId = genId();
  const tooltipsId = genId();
  const focusManagementId = genId();
  
  // Level 3 IDs - Magic Wand
  const promptGenerationId = genId();
  const guidelinesId = genId();
  const aiResponseHandlingId = genId();
  const statisticsTrackingId = genId();
  
  // Level 3 IDs - Export Features
  const jsonExportId = genId();
  const htmlExportId = genId();
  
  // Level 3 IDs - Keyboard Navigation
  const arrowKeyNavigationId = genId();
  const expandCollapseKeysId = genId();
  const homeEndKeysId = genId();
  const enterKeyEditingId = genId();
  
  // Level 3 IDs - Clipboard
  const copyOperationsId = genId();
  const pasteOperationsId = genId();
  const branchCopyingId = genId();
  
  return [    // Root Node
    {
      id: rootId,
      name: "🌳 Concept Hierarchy Designer",
      description: "A powerful interactive tool for creating, organizing, and visualizing hierarchical concept maps using AI assistance. Built with React and TypeScript, this application provides an intuitive drag-and-drop interface for managing complex concept hierarchies with unlimited depth. The system features AI-powered content generation through the Magic Wand, comprehensive keyboard navigation, export capabilities in multiple formats, and local storage persistence. Designed for knowledge workers, researchers, educators, and anyone who needs to organize complex information into structured hierarchies.",
      parent: null
    },
      // Level 1 - Main System Components
    {
      id: coreSystemId,
      name: "⚙️ Core System Architecture",
      description: "The foundational architecture of the application built on React 18 with TypeScript for type safety. Implements a context-based state management pattern for tree data, with hooks for business logic separation. The system uses a flat array structure for nodes with parent-child relationships, enabling efficient operations and virtualization for large trees. Features automatic persistence to localStorage and optimized rendering with React.memo and useMemo optimizations.",
      parent: rootId
    },
    {
      id: userInterfaceId,
      name: "🎨 User Interface System",
      description: "Modern, responsive UI built with Tailwind CSS and Framer Motion animations. Features a clean, intuitive design with hover states, transitions, and visual feedback. The interface adapts seamlessly between desktop and tablet views, with optimized touch targets and spacing. Implements consistent design patterns across all components with a focus on usability and accessibility.",
      parent: rootId
    },
    {
      id: dataManagementId,
      name: "💾 Data Management",
      description: "Comprehensive data handling system managing node creation, modification, deletion, and persistence. Implements automatic saving to localStorage with error handling and recovery mechanisms. Features data validation, backup creation, and import/export functionality with support for JSON format. Includes clipboard operations for copying and pasting nodes with full branch structures.",
      parent: rootId
    },    {
      id: aiIntegrationId,
      name: "🤖 AI Integration",
      description: "Advanced AI-powered content generation system featuring a comprehensive multiple prompts architecture. The enhanced 'Magic Wand' tool generates contextually relevant child concepts using MECE principles and customizable prompt strategies. Features a complete prompt management system with 5 built-in prompts (General MECE, Creative Thinking, Technical Systems, Academic Research, Business Strategy), custom prompt creation, usage analytics, prompt switching, and real-time synchronization across all components.",
      parent: rootId
    },
    {
      id: exportSystemId,
      name: "📤 Export System",
      description: "Flexible export system supporting multiple formats including JSON, HTML, PDF, SVG, and PNG. Features specialized capability card exports showing three-generation views (parent, current, children) with professional formatting. Includes tree-wide exports for complete hierarchy documentation and individual node exports for focused presentations. All exports maintain formatting and hierarchical relationships.",
      parent: rootId
    },
    {
      id: keyboardNavigationId,
      name: "⌨️ Keyboard Navigation",
      description: "Comprehensive keyboard navigation system enabling efficient tree traversal without mouse interaction. Supports arrow key navigation (up/down for siblings, left/right for parent/child), Home/End keys for jumping to boundaries, and Enter for editing. Features visual selection feedback with gray highlighting and automatic scrolling to keep focused nodes visible. Includes modal keyboard shortcuts for rapid form submission.",
      parent: rootId
    },
    {
      id: dragDropId,
      name: "🖱️ Drag and Drop System",
      description: "Intuitive drag-and-drop interface powered by react-dnd for reorganizing hierarchy structures. Features visual feedback during dragging with drop target highlighting and validation to prevent invalid moves (like dropping a node onto its own descendant). Includes custom drag preview with smooth animations and automatic expansion of drop targets for better usability.",
      parent: rootId
    },
    {
      id: utilsId,
      name: "🔧 Utility Functions",
      description: "Core utility functions providing essential tree operations including node creation, relationship management, search, and validation. Features efficient algorithms for finding parents, children, descendants, and calculating tree statistics. Includes helper functions for ID generation, data validation, and common tree manipulations used throughout the application.",
      parent: rootId
    },
    {
      id: adminId,
      name: "📊 Admin & Analytics",
      description: "Administrative interface providing comprehensive analytics and system management tools. Features detailed tree statistics including node counts, depth analysis, storage usage, and Magic Wand usage metrics. Includes data backup creation, hard reset functionality, and performance monitoring. Provides insights into user behavior and system usage patterns for optimization purposes.",
      parent: rootId
    },
      // Level 2 - Core System Components
    {
      id: treeContextId,
      name: "🌲 Tree Context Provider",
      description: "Central state management using React Context API to provide tree data and operations throughout the component tree. Manages the main nodes array, collapsed state set, loading states, and initialization flags. Implements automatic persistence to localStorage with debounced saves and error handling. The context provides both state and dispatch functions for tree modifications.",
      parent: coreSystemId
    },
    {
      id: nodeDataId,
      name: "📋 NodeData Interface",
      description: "Core TypeScript interface defining the structure of tree nodes with id, name, description, and parent properties. The flat structure with parent references enables efficient operations while maintaining hierarchical relationships. All nodes use generated string IDs for uniqueness, with null parent indicating root nodes. Description field supports Markdown formatting for rich text content.",
      parent: coreSystemId
    },
    {
      id: stateManagementId,
      name: "🗂️ State Management",
      description: "Sophisticated state management system handling tree data, UI states, and user interactions. Uses React hooks pattern with custom hooks for business logic separation. Implements optimistic updates with rollback capabilities and maintains consistency between UI state and persisted data. Features loading states, error handling, and state synchronization across components.",
      parent: coreSystemId
    },
      // Level 2 - User Interface Components
    {
      id: mainContentId,
      name: "🖥️ Main Content Component",
      description: "Primary application container managing the tree view, modals, and main user interactions. Coordinates between all major features including node editing, tree manipulation, keyboard navigation, and modal management. Implements virtualization for large trees (>100 nodes) and standard rendering for smaller trees. Handles responsive layout and container sizing.",
      parent: userInterfaceId
    },
    {
      id: nodeRowId,
      name: "📄 Node Row Component",
      description: "Individual node display component featuring drag-and-drop functionality, action buttons, and interactive elements. Shows node name with Markdown tooltip for descriptions, expand/collapse controls for parent nodes, and hover-revealed action buttons. Implements focus management for keyboard navigation and visual feedback for selection states. Supports touch interactions on mobile devices.",
      parent: userInterfaceId
    },
    {
      id: modalsId,
      name: "🪟 Modal System",
      description: "Comprehensive modal dialog system for node editing, tree creation, confirmations, and settings. Features keyboard shortcuts (ESC to close, Ctrl+Enter to submit), focus management, and accessibility support. Includes specialized modals for adding children, editing nodes, confirming deletions, creating new trees, and configuring Magic Wand settings. All modals support form validation and error display.",
      parent: userInterfaceId
    },
    {
      id: controlsId,
      name: "🎛️ Tree Controls",
      description: "Control panel providing tree-wide operations including expand/collapse all, new tree creation, save/load functionality, and Magic Wand settings access. Features responsive button layout with icon-only display on mobile and text labels on desktop. Includes disabled states during loading and consistent styling across all control elements.",
      parent: userInterfaceId
    },
    {
      id: layoutId,
      name: "🏗️ Layout System",
      description: "Responsive layout system with header, sidebar navigation, and main content areas. Features a burger menu for mobile navigation, routing between different pages (Home, About, Admin), and consistent spacing throughout the application. Implements scroll management, container sizing, and adaptive layouts for different screen sizes.",
      parent: userInterfaceId
    },
      // Level 2 - Data Management Components
    {
      id: storageId,
      name: "💽 Local Storage System",
      description: "Robust local storage implementation for persistent data storage with automatic saving and retrieval. Uses prefixed keys to avoid conflicts with other applications and implements versioning for data migration. Features error handling for storage quota exceeded scenarios and automatic cleanup of obsolete data. Includes backup creation before major operations.",
      parent: dataManagementId
    },
    {
      id: importExportId,
      name: "📋 Import/Export Operations",
      description: "Comprehensive import/export system supporting JSON format for tree data interchange. Features file validation, error handling, and progress feedback for large operations. Includes metadata preservation, format versioning, and compatibility checking. Supports both full tree exports and selective node exports with relationship preservation.",
      parent: dataManagementId
    },
    {
      id: clipboardId,
      name: "📎 Clipboard Operations",
      description: "Advanced clipboard system enabling copy/paste operations for individual nodes and entire branches. Preserves hierarchical relationships when copying subtrees and generates new IDs to prevent conflicts when pasting. Features visual feedback for copy/paste operations and supports cross-session clipboard data through localStorage. Includes branch copying with full descendant preservation.",
      parent: dataManagementId
    },
    {  // Level 2 - AI Integration Components    {
      id: magicWandId,
      name: "🪄 Magic Wand System",
      description: "AI-powered content generation system with multiple prompts support that creates contextually relevant child concepts using specialized generation strategies. Features 5 built-in prompts (General MECE, Creative Thinking, Technical Systems, Academic Research, Business Strategy) plus custom prompt creation. Analyzes current node context, parent relationships, and sibling nodes to generate appropriate suggestions. Includes prompt dropdown selection, usage tracking, automatic clipboard integration, and seamless prompt switching for different conceptual domains.",
      parent: aiIntegrationId
    },
    {
      id: promptManagementId,
      name: "📝 Prompt Management",
      description: "Sophisticated prompt engineering system for generating high-quality AI responses. Creates context-rich prompts including node relationships, domain analysis, and custom generation guidelines. Features template management, variable substitution, and prompt optimization based on usage patterns. Includes example outputs and formatting instructions for consistent results.",
      parent: aiIntegrationId
    },
    // Level 2 - Export System Components
    {
      id: capabilityCardsId,
      name: "🃏 Capability Cards",
      description: "Specialized visualization showing three-generation node relationships (parent, current, children) in a card format. Features hierarchical context display, navigation between related nodes, and export capabilities in multiple formats. Designed for presentation and documentation purposes with professional styling and layout. Includes relationship indicators and contextual information.",
      parent: exportSystemId
    },
    {
      id: formatOptionsId,
      name: "📑 Export Format Options",
      description: "Multiple export format support including JSON for data interchange, HTML for web viewing, PDF for documentation, SVG for vector graphics, and PNG for raster images. Each format optimized for specific use cases with appropriate styling and layout. Features format-specific options and quality settings for professional output.",
      parent: exportSystemId
    },
    {
      id: exportUtilsId,
      name: "🛠️ Export Utilities",
      description: "Core export functionality providing format conversion, styling application, and file generation. Features modular architecture with separate exporters for each format, shared utilities for common operations, and error handling for export failures. Includes progress tracking for large exports and memory optimization for handling large trees.",
      parent: exportSystemId
    },
      // Level 2 - Keyboard Navigation Components
    {
      id: navigationHooksId,
      name: "🎯 Navigation Hooks",
      description: "Custom React hooks implementing keyboard navigation logic with efficient tree traversal algorithms. Manages focus state, visible node calculation, and navigation boundaries. Features arrow key handling for directional movement, expand/collapse controls, and integration with tree state management. Includes focus restoration and smooth scrolling to maintain user context.",
      parent: keyboardNavigationId
    },
    {
      id: shortcutsId,
      name: "⚡ Keyboard Shortcuts",
      description: "Comprehensive keyboard shortcut system covering tree navigation, modal operations, and editing functions. Features contextual shortcuts that adapt based on current application state and focused elements. Includes global shortcuts for tree operations and modal-specific shortcuts for form submission and cancellation. All shortcuts documented with tooltips and help text.",
      parent: keyboardNavigationId
    },
    {
      id: accessibilityId,
      name: "♿ Accessibility Features",
      description: "ARIA-compliant accessibility implementation with screen reader support, focus management, and keyboard-only operation capability. Features semantic markup, descriptive labels, and logical tab order throughout the application. Includes high contrast mode support and responsive design for various accessibility needs.",
      parent: keyboardNavigationId
    },
      // Level 2 - Drag and Drop Components
    {
      id: dndSystemId,
      name: "🎪 DnD Core System",
      description: "React DnD-based drag and drop implementation with custom preview components and drop validation. Features smooth animations, visual feedback during dragging, and prevention of invalid operations. Includes touch support for mobile devices and accessible alternatives for non-pointer users. Implements optimistic updates with rollback on invalid operations.",
      parent: dragDropId
    },
    {
      id: visualFeedbackId,
      name: "👁️ Visual Feedback",
      description: "Rich visual feedback system for drag and drop operations including drop target highlighting, invalid drop indicators, and custom drag previews. Features smooth animations, color-coded feedback, and clear visual cues for allowed operations. Includes hover states, selection indicators, and transition animations for professional user experience.",
      parent: dragDropId
    },
    {
      id: hierarchyReorganizationId,
      name: "🔄 Hierarchy Reorganization",
      description: "Intelligent hierarchy restructuring with validation to maintain tree integrity. Prevents circular references, validates parent-child relationships, and automatically handles edge cases. Features batch operations for efficient large-scale reorganization and undo/redo capabilities for user error recovery. Includes automatic tree expansion for better visibility after moves.",
      parent: dragDropId
    },
      // Level 2 - Utility Components
    {
      id: treeUtilsId,
      name: "🌳 Tree Utilities",
      description: "Core tree manipulation functions including node creation, relationship management, search operations, and tree traversal algorithms. Features efficient parent/child lookups, descendant enumeration, and depth calculation. Includes utility functions for tree validation, statistics calculation, and common operations used throughout the application.",
      parent: utilsId
    },
    {
      id: validationId,
      name: "✅ Data Validation",
      description: "Comprehensive validation system ensuring data integrity for node structures, hierarchical relationships, and import/export operations. Features schema validation, relationship consistency checking, and error reporting. Includes validation for user inputs, API responses, and file formats with detailed error messages for debugging.",
      parent: utilsId
    },
    {
      id: helpersId,
      name: "🔨 Helper Functions",
      description: "Common utility functions for string manipulation, ID generation, formatting, and data transformation. Features pure functions with no side effects, comprehensive error handling, and optimized performance for frequently called operations. Includes date formatting, number formatting, and text processing utilities.",
      parent: utilsId
    },
      // Level 2 - Admin Components
    {
      id: statisticsId,
      name: "📈 Statistics Dashboard",
      description: "Comprehensive analytics dashboard showing tree statistics, user behavior metrics, and system usage patterns. Features real-time calculations of node counts, tree depth, storage usage, and Magic Wand effectiveness. Includes trending data, usage patterns, and performance metrics for system optimization and user insights.",
      parent: adminId
    },
    {
      id: performanceId,
      name: "⚡ Performance Monitoring",
      description: "Performance tracking system monitoring rendering performance, memory usage, and operation timings. Features component rendering optimization, memory leak detection, and performance bottleneck identification. Includes metrics collection for large tree handling and optimization recommendations for better user experience.",
      parent: adminId
    },
    {
      id: debuggingId,
      name: "🐛 Debugging Tools",
      description: "Development and debugging utilities including error tracking, state inspection, and performance profiling. Features comprehensive logging, error boundary implementation, and development-mode debugging aids. Includes tools for data inspection, operation tracing, and issue reproduction for effective troubleshooting.",
      parent: adminId
    },
      // Level 3 - Tree Context & State Management Details
    {
      id: nodeArrayId,
      name: "📊 Node Array Management",
      description: "Efficient array-based storage for tree nodes with optimized CRUD operations. Uses immutable update patterns for predictable state changes and implements filtering, sorting, and search operations. Features bulk operations for performance and maintains referential integrity across all node relationships.",
      parent: treeContextId
    },
    {
      id: collapsedStateId,
      name: "🔼 Collapsed State Management",
      description: "Set-based storage for tracking expanded/collapsed node states with efficient lookup and update operations. Implements smart defaults for new nodes and bulk expand/collapse operations. Features state persistence and restoration for maintaining user preferences across sessions.",
      parent: treeContextId
    },
    {
      id: loadingStateId,
      name: "⏳ Loading State Coordination",
      description: "Centralized loading state management for async operations including data loading, saving, AI generation, and export operations. Features progress tracking, error state handling, and user feedback coordination. Implements optimistic updates with loading indicators for better user experience.",
      parent: treeContextId
    },
    {
      id: persistenceId,
      name: "💾 Data Persistence Layer",
      description: "Automatic persistence system with debounced saves, error recovery, and data versioning. Features conflict resolution for concurrent modifications and backup creation before destructive operations. Implements efficient serialization and compression for large datasets.",
      parent: treeContextId
    },
      // Level 3 - Main Content & UI Details
    {
      id: virtualizationId,
      name: "🚀 Tree Virtualization",
      description: "React Window-based virtualization for handling large trees (>100 nodes) with smooth scrolling and efficient memory usage. Features dynamic item sizing, scroll position restoration, and keyboard navigation integration. Implements windowing algorithms for optimal performance with thousands of nodes.",
      parent: mainContentId
    },
    {
      id: renderingId,
      name: "🎨 Tree Rendering Engine",
      description: "Recursive tree rendering system with optimized performance through React.memo and careful re-render prevention. Features conditional rendering based on collapse state and efficient diff algorithms for minimal DOM updates. Implements smooth animations and transitions for tree state changes.",
      parent: mainContentId
    },
    {
      id: eventHandlingId,
      name: "🎯 Event Handling System",
      description: "Comprehensive event handling for tree interactions including clicks, keyboard events, drag operations, and touch gestures. Features event delegation for performance, proper event bubbling control, and integration with all tree operations. Implements debouncing for high-frequency events.",
      parent: mainContentId
    },
    {
      id: responsiveDesignId,
      name: "📱 Responsive Design System",
      description: "Mobile-first responsive design with adaptive layouts, touch-friendly targets, and screen size optimization. Features breakpoint-based styling, adaptive spacing, and optimized interactions for different device types. Implements progressive enhancement for advanced features on larger screens.",
      parent: mainContentId
    },
      // Level 3 - Modal Details
    {
      id: addChildModalId,
      name: "➕ Add Child Modal",
      description: "Modal dialog for creating new child nodes with form validation, Markdown preview, and parent context display. Features auto-focus on name field, keyboard shortcuts for submission, and integration with tree state management. Includes input validation and error handling with user feedback.",
      parent: modalsId
    },
    {
      id: editNodeModalId,
      name: "✏️ Edit Node Modal",
      description: "Node editing interface with pre-populated form fields, Markdown support for descriptions, and live validation. Features undo/redo capabilities, keyboard shortcuts, and integration with focus management. Includes change tracking and confirmation for unsaved changes.",
      parent: modalsId
    },
    {
      id: confirmDeleteModalId,
      name: "🗑️ Confirm Delete Modal",
      description: "Safety confirmation dialog for node deletion with clear consequence explanation and descendant count display. Features prominent warning styling, keyboard navigation, and clear action buttons. Includes information about cascade deletion effects on child nodes.",
      parent: modalsId
    },
    {
      id: newTreeModalId,
      name: "🌱 New Tree Modal",
      description: "Tree creation interface for starting fresh hierarchies with root node configuration. Features template selection, default values, and validation for required fields. Includes confirmation for replacing existing tree data and backup creation options.",
      parent: modalsId
    },
    {
      id: magicWandSettingsModalId,
      name: "⚙️ Magic Wand Settings Modal",
      description: "AI configuration interface for customizing generation guidelines with syntax highlighting and preview capabilities. Features template management, guideline history, and reset to defaults functionality. Includes help text and examples for effective prompt engineering.",
      parent: modalsId
    },
    {
      id: capabilityCardModalId,
      name: "🎴 Capability Card Modal",
      description: "Full-screen modal for displaying capability cards with navigation controls and export options. Features three-generation view with parent context, current node details, and children overview. Includes zoom controls, navigation between related nodes, and multi-format export capabilities.",
      parent: modalsId
    },
      // Level 3 - Control Details
    {
      id: treeControlsId,
      name: "🎛️ Tree Control Panel",
      description: "Primary control interface with expand/collapse all, Magic Wand access, and tree-wide operations. Features consistent button styling, responsive layout, and disabled states during operations. Implements tooltips for user guidance and keyboard shortcut indicators.",
      parent: controlsId
    },
    {
      id: saveLoadButtonsId,
      name: "💾 Save/Load Operations",
      description: "File operations interface for importing/exporting tree data with progress indicators and error handling. Features drag-and-drop file upload, format validation, and backup creation before loading new data. Includes filename suggestions and export options.",
      parent: controlsId
    },
    {
      id: expandCollapseId,
      name: "🔽 Expand/Collapse Controls",
      description: "Bulk tree state management with smart expand/collapse algorithms and user preference preservation. Features selective expansion based on tree depth and node types. Implements efficient state updates and visual feedback for large-scale operations.",
      parent: controlsId
    },
      // Level 3 - Node Row Features
    {
      id: nodeDisplayId,
      name: "📺 Node Display Elements",
      description: "Core node presentation including name display, description tooltips, hierarchy indicators, and visual styling. Features truncation handling, responsive text sizing, and accessibility markup. Implements hover states, selection indicators, and focus management for keyboard navigation.",
      parent: nodeRowId
    },
    {
      id: actionButtonsId,
      name: "🎬 Action Button Set",
      description: "Comprehensive action buttons for edit, delete, copy, paste, add child, Magic Wand, and capability card operations. Features hover-revealed display, responsive sizing, and consistent styling. Includes tooltips, keyboard shortcuts, and disabled states based on context.",
      parent: nodeRowId
    },
    {
      id: tooltipsId,
      name: "💬 Markdown Tooltips",
      description: "Rich tooltip system supporting Markdown formatting for node descriptions with interactive content. Features pinnable tooltips, syntax highlighting, and responsive positioning. Includes link support, code formatting, and list rendering for comprehensive content display.",
      parent: nodeRowId
    },
    {
      id: focusManagementId,
      name: "🎯 Focus Management",
      description: "Sophisticated focus handling for keyboard navigation with visual indicators and scroll-to-view functionality. Features focus restoration after operations, tab order management, and integration with screen readers. Implements focus trapping in modals and logical focus flow.",
      parent: nodeRowId
    },
      // Level 3 - Magic Wand Details
    {
      id: promptGenerationId,
      name: "🔮 Prompt Generation Engine",
      description: "Advanced prompt construction system analyzing node context, relationships, and domain patterns for optimal AI responses. Features template-based generation, variable substitution, and context enrichment. Implements MECE principle enforcement and domain-specific language adaptation.",
      parent: magicWandId
    },
    {
      id: guidelinesId,
      name: "📜 Generation Guidelines",
      description: "Customizable AI generation guidelines with template management and best practices integration. Features default guidelines based on MECE principles, user customization capabilities, and guideline versioning. Includes examples, explanations, and optimization recommendations.",
      parent: magicWandId
    },
    {
      id: aiResponseHandlingId,
      name: "🧠 AI Response Processing",
      description: "Response parsing and validation system for AI-generated content with error handling and format conversion. Features JSON parsing, content validation, and automatic node creation. Implements retry logic for failed generations and response quality assessment.",
      parent: magicWandId
    },
    {
      id: statisticsTrackingId,
      name: "📊 Usage Statistics Tracking",
      description: "Comprehensive tracking of Magic Wand usage including success rates, generation patterns, and user behavior analytics. Features call counting, error tracking, and effectiveness measurement. Implements privacy-conscious analytics with local storage and user control.",
      parent: magicWandId
    },
      // Level 3 - Export Features
    {
      id: jsonExportId,
      name: "📄 JSON Export",
      description: "Standard JSON format export preserving complete tree structure and metadata for data interchange. Features schema versioning, relationship preservation, and compression options. Implements validation and error checking for export integrity.",
      parent: formatOptionsId
    },
    {
      id: htmlExportId,
      name: "🌐 HTML Export",
      description: "Web-ready HTML export with embedded CSS, responsive design, and interactive features. Features standalone documents, custom styling options, and print optimization. Implements accessibility markup and semantic structure for maximum compatibility.",
      parent: formatOptionsId
    },
     // Level 3 - Keyboard Navigation Details
    {
      id: arrowKeyNavigationId,
      name: "⬅️ Arrow Key Navigation",
      description: "Directional navigation using arrow keys for intuitive tree traversal with up/down for siblings and left/right for hierarchy levels. Features smooth focus transitions, automatic scrolling, and visual feedback. Implements boundary handling and logical navigation flow.",
      parent: navigationHooksId
    },
    {
      id: expandCollapseKeysId,
      name: "🔀 Expand/Collapse Keys",
      description: "Left/right arrow key functionality for expanding and collapsing nodes with smart behavior based on current state. Features recursive expansion options and level-by-level navigation. Implements visual feedback and state persistence for user preferences.",
      parent: navigationHooksId
    },
    {
      id: homeEndKeysId,
      name: "🔚 Home/End Navigation",
      description: "Boundary navigation with Home key jumping to first visible node and End key to last visible node. Features efficient calculation of visible boundaries and smooth scrolling to targets. Implements wraparound options and context-aware positioning.",
      parent: navigationHooksId
    },
    {
      id: enterKeyEditingId,
      name: "⏎ Enter Key Editing",
      description: "Enter key activation for editing focused nodes with automatic form opening and field focus. Features edit mode detection and modal integration. Implements save shortcuts and form validation with keyboard-only operation support.",
      parent: navigationHooksId
    },
      // Level 3 - Clipboard Details
    {
      id: copyOperationsId,
      name: "📋 Copy Operations",
      description: "Node and branch copying with metadata preservation and relationship tracking. Features single node copy and full branch copy with descendant preservation. Implements clipboard integration and cross-session copy support through localStorage.",
      parent: clipboardId
    },
    {
      id: pasteOperationsId,
      name: "📌 Paste Operations",
      description: "Intelligent paste functionality with ID regeneration, relationship reconstruction, and conflict resolution. Features paste as child operation with automatic hierarchy integration. Implements validation and error handling for invalid paste operations.",
      parent: clipboardId
    },
    {
      id: branchCopyingId,
      name: "🌿 Branch Copying",
      description: "Complete subtree copying preserving full hierarchical structures with all descendants and relationships. Features recursive copying algorithms and efficient bulk operations. Implements progress tracking for large branches and memory optimization.",
      parent: clipboardId
    }
  ];
};

// Get all nodes in the flat structure
export const getAllNodes = (nodes: NodeData[]): NodeData[] => {
  return nodes;
};

// Get all children of a specific node in the flat structure
export const getChildren = (nodes: NodeData[], parentId: string | null): NodeData[] => {
  return nodes.filter(node => node.parent === parentId);
};

// Get the parent of a specific node
export const getParent = (nodes: NodeData[], childId: string): NodeData | null => {
  const child = nodes.find(node => node.id === childId);
  if (!child || child.parent === null) return null;
  return nodes.find(node => node.id === child.parent) || null;
};

interface FindNodeResult {
  node: NodeData;
  parent: NodeData | null;
}

// Find a node and its parent
export const findNode = (nodes: NodeData[], id: string): FindNodeResult | null => {
  const node = nodes.find(node => node.id === id);
  if (!node) return null;
  
  const parent = node.parent ? nodes.find(n => n.id === node.parent) || null : null;
  return { node, parent };
};