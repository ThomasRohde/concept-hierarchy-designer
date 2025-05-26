import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
// @ts-ignore
import remarkHtml from 'remark-html';

/**
 * Converts markdown text to HTML string
 * @param markdown The markdown text to convert
 * @returns HTML string
 */
export const markdownToHtml = async (markdown: string): Promise<string> => {
  if (!markdown) return '';
  
  try {
    const result = await remark()
      .use(remarkGfm) // GitHub Flavored Markdown support
      .use(remarkMath) // Math expressions support
      .use(remarkHtml, { sanitize: false }) // Convert to HTML
      .process(markdown);
    
    return result.toString();
  } catch (error) {
    console.warn('Failed to process markdown:', error);
    // Fallback to plain text with basic HTML escaping
    return markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

/**
 * Synchronous version of markdownToHtml using remark processor
 * Provides full GFM support including tables, horizontal rules, etc.
 * @param markdown The markdown text to convert
 * @returns HTML string
 */
export const markdownToHtmlSync = (markdown: string): string => {
  if (!markdown) return '';
  
  try {
    const result = remark()
      .use(remarkGfm) // GitHub Flavored Markdown support (tables, strikethrough, etc.)
      .use(remarkMath) // Math expressions support
      .use(remarkHtml, { sanitize: false }) // Convert to HTML
      .processSync(markdown); // Use synchronous processing
    
    return result.toString();
  } catch (error) {
    console.warn('Failed to process markdown synchronously:', error);
    // Fallback to plain text with basic HTML escaping
    return markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};
