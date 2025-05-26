import { Prompt, PromptCollection } from '../types';

// Storage keys
export const PROMPTS_STORAGE_KEY = 'prompt-collection';
export const ACTIVE_PROMPT_STORAGE_KEY = 'active-prompt-id';

// Default generation guidelines for the MECE framework
export const DEFAULT_GENERATION_GUIDELINES = `## Core Principles

### 1. **MECE Framework (Mutually Exclusive, Collectively Exhaustive)**
   - Each child concept must be distinct with no overlaps (Mutually Exclusive)
   - Together, all children should cover the complete scope of the parent (Collectively Exhaustive)
   - No gaps or redundancies in the conceptual coverage

### 2. **Consistent Abstraction Level**
   - All child concepts should exist at the same level of abstraction
   - Avoid mixing high-level categories with specific implementations
   - Maintain logical consistency in granularity

### 3. **Output Specifications**
   - **Number:** 3-7 concepts (optimal cognitive load)
   - **Naming:** Clear, concise, and descriptive
   - **Descriptions:** 
     - Start with the essential definition or purpose
     - Include scope and boundaries when helpful
     - Keep between 10-50 words for clarity
     - Use active voice and precise language

### 4. **Quality Standards**
   - Each concept should be meaningful and useful for understanding the parent
   - Prefer established terminology when available
   - Ensure concepts are actionable or clearly defined
   - Balance comprehensiveness with practical utility`;

