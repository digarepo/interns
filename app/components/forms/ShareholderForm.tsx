import React from "react";
import { shareholderFields } from "~/lib/configs/shareholder-fields";
import { useFetcher } from "@remix-run/react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";

interface ShareholderFormProps {
  initialValues?: Record<string, any>;
  submitLabel?: string;
  loadingLabel?: string;
  errors?: any[];
  method?: 'post' | 'get';
  hiddenFields?: Record<string, string>;
}

type ActionData = {
  success: boolean;
  errors?: any[];
  message?: string;
  data?: any;
};

export function ShareholderForm({
  initialValues = {},
  submitLabel = "Submit",
  loadingLabel = "Submitting...",
  errors = [],
  method = "post",
  hiddenFields = {},
}: ShareholderFormProps) {
  const fetcher = useFetcher<ActionData>();
  const isLoading = fetcher.state !== "idle";
  const isSuccess = fetcher.data?.success;

  return (
    <div className="w-full max-w-md mx-auto rounded-lg bg-white dark:bg-gray-800 shadow-md p-6 sm:p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Shareholder Form</h2>
      <fetcher.Form method={method} className="space-y-6">
        {Object.entries(hiddenFields).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        {shareholderFields.map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              maxLength={field.maxLength}
              required={field.required}
              autoComplete={field.autoComplete}
              defaultValue={initialValues[field.name] || ""}
              readOnly={field.name === "fn_id" && method !== "post"}
              className="mt-1"
            />
          </div>
        ))}
        {errors.length > 0 && (
          <div className="text-red-500">
            {errors.map((err: any, i: number) => (
              <div key={i}>{err.message}</div>
            ))}
          </div>
        )}
        {isSuccess && (
          <div className="text-green-600 text-center font-medium">Successfully submitted!</div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? loadingLabel : submitLabel}
        </Button>
      </fetcher.Form>
    </div>
  );
}

