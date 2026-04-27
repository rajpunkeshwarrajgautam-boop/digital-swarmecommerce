import { products } from "./data";

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  reputation: number;
  matchScore: number;
}

/**
 * PROTOCOL_SEARCH_ENGINE: High-velocity discovery for Swarm Agents.
 * Uses weighted fuzzy matching for names, categories, and tags.
 */
export async function swarmSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const q = query.toLowerCase();
  
  return products
    .map(product => {
      let score = 0;
      
      // Exact name match (Highest weight)
      if (product.name.toLowerCase() === q) score += 100;
      
      // Partial name match
      if (product.name.toLowerCase().includes(q)) score += 50;
      
      // Category match
      if (product.category.toLowerCase().includes(q)) score += 30;
      
      // Tag match (Simulated from metadata)
      const tags = [product.category, product.name.split(' ')].flat();
      if (tags.some(t => t.toString().toLowerCase().includes(q))) score += 10;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        reputation: 85, // Mock reputation for search weighting
        matchScore: score
      };
    })
    .filter(res => res.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * ARCHITECTURAL_SEARCH: Centralized service for product discovery.
 */
export class SearchService {
  static tagSearch(query: string, catalog: any[]) {
    const q = query.toLowerCase();
    return catalog.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
    );
  }

  static neuralSearch(query: string, catalog: any[]) {
    // Simulated neural weighting - for now same as tag search but with relevance sorting
    return this.tagSearch(query, catalog).sort((a, b) => {
      // Priority to category match in "neural" mode
      if (a.category.toLowerCase().includes(query.toLowerCase())) return -1;
      return 0;
    });
  }
}

