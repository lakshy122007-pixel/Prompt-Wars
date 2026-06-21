import { EMISSION_FACTORS, ActivityCategory } from './emissionFactors.js';

export class UnknownSubtypeError extends Error {
  constructor(category: string, subtype: string) {
    super(`Unknown subtype "${subtype}" for category "${category}"`);
    this.name = 'UnknownSubtypeError';
  }
}

export function calculateActivityCo2e(input: {
  category: ActivityCategory;
  subtype: string;
  quantity: number;
}): { co2eKg: number; factorUsed: number; sourceLabel: string } {
  const categoryFactors = EMISSION_FACTORS[input.category];
  if (!categoryFactors) {
    throw new UnknownSubtypeError(input.category, input.subtype);
  }

  const factorConfig = categoryFactors[input.subtype];
  if (!factorConfig) {
    throw new UnknownSubtypeError(input.category, input.subtype);
  }

  if (input.quantity < 0) {
    throw new Error('Quantity cannot be negative');
  }

  // Calculate CO2e in kg
  const co2eKg = input.quantity * factorConfig.factor;

  return {
    co2eKg,
    factorUsed: factorConfig.factor,
    sourceLabel: `${factorConfig.label} (${factorConfig.source})`
  };
}
