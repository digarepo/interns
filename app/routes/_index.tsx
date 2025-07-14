import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, useActionData } from "@remix-run/react";
import { ShareholderForm } from "~/components/ShareholderForm";
import { ShareholderList } from "~/components/ShareholderList";
import {
  getAllShareholders,
  createShareholder,
  deleteShareholder,
} from "~/lib/shareholder.server";
import { ShareholderSchema } from "~/validation/shareholder";

export const loader: LoaderFunction = async () => {
  const shareholders = await getAllShareholders();
  return json({ shareholders });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const _action = formData.get("_action");

  if (_action === "delete") {
    const fn_id = formData.get("fn_id") as string;
    await deleteShareholder(fn_id);
    return json({ success: true });
  }

  const data = Object.fromEntries(formData);
  const validation = ShareholderSchema.safeParse(data);

  if (!validation.success) {
    return json(
      {
        errors: validation.error.flatten().fieldErrors,
        values: data,
      },
      { status: 400 }
    );
  }

  try {
    await createShareholder(validation.data);
    return json({ success: true });
  } catch (error) {
    return json(
      {
        errors: {
          fn_id: ["This ID already exists"],
          form: ["Failed to create shareholder"],
        },
        values: data,
      },
      { status: 400 }
    );
  }
};

export default function Index() {
  const { shareholders } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Add New Shareholder</h2>
          <ShareholderForm
            errors={actionData?.errors}
            defaultValues={actionData?.values}
          />
          {actionData?.errors?.form && (
            <p className="text-red-500">{actionData.errors.form[0]}</p>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Shareholders</h2>
          <ShareholderList shareholders={shareholders} />
        </div>
      </div>
    </div>
  );
}
