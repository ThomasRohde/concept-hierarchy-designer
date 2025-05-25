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
 * Synchronous version of markdownToHtml for cases where async is not possible
 * Note: This provides basic markdown support without full remark processing
 * @param markdown The markdown text to convert
 * @returns HTML string
 */
export const markdownToHtmlSync = (markdown: string): string => {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Handle code blocks first (triple backticks)
  html = html.replace(/```(\w+)?\n?([\s\S]*?)```/g, (_, lang, code) => {
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    return `<pre><code${lang ? ` class="language-${lang}"` : ''}>${escapedCode}</code></pre>`;
  });
  
  // Use placeholders to protect already converted HTML
  const placeholders: string[] = [];
  html = html.replace(/<pre><code[^>]*>[\s\S]*?<\/code><\/pre>/g, (match) => {
    const placeholder = `__CODEBLOCK_${placeholders.length}__`;
    placeholders.push(match);
    return placeholder;
  });
  
  // Now safely escape HTML entities in the remaining text
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    
    // Convert basic markdown elements
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    
    // Convert line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Restore code blocks
  placeholders.forEach((codeBlock, index) => {
    html = html.replace(`__CODEBLOCK_${index}__`, codeBlock);
  });
  
  // Wrap in paragraph if content exists and doesn't start with block elements
  if (html.trim() && !html.match(/^<(pre|h[1-6])/)) {
    html = '<p>' + html + '</p>';
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
  }
  
  return html;
};
