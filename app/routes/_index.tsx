import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

import { ShareholderForm } from "~/components/forms/ShareholderForm";

export default function Index() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Shareholder Sign Page</h1>
        <ShareholderForm submitLabel="Sign In" />
      </div>
    </div>
  );
}

