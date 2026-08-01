export type Category = "wedding";

export type Framing = "full-length" | "half-body" | "close-up";

export type Subject = "couple" | "bride" | "groom" | "bridal-party" | "family";

export type Moment =
  | "getting-ready" | "first-look" | "ceremony"
  | "portraits" | "golden-hour" | "reception";

export type Difficulty = "easy" | "medium" | "advanced";

export interface PoseImage {
  thumb: string;
  card: string;
  full: string;
  /** Inline base64 preview so a card never renders as an empty grey box. */
  blur: string;
  /** height / width — lets the grid reserve space before the image lands. */
  aspect: number;
  width: number;
  height: number;
}

export interface Pose {
  id: string;
  /**
   * Stable position in the catalog. Share links encode this number instead of
   * the id, which is what keeps a 40-pose deck under 100 bytes of URL.
   */
  index: number;
  category: Category;
  title: string;
  framing: Framing;
  subject: Subject;
  moment: Moment;
  difficulty: Difficulty;
  /** The words the photographer says out loud to produce this frame. */
  direction: string;
  lighting: string;
  lens: string;
  /** This pose's most common failure, and the fix. */
  coaching: string;
  tags: string[];
  image: PoseImage;
  /** Free tier shows every frame but keeps most direction text behind Pro. */
  pro: boolean;
}

export interface ShotItem {
  id: string;
  label: string;
  /** Minutes to budget on the day — drives the timeline totals. */
  minutes: number;
  moment: Moment;
  required: boolean;
  done?: boolean;
  /** Set when the item came from a pose rather than a template. */
  poseId?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface ClientResponse {
  /** When the photographer pasted the reply code. */
  receivedISO: string;
  loved: string[];
  maybe: string[];
  no: string[];
  /** How much of the deck the couple actually got through, as a percentage. */
  completion: number;
}

export interface Project {
  id: string;
  name: string;
  category: Category;
  dateTimeISO?: string;
  /** Venue or city, printed on the shot list. */
  location?: string;
  poseIds: string[];
  notes?: string;
  checklist?: ChecklistItem[];
  shotList?: ShotItem[];
  /** Replies collected from the couple's deck. */
  responses?: ClientResponse[];
}
