export interface Link {
  id: number;
  title: string;
  url: string;
  favicon?: string;
  tags?: string;
  visit_count: number;
  created_at: Date;
  updated_at: Date;
}