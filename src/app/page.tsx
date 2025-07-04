import React from "react";
import App from "@/components/App";
import { Suspense } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const experimental_ppr = true;

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <App />
    </Suspense>
  );
}
