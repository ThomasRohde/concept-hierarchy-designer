# Product Requirements Document - Document Import & Concept Extraction

## Overview
Allow users to upload text or PDF documents and automatically generate a concept hierarchy using AI-powered extraction. This accelerates the creation of trees from existing knowledge bases or research papers.

## Goals
- Provide a simple interface to import documents from local files or URLs
- Use AI to analyze the content and propose an initial hierarchy of concepts
- Let users review the generated tree and make adjustments before saving
- Support multiple languages where possible

## Non-Goals
- Full citation management or advanced reference parsing
- Optical character recognition for scanned documents

## User Stories
1. **As a user**, I can upload a PDF or text file and see a suggested concept tree generated from its contents.
2. **As a user**, I can edit or reorganize the generated nodes before committing them to my workspace.
3. **As a user**, I can optionally merge an imported tree with my existing hierarchy.
4. **As a user**, I receive feedback if extraction fails or if the document is not supported.

## Functional Requirements
- File upload UI supporting PDF and plain text formats, plus import via URL.
- Backend service that sends document text to an AI model (e.g., GPT) for concept extraction.
- Heuristic or AI-based ranking of key concepts to determine hierarchy levels.
- Progress indicator and error handling for long-running analysis.
- Option to discard or accept the generated tree.

## UX Considerations
- Step-by-step import wizard that previews extracted concepts before insertion.
- Clear messaging about privacy and how uploaded documents are used.
- Ability to retry extraction with different parameters if the first attempt is unsatisfactory.

## Success Metrics
- Users save at least 50% of time compared to manual tree creation from documents.
- Successful extraction rate above 90% on supported file types.
- Positive qualitative feedback on the usefulness of AI-generated structures.

