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


export async function getShareholders() {
  // Select all columns from the shareholders table
  const [rows] = await db.execute(`SELECT id, first_name, email FROM shareholders`);

  return rows as (Shareholder & { id: number })[];
}


export async function getShareholderById(id: number) {
 
  const [rows]: any = await db.execute(
    `SELECT id, first_name, email FROM shareholders WHERE id = ?`,
    [id]
  );
 
  return rows[0] as (Shareholder & { id: number }) | null;
}


export async function updateShareholder(id: number, data: Shareholder) {
  const { first_name, email } = data;

 
  const [result] = await db.execute(
    `UPDATE shareholders SET first_name = ?, email = ? WHERE id = ?`,
    [first_name, email, id]
  );

  return result;
}


export async function deleteShareholder(id: number) {
 
  const [result] = await db.execute(
    `DELETE FROM shareholders WHERE id = ?`,
    [id]
  );

  return result;
}
