import { expect, test } from "@playwright/test";

test("runs a black-hole-path simulation from the Pages build", async ({ page }) => {
  test.setTimeout(90_000);

  await page.goto("/");
  await expect(page.getByText("Stellar Evolution Simulator")).toBeVisible();
  await expect(page.getByText(/v0\.1\.0/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Star repo" })).toHaveAttribute(
    "href",
    "https://github.com/baditaflorin/stellar-evolution-simulator",
  );
  await expect(page.getByRole("link", { name: "Support" })).toHaveAttribute(
    "href",
    "https://www.paypal.com/paypalme/florinbadita",
  );

  await page.getByRole("button", { name: "Black hole path" }).click();
  await expect(page.getByTestId("predicted-remnant")).toContainText("Black hole");
  await page.getByRole("button", { name: "Run simulation" }).click();

  await expect(page.getByTestId("simulation-status")).toContainText("Track complete", {
    timeout: 60_000,
  });
  await expect(page.getByText(/Black hole after/)).toBeVisible();
  await expect(page.getByTestId("chart-status")).toContainText("Chart ready", {
    timeout: 30_000,
  });
  await expect(page.getByTestId("star-canvas")).toBeVisible();
});
