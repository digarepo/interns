import { db } from "../db.server";
import type { Shareholder } from "../validations/shareholder";

export async function createShareholder(data: Shareholder) {
  const { first_name, email } = data;

  const [result] = await db.execute(
    `INSERT INTO shareholders (first_name, email)
     VALUES (?, ?)`,
    [first_name, email]
  );

  return result;
}
