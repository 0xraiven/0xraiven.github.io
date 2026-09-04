import { notFound } from "next/navigation";
import KeystaticApp from "./keystatic";

export default function Layout() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <KeystaticApp />;
}
