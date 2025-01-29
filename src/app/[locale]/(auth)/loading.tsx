import { Spinner , RoundSpinner  } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="flex items-center space-x-2 h-screen w-screen justify-center">
      <Spinner />
    </div>
  );
}

