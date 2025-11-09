export const BLE_WEIGHT = 0.3;
export const WIFI_WEIGHT = 0.7;

export function normalizeRatio(rawRatio: number | null | undefined): number {
  if (typeof rawRatio !== 'number' || !isFinite(rawRatio) || rawRatio <= 0) {
    return 1;
  }
  return rawRatio;
}

export function roundToSingleDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}
