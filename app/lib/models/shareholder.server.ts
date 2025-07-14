import { shareholderSchema, Shareholder } from "../validations/shareholder";
import { query } from "../db.server.js";

// Get all shareholders
export async function getShareholders(): Promise<Shareholder[]> {
  return await query("SELECT * FROM shareholders ORDER BY full_name");
}

// Get a single shareholder by fn_id
export async function getShareholder(fn_id: string): Promise<Shareholder | null> {
  const rows = await query("SELECT * FROM shareholders WHERE fn_id = ?", [fn_id]);
  return rows[0] || null;
}

// Insert a new shareholder
export async function insertShareholder(data: unknown): Promise<void> {
  const parsed = shareholderSchema.parse(data);
  await query(
    "INSERT INTO shareholders (fn_id, full_name) VALUES (?, ?)",
    [parsed.fn_id, parsed.full_name]
  );
}

// Update an existing shareholder
export async function updateShareholder(fn_id: string, data: unknown): Promise<void> {
  const parsed = shareholderSchema.parse(data);
  await query(
    "UPDATE shareholders SET full_name = ? WHERE fn_id = ?",
    [parsed.full_name, fn_id]
  );
}

// Delete a shareholder
export async function deleteShareholder(fn_id: string): Promise<void> {
  await query("DELETE FROM shareholders WHERE fn_id = ?", [fn_id]);
}
