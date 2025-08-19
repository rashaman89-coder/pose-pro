export type Category =
  | "single" | "couple" | "wedding" | "portrait" | "family"
  | "newborn" | "maternity" | "studio" | "outdoor" | "pets" | "fashion";

export interface Pose {
  id: string;
  title: string;
  category: Category;
  imageUrl: string;
  instructions: string;
  tags: string[];
}

export interface ShotItem {
  id: string;
  label: string;
  required: boolean;
  done?: boolean;
}

export interface Project {
  id: string;
  name: string;
  category: Category;
  dateTimeISO: string;
  notes?: string;
  poseIds: string[];
  shotList: ShotItem[];
}
