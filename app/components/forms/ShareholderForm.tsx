import { useActionData } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shareholderSchema } from "~/lib/validations/shareholder";
import type { z } from "zod";

type FormData = z.infer<typeof shareholderSchema>;

type ActionResponse = {
  success?: boolean;
  errors?: Record<string, string>;
};

export function ShareholderForm() {
  const actionData = useActionData<ActionResponse>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(shareholderSchema),
  });

  return (
    <form method="post" className="space-y-6 max-w-md">
      <div>
        <label className="block">First Name</label>
        <input className="border w-full p-2" {...register("first_name")} />
        {errors.first_name && (
          <p className="text-red-500 text-sm">{errors.first_name.message}</p>
        )}
      </div>

      <div>
        <label className="block">Email</label>
        <input className="border w-full p-2" {...register("email")} />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>

      {actionData?.success && <p className="text-green-600">Shareholder added!</p>}
      {actionData?.errors && <p className="text-red-600">Check your inputs</p>}
    </form>
  );
}
interface ShareholderFormProps {
  errors?: Record<string, string[]>;
}
