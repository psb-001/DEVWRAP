import { WrapData } from '../types';

export function calculatePersonality(data: WrapData): string {
    // We strictly use the first stat (Index 0) as our source of truth for Lines Written
    const locStat = data.stats[0];
    const locValue = locStat?.value || '0';

    // Clean string and parse to number
    const loc = parseInt(locValue.replace(/,/g, '').replace(/\+/g, '')) || 0;

    // Define personality BASED ONLY ON LINES WRITTEN volume
    if (loc >= 100000) return 'BATMAN';    // 100k+
    if (loc >= 50000) return 'CODE MONSTER'; // 50k+
    if (loc >= 25000) return 'SYNTAX WIZARD'; // 25k+
    if (loc >= 10000) return 'BUG SLAYER';   // 10k+
    if (loc >= 5000) return 'GHOST CODER';   // 5k+

    return 'NEWBIE'; // < 5k
}
