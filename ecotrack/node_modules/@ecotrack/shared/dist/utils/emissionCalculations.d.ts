import { ActivityCategory } from './emissionFactors.js';
export declare class UnknownSubtypeError extends Error {
    constructor(category: string, subtype: string);
}
export declare function calculateActivityCo2e(input: {
    category: ActivityCategory;
    subtype: string;
    quantity: number;
}): {
    co2eKg: number;
    factorUsed: number;
    sourceLabel: string;
};
