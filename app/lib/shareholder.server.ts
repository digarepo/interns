import { query } from "~/db/db.server";
import { Shareholder } from "~/types/shareholder";

export async function getAllShareholders(): Promise<Shareholder[]> {
  return query<Shareholder[]>("SELECT * FROM shareholders ORDER BY full_name");
}

export async function createShareholder(
  shareholder: Shareholder
): Promise<void> {
  await query("INSERT INTO shareholders (fn_id, full_name) VALUES (?, ?)", [
    shareholder.fn_id,
    shareholder.full_name,
  ]);
}

export async function deleteShareholder(fn_id: string): Promise<void> {
  await query("DELETE FROM shareholders WHERE fn_id = ?", [fn_id]);
}

export async function shareholderExists(fn_id: string): Promise<boolean> {
  const result = await query<{ count: number }[]>(
    "SELECT COUNT(*) as count FROM shareholders WHERE fn_id = ?",
    [fn_id]
  );
  return result[0].count > 0;
}
