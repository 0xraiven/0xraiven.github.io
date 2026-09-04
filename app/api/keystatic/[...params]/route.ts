import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "@/keystatic.config";
import { notFound } from "next/navigation";

const handler = makeRouteHandler({ config });

export const GET: typeof handler.GET = (...args) => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return handler.GET(...args);
};

export const POST: typeof handler.POST = (...args) => {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return handler.POST(...args);
};
