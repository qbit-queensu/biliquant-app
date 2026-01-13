/**
 * Calculates estimated number of newborns with jaundice based on live births
 * @param {number} liveBirths - Total number of live births in the region
 * @param {number} pretermPercent - Percentage of babies that are preterm (default: 15)
 * @returns {Object} Object containing { total: total cases, term: term baby cases, preterm: preterm baby cases }
 */
export function calculateJaundiceCases(liveBirths, pretermPercent = 15) {
  // Calculate number of preterm and term babies
  const pretermBabies = liveBirths * (pretermPercent / 100);
  const termBabies = liveBirths - pretermBabies;

  // Calculate jaundice cases using specified prevalence rates
  const termCases = termBabies * 0.6; // 60% prevalence for term babies
  const pretermCases = pretermBabies * 0.8; // 80% prevalence for preterm babies

  // Calculate total cases
  const totalCases = termCases + pretermCases;

  // Return rounded values as integers (since we're dealing with whole babies)
  return {
    total: Math.round(totalCases),
    term: Math.round(termCases),
    preterm: Math.round(pretermCases)
  };
}
