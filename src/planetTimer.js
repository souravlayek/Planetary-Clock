// Conversion factor: Earth seconds per 1 planetary day (sidereal rotation)
export const PLANET_DAY_SECONDS = {
  Mercury: 58.646 * 86400,        // ≈ 5,067,014.4 s
  Venus:   243.025 * 86400,       // ≈ 20,997,360 s (retrograde; use negative if you want reverse)
  Earth:   86400,                 // 24 h
  Mars:    (24*3600) + (39*60) + 35, // 24h 39m 35s ≈ 88,775 s
  Jupiter: (9*3600) + (55*60) + 29.71, // 9h 55m 29.71s ≈ 35,729.71 s
  Saturn:  (10*3600) + (33*60) + 38,   // ≈ 38,018 s
  Uranus:  (17*3600) + (14*60) + 24,   // ≈ 62,064 s
  Neptune: (16*3600) + (6*60) + 36,    // ≈ 57,996 s
  Pluto:   6.387 * 86400            // ≈ 551,836.8 s
};

// Display unit for the planetary "day"
export const PLANET_DAY_UNIT = {
  Mercury: "M-day",
  Venus:   "V-day",
  Earth:   "Day",
  Mars:    "Sol",
  Jupiter: "J-day",
  Saturn:  "S-day",
  Uranus:  "U-day",
  Neptune: "N-day",
  Pluto:   "P-day"
};

/**
 * Returns a map of { planet: daysElapsed } where daysElapsed is the
 * number of that planet's days since Unix epoch for the provided date.
 * 
 * @param {Date} date - JS Date (defaults to now)
 * @param {Object} overrides - optional overrides for PLANET_DAY_SECONDS
 * @returns {Record<string, number>}
 */
export function planetaryDaysElapsed(date = new Date(), overrides = {}) {
  const secondsSinceEpoch = date.getTime() / 1000; // UTC-based
  const factors = { ...PLANET_DAY_SECONDS, ...overrides };
  const out = {};
  for (const [planet, secPerPlanetDay] of Object.entries(factors)) {
    out[planet] = secondsSinceEpoch / secPerPlanetDay;
  }
  Object.entries(out).forEach(([planet, days]) => {
    updatePlanetLegend(planet, days);
  });
}

const updatePlanetLegend = (planet, days) => {
  const legend = document.querySelector(`.planet.${planet} p`);
  // INTL formatting for number comma separated
  const formattedDay = window.Intl.NumberFormat("en-US", { notation: "standard" }).format(days);
  legend.innerHTML = `${formattedDay} ${PLANET_DAY_UNIT[planet]}`;
};




// --- Example usage ---
/*
const now = new Date();
const days = planetaryDaysElapsed(now);
console.log({
  Earth:   `${days.Earth.toFixed(3)} ${PLANET_DAY_UNIT.Earth}`,
  Mars:    `${days.Mars.toFixed(3)} ${PLANET_DAY_UNIT.Mars}`,
  Jupiter: `${days.Jupiter.toFixed(3)} ${PLANET_DAY_UNIT.Jupiter}`,
});
*/

// If you want Venus to run backwards (retrograde), call with an override:
// planetaryDaysElapsed(new Date(), { Venus: -PLANET_DAY_SECONDS.Venus });
