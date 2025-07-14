export interface Shareholder {
  fn_id: string;
  full_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShareholderFormData {
  fn_id: string;
  full_name: string;
}
