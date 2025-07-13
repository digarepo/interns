
# Develop the Complete Shareholders Feature

Includes:

* Database schema
* Zod validation
* Backend API logic (with raw SQL)
* Frontend form using Tailwind + shadcn/ui with `<fetcher.Form>`

---

## Tasks to Complete

### Database & Validation

* [ ] Design MariaDB table: `shareholders`

* [ ] Create Zod schema to match DB rules exactly

* [ ] Export:

  ```ts
  export const shareholderSchema = z.object({ ... });
  export type Shareholder = z.infer<typeof shareholderSchema>;
  ```

* [ ] Save file as:
  `app/lib/validations/shareholder.ts`

---

### Backend (CRUD APIs)

* [ ] Validate all incoming requests using Zod inside `loader` and `action` functions

* [ ] Write raw SQL queries (no ORM) in:
  `lib/models/shareholder.server.ts`

* [ ] Implement full CRUD logic (`GET`, `POST`, `PUT`, `DELETE`) in:

  * `app/routes/dashboard/shareholders/index.tsx`
  * `app/routes/dashboard/shareholders/$fn_id.tsx`

* [ ] Return structured JSON responses using:

  ```ts
  return json({ success: true, data })
  ```

**Example: raw SQL logic using `query()`**

```ts

export async function getShareholders(): Promise<Shareholder[]> {
  return await query("SELECT * FROM shareholders ORDER BY full_name");
}

export async function insertShareholder(data: Shareholder): Promise<void> {
  await query("INSERT INTO shareholders (fn_id, full_name) VALUES (?, ?)", [data.fn_id, data.full_name]);
}

```

---

### Frontend (Form + UI)

* [ ] Design forms using Tailwind and shadcn/ui components (e.g., Input, Button, Label)

* [ ] Use `<fetcher.Form>` for all form handling (create, update, delete)

* [ ] Reuse field metadata from `lib/configs/shareholder-fields.ts` if applicable

* [ ] Use `.map()` to render dynamic fields from metadata

* [ ] Display validation errors (from Zod) and API errors inline

* [ ] Show loading and success states using `fetcher.state`

* [ ] Ensure full responsiveness across devices (mobile + desktop)

---

## Acceptance Criteria

* [ ] SQL schema saved to `/lib/sql/`

* [ ] Zod schema created and integrated with backend logic

* [ ] All API routes (index + \$fn\_id) support CRUD and are tested

* [ ] Form UI components created and optionally reusable

* [ ] Server-side Zod validation triggers and responds correctly

* [ ] Fully styled UI using Tailwind and ShadCN components

* [ ] All code committed to `feature/shareholders` branch

---

## File & Folder Expectations

* `lib/validations/shareholder.ts`
* `lib/models/shareholder.server.ts`
* `lib/configs/shareholder-fields.ts`
* `components/forms/ShareholderForm.tsx`
* `routes/dashboard/shareholders/index.tsx`
* `routes/dashboard/shareholders/$fn_id.tsx`
