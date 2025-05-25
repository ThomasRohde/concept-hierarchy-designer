
export interface NodeData {
  id: string;
  name: string;
  description: string;
  parent: string | null;
}

export interface CapabilityCardData extends NodeData {
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
}