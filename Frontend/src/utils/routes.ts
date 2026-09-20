import { CategoryType } from '../types';

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function slugToCategory(slug: string, categories: CategoryType[]): CategoryType | null {
  const found = categories.find((c) => categoryToSlug(c) === slug);
  return found || null;
}

export function blogUrl(slug: string): string {
  return `${window.location.origin}/blog/${slug}`;
}
