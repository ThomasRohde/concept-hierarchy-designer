# 📋 TODO: Concept Hierarchy Designer Feature Roadmap

## 🔄 Export System Enhancement

### 📤 Export Utility Functions
**Status:** 🟡 In Progress (JSON export exists)  
**Priority:** High  
**Files to create/modify:**
- `src/utils/exportUtils/` (new directory structure)
  - `exportUtils.ts` (main export orchestrator - modify existing)
  - `jsonExporter.ts` (extract existing JSON functionality)
  - `svgExporter.ts` (new - SVG tree diagram export)
  - `htmlExporter.ts` (new - standalone HTML export)
  - `pdfExporter.ts` (new - PDF document export)
  - `csvExporter.ts` (new - CSV data export)
  - `markdownExporter.ts` (new - Markdown documentation export)

**Current Implementation:**
- ✅ JSON export exists in `src/utils/exportUtils.ts` with `saveTreeAsJson` function
- ✅ Tree data structure supports hierarchical export via `TreeNode` type
- ✅ Capability card data available through `capabilityCardUtils.ts`

**Implementation Details:**

#### SVG Exporter
- Generate SVG tree diagrams using D3.js or similar
- Include node labels, descriptions, and visual hierarchy
- Support different layout algorithms (vertical, horizontal, radial)
- Configurable styling and dimensions

#### HTML Exporter  
- Create standalone HTML files with embedded CSS/JS
- Interactive navigation (expand/collapse nodes)
- Responsive design for different screen sizes
- Include search functionality within exported tree

#### PDF Exporter
- Use libraries like jsPDF or Puppeteer
- Multiple page layouts (tree diagram, detailed list, summary)
- Include metadata (creation date, tree statistics)
- Support for bookmarks and table of contents

#### CSV Exporter
- Flatten tree structure with depth indicators
- Include all node properties (id, label, description, depth, parent)
- Support for data analysis and spreadsheet import

#### Markdown Exporter
- Generate structured documentation
- Use nested lists or header hierarchy
- Include all descriptions with proper Markdown formatting
- Add table of contents and statistics

---

### 🃏 Capability Card Export Button
**Status:** 🔴 Not Started  
**Priority:** High  
**Files to modify:**
- `src/components/CapabilityCard.tsx` (add export button)
- `src/components/CapabilityCardModal.tsx` (add export options)
- `src/utils/capabilityCardUtils.ts` (add export-specific utilities)

**Current Implementation Analysis:**
- ✅ Capability cards show 3-generation view (parent, current, children)
- ✅ Modal system exists with keyboard shortcuts (ESC, Ctrl+Enter)
- ✅ Card data structure includes hierarchical relationships

**Implementation Plan:**
1. **Add Export Button to Capability Card**
   ```typescript
   // In CapabilityCard.tsx - add to button group
   <button onClick={handleExportCard} className="export-btn">
     <ExportIcon /> Export
   </button>
   ```

2. **Export Options Modal**
   - SVG: Vector graphic of the 3-generation view
   - PNG: Rasterized image with configurable DPI
   - HTML: Standalone card view with styling
   - PDF: Formatted card as PDF document

3. **Capability Card Specific Exports**
   - Include parent context, current node details, and children overview
   - Maintain visual hierarchy and relationships
   - Support custom styling and branding options

---

### 🌳 Main View Export Button  
**Status:** 🔴 Not Started  
**Priority:** High  
**Files to modify:**
- `src/components/Pages/MainContent.tsx` (add export button to header)
- `src/components/TreeControls.tsx` (integrate with existing controls)

**Current Implementation Analysis:**
- ✅ Main content shows full tree via `VirtualizedTree` component
- ✅ Tree controls already exist (New Tree, Save, Load buttons)
- ✅ Tree context provides complete tree state via `useTree()` hook

**Implementation Plan:**
1. **Add Export Button to Tree Controls**
   ```typescript
   // In TreeControls.tsx
   <ExportDropdown 
     treeData={tree}
     formats={['json', 'svg', 'html', 'pdf', 'csv', 'markdown']}
     onExport={handleTreeExport}
   />
   ```

2. **Export Options**
   - **Complete Tree**: All nodes, full hierarchy
   - **Visible Nodes**: Only expanded/visible portions
   - **Selected Branch**: Current selection and descendants
   - **Statistics**: Tree metrics and analytics

