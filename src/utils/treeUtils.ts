import { NodeData } from '../types';

export const genId = (): string => Math.random().toString(36).substring(2, 15);

// Create initial data in the flat structure - Comprehensive Documentation
export const createInitialData = (): NodeData[] => {
  // Generate IDs first to establish proper parent-child relationships
  const rootId = genId();
  const gettingStartedId = genId();
  const featuresId = genId();
  const architectureId = genId();
  const usageGuideId = genId();
  const advancedId = genId();
  const troubleshootingId = genId();
  const contributingId = genId();
  
  // Getting Started sub-sections
  const installationId = genId();
  const quickStartId = genId();
  const firstProjectId = genId();
  
  // Features sub-sections
  const hierarchyMgmtId = genId();
  const dragDropId = genId();
  const exportImportId = genId();
  const magicWandId = genId();
  const capabilityCardsId = genId();
  
  // Architecture sub-sections
  const techStackId = genId();
  const projectStructureId = genId();
  const dataModelId = genId();
  
  // Usage Guide sub-sections
  const createHierarchyId = genId();
  const managingNodesId = genId();
  const exportingDataId = genId();
  const keyboardShortcutsId = genId();
  
  // Advanced sub-sections
  const customizationId = genId();
  const integrationId = genId();
  const performanceId = genId();
  
  return [
    { 
      id: rootId, 
      name: '📚 Concept Hierarchy Designer - Complete Documentation', 
      description: `# Welcome to Concept Hierarchy Designer! 🎉

A powerful, intuitive tool for creating and managing hierarchical concept structures. Whether you're organizing knowledge, planning projects, or designing systems, this application provides a visual and interactive way to structure your ideas.

## 🌟 Key Highlights
- **Visual Tree Structure**: Interactive hierarchical display
- **Drag & Drop**: Intuitive node reorganization
- **AI-Powered Assistance**: Magic Wand feature for automated content generation
- **Export/Import**: Save and share your hierarchies
- **Capability Cards**: Detailed documentation for each concept
- **Auto-Save**: Never lose your work

*Navigate through the documentation tree to explore all features and capabilities!*`, 
      parent: null 
    },
    
    // Main Sections
    { 
      id: gettingStartedId, 
      name: '🚀 Getting Started', 
      description: `# Getting Started with Concept Hierarchy Designer

Your journey begins here! This section will help you get up and running quickly with the application.

## What You'll Learn:
- How to install and set up the application
- Creating your first concept hierarchy
- Basic navigation and interface overview
- Essential features to get productive immediately

Perfect for newcomers and those who want a refresher on the basics.`, 
      parent: rootId 
    },
    
    { 
      id: featuresId, 
      name: '✨ Features & Capabilities', 
      description: `# Features & Capabilities Overview

Discover the powerful features that make Concept Hierarchy Designer a comprehensive tool for organizing and managing hierarchical information.

## Core Features:
- **Hierarchical Organization**: Multi-level tree structures
- **Interactive Interface**: Click, drag, and modify with ease
- **Smart Automation**: AI-powered content suggestions
- **Data Management**: Import/export capabilities
- **Visual Design**: Clean, modern interface

Explore each feature in detail to maximize your productivity!`, 
      parent: rootId 
    },
    
    { 
      id: architectureId, 
      name: '🏗️ Architecture & Technical Details', 
      description: `# Architecture & Technical Details

Understanding the technical foundation of Concept Hierarchy Designer helps developers contribute and users understand the system's capabilities.

## Technical Overview:
- **Modern Web Technologies**: Built with React and TypeScript
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: Data persistence without server dependency
- **Modular Design**: Clean, maintainable codebase

Perfect for developers, technical users, and those interested in the implementation details.`, 
      parent: rootId 
    },
    
    { 
      id: usageGuideId, 
      name: '📖 Usage Guide & Best Practices', 
      description: `# Usage Guide & Best Practices

Master the art of creating effective concept hierarchies with proven strategies and detailed usage instructions.

## What's Included:
- **Step-by-step workflows** for common tasks
- **Best practices** for organizing concepts
- **Efficiency tips** to work faster
- **Real-world examples** and use cases

Transform from a beginner to a power user with these comprehensive guides!`, 
      parent: rootId 
    },
    
    { 
      id: advancedId, 
      name: '⚡ Advanced Features & Customization', 
      description: `# Advanced Features & Customization

Unlock the full potential of Concept Hierarchy Designer with advanced features and customization options.

## Advanced Topics:
- **Customization options** for power users
- **Integration possibilities** with other tools
- **Performance optimization** techniques
- **Advanced workflows** and automation

Take your concept hierarchy skills to the next level!`, 
      parent: rootId 
    },
    
    { 
      id: troubleshootingId, 
      name: '🔧 Troubleshooting & FAQ', 
      description: `# Troubleshooting & Frequently Asked Questions

Having issues? Find solutions to common problems and answers to frequently asked questions.

## Common Issues:
- **Performance problems** and solutions
- **Browser compatibility** information
- **Data recovery** procedures
- **Feature not working** troubleshooting

Quick solutions to keep you productive and minimize downtime.`, 
      parent: rootId 
    },
    
    { 
      id: contributingId, 
      name: '🤝 Contributing & Community', 
      description: `# Contributing & Community

Join our community of users and contributors! Learn how to contribute to the project and connect with other users.

## Get Involved:
- **Report bugs** and suggest features
- **Contribute code** and documentation
- **Share your hierarchies** with the community
- **Help other users** with questions

Together, we can make Concept Hierarchy Designer even better!`, 
      parent: rootId 
    },
    
    // Getting Started Sub-sections
    { 
      id: installationId, 
      name: '💻 Installation & Setup', 
      description: `# Installation & Setup

## Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required!

## Quick Setup
1. **Access the Application**: Simply open the web application in your browser
2. **No Installation Required**: This is a web-based application
3. **Local Storage**: Your data is saved locally in your browser

## Browser Requirements
- **JavaScript**: Must be enabled
- **Local Storage**: Required for data persistence
- **Modern CSS**: For optimal visual experience

## First Launch
When you first open the application:
1. You'll see a sample hierarchy to explore
2. All features are immediately available
3. Your changes are automatically saved
4. No account or login required

🎉 **That's it!** You're ready to start creating concept hierarchies.`, 
      parent: gettingStartedId 
    },
    
    { 
      id: quickStartId, 
      name: '⚡ Quick Start Guide', 
      description: `# Quick Start Guide - 5 Minutes to Productivity

## Step 1: Create Your First Node 🌱
- Click the **"+ Add Child"** button on any existing node
- Enter a name and description for your concept
- Press **Enter** or click **Save**

## Step 2: Build Your Hierarchy 🌳
- Add child nodes to create sub-concepts
- Use **drag and drop** to reorganize nodes
- **Expand/collapse** nodes using the arrow icons

## Step 3: Enhance with Descriptions 📝
- Click the **Edit** icon to modify any node
- Use **Markdown formatting** for rich descriptions
- Add emojis and formatting for visual appeal

## Step 4: Use Smart Features ✨
- Try the **Magic Wand** for AI-generated content
- **Copy/Paste** nodes to duplicate structures
- **Export** your hierarchy when complete

## Step 5: Save & Share 💾
- Your work auto-saves continuously
- Use **Export** to download as JSON
- **Import** previously saved hierarchies

**Congratulations!** 🎉 You're now ready to create amazing concept hierarchies.`, 
      parent: gettingStartedId 
    },
    
    { 
      id: firstProjectId, 
      name: '🎯 Creating Your First Project', 
      description: `# Creating Your First Project

## Choose Your Project Type 🎨
Start with a structure that matches your needs:

### 📚 Knowledge Organization
- Research topics and subtopics
- Learning curriculum structure
- Reference material organization

### 🏢 Business Planning
- Project breakdown structures
- Organizational hierarchies
- Process documentation

### 💡 Creative Projects
- Story outlines and character development
- Design system organization
- Content strategy planning

## Step-by-Step Project Creation

### 1. Define Your Root Concept
- Start with a clear, descriptive name
- Include the project's main purpose
- Add context in the description

### 2. Identify Main Categories
- Break down into 3-7 main areas
- Keep categories distinct and logical
- Use consistent naming conventions

### 3. Add Detail Levels
- Create subcategories as needed
- Include specific examples
- Add implementation details

### 4. Review and Refine
- Check for logical flow
- Ensure balanced hierarchy depth
- Verify completeness

## 💡 Pro Tips
- **Start broad, then narrow**: Begin with high-level concepts
- **Use consistent language**: Maintain terminology throughout
- **Regular reviews**: Periodically assess and reorganize
- **Collaborative thinking**: Consider multiple perspectives

Your first project sets the foundation for future success! 🚀`, 
      parent: gettingStartedId 
    },
    
    // Features Sub-sections
    { 
      id: hierarchyMgmtId, 
      name: '🌳 Hierarchy Management', 
      description: `# Hierarchy Management - Organizing Your Concepts

## Tree Structure Fundamentals 🌲

### Understanding Hierarchies
- **Root Node**: The top-level concept or project
- **Parent Nodes**: Categories that contain sub-concepts
- **Child Nodes**: Specific items within a category
- **Leaf Nodes**: End-level items with no children

### Hierarchy Best Practices
- **Logical Grouping**: Related concepts should be grouped together
- **Balanced Depth**: Avoid going too deep (5-7 levels max recommended)
- **Consistent Granularity**: Similar level of detail at same depths
- **Clear Naming**: Descriptive, unambiguous node names

## Managing Your Tree Structure 🔧

### Adding Nodes
- **Add Child**: Creates a sub-concept under the selected node
- **Multiple Children**: Add several related concepts quickly
- **Bulk Creation**: Use templates or copy-paste for efficiency

### Organizing Nodes
- **Drag & Drop**: Easily move nodes between parents
- **Cut/Copy/Paste**: Duplicate or relocate entire branches
- **Reordering**: Arrange siblings in logical order

### Editing Structure
- **Rename Nodes**: Update names as concepts evolve
- **Merge Concepts**: Combine similar or duplicate nodes
- **Split Concepts**: Break complex nodes into sub-concepts

## Visual Organization Tips 🎨
- **Use Emojis**: Visual indicators for different types of concepts
- **Color Coding**: Consistent visual themes (coming soon!)
- **Descriptive Names**: Clear, searchable terminology
- **Hierarchical Logic**: Maintain parent-child relationships that make sense

Transform your ideas into well-organized, navigable knowledge structures! 📊`, 
      parent: featuresId 
    },
    
    { 
      id: dragDropId, 
      name: '🖱️ Drag & Drop Interface', 
      description: `# Drag & Drop Interface - Intuitive Reorganization

## Understanding Drag & Drop 🎯

### Visual Feedback
- **Hover Effects**: See where nodes can be dropped
- **Drop Zones**: Clear indicators for valid drop locations
- **Drag Preview**: Visual representation while dragging
- **Conflict Prevention**: Invalid drops are clearly indicated

### Drag Operations
- **Click and Hold**: Start dragging any node
- **Move Between Parents**: Change node relationships
- **Reorder Siblings**: Arrange nodes within the same parent
- **Multi-level Moves**: Drag across different hierarchy levels

## Advanced Drag Techniques 🚀

### Precision Dropping
- **Drop as Child**: Create parent-child relationships
- **Drop as Sibling**: Place nodes at the same level
- **Drop Before/After**: Specific positioning within siblings
- **Visual Guides**: Lines and highlights show exact placement

### Bulk Operations
- **Select Multiple**: Drag groups of related nodes (coming soon!)
- **Branch Moving**: Move entire sub-trees at once
- **Template Dragging**: Drag from template libraries

### Keyboard Modifiers
- **Ctrl + Drag**: Copy instead of move (coming soon!)
- **Shift + Drag**: Constrain to specific directions
- **Alt + Drag**: Advanced placement options

## Best Practices 💡

### Efficient Workflow
- **Plan Before Moving**: Visualize the end structure
- **Test Relationships**: Ensure logical parent-child connections
- **Undo Available**: Don't worry about mistakes
- **Save Frequently**: Auto-save protects your changes

### Organization Strategies
- **Top-Down Organization**: Start with high-level structure
- **Group Similar Items**: Use proximity for related concepts
- **Maintain Balance**: Avoid overly deep or wide branches
- **Logical Flow**: Ensure natural reading order

Make restructuring your concepts as easy as thinking about them! 🧠✨`, 
      parent: featuresId 
    },
    
    { 
      id: exportImportId, 
      name: '💾 Export & Import Capabilities', 
      description: `# Export & Import Capabilities - Data Portability

## Export Options 📤

### JSON Format
- **Complete Structure**: Preserves all hierarchy relationships
- **Metadata Included**: Names, descriptions, and IDs
- **Human Readable**: Easy to view and edit externally
- **Version Control**: Perfect for tracking changes over time

### Export Process
1. **Click Export Button**: Located in the main toolbar
2. **Choose Filename**: Descriptive name for your hierarchy
3. **Download File**: Automatically saves to your downloads folder
4. **Backup Created**: Instant backup of your entire structure

### What's Exported
- **All Nodes**: Complete hierarchy with relationships
- **Descriptions**: Full markdown content and formatting
- **Structure**: Parent-child relationships preserved
- **Metadata**: Creation dates and unique identifiers

## Import Capabilities 📥

### Supported Formats
- **JSON Files**: Native format with full feature support
- **Validation**: Automatic checks for data integrity
- **Error Handling**: Clear messages for problematic files
- **Backup Restore**: Seamless restoration of previous versions

### Import Process
1. **Click Import Button**: Access from the main interface
2. **Select File**: Choose your previously exported JSON file
3. **Validation**: System checks file structure and content
4. **Merge or Replace**: Choose how to handle existing data

### Import Options
- **Replace Current**: Completely replace existing hierarchy
- **Merge with Existing**: Combine with current structure (coming soon!)
- **Import as Branch**: Add as subtree to existing node (coming soon!)

## Data Management Best Practices 🗃️

### Regular Backups
- **Weekly Exports**: Create regular backup schedules
- **Version Naming**: Use dates or version numbers in filenames
- **Multiple Locations**: Store backups in different locations
- **Project Milestones**: Export at significant project stages

### Collaboration Workflows
- **Share JSON Files**: Easy collaboration via file sharing
- **Version Control**: Track changes with Git or similar tools
- **Team Synchronization**: Regular import/export cycles
- **Conflict Resolution**: Manual merge strategies

### Data Security
- **Local Storage**: Data stays on your device
- **No Cloud Dependency**: Full control over your information
- **Encryption Ready**: Files can be encrypted externally
- **Privacy Maintained**: No data transmission to external servers

Keep your valuable concept hierarchies safe and shareable! 🔒📊`, 
      parent: featuresId 
    },
    
    { 
      id: magicWandId, 
      name: '🪄 Magic Wand - AI Assistance', 
      description: `# Magic Wand - AI-Powered Content Generation

## What is the Magic Wand? ✨

The Magic Wand feature leverages artificial intelligence to help you generate content, expand ideas, and enhance your concept hierarchies automatically.

### Key Capabilities
- **Content Generation**: Create descriptions and expand concepts
- **Idea Expansion**: Generate related sub-concepts automatically
- **Structure Suggestions**: Recommend hierarchy improvements
- **Text Enhancement**: Improve existing descriptions and content

## How to Use Magic Wand 🎯

### Basic Usage
1. **Select a Node**: Choose the concept you want to enhance
2. **Click Magic Wand**: Look for the 🪄 icon in the node controls
3. **Choose Generation Type**: Select what kind of content to generate
4. **Review Results**: AI-generated content appears for your review
5. **Accept or Modify**: Keep, edit, or regenerate as needed

### Generation Types
- **Expand Description**: Enhance existing concept descriptions
- **Generate Children**: Create logical sub-concepts automatically
- **Suggest Structure**: Recommend organizational improvements
- **Content Ideas**: Brainstorm related concepts and topics

## Advanced Magic Wand Features 🚀

### Custom Guidelines
- **Context Setting**: Provide specific instructions for generation
- **Style Preferences**: Define tone, format, and approach
- **Domain Expertise**: Specify field or industry context
- **Length Control**: Set desired content length and detail level

### Smart Suggestions
- **Pattern Recognition**: Learns from your existing structure
- **Consistency Maintenance**: Matches your naming and style conventions
- **Relevance Filtering**: Ensures suggestions fit your project context
- **Quality Scoring**: Ranks suggestions by relevance and quality

### Iterative Improvement
- **Regeneration**: Try different approaches with one click
- **Refinement**: Build on previous generations
- **Combination**: Merge multiple AI suggestions
- **Human-AI Collaboration**: Perfect blend of creativity and automation

## Best Practices for AI Assistance 💡

### Effective Prompting
- **Be Specific**: Clear, detailed instructions yield better results
- **Provide Context**: Include relevant background information
- **Set Expectations**: Define scope and boundaries for generation
- **Use Examples**: Show the AI what you're looking for

### Quality Control
- **Always Review**: AI suggestions need human oversight
- **Fact-Check**: Verify accuracy of generated content
- **Brand Alignment**: Ensure consistency with your project goals
- **Iterative Refinement**: Use multiple generations to improve results

### Creative Workflows
- **Brainstorming Sessions**: Generate lots of ideas quickly
- **Structure Exploration**: Try different organizational approaches
- **Content Inspiration**: Overcome writer's block and creative barriers
- **Rapid Prototyping**: Quickly create comprehensive hierarchies

Transform your concept development process with intelligent automation! 🤖🧠`, 
      parent: featuresId 
    },
    
    { 
      id: capabilityCardsId, 
      name: '🃏 Capability Cards', 
      description: `# Capability Cards - Detailed Documentation

## What are Capability Cards? 📋

Capability Cards provide in-depth documentation and detailed views for each concept in your hierarchy. Think of them as expanded information panels that give comprehensive context to your nodes.

### Key Features
- **Rich Text Support**: Full markdown formatting capabilities
- **Visual Enhancement**: Images, links, and multimedia support
- **Structured Information**: Organized sections for different types of content
- **Cross-References**: Links between related concepts and cards

## Creating Capability Cards 🎨

### Card Structure
- **Header Section**: Title, summary, and key metadata
- **Description Area**: Detailed explanation and context
- **Related Concepts**: Links to connected nodes and ideas
- **Implementation Notes**: Practical guidance and examples
- **Resources**: External links, references, and materials

### Content Types
- **Concept Definitions**: Clear explanations of complex ideas
- **Process Documentation**: Step-by-step procedures and workflows
- **Reference Materials**: Quick-access information and data
- **Planning Templates**: Reusable structures and frameworks

## Advanced Card Features 🚀

### Interactive Elements
- **Collapsible Sections**: Organize long content efficiently
- **Tabbed Views**: Multiple perspectives on the same concept
- **Progress Tracking**: Implementation status and completion
- **Comments System**: Collaborative notes and feedback (coming soon!)

### Linking and Navigation
- **Cross-References**: Automatic links between related cards
- **Back-References**: See which cards reference this concept
- **Hierarchy Navigation**: Jump to parent/child nodes quickly
- **Search Integration**: Find cards by content, not just titles

### Templates and Standards
- **Card Templates**: Consistent structure across similar concepts
- **Style Guidelines**: Maintain visual and content consistency
- **Required Fields**: Ensure complete documentation
- **Quality Checklists**: Standards for comprehensive cards

## Use Cases and Applications 📚

### Knowledge Management
- **Research Documentation**: Detailed findings and analysis
- **Learning Materials**: Educational content and explanations
- **Reference Guides**: Quick-access information repositories
- **Best Practices**: Organizational knowledge and standards

### Project Management
- **Requirement Specifications**: Detailed feature descriptions
- **Implementation Guides**: Technical documentation and procedures
- **Decision Records**: Historical context and rationale
- **Risk Assessment**: Potential issues and mitigation strategies

### Creative Projects
- **Character Profiles**: Detailed descriptions for storytelling
- **Design Systems**: Component documentation and guidelines
- **Content Planning**: Editorial calendars and content strategies
- **Brand Guidelines**: Visual identity and messaging standards

## Best Practices 💡

### Content Quality
- **Clear Writing**: Use simple, accessible language
- **Visual Hierarchy**: Organize information logically
- **Regular Updates**: Keep content current and relevant
- **Peer Review**: Collaborative editing and feedback

### Organization Strategy
- **Consistent Format**: Use similar structures across cards
- **Logical Grouping**: Related cards should have similar depth
- **Progressive Disclosure**: Layer information from general to specific
- **Cross-Linking**: Create a web of interconnected knowledge

Transform simple concepts into comprehensive knowledge assets! 📖✨`, 
      parent: featuresId 
    },
    
    // Architecture Sub-sections (continued in next sections...)
    { 
      id: techStackId, 
      name: '⚙️ Technology Stack', 
      description: `# Technology Stack - Modern Web Development

## Frontend Technologies 🖥️

### Core Framework
- **React 18**: Modern component-based UI library
- **TypeScript**: Type-safe JavaScript for better development
- **Vite**: Fast build tool and development server
- **Modern ES6+**: Latest JavaScript features and syntax

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **PostCSS**: Advanced CSS processing

### State Management
- **React Context**: Built-in state management for global data
- **Custom Hooks**: Reusable stateful logic
- **Local Storage**: Browser-based data persistence
- **useState/useEffect**: React hooks for component state

## Development Tools 🛠️

### Build and Development
- **Vite**: Lightning-fast HMR and building
- **TypeScript Compiler**: Static type checking
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (recommended)

### Browser APIs
- **Local Storage API**: Data persistence without server
- **Drag and Drop API**: Native browser drag operations
- **File API**: Import/export functionality
- **Resize Observer**: Responsive layout adjustments

## Architecture Principles 🏗️

### Component Design
- **Functional Components**: Modern React patterns
- **Custom Hooks**: Reusable logic extraction
- **Composition over Inheritance**: Flexible component structure
- **Single Responsibility**: Each component has one purpose

### Code Organization
- **Feature-Based Structure**: Organized by functionality
- **Barrel Exports**: Clean import/export patterns
- **Type Definitions**: Centralized TypeScript interfaces
- **Utility Functions**: Shared helper functions

### Performance Considerations
- **Virtual Scrolling**: Efficient rendering of large lists
- **React.memo**: Prevent unnecessary re-renders
- **Lazy Loading**: Code splitting for optimal bundle size
- **Browser Optimization**: Leveraging native browser features

## Why This Stack? 🤔

### Developer Experience
- **Type Safety**: Catch errors during development
- **Hot Reload**: Instant feedback during development
- **Modern Tooling**: Industry-standard development tools
- **Component Reusability**: Modular, maintainable code

### User Experience
- **Fast Performance**: Optimized bundle and runtime
- **Responsive Design**: Works on all device sizes
- **Smooth Interactions**: Polished animations and transitions
- **Accessibility**: Built with web standards in mind

### Maintainability
- **Clean Architecture**: Well-organized, scalable codebase
- **TypeScript Benefits**: Self-documenting code with types
- **Testing Ready**: Easy to unit test and debug
- **Future Proof**: Built on stable, evolving technologies

Ready to contribute? This stack makes development enjoyable and productive! 🚀`, 
      parent: architectureId 
    },
    
    { 
      id: projectStructureId, 
      name: '📁 Project Structure', 
      description: `# Project Structure - Code Organization

## Root Directory Structure 📂

\`\`\`
concept-hierarchy-designer/
├── public/           # Static assets and favicons
├── src/             # Source code
├── package.json     # Dependencies and scripts
├── vite.config.ts   # Build configuration
├── tsconfig.json    # TypeScript configuration
├── tailwind.config.js # Styling configuration
└── README.md        # Project documentation
\`\`\`

## Source Code Organization 🗂️

### Main Application Structure
\`\`\`
src/
├── App.tsx          # Main application component
├── index.tsx        # Application entry point
├── index.css        # Global styles
├── types.ts         # Global type definitions
└── constants.ts     # Application constants
\`\`\`

### Components Directory
\`\`\`
components/
├── Layout/          # Layout and navigation components
│   ├── Layout.tsx
│   └── BurgerMenu.tsx
├── Pages/           # Main page components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── MainContent.tsx
├── ui/              # Reusable UI components
│   ├── Button.tsx
│   ├── Modal.tsx
│   ├── Input.tsx
│   └── Card.tsx
└── [Feature Components] # Feature-specific components
\`\`\`

### Supporting Directories
\`\`\`
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── router/          # Routing configuration
├── utils/           # Utility functions
└── types/           # Additional type definitions
\`\`\`

## Detailed Directory Breakdown 🔍

### Components Structure
- **Layout Components**: Header, navigation, and page structure
- **Page Components**: Route-level components for different views
- **UI Components**: Reusable interface elements
- **Feature Components**: Specific functionality (modals, trees, cards)

### Context and State
- **TreeContext**: Manages hierarchy data and operations
- **CapabilityCardContext**: Handles card-specific state
- **Global State**: Application-wide configuration and settings

### Custom Hooks
- **useAutoSave**: Automatic data persistence
- **useMagicWand**: AI feature integration
- **useClipboardActions**: Copy/paste functionality
- **useResizeObserver**: Responsive layout handling

### Utilities
- **treeUtils**: Hierarchy manipulation functions
- **storageUtils**: Local storage operations
- **exportUtils**: Import/export functionality
- **capabilityCardUtils**: Card-specific operations

## File Naming Conventions 📝

### Component Files
- **PascalCase**: \`ComponentName.tsx\`
- **Descriptive Names**: Clear purpose indication
- **Feature Grouping**: Related components together
- **Index Files**: Barrel exports for clean imports

### Utility Files
- **camelCase**: \`utilityFunction.ts\`
- **Purpose-Based**: Names reflect functionality
- **Consistent Suffixes**: \`Utils\`, \`Helpers\`, \`Services\`

### Type Files
- **Interfaces**: Clear, descriptive interface names
- **Enums**: Uppercase with descriptive values
- **Type Unions**: Logical groupings of related types

## Import/Export Patterns 📦

### Clean Imports
\`\`\`typescript
// Barrel exports from directories
export { Button } from './Button';
export { Modal } from './Modal';
export { Input } from './Input';

// Clean component imports
import { Button, Modal, Input } from './ui';
\`\`\`

### Type Exports
\`\`\`typescript
// Centralized type definitions
export interface NodeData {
  id: string;
  name: string;
  description: string;
  parent: string | null;
}
\`\`\`

## Best Practices 💡

### Code Organization
- **Feature-First**: Group by functionality, not file type
- **Consistent Structure**: Similar patterns across features
- **Clear Dependencies**: Minimal coupling between modules
- **Reusable Components**: Build once, use everywhere

### Maintainability
- **Single Responsibility**: Each file has one clear purpose
- **Descriptive Naming**: Names explain functionality
- **Documentation**: Comments for complex logic
- **Type Safety**: TypeScript interfaces for all data

Navigate the codebase with confidence using this organized structure! 🧭`, 
      parent: architectureId 
    },
    
    { 
      id: dataModelId, 
      name: '📊 Data Model & State Management', 
      description: `# Data Model & State Management

## Core Data Structures 🗃️

### NodeData Interface
\`\`\`typescript
interface NodeData {
  id: string;           // Unique identifier
  name: string;         // Display name
  description: string;  // Detailed description (markdown)
  parent: string | null; // Parent node ID (null for root)
}
\`\`\`

### Flat vs Hierarchical Structure
- **Storage**: Flat array structure for efficiency
- **Display**: Converted to hierarchical tree for UI
- **Benefits**: Easy to search, filter, and manipulate
- **Performance**: O(1) lookups with proper indexing

## State Management Architecture 🏗️

### React Context Pattern
- **TreeContext**: Primary data and operations
- **CapabilityCardContext**: Card-specific state
- **Provider Hierarchy**: Logical nesting of contexts
- **Consumer Components**: Clean separation of concerns

### State Flow
\`\`\`
User Action → Component → Context → State Update → Re-render
\`\`\`

### Data Operations
- **CRUD Operations**: Create, Read, Update, Delete nodes
- **Tree Manipulations**: Move, copy, restructure
- **Batch Operations**: Multiple changes in single transaction
- **Undo/Redo**: State history management (future feature)

## Local Storage Integration 💾

### Persistence Strategy
- **Auto-Save**: Continuous background saving
- **Storage Key**: Unique identifier for data isolation
- **Serialization**: JSON format for data storage
- **Recovery**: Automatic restoration on application load

### Data Validation
\`\`\`typescript
const validateNodeData = (data: any): data is NodeData[] => {
  // Type checking and structure validation
  return Array.isArray(data) && 
         data.every(node => 
           typeof node.id === 'string' &&
           typeof node.name === 'string' &&
           typeof node.description === 'string' &&
           (node.parent === null || typeof node.parent === 'string')
         );
};
\`\`\`

## Tree Operations 🌳

### Hierarchy Utilities
- **getChildren()**: Find all child nodes of a parent
- **getParent()**: Find the parent of a specific node
- **findNode()**: Locate node and its relationships
- **moveNode()**: Update parent-child relationships

### Algorithms
- **Depth-First Search**: Tree traversal for operations
- **Breadth-First Search**: Level-order processing
- **Path Finding**: Navigate between any two nodes
- **Cycle Detection**: Prevent circular references

## Performance Optimizations ⚡

### Efficient Updates
- **Immutable Updates**: Prevent unnecessary re-renders
- **Selective Re-rendering**: Component-level optimization
- **Memoization**: Cache expensive calculations
- **Virtual Scrolling**: Handle large datasets efficiently

### Memory Management
- **Object Reuse**: Minimize garbage collection
- **Event Cleanup**: Proper listener management
- **Component Cleanup**: useEffect cleanup functions
- **Storage Limits**: Monitor local storage usage

## Data Flow Patterns 🔄

### Unidirectional Flow
1. **User Interaction**: Click, drag, type
2. **Event Handler**: Process user input
3. **Context Action**: Update global state
4. **State Change**: Trigger re-renders
5. **UI Update**: Reflect new state

### Error Handling
- **Validation**: Input validation at entry points
- **Graceful Degradation**: Fallback for data issues
- **Error Boundaries**: Catch and handle React errors
- **User Feedback**: Clear error messages and recovery

## Advanced Patterns 🚀

### Custom Hooks Integration
\`\`\`typescript
const useTreeOperations = () => {
  const { nodes, setNodes } = useContext(TreeContext);
  
  const addNode = useCallback((parentId: string, nodeData: Partial<NodeData>) => {
    // Implementation with optimistic updates
  }, [nodes, setNodes]);
  
  return { addNode, deleteNode, moveNode };
};
\`\`\`

### State Synchronization
- **Multiple Components**: Consistent state across UI
- **Real-time Updates**: Immediate reflection of changes
- **Conflict Resolution**: Handle concurrent modifications
- **State Persistence**: Maintain state across sessions

## Future Enhancements 🔮

### Planned Improvements
- **Real-time Collaboration**: Multi-user editing
- **Version History**: Track and revert changes
- **Cloud Sync**: Optional cloud storage integration
- **Advanced Search**: Full-text search across hierarchies

### Scalability Considerations
- **Large Datasets**: Optimize for thousands of nodes
- **Lazy Loading**: Load subtrees on demand
- **Incremental Updates**: Partial re-rendering
- **Background Processing**: Non-blocking operations

Build robust, scalable applications with this solid data foundation! 🏛️`, 
      parent: architectureId 
    },
    
    // Usage Guide Sub-sections
    { 
      id: createHierarchyId, 
      name: '🌱 Creating Effective Hierarchies', 
      description: `# Creating Effective Hierarchies

## Planning Your Hierarchy 📋

### Start with Purpose
- **Define Objectives**: What do you want to achieve?
- **Identify Audience**: Who will use this hierarchy?
- **Set Scope**: What topics/concepts will be included?
- **Choose Depth**: How detailed should you go?

### Hierarchical Thinking
- **Top-Down Approach**: Start with broad categories
- **Bottom-Up Approach**: Begin with specific items and group
- **Mixed Strategy**: Combine both approaches as needed
- **Iterative Design**: Refine through multiple passes

## Structure Best Practices 🏗️

### The 7±2 Rule
- **Optimal Branching**: 5-9 children per node works best
- **Cognitive Load**: Too many options overwhelm users
- **Logical Grouping**: Combine related items when possible
- **Balanced Trees**: Avoid extremely wide or deep structures

### Naming Conventions
- **Consistent Style**: Use similar patterns throughout
- **Descriptive Names**: Clear, unambiguous terminology
- **Action-Oriented**: Use verbs for process steps
- **Hierarchy Indicators**: Show relationships in names

## Content Organization 📚

### Logical Flow
- **Sequential Order**: Arrange by importance or chronology
- **Alphabetical Sorting**: Use when no natural order exists
- **Frequency-Based**: Most-used items first
- **Conceptual Grouping**: Related ideas together

### Depth Management
- **3-5 Levels**: Optimal for most hierarchies
- **Avoid Going Too Deep**: 7+ levels become unwieldy
- **Consistent Granularity**: Similar detail level per depth
- **Progressive Disclosure**: Show details only when needed

## Common Hierarchy Patterns 🔄

### Knowledge Organization
\`\`\`
Subject → Topics → Subtopics → Specific Examples
Education → Math → Algebra → Linear Equations
\`\`\`

### Process Documentation
\`\`\`
Process → Phases → Steps → Actions
Project → Planning → Requirements → Gather Stakeholder Input
\`\`\`

### Product/Service Structure
\`\`\`
Category → Products → Features → Specifications
Electronics → Laptops → Performance → Processing Power
\`\`\`

### Organizational Hierarchy
\`\`\`
Organization → Departments → Teams → Roles
Company → Engineering → Frontend → Senior Developer
\`\`\`

## Quality Checklist ✅

### Structure Review
- [ ] **Clear Purpose**: Each node has a defined role
- [ ] **Logical Relationships**: Parent-child connections make sense
- [ ] **Balanced Distribution**: No extremely heavy or light branches
- [ ] **Complete Coverage**: All relevant topics included
- [ ] **No Redundancy**: Eliminate duplicate concepts

### Usability Check
- [ ] **Easy Navigation**: Users can find information quickly
- [ ] **Intuitive Names**: Terminology is familiar to users
- [ ] **Consistent Style**: Similar formatting throughout
- [ ] **Appropriate Depth**: Not too shallow or deep
- [ ] **Clear Scope**: Boundaries are well-defined

## Real-World Examples 🌍

### Educational Curriculum
\`\`\`
Course → Modules → Lessons → Activities → Exercises
\`\`\`

### Business Strategy
\`\`\`
Strategy → Objectives → Initiatives → Projects → Tasks
\`\`\`

### Content Management
\`\`\`
Website → Sections → Pages → Components → Elements
\`\`\`

### Research Organization
\`\`\`
Research Area → Topics → Questions → Methods → Results
\`\`\`

Transform complex information into clear, navigable structures! 🗺️`, 
      parent: usageGuideId 
    },
    
    { 
      id: managingNodesId, 
      name: '🔧 Managing Nodes & Content', 
      description: `# Managing Nodes & Content

## Node Lifecycle Management 🔄

### Creating Nodes
- **Add Child**: Create sub-concepts under existing nodes
- **Bulk Creation**: Add multiple related nodes quickly
- **Template Usage**: Start with predefined structures
- **Import Content**: Bring in existing hierarchies

### Editing Operations
- **Rename Nodes**: Update names as concepts evolve
- **Modify Descriptions**: Enhance content with markdown
- **Restructure**: Move nodes to better locations
- **Merge/Split**: Combine or divide concepts as needed

### Content Enhancement
- **Rich Descriptions**: Use markdown for formatting
- **Visual Elements**: Add emojis and symbols
- **Cross-References**: Link to related concepts
- **External Links**: Connect to resources and references

## Advanced Node Operations 🚀

### Batch Operations
- **Multi-Select**: Work with multiple nodes (coming soon!)
- **Copy/Paste**: Duplicate structures efficiently
- **Find & Replace**: Update content across nodes
- **Bulk Edit**: Modify multiple nodes simultaneously

### Content Templates
- **Standard Formats**: Consistent node structures
- **Reusable Patterns**: Common hierarchy templates
- **Style Guidelines**: Maintain visual consistency
- **Quality Standards**: Ensure complete documentation

## Organization Strategies 📊

### Categorization Methods
- **By Function**: Group by what items do
- **By Topic**: Organize around subject areas
- **By Importance**: Priority-based arrangement
- **By Timeline**: Chronological ordering
- **By User Type**: Audience-specific organization

### Maintenance Practices
- **Regular Reviews**: Periodic structure assessment
- **Content Updates**: Keep information current
- **Dead Link Removal**: Clean up broken references
- **Redundancy Elimination**: Remove duplicate content
- **Performance Optimization**: Maintain efficient structure

## Content Quality Guidelines 📝

### Writing Standards
- **Clear Language**: Use simple, accessible terms
- **Consistent Tone**: Maintain uniform voice
- **Proper Grammar**: Professional presentation
- **Scannable Format**: Easy to read quickly
- **Actionable Content**: Provide practical guidance

### Markdown Best Practices
\`\`\`markdown
# Use Headers for Structure
## Organize with Subheaders
- Use bullet points for lists
- **Bold** for emphasis
- *Italics* for subtle emphasis
- [Links](url) for references
- \`Code\` for technical terms
\`\`\`

### Visual Enhancement
- **Emojis**: Add visual interest and categorization
- **Consistent Symbols**: Use similar icons for same types
- **Color Coordination**: Plan for future color features
- **White Space**: Use spacing for readability

## Collaboration Features 🤝

### Sharing & Export
- **JSON Export**: Share complete hierarchies
- **Selective Export**: Share specific branches (coming soon!)
- **Print-Friendly**: Format for documentation
- **Version Control**: Track changes over time

### Review Process
- **Peer Review**: Collaborative content improvement
- **Feedback Integration**: Incorporate suggestions
- **Quality Assurance**: Systematic content checking
- **Approval Workflows**: Formal review processes

## Troubleshooting Common Issues 🔍

### Performance Problems
- **Large Hierarchies**: Optimize for many nodes
- **Deep Nesting**: Avoid excessive depth
- **Heavy Content**: Balance detail with performance
- **Memory Usage**: Monitor browser resource usage

### Content Issues
- **Broken Structure**: Fix logical inconsistencies
- **Duplicate Content**: Identify and merge duplicates
- **Orphaned Nodes**: Reconnect isolated content
- **Incomplete Information**: Fill gaps in documentation

### User Experience
- **Navigation Difficulties**: Simplify complex structures
- **Information Overload**: Break down complex concepts
- **Unclear Relationships**: Clarify parent-child connections
- **Inconsistent Formatting**: Standardize presentation

## Maintenance Workflows 🔄

### Daily Operations
- **Content Updates**: Regular information refresh
- **Structure Adjustments**: Minor organizational changes
- **Quality Checks**: Quick content review
- **User Feedback**: Address immediate concerns

### Weekly Reviews
- **Structure Assessment**: Overall organization review
- **Content Audit**: Systematic quality check
- **Performance Analysis**: System efficiency review
- **Backup Creation**: Regular data preservation

### Monthly Planning
- **Strategic Review**: Long-term structure planning
- **Major Restructuring**: Significant organizational changes
- **Template Updates**: Refresh standard formats
- **Best Practice Review**: Process improvement

Master the art of content organization and node management! 🎯`, 
      parent: usageGuideId 
    },
    
    { 
      id: exportingDataId, 
      name: '📤 Exporting & Sharing Data', 
      description: `# Exporting & Sharing Data

## Export Formats & Options 📁

### JSON Export (Primary)
- **Complete Structure**: Full hierarchy with all metadata
- **Human Readable**: Easy to view and edit in text editors
- **Version Control**: Perfect for Git and change tracking
- **Import Compatible**: Seamless re-import into application

### Export Process Walkthrough
1. **Prepare for Export**: Review hierarchy completeness
2. **Click Export Button**: Located in main toolbar
3. **Choose Filename**: Use descriptive, date-stamped names
4. **Download File**: Automatic save to downloads folder
5. **Verify Export**: Quick check of file contents

### What Gets Exported
- **Node Data**: Names, descriptions, and unique IDs
- **Hierarchy Structure**: Parent-child relationships
- **Metadata**: Creation timestamps and version info
- **Formatting**: Markdown content preserved
- **Settings**: Configuration and preferences (coming soon!)

## File Organization Strategies 🗂️

### Naming Conventions
\`\`\`
[Project]-[Version]-[Date].json
concept-hierarchy-v1.2-2024-12-25.json
documentation-final-2024-12-25.json
research-notes-draft-2024-12-25.json
\`\`\`

### Version Management
- **Incremental Versions**: v1.0, v1.1, v1.2 for updates
- **Date Stamps**: Include export date for reference
- **Status Indicators**: draft, review, final, archived
- **Project Codes**: Short prefixes for easy identification

### Storage Organization
\`\`\`
Project Hierarchies/
├── Active Projects/
│   ├── project-a-current.json
│   └── project-b-wip.json
├── Archived/
│   ├── 2024/
│   └── 2023/
├── Templates/
│   ├── education-template.json
│   └── business-template.json
└── Backups/
    ├── Daily/
    └── Weekly/
\`\`\`

## Sharing & Collaboration 🤝

### File Sharing Methods
- **Email Attachments**: Simple for small teams
- **Cloud Storage**: Dropbox, Google Drive, OneDrive
- **Version Control**: Git repositories for developers
- **Project Management**: Attach to tickets and tasks

### Collaboration Workflows
- **Round-Robin Editing**: Sequential team editing
- **Branch-Based**: Parallel development of sections
- **Review Cycles**: Structured feedback processes
- **Merge Strategies**: Combining multiple contributions

### Best Practices for Teams
- **Clear Ownership**: Define who manages what sections
- **Regular Sync**: Scheduled sharing and updates
- **Conflict Resolution**: Procedures for handling disagreements
- **Communication**: Document changes and rationale

## Advanced Export Features 🚀

### Selective Export (Coming Soon)
- **Branch Export**: Export specific subtrees only
- **Filtered Export**: Export based on criteria
- **Template Creation**: Save reusable structure patterns
- **Custom Formats**: PDF, HTML, and other formats

### Automation Options
- **Scheduled Exports**: Automatic backup creation
- **API Integration**: Connect with other tools
- **Webhook Support**: Trigger exports from events
- **Batch Processing**: Export multiple hierarchies

## Import & Restoration 📥

### Import Process
1. **File Validation**: Automatic format checking
2. **Preview Changes**: See what will be imported
3. **Merge Options**: Choose how to handle existing data
4. **Conflict Resolution**: Handle duplicate or conflicting data
5. **Import Confirmation**: Finalize the import process

### Import Strategies
- **Replace All**: Complete replacement of current hierarchy
- **Merge Smart**: Intelligent combination of structures
- **Append Branch**: Add imported content as subtree
- **Selective Import**: Choose specific nodes to import

### Recovery Procedures
- **Backup Restoration**: Recover from previous exports
- **Partial Recovery**: Restore specific sections
- **Data Validation**: Ensure integrity after import
- **Rollback Options**: Undo problematic imports

## External Integration 🔗

### Documentation Systems
- **Wiki Integration**: Import into knowledge bases
- **CMS Systems**: Content management system import
- **Documentation Generators**: Automated doc creation
- **Learning Platforms**: Educational content import

### Development Tools
- **Code Documentation**: Generate API docs from hierarchies
- **Project Planning**: Import into project management tools
- **Issue Tracking**: Create tickets from hierarchy items
- **Architecture Diagrams**: Generate visual representations

### Data Analysis
- **Spreadsheet Import**: Convert to CSV for analysis
- **Database Integration**: Import into structured databases
- **Reporting Tools**: Generate reports from hierarchy data
- **Visualization**: Create charts and graphs

## Security & Privacy 🔒

### Data Protection
- **Local Storage**: Data never leaves your device
- **Encryption Options**: Encrypt exported files externally
- **Access Control**: Manage who can access exports
- **Audit Trails**: Track export and sharing activities

### Privacy Considerations
- **Sensitive Content**: Review before sharing
- **Redaction Options**: Remove confidential information
- **Anonymization**: Replace identifying information
- **Compliance**: Meet organizational security requirements

### Best Security Practices
- **Regular Backups**: Multiple backup locations
- **Access Logging**: Track file access and modifications
- **Secure Sharing**: Use encrypted channels for sensitive data
- **Regular Reviews**: Periodic security assessment

Transform your hierarchies into shareable, valuable assets! 📊🌟`, 
      parent: usageGuideId 
    },
    
    { 
      id: keyboardShortcutsId, 
      name: '⌨️ Keyboard Shortcuts & Efficiency Tips', 
      description: `# Keyboard Shortcuts & Efficiency Tips

## Core Navigation Shortcuts ⚡

### Tree Navigation
- **↑/↓ Arrow Keys**: Move between nodes
- **←/→ Arrow Keys**: Expand/collapse nodes
- **Home**: Jump to root node
- **End**: Jump to last visible node
- **Page Up/Down**: Scroll tree quickly
- **Ctrl + F**: Search within hierarchy (coming soon!)

### Node Operations
- **Enter**: Edit selected node
- **Ctrl + N**: Add new child node
- **Ctrl + D**: Duplicate selected node
- **Delete**: Remove selected node (with confirmation)
- **F2**: Rename node quickly
- **Escape**: Cancel current operation

## Advanced Shortcuts 🚀

### Editing & Content
- **Ctrl + S**: Manual save (auto-save is default)
- **Ctrl + Z**: Undo last action (coming soon!)
- **Ctrl + Y**: Redo action (coming soon!)
- **Ctrl + A**: Select all text in editor
- **Ctrl + B**: Bold text in markdown
- **Ctrl + I**: Italic text in markdown

### Clipboard Operations
- **Ctrl + C**: Copy selected node
- **Ctrl + V**: Paste as child of selected node
- **Ctrl + X**: Cut selected node
- **Shift + Ctrl + V**: Paste as sibling
- **Alt + Ctrl + V**: Paste special options

### Application Controls
- **Ctrl + E**: Export hierarchy
- **Ctrl + O**: Import hierarchy
- **Ctrl + Shift + N**: New hierarchy
- **F5**: Refresh/reload application
- **F11**: Toggle fullscreen mode

## Mouse & Touchpad Efficiency 🖱️

### Click Operations
- **Single Click**: Select node
- **Double Click**: Edit node quickly
- **Right Click**: Context menu (coming soon!)
- **Middle Click**: Open capability card
- **Ctrl + Click**: Multi-select (coming soon!)

### Drag & Drop Techniques
- **Standard Drag**: Move node to new parent
- **Ctrl + Drag**: Copy node to new location
- **Shift + Drag**: Move as sibling
- **Alt + Drag**: Advanced placement options
- **Precision Dropping**: Use visual guides for exact placement

## Workflow Optimization 📈

### Quick Creation Patterns
1. **Outline Method**: Create structure first, add details later
2. **Top-Down**: Start with main categories, then drill down
3. **Bottom-Up**: Begin with details, organize into categories
4. **Hybrid Approach**: Mix strategies based on content type

### Bulk Operations
- **Template Creation**: Build reusable node structures
- **Copy-Paste Workflows**: Duplicate similar structures
- **Batch Editing**: Modify multiple nodes efficiently
- **Import Patterns**: Use existing hierarchies as starting points

### Time-Saving Techniques
- **Markdown Shortcuts**: Use formatting for quick styling
- **Emoji Shortcuts**: Standard emoji codes (e.g., :star: → ⭐)
- **Auto-Complete**: Let browser suggest repeated text
- **Template Libraries**: Maintain collection of useful structures

## Productivity Features 🎯

### Focus Modes
- **Collapse All**: Ctrl + Shift + ← (overview mode)
- **Expand All**: Ctrl + Shift + → (detail mode)
- **Focus Node**: Hide other branches temporarily
- **Zen Mode**: Minimize distractions (coming soon!)

### Quick Access
- **Recent Hierarchies**: Quick access to recent work
- **Favorites**: Bookmark frequently used nodes
- **Search Results**: Jump to specific content
- **History Navigation**: Browse previous edits

### Batch Processing
- **Find & Replace**: Update content across multiple nodes
- **Style Application**: Apply formatting to multiple items
- **Structure Changes**: Reorganize multiple branches
- **Quality Checks**: Validate content across hierarchy

## Customization Options ⚙️

### Interface Preferences
- **Theme Selection**: Choose visual appearance
- **Layout Options**: Customize workspace arrangement
- **Font Settings**: Adjust text size and family
- **Color Schemes**: Personalize visual elements

### Behavioral Settings
- **Auto-Save Interval**: Control save frequency
- **Confirmation Dialogs**: Toggle safety prompts
- **Animation Speed**: Adjust UI animation timing
- **Default Templates**: Set preferred starting structures

## Advanced Power User Tips 💡

### Expert Workflows
- **Keyboard-Only Navigation**: Complete tasks without mouse
- **Rapid Prototyping**: Quickly create concept outlines
- **Content Migration**: Efficiently import from other sources
- **Template Management**: Build and maintain structure libraries

### Performance Optimization
- **Large Hierarchies**: Techniques for managing complex structures
- **Memory Management**: Keep browser performance optimal
- **Startup Speed**: Faster application loading
- **Responsive Usage**: Smooth operation on all devices

### Integration Techniques
- **Browser Bookmarks**: Quick access to hierarchies
- **External Editors**: Work with exported content
- **Automation Scripts**: Custom workflow enhancements
- **API Usage**: Programmatic interaction (future feature)

## Mobile & Touch Optimization 📱

### Touch Gestures
- **Tap**: Select and interact with nodes
- **Long Press**: Access context options
- **Pinch to Zoom**: Scale tree view
- **Swipe**: Navigate between sections
- **Two-Finger Scroll**: Move through large hierarchies

### Mobile-Specific Features
- **Touch-Friendly Buttons**: Larger interactive elements
- **Gesture Navigation**: Intuitive touch controls
- **Responsive Layout**: Optimal display on small screens
- **Offline Capability**: Work without internet connection

## Accessibility Features ♿

### Keyboard Accessibility
- **Tab Navigation**: Complete keyboard control
- **Screen Reader Support**: ARIA labels and descriptions
- **Focus Indicators**: Clear visual focus states
- **Skip Links**: Quick navigation options

### Visual Accessibility
- **High Contrast**: Enhanced visibility options
- **Zoom Support**: Browser zoom compatibility
- **Font Scaling**: Adjustable text sizes
- **Color Independence**: Information not solely color-dependent

Master these techniques to become a hierarchy creation powerhouse! 🚀⚡`, 
      parent: usageGuideId 
    },
    
    // Advanced Sub-sections
    { 
      id: customizationId, 
      name: '🎨 Customization & Personalization', 
      description: `# Customization & Personalization

## Visual Customization 🖌️

### Theme Options
- **Light Theme**: Clean, bright interface for day use
- **Dark Theme**: Easy on eyes for extended sessions
- **High Contrast**: Enhanced visibility for accessibility
- **Custom Themes**: Create your own color schemes (coming soon!)

### Interface Personalization
- **Layout Preferences**: Customize workspace arrangement
- **Panel Sizes**: Adjust tree and content panel widths
- **Font Settings**: Choose typeface and size preferences
- **Icon Styles**: Select from different icon sets

### Visual Hierarchy
- **Indentation Settings**: Control tree depth visualization
- **Node Styling**: Customize node appearance
- **Color Coding**: Assign colors to different node types
- **Visual Indicators**: Custom symbols and badges

## Behavioral Customization ⚙️

### Auto-Save Configuration
- **Save Frequency**: Control how often data is saved
- **Save Triggers**: Define what actions trigger saves
- **Backup Retention**: Number of backup versions to keep
- **Recovery Options**: Automatic recovery preferences

### Interaction Preferences
- **Click Behavior**: Single vs double-click actions
- **Drag Sensitivity**: Adjust drag-and-drop responsiveness
- **Confirmation Dialogs**: Choose which actions need confirmation
- **Animation Speed**: Control interface animation timing

### Default Settings
- **New Node Templates**: Default content for new nodes
- **Hierarchy Structure**: Preferred starting organization
- **Export Settings**: Default export format and options
- **Import Behavior**: How to handle imported content

## Content Customization 📝

### Template System
- **Node Templates**: Predefined content structures
- **Hierarchy Templates**: Complete tree starting points
- **Style Templates**: Formatting and presentation standards
- **Custom Fields**: Additional data fields (future feature)

### Markdown Enhancements
- **Custom CSS**: Personalized styling for descriptions
- **Syntax Highlighting**: Enhanced code block display
- **Custom Shortcuts**: Personal markdown abbreviations
- **Link Behavior**: How external links are handled

### Content Defaults
- **Description Format**: Standard structure for new nodes
- **Naming Conventions**: Automatic naming patterns
- **Emoji Sets**: Preferred emoji collections
- **Language Settings**: Localization preferences

## Workspace Customization 🖥️

### Layout Options
- **Panel Arrangement**: Customize interface layout
- **Toolbar Configuration**: Choose visible tools and options
- **Sidebar Content**: Select what appears in side panels
- **Status Bar**: Information displayed at bottom

### Productivity Features
- **Quick Access Bar**: Shortcuts to frequently used features
- **Recent Items**: Number of recent hierarchies to show
- **Search Settings**: Search behavior and results display
- **Notification Preferences**: What alerts to show

### Multi-Monitor Support
- **Window Management**: Optimal display across screens
- **Panel Distribution**: Spread interface across monitors
- **Resolution Adaptation**: Adjust for different screen sizes
- **Scaling Options**: Handle high-DPI displays

## Advanced Customization 🚀

### API Integration
- **Webhook Configuration**: Connect to external services
- **Export Automation**: Scheduled or triggered exports
- **Import Sources**: Automatic data import from other tools
- **Custom Integrations**: Build connections to other systems

### Plugin System (Future)
- **Extension Framework**: Add custom functionality
- **Community Plugins**: Install user-created extensions
- **Custom Widgets**: Add specialized interface elements
- **Data Processors**: Custom import/export formats

### Performance Tuning
- **Rendering Options**: Optimize for large hierarchies
- **Memory Management**: Control resource usage
- **Caching Settings**: Improve application responsiveness
- **Background Processing**: Handle heavy operations efficiently

## User Profiles & Settings 👤

### Profile Management
- **Multiple Profiles**: Different settings for different use cases
- **Profile Switching**: Quick changes between configurations
- **Settings Export**: Share configurations with others
- **Cloud Sync**: Synchronize settings across devices (future)

### Workspace Presets
- **Research Mode**: Optimized for information gathering
- **Planning Mode**: Focused on project organization
- **Presentation Mode**: Clean display for sharing
- **Development Mode**: Enhanced for technical documentation

## Personalization Best Practices 💡

### Getting Started
1. **Start Simple**: Begin with basic customizations
2. **Experiment Gradually**: Try one change at a time
3. **Save Configurations**: Backup your preferred settings
4. **Reset When Needed**: Return to defaults if overwhelmed

### Optimization Strategies
- **Task-Based Setup**: Configure for your specific workflows
- **Performance Balance**: Customize without sacrificing speed
- **Accessibility First**: Ensure changes don't hinder usability
- **Regular Review**: Periodically assess and update settings

### Common Customization Patterns
- **Minimalist Setup**: Clean, distraction-free interface
- **Power User Config**: Maximum features and shortcuts
- **Team Standard**: Consistent setup across organization
- **Project-Specific**: Different settings for different work types

## Sharing Customizations 🤝

### Configuration Export
- **Settings Files**: Export customization preferences
- **Template Sharing**: Share node and hierarchy templates
- **Style Sheets**: Distribute custom CSS and themes
- **Best Practices**: Document successful configurations

### Team Standardization
- **Organization Themes**: Consistent branding across team
- **Workflow Standards**: Shared productivity configurations
- **Template Libraries**: Common starting points for projects
- **Training Materials**: Help others adopt effective setups

## Troubleshooting Customizations 🔧

### Common Issues
- **Performance Impact**: Heavy customizations slowing interface
- **Compatibility Problems**: Settings conflicts between features
- **Display Issues**: Customizations not appearing correctly
- **Reset Procedures**: How to return to working state

### Recovery Options
- **Backup Restoration**: Recover previous working settings
- **Incremental Reset**: Remove problematic customizations
- **Safe Mode**: Load with minimal customizations
- **Support Resources**: Where to get help with customization issues

Transform the application into your perfect productivity environment! 🎯✨`, 
      parent: advancedId 
    },
    
    { 
      id: integrationId, 
      name: '🔗 Integration & External Tools', 
      description: `# Integration & External Tools

## Export Integrations 📤

### Documentation Systems
- **Confluence**: Export to wiki pages and spaces
- **Notion**: Convert hierarchies to Notion databases
- **Obsidian**: Generate markdown files with backlinks
- **GitBook**: Create structured documentation
- **MediaWiki**: Export to wiki format

### Project Management
- **Jira**: Convert nodes to issues and epics
- **Trello**: Generate boards and cards from hierarchy
- **Asana**: Create tasks and project structures
- **Monday.com**: Build project workflows
- **Linear**: Generate development tickets

### Development Tools
- **GitHub Issues**: Create issue templates from nodes
- **GitLab**: Generate project documentation
- **Azure DevOps**: Create work items and features
- **Bitbucket**: Generate repository documentation
- **Code Documentation**: Generate API docs from structure

## Import Sources 📥

### Existing Documentation
- **Markdown Files**: Import from existing docs
- **JSON Structures**: Convert from other hierarchy tools
- **CSV/Excel**: Import tabular data as hierarchies
- **XML Files**: Convert structured data
- **API Responses**: Import from external services

### Content Management
- **WordPress**: Import post hierarchies
- **Drupal**: Convert taxonomy structures
- **SharePoint**: Import document structures
- **Google Drive**: Convert folder hierarchies
- **Dropbox**: Import file organization

### Research Tools
- **Zotero**: Import research bibliographies
- **Mendeley**: Convert reference hierarchies
- **EndNote**: Import citation structures
- **Roam Research**: Convert graph structures
- **RemNote**: Import hierarchical notes

## API Integration Framework 🔧

### Webhook Support
- **Export Triggers**: Automatic export on changes
- **Import Notifications**: Alerts when new data available
- **Status Updates**: Real-time synchronization status
- **Error Handling**: Graceful failure and retry logic

### REST API (Future)
- **CRUD Operations**: Full programmatic control
- **Bulk Operations**: Efficient large-scale modifications
- **Authentication**: Secure access control
- **Rate Limiting**: Prevent system overload

### GraphQL Support (Future)
- **Flexible Queries**: Request exactly needed data
- **Real-time Subscriptions**: Live update notifications
- **Schema Introspection**: Discover available operations
- **Batch Operations**: Efficient multiple requests

## Automation Workflows 🤖

### Zapier Integration
- **Trigger Events**: New nodes, modifications, exports
- **Action Targets**: Send data to hundreds of apps
- **Multi-Step Workflows**: Complex automation chains
- **Error Handling**: Robust failure recovery

### IFTTT Support
- **Simple Triggers**: Basic event-based automation
- **Mobile Integration**: Connect with phone and IoT devices
- **Social Media**: Automatic posting and sharing
- **Productivity Apps**: Connect with task managers

### Custom Automation
- **Scheduled Jobs**: Time-based automatic operations
- **Event-Driven**: React to specific changes
- **Batch Processing**: Handle multiple items efficiently
- **Monitoring**: Track automation success and failures

## Data Synchronization 🔄

### Cloud Storage
- **Google Drive**: Automatic backup and sync
- **Dropbox**: File-based synchronization
- **OneDrive**: Microsoft ecosystem integration
- **iCloud**: Apple device synchronization
- **Amazon S3**: Enterprise cloud storage

### Version Control
- **Git Integration**: Track changes like code
- **Branch Management**: Parallel development paths
- **Merge Conflicts**: Resolve simultaneous edits
- **History Tracking**: Complete change audit trail

### Real-time Collaboration
- **Operational Transform**: Conflict-free simultaneous editing
- **Presence Awareness**: See who's working on what
- **Comment System**: Collaborative discussion threads
- **Change Notifications**: Real-time update alerts

## Business Intelligence 📊

### Analytics Platforms
- **Google Analytics**: Track usage patterns
- **Mixpanel**: User behavior analysis
- **Amplitude**: Product analytics
- **Custom Dashboards**: Build specific metrics views

### Reporting Tools
- **Tableau**: Advanced data visualization
- **Power BI**: Microsoft business intelligence
- **Google Data Studio**: Free reporting platform
- **Custom Reports**: Generate specific insights

### Data Warehousing
- **BigQuery**: Google cloud analytics
- **Snowflake**: Cloud data platform
- **Redshift**: Amazon data warehouse
- **Custom ETL**: Extract, transform, load processes

## Development Ecosystem 🛠️

### Code Generation
- **API Documentation**: Generate from hierarchy structure
- **Database Schemas**: Convert to database designs
- **Configuration Files**: Generate app config from hierarchy
- **Test Cases**: Create test suites from structure

### Development Tools
- **VS Code Extension**: Direct integration with editor
- **CLI Tools**: Command-line interface for automation
- **Browser Extensions**: Enhanced web browsing integration
- **Mobile Apps**: Companion mobile applications

### Monitoring & Observability
- **Application Monitoring**: Track system performance
- **Error Tracking**: Capture and analyze errors
- **Usage Analytics**: Understand user behavior
- **Performance Metrics**: Monitor system health

## Enterprise Integration 🏢

### Single Sign-On (SSO)
- **SAML**: Enterprise authentication standard
- **OAuth**: Modern authorization framework
- **LDAP**: Directory service integration
- **Active Directory**: Microsoft enterprise directory

### Security & Compliance
- **Audit Logging**: Complete activity tracking
- **Data Encryption**: Protect sensitive information
- **Access Controls**: Role-based permissions
- **Compliance Reporting**: Meet regulatory requirements

### Enterprise Features
- **Multi-tenant**: Isolate different organizations
- **Custom Branding**: White-label deployments
- **SLA Monitoring**: Service level agreements
- **Priority Support**: Enhanced customer service

## Integration Best Practices 💡

### Planning Integration
1. **Define Requirements**: Clear integration objectives
2. **Map Data Flow**: Understand how data moves
3. **Test Thoroughly**: Validate all integration points
4. **Monitor Performance**: Track integration health
5. **Document Process**: Maintain integration documentation

### Security Considerations
- **API Keys**: Secure credential management
- **Data Privacy**: Protect sensitive information
- **Access Control**: Limit integration permissions
- **Audit Trails**: Track all integration activities

### Performance Optimization
- **Batch Operations**: Group requests efficiently
- **Caching Strategy**: Reduce redundant API calls
- **Rate Limiting**: Respect external service limits
- **Error Recovery**: Handle failures gracefully

## Future Integration Roadmap 🚀

### Planned Integrations
- **Microsoft Office**: Direct Word/Excel integration
- **Slack**: Team communication integration
- **Discord**: Community and gaming integration
- **Zoom**: Meeting and webinar integration

### AI & Machine Learning
- **Natural Language Processing**: Automatic content analysis
- **Recommendation Engine**: Suggest improvements
- **Auto-categorization**: Intelligent content organization
- **Sentiment Analysis**: Understand content tone

Connect your hierarchies to your entire digital ecosystem! 🌐🔗`, 
      parent: advancedId 
    },
    
    { 
      id: performanceId, 
      name: '⚡ Performance Optimization', 
      description: `# Performance Optimization

## Understanding Performance Factors 📊

### Client-Side Performance
- **Browser Rendering**: How the interface displays and updates
- **Memory Usage**: RAM consumption during operation
- **CPU Utilization**: Processing power for complex operations
- **Storage Access**: Local storage read/write performance
- **Network Impact**: Even though local, some operations have overhead

### Hierarchy Size Impact
- **Node Count**: Performance scales with number of nodes
- **Depth Levels**: Very deep hierarchies can impact navigation
- **Content Size**: Large descriptions affect memory usage
- **Update Frequency**: How often changes are made

### Browser Considerations
- **JavaScript Engine**: V8 (Chrome), SpiderMonkey (Firefox) differences
- **Memory Management**: Garbage collection patterns
- **Rendering Engine**: How different browsers handle DOM updates
- **Storage Limits**: Browser local storage constraints

## Optimization Strategies 🚀

### Efficient Data Structures
- **Flat Array Storage**: Optimized for search and manipulation
- **Index Mapping**: Quick parent-child lookups
- **Lazy Loading**: Load subtrees only when needed
- **Virtual Scrolling**: Render only visible nodes

### Memory Management
- **Object Pooling**: Reuse objects instead of creating new ones
- **Event Cleanup**: Proper removal of event listeners
- **Component Unmounting**: Clean React component lifecycle
- **Garbage Collection**: Minimize memory leaks

### Rendering Optimization
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Cache expensive computations
- **Virtualization**: Only render visible tree portions
- **Batched Updates**: Group multiple changes together

## Large Hierarchy Best Practices 📈

### Structure Guidelines
- **Optimal Depth**: Keep hierarchies under 10 levels deep
- **Branch Balance**: Avoid extremely wide or narrow branches
- **Content Distribution**: Distribute information evenly
- **Logical Grouping**: Group related concepts to reduce navigation

### Content Management
- **Description Length**: Balance detail with performance
- **Markdown Complexity**: Simple formatting performs better
- **External Links**: Use sparingly to avoid loading delays
- **Image Content**: Optimize or link externally

### Navigation Patterns
- **Progressive Disclosure**: Show details only when needed
- **Collapse by Default**: Start with collapsed subtrees
- **Search Functionality**: Quick access to specific content
- **Breadcrumb Navigation**: Clear path through hierarchy

## Browser Optimization 🌐

### Chrome Optimization
- **DevTools**: Use Performance tab to identify bottlenecks
- **Memory Tab**: Monitor memory usage patterns
- **Extensions**: Disable unnecessary browser extensions
- **Hardware Acceleration**: Enable for better rendering

### Firefox Optimization
- **about:config**: Tune performance settings
- **Developer Tools**: Network and performance analysis
- **Memory Tools**: Track memory allocation
- **Privacy Settings**: Balance privacy with performance

### Safari Optimization
- **Web Inspector**: Debug performance issues
- **Storage Management**: Monitor local storage usage
- **Energy Impact**: Optimize for battery life
- **Privacy Features**: Understand tracking protection impact

## Performance Monitoring 📱

### Built-in Metrics
- **Load Time**: How quickly the application starts
- **Response Time**: Interface responsiveness to interactions
- **Memory Growth**: Track memory usage over time
- **Storage Usage**: Monitor local storage consumption

### Performance Indicators
- **Slow Operations**: Identify bottlenecks in common tasks
- **Error Rates**: Track and reduce error occurrences
- **User Experience**: Measure perceived performance
- **Resource Utilization**: CPU and memory efficiency

### Diagnostic Tools
- **Browser DevTools**: Built-in performance analysis
- **Lighthouse**: Automated performance auditing
- **Performance Observer**: Real-time performance monitoring
- **Custom Metrics**: Application-specific measurements

## Troubleshooting Performance Issues 🔍

### Common Problems
- **Slow Loading**: Application takes too long to start
- **Laggy Interface**: Delayed response to user interactions
- **Memory Leaks**: Gradually increasing memory usage
- **Storage Limits**: Reaching browser storage constraints

### Diagnostic Steps
1. **Identify Symptoms**: What specific performance issues?
2. **Measure Baseline**: Current performance metrics
3. **Isolate Variables**: Test with different data sizes
4. **Monitor Resources**: Track CPU, memory, storage usage
5. **Implement Solutions**: Apply targeted optimizations

### Quick Fixes
- **Browser Restart**: Clear temporary files and memory
- **Extension Disable**: Remove conflicting browser extensions
- **Cache Clear**: Reset browser cache and storage
- **Data Cleanup**: Remove unnecessary nodes and content

## Advanced Performance Techniques ⚡

### Code Splitting
- **Dynamic Imports**: Load features only when needed
- **Route-Based Splitting**: Separate page-level code
- **Component Lazy Loading**: Load components on demand
- **Feature Flags**: Enable/disable expensive features

### Caching Strategies
- **Browser Caching**: Leverage browser storage efficiently
- **Computation Caching**: Cache expensive calculations
- **Component Memoization**: Avoid redundant rendering
- **Data Caching**: Store frequently accessed information

### Background Processing
- **Web Workers**: Offload heavy computations
- **Idle Callbacks**: Use browser idle time efficiently
- **Debounced Operations**: Reduce operation frequency
- **Batched Updates**: Group multiple changes

## Mobile Performance 📱

### Touch Device Optimization
- **Touch Responsiveness**: Minimize touch delay
- **Scroll Performance**: Smooth scrolling experience
- **Gesture Recognition**: Efficient touch gesture handling
- **Viewport Management**: Optimal mobile layout

### Resource Constraints
- **Limited Memory**: Optimize for mobile RAM constraints
- **CPU Efficiency**: Minimize processing on mobile devices
- **Battery Life**: Reduce energy consumption
- **Network Awareness**: Consider mobile data usage

### Mobile Best Practices
- **Responsive Design**: Efficient layout for small screens
- **Touch Targets**: Appropriate button and link sizes
- **Loading States**: Clear feedback during operations
- **Offline Capability**: Work without network connection

## Future Performance Enhancements 🔮

### Planned Optimizations
- **Web Assembly**: High-performance computation modules
- **Service Workers**: Advanced caching and offline support
- **IndexedDB**: More efficient client-side database
- **Progressive Web App**: Native app-like performance

### Emerging Technologies
- **HTTP/3**: Faster network protocols
- **WebGPU**: Graphics processing acceleration
- **Streaming**: Real-time data streaming
- **Edge Computing**: Distributed processing

### Continuous Improvement
- **Performance Budgets**: Set and maintain performance targets
- **Automated Testing**: Regular performance regression testing
- **User Feedback**: Real-world performance insights
- **Optimization Cycles**: Regular performance review and improvement

Achieve lightning-fast performance for hierarchies of any size! ⚡🚀`, 
      parent: advancedId 
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