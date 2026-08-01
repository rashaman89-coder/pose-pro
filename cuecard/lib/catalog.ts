import catalogJson from "./generated/catalog.json";
import type { Pose, Category, Framing, Subject, Moment, Difficulty } from "./types";

export const catalog = catalogJson as unknown as Pose[];

/** Index lookup is the hot path — share links decode to indexes. */
const byIndex = catalog;
const byId = new Map(catalog.map((p) => [p.id, p]));

export function poseByIndex(index: number): Pose | undefined {
  return byIndex[index];
}

export function poseById(id: string): Pose | undefined {
  return byId.get(id);
}

export function posesByIndexes(indexes: number[]): Pose[] {
  return indexes.map((i) => byIndex[i]).filter((p): p is Pose => Boolean(p));
}

export function posesByIds(ids: string[]): Pose[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Pose => Boolean(p));
}

export interface PoseFilter {
  category?: Category;
  framing?: Framing;
  subject?: Subject;
  moment?: Moment;
  difficulty?: Difficulty;
  tag?: string;
  /** Free-text match over title, tags and direction. */
  q?: string;
}

export function filterPoses(filter: PoseFilter): Pose[] {
  const q = filter.q?.trim().toLowerCase();
  return catalog.filter((p) => {
    if (filter.category && p.category !== filter.category) return false;
    if (filter.framing && p.framing !== filter.framing) return false;
    if (filter.subject && p.subject !== filter.subject) return false;
    if (filter.moment && p.moment !== filter.moment) return false;
    if (filter.difficulty && p.difficulty !== filter.difficulty) return false;
    if (filter.tag && !p.tags.includes(filter.tag)) return false;
    if (q) {
      const haystack = `${p.title} ${p.tags.join(" ")} ${p.direction}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** Facet counts for the filter sidebar, computed against the current result set. */
export function facets(poses: Pose[] = catalog) {
  const tally = <K extends string>(key: (p: Pose) => K) => {
    const m = new Map<K, number>();
    for (const p of poses) m.set(key(p), (m.get(key(p)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  const tagCounts = new Map<string, number>();
  for (const p of poses) {
    for (const t of p.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  }

  return {
    framing: tally((p) => p.framing),
    subject: tally((p) => p.subject),
    moment: tally((p) => p.moment),
    difficulty: tally((p) => p.difficulty),
    tags: [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 24),
  };
}

export const allTags = [...new Set(catalog.flatMap((p) => p.tags))].sort();

export const categories = [...new Set(catalog.map((p) => p.category))] as Category[];

/**
 * Suggests a balanced deck for a shoot: a spread across moments and framings
 * rather than twelve near-identical couple portraits. Used by the "build me a
 * deck" button so a first-time user gets a good result with one click.
 */
export function suggestDeck(options: {
  size?: number;
  subjects?: Subject[];
  moments?: Moment[];
} = {}): Pose[] {
  const size = options.size ?? 24;
  const subjects = options.subjects ?? ["couple", "bride", "groom"];
  const pool = catalog.filter((p) => subjects.includes(p.subject));

  // Round-robin across (subject, framing) buckets so no single look dominates.
  const buckets = new Map<string, Pose[]>();
  for (const p of pool) {
    const key = `${p.subject}:${p.framing}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(p);
  }

  const keys = [...buckets.keys()].sort();
  const picked: Pose[] = [];
  let round = 0;
  while (picked.length < size && round < 200) {
    let addedThisRound = false;
    for (const key of keys) {
      const list = buckets.get(key)!;
      if (round < list.length) {
        picked.push(list[round]);
        addedThisRound = true;
        if (picked.length >= size) break;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }
  return picked;
}

export const LABELS = {
  framing: {
    "full-length": "Full length",
    "half-body": "Half body",
    "close-up": "Close up",
  },
  subject: {
    couple: "Couple",
    bride: "Bride",
    groom: "Groom",
    "bridal-party": "Bridal party",
    family: "Family",
  },
  moment: {
    "getting-ready": "Getting ready",
    "first-look": "First look",
    ceremony: "Ceremony",
    portraits: "Portraits",
    "golden-hour": "Golden hour",
    reception: "Reception",
  },
  difficulty: {
    easy: "Easy",
    medium: "Medium",
    advanced: "Advanced",
  },
} as const;

export function label(kind: keyof typeof LABELS, value: string): string {
  const group = LABELS[kind] as Record<string, string>;
  return group[value] ?? value;
}
