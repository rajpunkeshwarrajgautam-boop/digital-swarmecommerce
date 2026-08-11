import { products } from "./data";
import { isSellableProductId } from "./catalog-integrity";

export interface SearchResult {
  id: string;
  name: string;
  category: string;
  price: number;
  matchScore: number;
}

/** Lightweight local catalog search using explicit name/category matching. */
export async function swarmSearch(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const q = query.trim().toLowerCase();

  return products
    .filter((product) => product.inStock && isSellableProductId(product.id))
    .map((product) => {
      let score = 0;
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();
      const featureText = (product.features || []).join(' ').toLowerCase();

      if (name === q) score += 100;
      if (name.includes(q)) score += 50;
      if (category.includes(q)) score += 30;
      if (featureText.includes(q)) score += 15;

      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        matchScore: score,
      };
    })
    .filter((result) => result.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export class SearchService {
  static tagSearch(query: string, catalog: any[]) {
    const q = query.toLowerCase();
    return catalog.filter((product) =>
      product.name.toLowerCase().includes(q) ||
      product.category.toLowerCase().includes(q) ||
      (product.tags && product.tags.some((tag: string) => tag.toLowerCase().includes(q)))
    );
  }

  static neuralSearch(query: string, catalog: any[]) {
    return this.tagSearch(query, catalog).sort((a, b) => {
      const q = query.toLowerCase();
      const aCategory = a.category.toLowerCase().includes(q) ? 1 : 0;
      const bCategory = b.category.toLowerCase().includes(q) ? 1 : 0;
      return bCategory - aCategory;
    });
  }
}
