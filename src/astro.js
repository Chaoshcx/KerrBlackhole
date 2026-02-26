const G = 6.6743e-11;
const C = 299792458;
const M_SUN = 1.98847e30;

export function schwarzschildRadiusMeters(massSolar) {
  const mKg = massSolar * M_SUN;
  return (2 * G * mKg) / (C * C);
}

export function eventHorizonRadiusRg(spin) {
  return 1 + Math.sqrt(Math.max(0, 1 - spin * spin));
}

export function iscoProgradeRg(spin) {
  const z1 = 1 + Math.cbrt(1 - spin * spin) * (Math.cbrt(1 + spin) + Math.cbrt(1 - spin));
  const z2 = Math.sqrt(3 * spin * spin + z1 * z1);
  return 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2));
}

export function ntEfficiency(spin) {
  const risco = iscoProgradeRg(spin);
  const eISCO = Math.sqrt(1 - 2 / (3 * risco));
  return 1 - eISCO;
}

export function summarizeKerrState({ mass, spin, accretion }) {
  const rs = schwarzschildRadiusMeters(mass);
  const rh = eventHorizonRadiusRg(spin);
  const risco = iscoProgradeRg(spin);
  const eta = ntEfficiency(spin);
  const lEddW = 1.26e31 * mass;
  const lBol = lEddW * accretion;

  return {
    rsKm: rs / 1000,
    horizonRg: rh,
    iscoRg: risco,
    efficiency: eta,
    luminosityW: lBol,
    lEddW,
  };
}
