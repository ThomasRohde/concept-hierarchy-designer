---
mode: "agent"
description: "Scaffold a modern Vite+React+TypeScript project with GitHub Pages deployment"
tools: ["codebase", "terminal"]
---

# Project Scaffolding: Vite + React + TypeScript + GitHub Pages

## Context
Create a new modern web application using the latest versions of:
- Vite as the build tool
- React for the UI framework
- TypeScript for type safety
- GitHub Pages for deployment

## Requirements

1. Set up a new Vite project with React and TypeScript template
2. Configure GitHub Pages deployment
3. Install essential dependencies similar to the concept-hierarchy-designer project
4. Set up a basic project structure with folders for components, hooks, and utilities
5. Configure TypeScript properly
6. Set up proper npm scripts for development, building, and deployment

## Steps

1. **Create Project Base**:
   - Create a new Vite project with the React + TypeScript template
   - Name the project: `${input:projectName}`
   - Configure the project directory structure with essential folders

2. **Install Dependencies**:
   - Core dependencies: React, React DOM
   - UI enhancement: Framer Motion, react-hot-toast, ${input:uiFramework:lucide-react}
   - State management (optional): ${input:stateManagement:none}
   - Utility libraries: ${input:additionalLibraries:none}
   
3. **Setup GitHub Pages Deployment**:
   - Install the gh-pages package
   - Configure deployment scripts in package.json
   - Set up necessary GitHub workflows (optional)

4. **Project Structure**:
   - Create folder structure for components, hooks, utilities
   - Set up basic App component and entry point
   - Configure global types and constants

5. **Development Configuration**:
   - Configure Vite settings
   - Set up TypeScript configuration
   - Configure any required environment variables

## Validation Checklist
- [ ] The project builds successfully with `npm run build`
- [ ] Development server runs properly with `npm run dev`
- [ ] GitHub Pages deployment is correctly set up
- [ ] Project structure follows modern best practices
- [ ] TypeScript is properly configured with strict mode
- [ ] Dependencies use the latest stable versions
