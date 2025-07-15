import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";

import { shareholderSchema } from "~/lib/validations/shareholder";
import { createShareholder } from "~/lib/models/shareholder.server";
import { ShareholderForm } from "~/components/forms/ShareholderForm";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  const parsed = shareholderSchema.safeParse(values);

  if (!parsed.success) {
    return json(
      { success: false, errors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await createShareholder(parsed.data); // ⬅️ You must define this logic in `lib/models/shareholder.server.ts`
    return json({ success: true });
  } catch (err) {
    console.error("Error saving shareholder:", err);
    return json({ success: false, message: "Database error" }, { status: 500 });
  }
};

export default function ShareholdersPage() {
  const actionData = useActionData<typeof action>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Add Shareholder</h1>
      {isClient ? (
        <ShareholderForm errors={actionData?.errors} />
      ) : (
        <p>Loading form...</p>
      )}
    </div>
  );
}
