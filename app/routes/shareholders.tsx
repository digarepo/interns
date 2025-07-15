import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { useActionData, useLoaderData, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { z } from "zod"; 


import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { shareholderSchema } from "~/lib/validations/shareholder";
import {
  createShareholder,
  getShareholders,
  updateShareholder,
  deleteShareholder,
  getShareholderById,
} from "~/lib/models/shareholder.server";


type ShareholderWithId = z.infer<typeof shareholderSchema> & { id: number };


export const loader: LoaderFunction = async () => {
  const shareholders = await getShareholders();
  return json({ shareholders });
};


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent"); 

  switch (intent) {
    case "create": {
      const values = Object.fromEntries(formData);
      const parsed = shareholderSchema.safeParse(values);

      if (!parsed.success) {
        return json(
          { success: false, errors: parsed.error.flatten().fieldErrors, intent: "create" },
          { status: 400 }
        );
      }

      try {
        await createShareholder(parsed.data);
        return json({ success: true, intent: "create" });
      } catch (err) {
        console.error("Error saving shareholder:", err);
        return json({ success: false, message: "Database error", intent: "create" }, { status: 500 });
      }
    }

    case "update": {
      const id = Number(formData.get("id"));
      if (isNaN(id)) {
        return json({ success: false, message: "Invalid Shareholder ID", intent: "update" }, { status: 400 });
      }

      const values = Object.fromEntries(formData);
      const parsed = shareholderSchema.safeParse(values);

      if (!parsed.success) {
        return json(
          { success: false, errors: parsed.error.flatten().fieldErrors, intent: "update", id },
          { status: 400 }
        );
      }

      try {
        await updateShareholder(id, parsed.data);
        return json({ success: true, intent: "update", id });
      } catch (err) {
        console.error(`Error updating shareholder ${id}:`, err);
        return json({ success: false, message: "Database error", intent: "update", id }, { status: 500 });
      }
    }

    case "delete": {
      const id = Number(formData.get("id"));
      if (isNaN(id)) {
        return json({ success: false, message: "Invalid Shareholder ID", intent: "delete" }, { status: 400 });
      }

      try {
        await deleteShareholder(id);
        return json({ success: true, intent: "delete", id });
      } catch (err) {
        console.error(`Error deleting shareholder ${id}:`, err);
        return json({ success: false, message: "Database error", intent: "delete", id }, { status: 500 });
      }
    }

    default:
      return json({ success: false, message: "Invalid intent", intent: "unknown" }, { status: 400 });
  }
};


type FormData = z.infer<typeof shareholderSchema>;

type ActionResponse = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  intent?: "create" | "update" | "delete" | "unknown";
  id?: number; 
};

interface ShareholderFormProps {
  initialData?: ShareholderWithId | null; 
  onCancel?: () => void; 
}

export function ShareholderForm({ initialData, onCancel }: ShareholderFormProps) {
  const actionData = useActionData<ActionResponse>();
  const isUpdate = !!initialData; 

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: initialData || { first_name: "", email: "" }, 
  });

  useEffect(() => {

    if (actionData?.success && actionData.intent === "create") {
      reset();
    }
   
    if (actionData?.errors && (actionData.intent === "create" || actionData.intent === "update")) {
      Object.entries(actionData.errors).forEach(([fieldName, messages]) => {
        setError(fieldName as keyof FormData, {
          type: "server",
          message: messages[0],
        });
      });
    }
  }, [actionData, reset, setError]);

  return (
    <form method="post" className="space-y-4 p-4 border rounded-lg shadow-sm bg-white">
      {isUpdate && (
        <input type="hidden" name="id" value={initialData.id} />
      )}
      <input type="hidden" name="intent" value={isUpdate ? "update" : "create"} />

      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          id="first_name"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          {...register("first_name")}
        />
        {errors.first_name && (
          <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          id="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="flex space-x-3">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isUpdate ? "Update Shareholder" : "Add Shareholder"}
        </button>
        {isUpdate && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Display messages based on the intent of the action */}
      {actionData?.success && actionData.intent === "create" && (
        <p className="text-green-600 text-sm mt-2">Shareholder added successfully!</p>
      )}
      {actionData?.success && actionData.intent === "update" && actionData.id === initialData?.id && (
        <p className="text-green-600 text-sm mt-2">Shareholder updated successfully!</p>
      )}
      {actionData?.success === false && actionData.message && (
        <p className="text-red-600 text-sm mt-2">{actionData.message}</p>
      )}
    </form>
  );
}


export default function ShareholdersPage() {
  const { shareholders } = useLoaderData<{ shareholders: ShareholderWithId[] }>();
  const actionData = useActionData<ActionResponse>();
  const [isClient, setIsClient] = useState(false);
  const [editingShareholderId, setEditingShareholderId] = useState<number | null>(null);

 
  const fetcher = useFetcher();

  useEffect(() => {
    setIsClient(true);
  }, []);

 
  useEffect(() => {
    if (actionData?.success && (actionData.intent === "update" || actionData.intent === "delete")) {
      setEditingShareholderId(null); // Exit edit mode
    }
  }, [actionData]);

  const handleEditClick = (id: number) => {
    setEditingShareholderId(id);
  };

  const handleCancelEdit = () => {
    setEditingShareholderId(null);
  };

  const handleDeleteClick = (id: number) => {
    if (window.confirm("Are you sure you want to delete this shareholder?")) {
      fetcher.submit(
        { id: String(id), intent: "delete" },
        { method: "post", action: "/shareholders" }
      );
    }
  };

  const shareholderToEdit = editingShareholderId
    ? shareholders.find((s) => s.id === editingShareholderId)
    : null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Shareholder Management</h1>

        {/* Add/Edit Shareholder Form */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingShareholderId ? "Edit Shareholder" : "Add New Shareholder"}
          </h2>
          {isClient ? (
            <ShareholderForm
              initialData={shareholderToEdit}
              onCancel={handleCancelEdit}
            />
          ) : (
            <p className="text-gray-600">Loading form...</p>
          )}
        </div>

        {/* Shareholder List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Existing Shareholders</h2>
          {shareholders.length === 0 ? (
            <p className="text-gray-600">No shareholders added yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      First Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shareholders.map((shareholder) => (
                    <tr key={shareholder.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shareholder.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shareholder.first_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shareholder.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(shareholder.id)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(shareholder.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}