// Default prompts that ship with the application
export const DEFAULT_PROMPTS: Prompt[] = [
  /* 1. Top-level capability prompt */
  {
    id: 'bcm-first-level',
    name: 'BCM - First Level',
    description: 'Generates the 6-12 highest-level, enterprise-wide business capabilities',
    content: `## Core Principles

### 1. Enterprise-Wide Abstraction
   - Deliver a **mutually exclusive, collectively exhaustive** (MECE) view of what the organisation does.
   - Limit output to 6-12 singular-noun capabilities for executive digestibility.

### 2. Naming & Scope
   - Use concise, singular **nouns** (≤ 3 words); no verbs, gerunds or org-unit labels.
   - Each capability must be implementation-agnostic and stable for 3-5 years.

### 3. Pattern Guidance
   - Choose one clustering approach only (e.g., Value-Chain phases, Industry Domains, or Customer/Product/Operations/Support).
   - Ensure no overlaps and no gaps across the selected pattern.

### 4. Output Specifications
   - **Number:** 6-12 capabilities
   - **Name:** Title-case nouns
   - **Description:** 15-35 words defining purpose and boundaries
   - Format each capability as:  
     \`<Capability Name>: <Description>\`

### 5. Quality Gates
   - Perform an overlap check across all proposed capabilities.
   - Confirm collective coverage of enterprise mission and strategy.`,
    createdAt: new Date('2025-05-26'),
    lastModified: new Date('2025-05-26'),
    isDefault: true,
    category: 'business',
    tags: ['business', 'capability', 'bcm', 'level1'],
    usageCount: 0,
  },

  /* 2. Deeper-level capability prompt (Level 2+) */
  {
    id: 'bcm-default',
    name: 'BCM - Default',
    description: 'Guidelines for decomposing any parent capability into consistent lower-level children',
    content: `## Core Principles

### 1. Capability Decomposition
   - Each child refines the **what** of its parent while remaining MECE with its siblings.
   - Target 3-7 children for balance between clarity and completeness.

### 2. Naming & Consistency
   - Keep noun-based names; add qualifying adjectives (e.g., "Customer Data Management").
   - Maintain uniform granularity across all siblings.

### 3. Decomposition Patterns
   - Select **one** pattern per parent (e.g., life-cycle, object sub-types, channel, region, enabler vs. performer).
   - Do **not** mix patterns within the same sibling set.

### 4. Output Specifications
   - **Number:** 3-7 child capabilities
   - **Name:** ≤ 4 words, noun-based
   - **Description:** 10-40 words covering purpose, scope and boundaries
   - Format:  
     \`<Child Capability Name>: <Description>\`

### 5. Quality Standards
   - Check for sibling overlap and gaps.
   - Verify traceability to parent and usability for mapping processes, data or systems.`,
    createdAt: new Date('2025-05-26'),
    lastModified: new Date('2025-05-26'),
    isDefault: true,
    category: 'business',
    tags: ['business', 'capability', 'bcm', 'default'],
    usageCount: 0,
  },
  /* 3. MECE Framework (Default) */
  {
    id: 'default-mece',
    name: 'MECE Framework (Default)',
    description: 'Comprehensive prompt using MECE principles for hierarchical concept generation',
    content: DEFAULT_GENERATION_GUIDELINES,
    createdAt: new Date('2025-01-01'),
    lastModified: new Date('2025-01-01'),
    isDefault: true,
    category: 'general',
    tags: ['mece', 'framework', 'hierarchy', 'default'],
    usageCount: 0,
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Structured approach for academic and research contexts',
    content: `## Core Principles

### 1. **Academic Rigor and Evidence-Based Decomposition**
   - Each child concept must be grounded in established academic literature
   - Use scholarly terminology and precise definitions
   - Reference established frameworks when applicable
   - Maintain intellectual honesty about limitations and uncertainties

### 2. **Research-Oriented Categorization**
   - **Theoretical Framework:** Core theories and models
   - **Methodological Approach:** Research methods and techniques
   - **Empirical Evidence:** Data types and findings
   - **Literature Streams:** Different schools of thought
   - **Disciplinary Perspective:** Inter/multidisciplinary angles

### 3. **Output Specifications**
   - **Number:** 4-8 concepts (focused depth over breadth)
   - **Naming:** Use established academic terminology
   - **Descriptions:** 
     - Lead with formal definition
     - Include key researchers/theorists when relevant
     - Mention seminal works or methodologies
     - 15-60 words for comprehensive coverage`,
    createdAt: new Date('2025-01-01'),
    lastModified: new Date('2025-01-01'),
    isDefault: true,
    category: 'academic',
    tags: ['academic', 'research', 'scholarly', 'literature'],
    usageCount: 0,
  },
  {
    id: 'business-strategy',
    name: 'Business Strategy',
    description: 'Business-focused decomposition for strategic planning and analysis',
    content: `## Core Principles

### 1. **Strategic Business Analysis**
   - Apply established business frameworks (Porter's Forces, SWOT, etc.)
   - Focus on value creation and competitive advantage
   - Consider stakeholder impact and market dynamics
   - Emphasize actionable insights and measurable outcomes

### 2. **Business Decomposition Patterns**
   - **Value Chain:** Primary and support activities
   - **Market Segmentation:** Customer types and needs
   - **Business Model:** Revenue streams and cost structures
   - **Organizational Function:** Departments and roles
   - **Strategic Initiative:** Projects and programs
   - **Performance Metric:** KPIs and success measures

### 3. **Output Specifications**
   - **Number:** 5-10 concepts (practical scope)
   - **Naming:** Use business terminology and acronyms when appropriate
   - **Descriptions:**
     - Start with business impact or purpose
     - Include metrics or success indicators when relevant
     - Use **bold** for key performance areas
     - 10-40 words for executive summary style`,
    createdAt: new Date('2025-01-01'),
    lastModified: new Date('2025-01-01'),
    isDefault: true,
    category: 'business',
    tags: ['business', 'strategy', 'management', 'analysis'],
    usageCount: 0,
  },
  {
    id: 'creative-ideation',
    name: 'Creative Ideation',
    description: 'Divergent thinking approach for creative and innovative concept development',
    content: `## Core Principles

### 1. **Divergent Thinking and Innovation**
   - Encourage unconventional perspectives and connections
   - Embrace both logical and intuitive categorizations
   - Allow for experimental and emerging concepts
   - Balance structured thinking with creative exploration

### 2. **Creative Decomposition Patterns**
   - **Sensory Experience:** How concepts engage different senses
   - **Emotional Journey:** Feelings and psychological states
   - **Metaphorical Lens:** Alternative ways to view the concept
   - **Temporal Dimension:** Past, present, future perspectives
   - **Scale Variation:** Micro to macro perspectives
   - **Paradox/Tension:** Opposing forces within the concept

### 3. **Output Specifications**
   - **Number:** 6-15 concepts (embrace abundance)
   - **Naming:** Use evocative, memorable language
   - **Descriptions:**
     - Start with vivid, engaging language
     - Include *metaphors* and analogies
     - Use creative formatting and emojis when appropriate
     - 5-30 words for impact and memorability`,
    createdAt: new Date('2025-01-01'),
    lastModified: new Date('2025-01-01'),
    isDefault: true,
    category: 'creative',
    tags: ['creative', 'innovation', 'ideation', 'divergent'],
    usageCount: 0,
  },
  {
    id: 'technical-systems',
    name: 'Technical Systems',
    description: 'Engineering and technical approach for system architecture and implementation',
    content: `## Core Principles

### 1. **Systems Engineering and Architecture**
   - Apply systems thinking and engineering principles
   - Focus on modularity, scalability, and maintainability
   - Consider technical constraints and requirements
   - Emphasize interfaces, dependencies, and data flow

### 2. **Technical Decomposition Patterns**
   - **System Layer:** Presentation, business logic, data layers
   - **Component Type:** Services, modules, libraries, utilities
   - **Data Flow:** Input, processing, output, storage
   - **Protocol/Interface:** APIs, communication methods
   - **Infrastructure:** Hardware, software, network components
   - **Lifecycle Phase:** Development, testing, deployment, maintenance

### 3. **Output Specifications**
   - **Number:** 5-12 components (optimal system complexity)
   - **Naming:** Use technical terminology and conventions
   - **Descriptions:**
     - Lead with technical function or purpose
     - Include \`code examples\` or technical specifications
     - Mention technologies, protocols, or standards
     - 15-50 words for technical clarity`,
    createdAt: new Date('2025-01-01'),
    lastModified: new Date('2025-01-01'),
    isDefault: true,
    category: 'technical',
    tags: ['technical', 'systems', 'engineering', 'architecture'],
    usageCount: 0,
  },
];

