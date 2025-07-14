import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import {
  getShareholder,
  updateShareholder,
  deleteShareholder,
} from "~/lib/models/shareholder.server";
import { shareholderSchema } from "~/lib/validations/shareholder";
import { ShareholderForm } from "~/components/forms/ShareholderForm";

export const loader: LoaderFunction = async ({ params }) => {
  const { fn_id } = params;
  if (!fn_id) return json({ success: false, message: "Missing ID" }, { status: 400 });
  const shareholder = await getShareholder(fn_id);
  if (!shareholder) return json({ success: false, message: "Not found" }, { status: 404 });
  return json({ success: true, data: shareholder });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { fn_id } = params;
  if (!fn_id) return json({ success: false, message: "Missing ID" }, { status: 400 });
  const formData = Object.fromEntries(await request.formData());
  const method = request.method.toUpperCase();
  try {
    if (method === "PUT" || (formData._method && formData._method === "PUT")) {
      const parsed = shareholderSchema.parse(formData);
      await updateShareholder(fn_id, parsed);
      return json({ success: true });
    } else if (method === "DELETE" || (formData._method && formData._method === "DELETE")) {
      await deleteShareholder(fn_id);
      return json({ success: true });
    }
    return json({ success: false, message: "Unsupported method" }, { status: 405 });
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

export default function ShareholderDetail() {
  const { data } = useLoaderData<typeof loader>().data;
  const fetcher = useFetcher<ActionData>();
  const navigate = useNavigate();
  const { fn_id } = useParams();

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Shareholder</h1>
      <ShareholderForm
        initialValues={data}
        submitLabel="Save Changes"
        loadingLabel="Saving..."
        errors={fetcher.data?.errors || []}
        method="post"
        hiddenFields={{ _method: "PUT" }}
      />
      <fetcher.Form method="post" className="mt-6" onSubmit={e => { if(!window.confirm('Delete this shareholder?')) e.preventDefault(); }}>
        <input type="hidden" name="_method" value="DELETE" />
        <button type="submit" className="btn btn-error">Delete</button>
      </fetcher.Form>
      {fetcher.data?.success && (
        <div className="text-green-500 mt-2">Success!</div>
      )}
    </div>
  );
}
