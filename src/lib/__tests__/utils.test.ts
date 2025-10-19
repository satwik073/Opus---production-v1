import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges simple class names", () => {
    expect(cn("p-2", "text-sm")).toBe("p-2 text-sm");
  });

  it("skips falsy values", () => {
    const cond = false;
    // @ts-expect-error testing loose input acceptance
    expect(cn("p-2", cond && "hidden", null, undefined, "m-1")).toBe("p-2 m-1");
  });

  it("tailwind-merge resolves conflicts by last entry", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("bg-blue-500", "bg-red-500")).toBe("bg-red-500");
  });
});