/**
 * Load prompt collection from localStorage
 */
export const loadPromptCollection = (): PromptCollection => {
  try {
    const stored = localStorage.getItem(PROMPTS_STORAGE_KEY);
    if (stored) {
      const collection: PromptCollection = JSON.parse(stored);
      // Ensure dates are properly parsed
      collection.prompts = collection.prompts.map(prompt => ({
        ...prompt,
        createdAt: new Date(prompt.createdAt),
        lastModified: new Date(prompt.lastModified),
        lastUsed: prompt.lastUsed ? new Date(prompt.lastUsed) : undefined,
      }));
      return collection;
    }
  } catch (error) {
    console.error('Error loading prompt collection:', error);
  }

  // Return default collection if none exists
  return {
    prompts: DEFAULT_PROMPTS,
    activePromptId: DEFAULT_PROMPTS[0].id,
  };
};

/**
 * Save prompt collection to localStorage
 */
export const savePromptCollection = (collection: PromptCollection): void => {
  try {
    localStorage.setItem(PROMPTS_STORAGE_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Error saving prompt collection:', error);
  }
};

/**
 * Get active prompt ID from localStorage
 */
export const getActivePromptId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_PROMPT_STORAGE_KEY);
  } catch (error) {
    console.error('Error loading active prompt ID:', error);
    return null;
  }
};

/**
 * Set active prompt ID in localStorage
 */
export const setActivePromptId = (promptId: string | null): void => {
  try {
    if (promptId) {
      localStorage.setItem(ACTIVE_PROMPT_STORAGE_KEY, promptId);
    } else {
      localStorage.removeItem(ACTIVE_PROMPT_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving active prompt ID:', error);
  }
};

/**
 * Create a new prompt with default values
 */
export const createNewPrompt = (partial: Partial<Prompt> = {}): Prompt => {
  const now = new Date();
  return {
    id: `prompt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: 'New Prompt',
    description: 'Custom prompt for concept generation',
    content: DEFAULT_GENERATION_GUIDELINES,
    createdAt: now,
    lastModified: now,
    isDefault: false,
    category: 'general',
    tags: [],
    usageCount: 0,
    ...partial,
  };
};

/**
 * Update prompt usage statistics
 */
export const updatePromptUsage = (promptId: string): void => {
  const collection = loadPromptCollection();
  const promptIndex = collection.prompts.findIndex(p => p.id === promptId);
  
  if (promptIndex !== -1) {
    collection.prompts[promptIndex] = {
      ...collection.prompts[promptIndex],
      usageCount: (collection.prompts[promptIndex].usageCount || 0) + 1,
      lastUsed: new Date(),
    };
    savePromptCollection(collection);
  }
};

/**
 * Get prompt by ID
 */
export const getPromptById = (promptId: string): Prompt | null => {
  const collection = loadPromptCollection();
  return collection.prompts.find(p => p.id === promptId) || null;
};

/**
 * Get active prompt
 */
export const getActivePrompt = (): Prompt => {
  const collection = loadPromptCollection();
  const activeId = collection.activePromptId || getActivePromptId();
  
  if (activeId) {
    const prompt = collection.prompts.find(p => p.id === activeId);
    if (prompt) return prompt;
  }
  
  // Fallback to first default prompt
  return collection.prompts.find(p => p.isDefault) || DEFAULT_PROMPTS[0];
};

/**
 * Filter prompts by search query
 */
export const filterPrompts = (prompts: Prompt[], query: string): Prompt[] => {
  if (!query.trim()) return prompts;
  
  const searchTerms = query.toLowerCase().split(' ');
  return prompts.filter(prompt => {
    const searchText = `${prompt.name} ${prompt.description} ${prompt.tags.join(' ')}`.toLowerCase();
    return searchTerms.every(term => searchText.includes(term));
  });
};

/**
 * Sort prompts by various criteria
 */
export const sortPrompts = (prompts: Prompt[], sortBy: 'name' | 'lastUsed' | 'usageCount' | 'category'): Prompt[] => {
  return [...prompts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'lastUsed':
        if (!a.lastUsed && !b.lastUsed) return 0;
        if (!a.lastUsed) return 1;
        if (!b.lastUsed) return -1;
        return b.lastUsed.getTime() - a.lastUsed.getTime();
      case 'usageCount':
        return (b.usageCount || 0) - (a.usageCount || 0);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });
};
