import { NodeData } from '../types';

export const genId = (): string => Math.random().toString(36).substring(2, 15);

// Create initial data in the flat structure
export const createInitialData = (): NodeData[] => {
  const rootId = genId();
  const quantum = genId();
  const theories = genId();
  const applications = genId();
  const wave = genId();
  const superposition = genId();
  const mechanics = genId();
  const string = genId();
  const relativity = genId();

  return [
    {
      id: rootId,
      name: "Root Concept",
      description: "The main starting point of the hierarchy.",
      parent: null
    },
    {
      id: quantum,
      name: "Introduction to Quantum Physics",
      description: "Fundamental concepts of quantum mechanics.",
      parent: rootId
    },
    {
      id: theories,
      name: "Key Theories",
      description: "Major theories underpinning the field.",
      parent: rootId
    },
    {
      id: applications,
      name: "Applications",
      description: "Practical uses of these concepts.",
      parent: rootId
    },
    {
      id: wave,
      name: "Wave-Particle Duality",
      description: "Exhibiting both wave and particle properties.",
      parent: quantum
    },
    {
      id: superposition,
      name: "Quantum Superposition",
      description: "Ability to be in multiple states at once.",
      parent: quantum
    },
    {
      id: mechanics,
      name: "Quantum Mechanics",
      description: "Describes physical phenomena at nanoscopic scales.",
      parent: theories
    },
    {
      id: string,
      name: "String Theory (Overview)",
      description: "A theoretical framework where point-like particles are replaced by one-dimensional strings.",
      parent: theories
    },
    {
      id: relativity,
      name: "General Relativity (Brief)",
      description: "Einstein's theory of gravitation.",
      parent: theories
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