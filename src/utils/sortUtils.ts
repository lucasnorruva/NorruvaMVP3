
// --- File: src/utils/sortUtils.ts ---
// Description: Utility functions for sorting Digital Product Passports.

import type { DigitalProductPassport, SortableKeys } from '@/types/dpp';

/**
 * Returns the value to use when sorting a DPP by the given key.
 * Handles nested keys and special cases.
 */
export function getSortValue(dpp: DigitalProductPassport, key: SortableKeys): any {
  switch (key) {
    case 'metadata.status':
      return dpp.metadata.status;
    case 'metadata.last_updated':
      return new Date(dpp.metadata.last_updated).getTime();
    case 'ebsiVerification.status':
      return dpp.ebsiVerification?.status;
    case 'metadata.onChainStatus': 
      return dpp.metadata?.onChainStatus;
    case 'manufacturer.name': // Ensure this case is handled
      return dpp.manufacturer?.name;
    default:
      // Handle simple top-level keys directly
      if (!key.includes('.')) {
        return (dpp as any)[key];
      }
      // For other potential nested keys (if added to SortableKeys later)
      const keys = key.split('.');
      let value: any = dpp;
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return undefined;
        }
      }
      return value;
  }
}

