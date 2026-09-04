import { notFound } from "next/navigation";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ params: [] }];
}

export default function Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return null;
}
