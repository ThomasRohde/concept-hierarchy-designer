# 🌳 Concept Hierarchy Designer

![100% Vibe Coded](https://img.shields.io/badge/100%25-Vibe%20Coded-ff69b4?style=for-the-badge&logoColor=white)
![Agent: GitHub Copilot](https://img.shields.io/badge/Agent-GitHub%20Copilot-blue?style=for-the-badge&logo=github&logoColor=white)

A powerful interactive tool for creating, organizing, and visualizing hierarchical concept maps using AI assistance.

![Concept Hierarchy Designer](public/screenshot.png) <!-- Consider replacing this with an actual screenshot of your app -->

## ✨ Features

- 📋 Create and manage hierarchical concept trees
- 🔄 Drag and drop nodes to reorganize your hierarchy
- ⌨️ **Full keyboard navigation** with arrow keys and visual selection
- ✏️ Edit node labels and descriptions with **Markdown support**
- 📝 Rich text formatting in descriptions (bold, italic, code, lists, links)
- 🧠 **AI-powered "Magic Wand"** with multiple prompt system for generating child concepts
- 📝 **Multiple AI prompts** - Create, manage, and switch between different generation strategies
- 📋 Copy/cut/paste functionality for nodes and branches
- 🎯 Interactive capability cards with three-generation view
- 📤 **Export capability cards** in multiple formats (SVG, PNG, PDF, HTML, JSON)
- 🌈 Modern, responsive UI with animations
- 💾 Local storage persistence for your concept trees

## 🚀 Getting Started

### Prerequisites

- 📦 [Node.js](https://nodejs.org/) (v16.x or later)

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/concept-hierarchy-designer.git
   cd concept-hierarchy-designer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**

   Navigate to http://localhost:5173 to view the app.

## 🛠️ Built With

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Fast development server and bundler
- [React DnD](https://react-dnd.github.io/react-dnd/) - Drag and drop for React
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [React Hot Toast](https://react-hot-toast.com/) - Toast notifications
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown rendering
- [KaTeX](https://katex.org/) - Mathematical notation rendering

## 📖 How to Use

1. **Create a new concept tree** - Use the "New Tree" button
2. **Add child concepts** - Click the "+" button on any node
3. **Navigate efficiently** - Use arrow keys to move between nodes, or click to select
4. **Reorganize** - Drag and drop nodes to restructure your hierarchy
5. **Use Magic Wand** - Generate AI-suggested child concepts using customizable prompts for any node
6. **Manage AI prompts** - Create and switch between different AI generation strategies in the Prompts page
6. **Edit nodes** - Modify labels and descriptions by pressing Enter or clicking the edit icon
7. **View capability cards** - Click the capability card icon to see hierarchical overviews

## ⌨️ Keyboard Shortcuts

Enhance your productivity with these keyboard shortcuts:

### Tree Navigation
- **↑/↓ Arrow Keys** - Navigate between nodes in the tree
- **←/→ Arrow Keys** - Collapse/expand nodes and navigate to parent/first child
- **Home** - Jump to the first visible node
- **End** - Jump to the last visible node  
- **Enter** - Edit the selected node
- **Click or Tab** - Select a node for keyboard navigation

### Visual Selection
- Selected nodes are highlighted with a light gray background and border
- Keyboard navigation automatically scrolls selected nodes into view
- Selection state is maintained as you navigate the tree

### Modal Dialogs
- **ESC** - Close any modal dialog (cancel action)
- **Ctrl+Enter** (Cmd+Enter on Mac) - Submit/save form in modals:
  - Add Child Modal: Save new child concept
  - Edit Node Modal: Save node changes  
  - New Tree Modal: Create new tree
  - Magic Wand Settings: Save AI guidelines
- **Enter** - Confirm deletion in delete confirmation dialogs

### Tips
- Keyboard shortcuts work when modal dialogs are open
- Tree navigation only works when no input fields are focused
- Tooltips on buttons show the available shortcuts
- Form modals display helpful hints about keyboard shortcuts

## 🧠 AI-Powered Magic Wand & Multiple Prompts

The Magic Wand feature uses AI to generate relevant child concepts for any node in your hierarchy. The system now supports **multiple prompts**, allowing you to use different AI generation strategies for different contexts.

### 🎯 How the Magic Wand Works

1. **Select a node** in your tree (click or use keyboard navigation)
2. **Click the Magic Wand button** (⚡) on the node
3. **Choose your prompt** from the dropdown (or use the currently active one)
4. **AI prompt is copied to clipboard** - paste it into your preferred AI tool (ChatGPT, Claude, Gemini, etc.)
5. **Copy the AI response** and paste it back to automatically create child nodes

### 📝 Multiple Prompts System

#### **Default Prompts Included:**
- **🌟 General (MECE)** - Balanced approach using Mutually Exclusive, Collectively Exhaustive principles
- **🧠 Creative Thinking** - Encourages innovative and divergent thinking patterns
- **🔧 Technical Systems** - Engineering-focused approach for system architecture
- **📚 Academic Research** - Scholarly methodology with evidence-based analysis
- **💼 Business Strategy** - Commercial and strategic business perspective

#### **Managing Your Prompts:**
- **📋 Prompts Page** - Access via the main navigation to view and manage all prompts
- **✏️ Create Custom Prompts** - Design prompts tailored to your specific domain or methodology
- **🎯 Set Active Prompt** - Choose which prompt is used by default for Magic Wand operations
- **📊 Usage Tracking** - See which prompts are most effective for your workflow
- **🏷️ Categorization** - Organize prompts by domain, type, or purpose

#### **Switching Prompts:**
- **Main Content**: Use the prompt dropdown in the tree controls area
- **Prompts Page**: Click "Set as Default" on any prompt
- **Per-Use**: Select different prompts when using the Magic Wand on individual nodes

### 💡 Tips for Best Results

- **Context Matters**: The AI analyzes parent nodes and siblings to maintain consistency
- **Descriptive Names**: Use clear, descriptive node names for better AI understanding  
- **Domain-Specific Prompts**: Create specialized prompts for technical, creative, or business contexts
- **Iterate and Refine**: Adjust prompts based on the quality of generated concepts

### 📝 Markdown Support

Descriptions support full Markdown formatting, including:

- **Bold text** and *italic text*
- `inline code` and code blocks
- Bulleted and numbered lists
- [Links](https://example.com)
- Headers and other Markdown features
- 🧮 **Mathematical expressions** using LaTeX syntax:
  - Inline math: `$\sigma_x \sigma_p \ge \frac{\hbar}{2}$`
  - Display math: `$$E = mc^2$$`
  - Complex formulas: `$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$`

The formatted descriptions are visible in:
- Node tooltips (hover over node names)
- Capability card displays
- All description viewing areas

## 🧪 Building for Production

To create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
