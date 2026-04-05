/**
 * 🛰️ DIGITAL SWARM | Neural Link Discovery
 * -----------------------------------------
 * Handles conceptual and semantic asset search.
 */

import { Product } from './types';

export interface SearchResult extends Product {
  matchDensity: number;
}

export class SearchService {
  private static CONCEPTUAL_MAP: Record<string, string[]> = {
    cyberpunk: ['neon', 'future', 'dark', 'industrial', 'terminal', 'hacker', 'urban', 'high-tech'],
    glassmorphism: ['translucent', 'blur', 'frosted', 'modern', 'sleek', 'premium', 'clean'],
    industrial: ['raw', 'texture', 'heavy', 'metal', 'elite', 'gold', 'monochrome', 'brutalist'],
    minimalist: ['clean', 'simple', 'white', 'modern', 'elegant', 'negative space'],
    energetic: ['bright', 'neon', 'fast', 'vibrant', 'gradient', 'motion', 'dynamic'],
    corporate: ['stable', 'trust', 'blue', 'clean', 'professional', 'standard'],
  };

  /**
   * ✨ NEURAL LINK DISCOVERY
   * Finds Conceptual Matches by expanding the query into semantic clusters.
   */
  static neuralSearch(query: string, assets: Product[]): SearchResult[] {
    const normalizedQuery = query.toLowerCase();
    const queryWords = normalizedQuery.split(/\s+/);

    // 1. Expand Query (Add synonyms/concepts from the map)
    const expandedConcepts = new Set<string>(queryWords);
    Object.entries(this.CONCEPTUAL_MAP).forEach(([key, values]) => {
      if (queryWords.some(qw => key.includes(qw) || qw.includes(key))) {
        values.forEach(v => expandedConcepts.add(v));
      }
    });

    // 2. Score Assets
    const results: SearchResult[] = assets.map(asset => {
      const assetTerms = `${asset.name} ${asset.description} ${asset.category}`.toLowerCase();
      let score = 0;

      // Base weight: Literal matches
      queryWords.forEach(qw => {
        if (assetTerms.includes(qw)) score += 1.0;
      });

      // Neural weight: Conceptual overlap
      expandedConcepts.forEach(concept => {
        if (assetTerms.includes(concept)) score += 0.4; // 40% weight for semantic links
      });

      // 3. Normalize to Match Density %
      const maxPossible = queryWords.length + (expandedConcepts.size * 0.4);
      const matchDensity = Math.min(Math.round((score / Math.max(1, maxPossible)) * 100), 100);

      return { ...asset, matchDensity };
    });

    // 4. Threshold & Rank
    return results
      .filter(r => r.matchDensity > 20)
      .sort((a, b) => b.matchDensity - a.matchDensity);
  }

  /**
   * 🏷️ STANDARD TAG SEARCH
   * Fallback for literal filtering.
   */
  static tagSearch(query: string, assets: Product[]): Product[] {
    const q = query.toLowerCase();
    return assets.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    );
  }
}
