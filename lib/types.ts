// Ledger
export type LedgerCategory =
  | "Fashion"
  | "Skincare"
  | "Aesthetic"
  | "Hair"
  | "Experience"
  | "Wellness"
  | "Other";

export interface LedgerEntry {
  id: string;
  title: string;
  date: string;
  week?: number;
  month?: number;
  category: LedgerCategory;
  amount: number;
  purpose: string;
  effectiveness: "High" | "Medium" | "Low" | "TBD";
  repurchase: "Yes" | "No" | "Maybe";
  notes?: string;
}

// Feelings
export type Mood =
  | "Calm"
  | "Happy"
  | "Anxious"
  | "Low"
  | "Energized"
  | "Tired"
  | "Peaceful"
  | "Restless"
  | "Hopeful"
  | "Other";

export interface FeelingEntry {
  id: string;
  title: string;
  date: string;
  week?: number;
  month?: number;
  mood: Mood[];
  energy: 1 | 2 | 3 | 4 | 5;
  self_state: string;
  favorite_moment?: string;
  uncomfortable_moment?: string;
  touched_by?: string;
  confirmed?: string;
  eliminated?: string;
}

// Looks
export type LookOccasion = "Work" | "Daily" | "Social" | "Event" | "Travel" | "Other";

export interface LookEntry {
  id: string;
  title: string;
  date: string;
  week?: number;
  month?: number;
  imageUrl: string;
  occasion: LookOccasion;
  styleTags: string[];
  colorPalette: string;
  selfRating: number;
  photogenicRating: "Strong" | "Okay" | "Weak" | "N/A";
  notes?: string;
  hairstyle?: string;
  makeup?: string;
  feedback?: string;
  nextAdjustment?: string;
}

// Taste
export type TasteType =
  | "Movie"
  | "Book"
  | "Exhibition"
  | "Brand"
  | "Space"
  | "Person"
  | "Music"
  | "Restaurant"
  | "City"
  | "Other";

export interface TasteEntry {
  id: string;
  title: string;
  type: TasteType;
  date: string;
  week?: number;
  month?: number;
  coverUrl?: string;
  whyILikeIt: string;
  translateToLife: string;
  tags?: string[];
}

// Weekly Review（日历周壳；具体复盘条目由 weekly-review-prompts + 本地存储）
export interface WeeklyReview {
  id: string;
  /** 对应 52 方案周次 1–52 */
  programWeek: number;
  weekStart: string;
  weekEnd: string;
}

// Monthly Reflection
export interface MonthlyReflection {
  id: string;
  month: string;
  monthDate: string;
  keyword: string[];
  biggestChange: string;
  top3WorthIt: string[];
  top3NotWorthIt: string[];
  bestLooks: string[];
  bestInspirations: string[];
  nextMonthFocus: string;
}

// Stable Template
export interface StableTemplate {
  id: string;
  name: string;
  scenario: string;
  keyPieces: string;
  whyItWorks: string;
  usageCount?: number;
}

// To Try
export type ToTryStatus = "Want to try" | "Planned" | "Tried" | "Archived";
export type ToTryType =
  | "Hairstyle"
  | "Item"
  | "Makeup"
  | "Exhibition"
  | "Place"
  | "Style"
  | "Experience"
  | "Other";

export interface ToTryEntry {
  id: string;
  title: string;
  week?: number;
  month?: number;
  type: ToTryType;
  status: ToTryStatus;
  priority: "High" | "Medium" | "Low";
  budget?: string;
  whyWantToTry: string;
}

// Identity
export type IdentitySectionType =
  | "woman_i_want_to_become"
  | "first_glance"
  | "my_elegance"
  | "no_longer_want"
  | "style_keywords"
  | "notes";

export interface IdentityNote {
  id: string;
  section: IdentitySectionType;
  title: string;
  content: string;
  updatedAt: string;
}
