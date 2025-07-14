import { Form } from "@remix-run/react";
import type { ShareholderFormData } from "~/validation/shareholder";

interface ShareholderFormProps {
  errors?: {
    fn_id?: string[];
    full_name?: string[];
  };
  defaultValues?: Partial<ShareholderFormData>;
}

export function ShareholderForm({
  errors,
  defaultValues,
}: ShareholderFormProps) {
  return (
    <Form method="post" className="space-y-4">
      <div>
        <label
          htmlFor="fn_id"
          className="block text-sm font-medium text-gray-700"
        >
          ID
        </label>
        <input
          type="text"
          id="fn_id"
          name="fn_id"
          defaultValue={defaultValues?.fn_id}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
            errors?.fn_id ? "border-red-500" : ""
          }`}
          aria-invalid={Boolean(errors?.fn_id)}
          aria-describedby={errors?.fn_id ? "fn_id-error" : undefined}
        />
        {errors?.fn_id && (
          <p id="fn_id-error" className="mt-1 text-sm text-blue-600">
            {errors.fn_id[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-blue-500"
        >
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          defaultValue={defaultValues?.full_name}
          className={`mt-1 block w-full rounded-md sm:text-sm ${
            errors?.full_name ? "border-white-500" : ""
          }`}
          aria-invalid={Boolean(errors?.full_name)}
          aria-describedby={errors?.full_name ? "full_name-error" : undefined}
        />
        {errors?.full_name && (
          <p id="full_name-error" className="mt-1 text-sm text-red-600">
            {errors.full_name[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Submit
      </button>
    </Form>
  );
}
