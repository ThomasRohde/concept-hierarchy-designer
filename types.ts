
export interface NodeData {
  id: string;
  label: string;
  description?: string; // Added description field
  children: NodeData[];
}