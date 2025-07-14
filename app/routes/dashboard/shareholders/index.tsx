import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  getShareholders,
  insertShareholder,
} from "~/lib/models/shareholder.server";
import { shareholderSchema } from "~/lib/validations/shareholder";
import { ShareholderForm } from "~/components/forms/ShareholderForm";

export const loader: LoaderFunction = async () => {
  const shareholders = await getShareholders();
  return json({ success: true, data: shareholders });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = Object.fromEntries(await request.formData());
  try {
    const parsed = shareholderSchema.parse(formData);
    await insertShareholder(parsed);
    return json({ success: true });
  } catch (error: any) {
    if (error.errors) {
      // Zod validation error
      return json({ success: false, errors: error.errors }, { status: 400 });
    }
    return json({ success: false, message: error.message }, { status: 500 });
  }
};

type ActionData = {
  success: boolean;
  errors?: any[];
  message?: string;
  data?: any;
};

export default function ShareholdersIndex() {
  const { data } = useLoaderData<typeof loader>().data;
  const fetcher = useFetcher<ActionData>();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Shareholders</h1>
        <ul className="mb-8">
          {data.map((s: any) => (
            <li key={s.fn_id} className="border-b py-2 text-gray-700 dark:text-gray-200">
              {s.full_name} <span className="text-xs text-gray-500">({s.fn_id})</span>
            </li>
          ))}
        </ul>
        <ShareholderForm
          submitLabel="Add Shareholder"
          loadingLabel="Adding..."
          errors={fetcher.data?.errors || []}
          method="post"
        />
      </div>
    </div>
  );
}
