# 🌳 Concept Hierarchy Designer

A powerful interactive tool for creating, organizing, and visualizing hierarchical concept maps using AI assistance.

![Concept Hierarchy Designer](https://via.placeholder.com/800x400?text=Concept+Hierarchy+Designer) <!-- Consider replacing this with an actual screenshot of your app -->

## ✨ Features

- 📋 Create and manage hierarchical concept trees
- 🔄 Drag and drop nodes to reorganize your hierarchy
- ✏️ Edit node labels and descriptions with **Markdown support**
- 📝 Rich text formatting in descriptions (bold, italic, code, lists, links)
- 🧠 AI-powered "Magic Wand" feature to generate child concepts using Gemini API
- 📋 Copy/cut/paste functionality for nodes and branches
- 🎯 Interactive capability cards with three-generation view
- 🌈 Modern, responsive UI with animations
- 💾 Local storage persistence for your concept trees

## 🚀 Getting Started

### Prerequisites

- 📦 [Node.js](https://nodejs.org/) (v16.x or later)
- 🔑 [Gemini API key](https://ai.google.dev/) for the Magic Wand feature

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
3. **Reorganize** - Drag and drop nodes to restructure your hierarchy
4. **Use Magic Wand** - Generate AI-suggested child concepts for any node
5. **Edit nodes** - Modify labels and descriptions by clicking the edit icon
6. **View capability cards** - Click the capability card icon to see hierarchical overviews

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
