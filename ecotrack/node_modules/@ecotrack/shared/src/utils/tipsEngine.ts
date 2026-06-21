import { ActivityCategory } from './emissionFactors.js';

export interface CategoryTotals {
  transport: number;
  energy: number;
  food: number;
  waste: number;
  water: number;
}

export interface Tip {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  estimatedAnnualSavingsKg: number;
  moneySavingDescription: string;
}

export function getTopCategory(last30DaysSummary: CategoryTotals): ActivityCategory {
  const categories: ActivityCategory[] = ['transport', 'energy', 'food', 'waste', 'water'];
  let topCategory: ActivityCategory = 'transport';
  let maxEmissions = -1;

  for (const cat of categories) {
    const val = last30DaysSummary[cat] || 0;
    if (val > maxEmissions) {
      maxEmissions = val;
      topCategory = cat;
    }
  }

  return topCategory;
}

export function selectTips(topCategory: ActivityCategory, allTips: Tip[]): Tip[] {
  return allTips
    .filter(tip => tip.category === topCategory)
    .sort((a, b) => b.estimatedAnnualSavingsKg - a.estimatedAnnualSavingsKg)
    .slice(0, 5);
}
