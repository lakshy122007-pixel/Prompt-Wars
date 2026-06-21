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
export declare function getTopCategory(last30DaysSummary: CategoryTotals): ActivityCategory;
export declare function selectTips(topCategory: ActivityCategory, allTips: Tip[]): Tip[];
