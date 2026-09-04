import { makePage } from "@keystatic/next/ui/app";
import config from "@/keystatic.config";
import { notFound } from "next/navigation";

const Keystatic = makePage(config);

export default function KeystaticPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <Keystatic />;
}
