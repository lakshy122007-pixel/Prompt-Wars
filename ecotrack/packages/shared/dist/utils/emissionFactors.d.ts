export interface EmissionFactor {
    subtype: string;
    factor: number;
    unit: string;
    source: string;
    label: string;
}
export type ActivityCategory = 'transport' | 'energy' | 'food' | 'waste' | 'water';
export declare const EMISSION_FACTORS: Record<ActivityCategory, Record<string, EmissionFactor>>;