3. **Batch Export Options**
   - Multiple formats simultaneously
   - Zip archive for comprehensive exports
   - Custom export configurations and presets

---

## ⚙️ Admin Page Implementation

### 📊 Admin Dashboard
**Status:** 🔴 Not Started  
**Priority:** Medium  
**Files to create/modify:**
- `src/components/Pages/AdminPage.tsx` (new)
- `src/components/Layout/BurgerMenu.tsx` (add admin link)
- `src/router/AppRouter.tsx` (add admin route)
- `src/utils/adminUtils.ts` (new - admin-specific utilities)
- `src/utils/storageUtils.ts` (add admin functions)

**Current Implementation Analysis:**
- ✅ Burger menu exists with Home/About navigation in `BurgerMenu.tsx`
- ✅ Router system supports page navigation via `AppRouter.tsx`
- ✅ Storage utilities handle localStorage operations in `storageUtils.ts`
- ✅ Tree context manages application state

**Admin Page Features:**

#### 📈 Model Statistics Dashboard
```typescript
interface TreeStatistics {
  totalTrees: number;
  totalNodes: number;
  averageDepth: number;
  mostUsedLabels: string[];
  creationDates: Date[];
  storageUsage: number; // bytes
  lastModified: Date;
  magicWandUsage: {
    totalCalls: number;
    successRate: number;
    averageChildrenGenerated: number;
  };
}
```

**Statistics to Display:**
- 📊 Total number of concept trees
- 🌿 Total nodes across all trees  
- 📏 Average and maximum tree depth
- 🏷️ Most frequently used node labels
- 📅 Tree creation timeline and activity
- 💾 Local storage usage and quotas
- 🧠 Magic Wand API usage statistics
- ⚡ Performance metrics (load times, responsiveness)

#### 🔄 Hard Model Reset Function
```typescript
// In adminUtils.ts
export const performHardReset = async (): Promise<void> => {
  // Clear all localStorage data
  // Reset to default tree structure
  // Clear magic wand settings
  // Reset user preferences
  // Reload application state
}
```

**Reset Options:**
- **Complete Reset**: Remove all data, return to initial state
- **Selective Reset**: Choose what to preserve (trees, settings, etc.)
- **Backup Before Reset**: Auto-export all data before clearing
- **Import Default Tree**: Load predefined example tree structure

#### 🛡️ Admin Security
- Confirmation dialogs for destructive actions
- Export backup before any reset operations
- Activity logging for admin actions
- Undo functionality where possible

---

## 🎯 Multiple Prompts System

### 🧠 Prompt Management Enhancement
**Status:** 🟡 Partial (single prompt exists)  
**Priority:** High  
**Files to create/modify:**
- `src/hooks/useMagicWand.ts` (modify for multiple prompts)
- `src/components/Pages/PromptsPage.tsx` (new)
- `src/components/PromptEditor.tsx` (new)
- `src/components/PromptDropdown.tsx` (new)
- `src/utils/promptUtils.ts` (new)
- `src/types.ts` (add prompt interfaces)

**Current Implementation Analysis:**
- ✅ Magic Wand system exists in `useMagicWand.ts` hook
- ✅ Single prompt stored in localStorage as 'ai-guidelines'
- ✅ Settings modal exists in `MagicWandSettingsModal.tsx`
- ✅ Integration with Gemini API for content generation

**Current Magic Wand Flow:**
1. User clicks Magic Wand button on node
2. Modal opens with current AI guidelines
3. User can edit guidelines and save
4. API call generates child concepts based on guidelines

### 📝 Prompts Management Page
**Files to implement:**

#### New Type Definitions
```typescript
// In src/types.ts
interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  createdAt: Date;
  lastModified: Date;
  isDefault: boolean;
  category: 'general' | 'academic' | 'business' | 'creative' | 'technical';
  tags: string[];
}

interface PromptCollection {
  prompts: Prompt[];
  activePromptId: string | null;
}
```

#### Prompts Page Features
- **📋 Prompt Library**: List all saved prompts with search/filter
- **✏️ Rich Text Editor**: Full-featured prompt editing with syntax highlighting
- **🏷️ Categorization**: Organize prompts by type/domain
- **📤 Import/Export**: Share prompts between users/installations
- **🔄 Version History**: Track prompt changes over time
- **⭐ Default Prompts**: Ship with curated starter prompts

