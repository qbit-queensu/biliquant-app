const BHUTANI_ANCHORS = [
  { hour: 18, p40: 4.5, p75: 5.6, p95: 6.9 },
  { hour: 24, p40: 5.0, p75: 6.4, p95: 7.8 },
  { hour: 30, p40: 6.0, p75: 7.5, p95: 9.4 },
  { hour: 36, p40: 7.0, p75: 8.9, p95: 11.1 },
  { hour: 42, p40: 7.9, p75: 10.1, p95: 12.3 },
  { hour: 48, p40: 8.6, p75: 10.8, p95: 13.2 },
  { hour: 54, p40: 9.1, p75: 11.7, p95: 14.2 },
  { hour: 60, p40: 9.6, p75: 12.6, p95: 15.2 },
  { hour: 66, p40: 10.4, p75: 13.0, p95: 15.5 },
  { hour: 72, p40: 11.1, p75: 13.4, p95: 15.9 },
  { hour: 78, p40: 11.4, p75: 14.0, p95: 16.3 },
  { hour: 84, p40: 11.6, p75: 14.6, p95: 16.7 },
  { hour: 90, p40: 12.0, p75: 14.9, p95: 17.1 },
  { hour: 96, p40: 12.4, p75: 15.2, p95: 17.4 },
  { hour: 102, p40: 12.6, p75: 15.4, p95: 17.5 },
  { hour: 108, p40: 12.8, p75: 15.5, p95: 17.5 },
  { hour: 114, p40: 13.0, p75: 15.7, p95: 17.6 },
  { hour: 120, p40: 13.2, p75: 15.8, p95: 17.6 },
  { hour: 126, p40: 13.2, p75: 15.7, p95: 17.5 },
  { hour: 132, p40: 13.2, p75: 15.6, p95: 17.4 },
  { hour: 138, p40: 13.2, p75: 15.4, p95: 17.4 },
  { hour: 144, p40: 13.2, p75: 15.3, p95: 17.3 },
  { hour: 150, p40: 13.3, p75: 15.3, p95: 17.5 },
  { hour: 156, p40: 13.3, p75: 15.4, p95: 17.7 },
  { hour: 162, p40: 13.4, p75: 15.4, p95: 17.9 },
  { hour: 168, p40: 13.4, p75: 15.4, p95: 18.2 },
];

const BHUTANI_MIN_HOUR = 18;
const BHUTANI_MAX_HOUR = 168;

const RISK_INFO = {
  high: { label: "High", percentileBand: ">=95th", probability: 39.5 },
  high_intermediate: {
    label: "High-intermediate",
    percentileBand: "76th-94th",
    probability: 12.9,
  },
  low_intermediate: {
    label: "Low-intermediate",
    percentileBand: "40th-75th",
    probability: 2.2,
  },
  low: { label: "Low", percentileBand: "<40th", probability: 0 },
};

function toDateValue(dateValue, fallbackTime) {
  if (!dateValue) return null;
  const ts = new Date(`${dateValue}T${fallbackTime || "00:00:00"}`);
  if (Number.isNaN(ts.getTime())) return null;
  return ts;
}

function round1(value) {
  return Number(value.toFixed(1));
}

function interpolateThreshold(start, end, hour) {
  if (!start || !end) return null;
  if (start.hour === end.hour) return { p40: start.p40, p75: start.p75, p95: start.p95 };

  const ratio = (hour - start.hour) / (end.hour - start.hour);
  return {
    p40: round1(start.p40 + (end.p40 - start.p40) * ratio),
    p75: round1(start.p75 + (end.p75 - start.p75) * ratio),
    p95: round1(start.p95 + (end.p95 - start.p95) * ratio),
  };
}

export function getPostnatalHours({
  birthDate,
  birthTime,
  measurementDate,
  measurementTime,
  measurementCreatedAt,
}) {
  const birthTimestamp = toDateValue(birthDate, birthTime);

  if (!birthTimestamp) return null;

  let measurementTimestamp = null;
  if (measurementDate) {
    measurementTimestamp = toDateValue(measurementDate, measurementTime);
  } else if (measurementCreatedAt) {
    measurementTimestamp = new Date(measurementCreatedAt);
  }

  if (!measurementTimestamp || Number.isNaN(measurementTimestamp.getTime())) return null;

  const hourDiff =
    (measurementTimestamp.getTime() - birthTimestamp.getTime()) / (1000 * 60 * 60);

  if (!Number.isFinite(hourDiff) || hourDiff < 0) return null;
  return Number(hourDiff.toFixed(2));
}

export function getBhutaniThresholds(postnatalHours) {
  if (!Number.isFinite(postnatalHours)) return null;
  if (postnatalHours < BHUTANI_MIN_HOUR || postnatalHours > BHUTANI_MAX_HOUR) return null;

  const lower = [...BHUTANI_ANCHORS]
    .reverse()
    .find((point) => point.hour <= postnatalHours);
  const upper = BHUTANI_ANCHORS.find((point) => point.hour >= postnatalHours);

  if (!lower || !upper) return null;
  return interpolateThreshold(lower, upper, postnatalHours);
}

export function classifyBhutaniRisk({ bilirubinMgDl, postnatalHours }) {
  const bilirubin = Number(bilirubinMgDl);
  if (!Number.isFinite(bilirubin)) return null;

  const thresholds = getBhutaniThresholds(postnatalHours);
  if (!thresholds) {
    return {
      isWithinModelRange: false,
      riskLevel: null,
      riskLabel: "Out of model range",
      percentileBand: null,
      probability: null,
      postnatalHours,
      thresholds: null,
    };
  }

  let riskLevel = "low";
  if (bilirubin >= thresholds.p95) riskLevel = "high";
  else if (bilirubin >= thresholds.p75) riskLevel = "high_intermediate";
  else if (bilirubin >= thresholds.p40) riskLevel = "low_intermediate";

  const riskMeta = RISK_INFO[riskLevel];
  return {
    isWithinModelRange: true,
    riskLevel,
    riskLabel: riskMeta.label,
    percentileBand: riskMeta.percentileBand,
    probability: riskMeta.probability,
    postnatalHours,
    thresholds,
  };
}

export function normalizeRiskLevel(value) {
  if (!value) return null;
  const normalized = String(value).toLowerCase().replace(/\s+/g, "_").replace(/-/g, "_");
  if (normalized === "high" || normalized === "critical") return normalized;
  if (normalized === "high_intermediate") return "high_intermediate";
  if (normalized === "low_intermediate") return "low_intermediate";
  if (normalized === "low") return "low";
  return null;
}

export function formatRiskLabel(value) {
  const normalized = normalizeRiskLevel(value);
  if (!normalized) return "Pending";
  if (normalized === "critical") return "Critical";
  if (normalized === "high_intermediate") return "High-intermediate";
  if (normalized === "low_intermediate") return "Low-intermediate";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

