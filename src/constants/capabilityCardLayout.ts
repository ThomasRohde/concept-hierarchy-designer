/**
 * Layout constants for capability card rendering and export
 * These values can be adjusted to fine-tune the visual appearance
 */
export const CAPABILITY_CARD_LAYOUT = {
  /**
   * Fixed heights for cards in export mode
   * These ensure consistent row heights when exporting to SVG
   */
  CARD_HEIGHTS: {
    CURRENT: 200,    // Height for blue current card (top level)
    CHILD: 160,      // Height for pink child cards (level N+1)
    GRANDCHILD: 120, // Height for green grandchild cards (level N+2)
  },

  /**
   * Spacing and gap values
   */
  SPACING: {
    ROW_GAP: 24,           // Space between rows (mb-6 equivalent)
    CARD_GAP: 16,          // Space between cards in a row (gap-4 equivalent)
    CONTAINER_PADDING: 24, // Padding around the entire card container (p-6 equivalent)
    GRANDCHILD_ROW_GAP: 12, // Space between grandchild rows (mt-3 equivalent)
  },

  /**
   * Card width and responsive behavior
   */
  CARDS_PER_ROW: {
    RESPONSIVE_BREAKPOINT: 4, // <= 4 cards = responsive layout, > 4 = fixed width
    FIXED_CARD_WIDTH: 220,    // Fixed width for cards when > 4 children
    MIN_RESPONSIVE_WIDTH: 200, // Minimum width for responsive cards
  },

  /**
   * Typography and content sizing
   */
  TYPOGRAPHY: {
    CURRENT_TITLE_SIZE: 'text-xl',      // Title size for current card
    CHILD_TITLE_SIZE: 'text-base',      // Title size for child cards
    GRANDCHILD_TITLE_SIZE: 'text-sm',   // Title size for grandchild cards
    
    CURRENT_DESC_SIZE: 'text-base',     // Description size for current card
    CHILD_DESC_SIZE: 'text-sm',         // Description size for child cards
    GRANDCHILD_DESC_SIZE: 'text-xs',    // Description size for grandchild cards
    
    LINE_CLAMP: {
      CURRENT: 4,     // Max lines for current card description
      CHILD: 3,       // Max lines for child card description
      GRANDCHILD: 2,  // Max lines for grandchild card description
    },
  },

  /**
   * Padding values for different card variants
   */
  PADDING: {
    CURRENT: 24,     // p-6 equivalent
    CHILD: 16,       // p-4 equivalent
    GRANDCHILD: 12,  // p-3 equivalent
  },

  /**
   * Export-specific settings
   */
  EXPORT: {
    // Minimum height buffer to account for text overflow
    HEIGHT_BUFFER: 8,
    // Default SVG dimensions when no element provided
    DEFAULT_WIDTH: 1200,
    DEFAULT_HEIGHT: 800,
  },
} as const;

/**
 * Helper function to get card height based on variant
 */
export const getCardHeight = (variant: 'current' | 'child' | 'grandchild'): number => {
  switch (variant) {
    case 'current':
      return CAPABILITY_CARD_LAYOUT.CARD_HEIGHTS.CURRENT;
    case 'child':
      return CAPABILITY_CARD_LAYOUT.CARD_HEIGHTS.CHILD;
    case 'grandchild':
      return CAPABILITY_CARD_LAYOUT.CARD_HEIGHTS.GRANDCHILD;
    default:
      return CAPABILITY_CARD_LAYOUT.CARD_HEIGHTS.CHILD;
  }
};

/**
 * Helper function to get padding based on variant
 */
export const getCardPadding = (variant: 'current' | 'child' | 'grandchild'): number => {
  switch (variant) {
    case 'current':
      return CAPABILITY_CARD_LAYOUT.PADDING.CURRENT;
    case 'child':
      return CAPABILITY_CARD_LAYOUT.PADDING.CHILD;
    case 'grandchild':
      return CAPABILITY_CARD_LAYOUT.PADDING.GRANDCHILD;
    default:
      return CAPABILITY_CARD_LAYOUT.PADDING.CHILD;
  }
};