#### Advanced Prompt Editor
```typescript
// PromptEditor component features
interface PromptEditorProps {
  prompt: Prompt;
  onSave: (prompt: Prompt) => void;
  onCancel: () => void;
}
```

**Editor Features:**
- **🎨 Syntax Highlighting**: For template variables and markup
- **📝 Live Preview**: Show how prompt will appear to AI
- **🔧 Template Variables**: Support for dynamic content insertion
- **💾 Auto-save**: Prevent loss of work
- **📋 Prompt Templates**: Pre-built structures for common use cases
- **🧪 Test Mode**: Preview AI responses without creating nodes

### 🎛️ Prompt Dropdown Integration
**Files to modify:**
- `src/components/Pages/MainContent.tsx` (replace Magic Wand button)
- `src/components/TreeControls.tsx` (add prompt picker)

**Current Magic Wand Button Location:**
- Located in tree controls area
- Currently opens settings modal directly
- Single prompt workflow

**New Dropdown Implementation:**
```typescript
// PromptDropdown component
interface PromptDropdownProps {
  selectedPromptId: string | null;
  onPromptSelect: (promptId: string) => void;
  onOpenPromptEditor: () => void;
}
```

**Dropdown Features:**
- **📋 Quick Selection**: Recently used prompts at top
- **🔍 Search**: Filter prompts by name/description
- **⚙️ Manage Prompts**: Direct link to prompts page
- **✨ Quick Actions**: Edit current prompt, create new prompt
- **📊 Usage Stats**: Show prompt effectiveness metrics

**Integration with Magic Wand:**
1. User selects prompt from dropdown
2. Prompt becomes active for current session
3. Magic Wand uses selected prompt for generation
4. Option to quickly switch prompts without losing context

---

## 🛣️ Implementation Roadmap

### Phase 1: Export System Foundation (Week 1-2)
- [ ] Restructure export utilities into modular system
- [ ] Implement SVG and HTML exporters
- [ ] Add export buttons to capability cards and main view
- [ ] Create export options modal with format selection

### Phase 2: Admin Dashboard (Week 2-3)  
- [ ] Create admin page with navigation integration
- [ ] Implement statistics collection and display
- [ ] Add hard reset functionality with safeguards
- [ ] Create admin utilities for data management

### Phase 3: Multiple Prompts System (Week 3-4)
- [ ] Design prompt data structures and storage
- [ ] Create prompts management page with editor
- [ ] Implement prompt dropdown picker
- [ ] Migrate existing Magic Wand to new system

### Phase 4: Advanced Features (Week 4-5)
- [ ] Add PDF and CSV exporters
- [ ] Implement prompt templates and categories
- [ ] Add batch export and backup features
- [ ] Performance optimization and testing

### Phase 5: Polish and Documentation (Week 5-6)
- [ ] User experience improvements
- [ ] Comprehensive testing of all features
- [ ] Update documentation and help content
- [ ] Prepare for production deployment

---

## 🔧 Technical Considerations

### Dependencies to Add
```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "d3": "^7.8.5",
    "@types/d3": "^7.4.0",
    "monaco-editor": "^0.44.0",
    "@monaco-editor/react": "^4.6.0",
    "file-saver": "^2.0.5",
    "@types/file-saver": "^2.0.7"
  }
}
```

### Performance Considerations
- **Lazy Loading**: Load export utilities only when needed
- **Web Workers**: Use for heavy export operations (PDF generation)
- **Chunked Processing**: Handle large trees in batches
- **Memory Management**: Clean up resources after exports

### Browser Compatibility
- File download APIs (modern browsers)
- Canvas/SVG rendering capabilities
- Local storage quotas and limits
- Performance with large datasets

### Security Considerations
- Validate export file sizes
- Sanitize content in exports
- Admin page access controls
- Safe HTML export generation

---

## 📖 Documentation Updates Needed

### README.md Updates
- [ ] Add export functionality documentation
- [ ] Document admin page features
- [ ] Update keyboard shortcuts for new features
- [ ] Add multiple prompts usage guide

### Help Content
- [ ] Export format comparison guide
- [ ] Prompt creation best practices
- [ ] Admin dashboard usage tutorial
- [ ] Troubleshooting guide for new features

---

*Last Updated: May 25, 2025*  
*Priority: High = Core functionality, Medium = Enhancement, Low = Nice-to-have*
