import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders default button", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: /click me/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass("bg-primary");
    expect(btn).toHaveClass("text-primary-foreground");
    expect(btn).toHaveClass("h-9");
  });

  it("supports outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: /outline/i });
    expect(btn).toHaveClass("border");
    expect(btn).toHaveClass("bg-background");
  });

  it("supports icon size", () => {
    render(<Button size="icon" aria-label="icon only" />);
    const btn = screen.getByRole("button", { name: /icon only/i });
    expect(btn).toHaveClass("size-9");
  });

  it("renders asChild (anchor)", () => {
    render(
      <Button asChild>
        <a href="/docs">Docs</a>
      </Button>
    );
    const link = screen.getByRole("link", { name: /docs/i });
    expect(link).toHaveAttribute("href", "/docs");
  });
});