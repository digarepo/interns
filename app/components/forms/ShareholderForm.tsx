import { useActionData } from "@remix-run/react";
import { useForm } from "react-hook-form"; // <-- Make sure this line is present
import { zodResolver } from "@hookform/resolvers/zod";
import { shareholderSchema } from "~/lib/validations/shareholder";
import type { z } from "zod";
import { useEffect } from "react";

// Define a type for a Shareholder with an ID for display/editing
type ShareholderWithId = z.infer<typeof shareholderSchema> & { id: number }; // Ensure this type is defined if not already

type FormData = z.infer<typeof shareholderSchema>;

type ActionResponse = {
  success?: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  intent?: "create" | "update" | "delete" | "unknown";
  id?: number; // For update/delete responses
};

interface ShareholderFormProps {
  initialData?: ShareholderWithId | null; // Optional initial data for editing
  onCancel?: () => void; // Optional callback for cancel button in edit mode
}

export function ShareholderForm({ initialData, onCancel }: ShareholderFormProps) {
  const actionData = useActionData<ActionResponse>();
  const isUpdate = !!initialData; // Determine if it's an update form

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: initialData || { first_name: "", email: "" }, // Set default values for edit or new
  });

  useEffect(() => {
    // Reset form only if it was a successful 'create' action
    if (actionData?.success && actionData.intent === "create") {
      reset();
    }
    // Set server-side errors for 'create' or 'update' intent
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