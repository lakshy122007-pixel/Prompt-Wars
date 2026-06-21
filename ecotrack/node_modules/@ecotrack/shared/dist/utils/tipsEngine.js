export function getTopCategory(last30DaysSummary) {
    const categories = ['transport', 'energy', 'food', 'waste', 'water'];
    let topCategory = 'transport';
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
export function selectTips(topCategory, allTips) {
    return allTips
        .filter(tip => tip.category === topCategory)
        .sort((a, b) => b.estimatedAnnualSavingsKg - a.estimatedAnnualSavingsKg)
        .slice(0, 5);
}
