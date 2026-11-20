"use client";

import { useState } from "react";
import { Countdown } from "@/rac";

/** Demo helper: counts down to a moment a fixed distance from page load. */
export function DemoCountdown({ label, msFromNow }: { label: string; msFromNow: number }) {
  const [target] = useState(() => Date.now() + msFromNow);
  return <Countdown label={label} target={target} />;
}
