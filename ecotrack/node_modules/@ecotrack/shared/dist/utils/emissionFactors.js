export const EMISSION_FACTORS = {
    transport: {
        car_petrol: {
            subtype: 'car_petrol',
            factor: 0.192,
            unit: 'km',
            source: 'DEFRA 2024',
            label: 'Car (petrol, average)'
        },
        car_diesel: {
            subtype: 'car_diesel',
            factor: 0.171,
            unit: 'km',
            source: 'DEFRA 2024',
            label: 'Car (diesel, average)'
        },
        car_electric: {
            subtype: 'car_electric',
            factor: 0.053,
            unit: 'km',
            source: 'DEFRA/IEA 2024',
            label: 'Car (electric, grid avg)'
        },
        bus: {
            subtype: 'bus',
            factor: 0.105,
            unit: 'km',
            source: 'DEFRA 2024',
            label: 'Bus'
        },
        train: {
            subtype: 'train',
            factor: 0.041,
            unit: 'km',
            source: 'DEFRA 2024',
            label: 'Train'
        },
        flight_domestic: {
            subtype: 'flight_domestic',
            factor: 0.246,
            unit: 'km',
            source: 'DEFRA 2024',
            label: 'Domestic flight'
        },
        walk_cycle: {
            subtype: 'walk_cycle',
            factor: 0.0,
            unit: 'km',
            source: 'None',
            label: 'Bicycle/Walk'
        }
    },
    energy: {
        electricity_grid: {
            subtype: 'electricity_grid',
            factor: 0.42,
            unit: 'kWh',
            source: 'EPA eGRID 2023 avg',
            label: 'Grid electricity (avg)'
        },
        natural_gas: {
            subtype: 'natural_gas',
            factor: 0.18,
            unit: 'kWh',
            source: 'EPA 2023',
            label: 'Natural gas heating'
        }
    },
    food: {
        beef: {
            subtype: 'beef',
            factor: 6.61,
            unit: 'serving',
            source: 'Poore & Nemecek 2018',
            label: 'Beef meal'
        },
        chicken: {
            subtype: 'chicken',
            factor: 1.57,
            unit: 'serving',
            source: 'Poore & Nemecek 2018',
            label: 'Chicken meal'
        },
        vegetarian: {
            subtype: 'vegetarian',
            factor: 0.84,
            unit: 'serving',
            source: 'Poore & Nemecek 2018',
            label: 'Vegetarian meal'
        },
        vegan: {
            subtype: 'vegan',
            factor: 0.51,
            unit: 'serving',
            source: 'Poore & Nemecek 2018',
            label: 'Vegan meal'
        }
    },
    waste: {
        landfill: {
            subtype: 'landfill',
            factor: 0.45,
            unit: 'kg',
            source: 'EPA WARM model',
            label: 'General landfill waste'
        },
        recycled: {
            subtype: 'recycled',
            factor: 0.05,
            unit: 'kg',
            source: 'EPA WARM model',
            label: 'Recycled (mixed)'
        }
    },
    water: {
        water_treated: {
            subtype: 'water_treated',
            factor: 0.0003,
            unit: 'litre',
            source: 'EPA/water utility avg',
            label: 'Household water (treated)'
        }
    }
};
