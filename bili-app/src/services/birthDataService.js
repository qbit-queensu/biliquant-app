/**
 * Birth Data Service
 * Uses World Bank API for live worldwide population data
 * Calculates estimated births and jaundice cases in real-time
 */

const WORLD_BANK_API = 'https://api.worldbank.org/v2/country/WLD/indicator/SP.POP.TOTL';

/**
 * Start date for the birth counter (January 1, 2026)
 */
const START_DATE = '2026-01-01';

/**
 * Global statistics
 * Source: World Health Organization averages
 */
const GLOBAL_PRETERM_RATE = 0.15; // 15% worldwide
const TERM_JAUNDICE_RATE = 0.60; // 60% for term babies
const PRETERM_JAUNDICE_RATE = 0.80; // 80% for preterm babies

/**
 * Calculate days since January 1, 2026
 * @returns {number} Days since start date
 */
function getDaysSinceStart() {
  const start = new Date(START_DATE);
  const now = new Date();
  const diffMs = now - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Fetch world population from World Bank API
 * @returns {Promise<{population: number, fromAPI: boolean}>}
 */
export async function fetchWorldPopulation() {
  try {
    const response = await fetch(`${WORLD_BANK_API}?format=json&per_page=1`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // World Bank returns [metadata, data_array]
    // The first data item is the most recent
    if (data && data[1] && data[1][0] && data[1][0].value) {
      return { population: data[1][0].value, fromAPI: true };
    }
    
    throw new Error('No population data found');
  } catch (error) {
    console.log('World Bank API error:', error.message);
    // Fallback: use estimated world population
    return { population: 8140000000, fromAPI: false }; // ~8.14 billion
  }
}

/**
 * Calculate estimated births since January 1, 2026
 * Global birth rate: approximately 12 births per 1,000 people per year
 * @param {number} worldPopulation - Current world population
 * @returns {number} Estimated number of births
 */
export function calculateBirths(worldPopulation) {
  // Global birth rate: ~12 per 1,000 per year = 1.2%
  const annualBirthRate = 0.012; 
  const daysSinceStart = getDaysSinceStart();
  
  // Births = population × annual_rate × (days / 365)
  const estimatedBirths = Math.floor(
    worldPopulation * annualBirthRate * (daysSinceStart / 365)
  );
  
  return estimatedBirths;
}

/**
 * Calculate jaundice cases from births
 * @param {number} births - Number of live births
 * @returns {Object} Object containing jaundice case estimates
 */
export function calculateJaundiceCases(births) {
  // Calculate term and preterm babies
  const pretermBabies = Math.floor(births * GLOBAL_PRETERM_RATE);
  const termBabies = births - pretermBabies;
  
  // Calculate jaundice cases
  const termCases = Math.floor(termBabies * TERM_JAUNDICE_RATE);
  const pretermCases = Math.floor(pretermBabies * PRETERM_JAUNDICE_RATE);
  const totalCases = termCases + pretermCases;
  
  return {
    total: totalCases,
    term: termCases,
    preterm: pretermCases,
    births: births
  };
}

/**
 * Get live birth and jaundice data from World Bank API
 * This is the main function that should be called
 * @returns {Promise<Object>} Object containing all statistics
 */
export async function getLiveBirthData() {
  const { population, fromAPI } = await fetchWorldPopulation();
  const births = calculateBirths(population);
  const jaundiceCases = calculateJaundiceCases(births);
  
  return {
    birthCount: births,
    worldPopulation: population,
    fromAPI,
    daysSinceStart: getDaysSinceStart(),
    lastUpdated: new Date().toISOString(),
    dataSource: fromAPI 
      ? 'World Bank API (live)' 
      : 'World Bank API (fallback)',
    jaundiceCases,
    note: 'Estimates based on global birth rates and World Bank population data'
  };
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getLiveBirthData() instead
 */
export function getEstimatedLiveBirths() {
  return calculateBirths(8140000000);
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getLiveBirthData() instead
 */
export function getBaseBirthCount() {
  return 24809;
}

/**
 * Legacy function - no longer needed
 * @deprecated Now using World Bank API
 */
export async function fetchBirthCountFromSupabase() {
  return { birthCount: getEstimatedLiveBirths(), fromDatabase: false };
}

/**
 * Legacy function - no longer needed
 * @deprecated Now using World Bank API
 */
export async function saveBirthCountToSupabase(birthCount) {
  return true;
}

export default {
  fetchWorldPopulation,
  calculateBirths,
  calculateJaundiceCases,
  getLiveBirthData,
  getEstimatedLiveBirths,
  getBaseBirthCount
};
