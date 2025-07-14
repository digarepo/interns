import { Form } from "@remix-run/react";
import type { Shareholder } from "~/types/shareholder";

interface ShareholderListProps {
  shareholders: Shareholder[];
}

export function ShareholderList({ shareholders }: ShareholderListProps) {
  if (shareholders.length === 0) {
    return <p className="text-gray-500">No shareholders found</p>;
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <ul className="divide-y divide-gray-200">
        {shareholders.map((shareholder) => (
          <li key={shareholder.fn_id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center min-w-0">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  {shareholder.full_name}
                </p>
                <p className="ml-2 flex-shrink-0 text-xs text-gray-500">
                  ({shareholder.fn_id})
                </p>
              </div>
              <Form method="post">
                <input type="hidden" name="fn_id" value={shareholder.fn_id} />
                <button
                  type="submit"
                  name="_action"
                  value="delete"
                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </Form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
