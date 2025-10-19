import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

describe("Alert", () => {
  it("renders with role alert and content", () => {
    render(
      <Alert>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>Something needs your attention.</AlertDescription>
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent("Heads up!");
    expect(alert).toHaveTextContent("Something needs your attention.");
  });

  it("applies destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Failure occurred.</AlertDescription>
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert.className).toMatch(/destructive/);
  });
});