import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function Shareholders() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Shareholder Form</h2>
        <form className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" placeholder="Enter full name" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="Enter email" required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="shares">Number of Shares</Label>
            <Input id="shares" name="shares" type="number" placeholder="Enter shares" required className="mt-1" />
          </div>
          <Button type="submit" className="w-full">Submit</Button>
        </form>
      </div>
    </div>
  );
}
