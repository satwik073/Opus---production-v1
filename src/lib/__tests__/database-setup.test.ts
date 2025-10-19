import { describe, it, expect, vi } from "vitest";

describe("database-setup prisma singleton", () => {
  it("creates and assigns prisma to global in non-production", async () => {
    // Clean slate
    // @ts-expect-error test override
    delete (global as any).prisma;

    vi.resetModules();
    process.env.NODE_ENV = "test";

    vi.doMock("@/generated/prisma", () => {
      class PrismaClient {}
      return { PrismaClient };
    }, { virtual: true });

    const mod = await import("@/lib/database-setup");
    expect(mod.prisma).toBeDefined();
    // @ts-expect-error test check
    expect((global as any).prisma).toBe(mod.prisma);
  });

  it("does not attach prisma to global in production", async () => {
    // Clean slate
    // @ts-expect-error test override
    delete (global as any).prisma;

    vi.resetModules();
    process.env.NODE_ENV = "production";

    vi.doMock("@/generated/prisma", () => {
      class PrismaClient {}
      return { PrismaClient };
    }, { virtual: true });

    const mod = await import("@/lib/database-setup");
    expect(mod.prisma).toBeDefined();
    // @ts-expect-error test check
    expect((global as any).prisma).toBeUndefined();
  });
});