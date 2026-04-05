import { test, expect } from "@playwright/test";

test.describe("Cyber Cafe UI smoke", () => {
  test("home loads and layout mode toggles editor toolbar", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("app-root")).toBeVisible({ timeout: 30_000 });
    await page.getByTestId("toolbar-layout").click();
    await expect(page.getByTestId("editor-toolbar")).toBeVisible({ timeout: 15_000 });
  });
});
