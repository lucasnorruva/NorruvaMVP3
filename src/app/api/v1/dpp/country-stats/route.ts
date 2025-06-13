
// --- File: src/app/api/v1/dpp/country-stats/route.ts ---
// Description: API endpoint to retrieve DPP counts by country of origin.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { MOCK_DPPS } from '@/data';
import { validateApiKey } from '@/middleware/apiKeyAuth';

interface CountryStat {
  countryCode: string;
  count: number;
}

export async function GET(request: NextRequest) {
  const authError = validateApiKey(request);
  if (authError) return authError;

  const countryCounts: Record<string, number> = {};

  MOCK_DPPS.forEach(dpp => {
    const originCountry = dpp.traceability?.originCountry?.toUpperCase() || 'UNKNOWN';
    countryCounts[originCountry] = (countryCounts[originCountry] || 0) + 1;
  });

  const result: CountryStat[] = Object.entries(countryCounts).map(([code, num]) => ({
    countryCode: code,
    count: num,
  }));

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));

  return NextResponse.json(result);
}
