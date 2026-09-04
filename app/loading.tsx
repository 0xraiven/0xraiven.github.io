import React from "react";
import { GlyphMatrixSpinner } from "@/components/animation/GlyphMatrixSpinner";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <GlyphMatrixSpinner
        title="r41n // NODE_DISPATCHER"
        subtitle="FETCHING CRYPTOGRAPHIC PAYLOAD..."
        size="md"
        className="w-full max-w-md"
      />
    </div>
  );
}
