import { test, expect } from "@playwright/test";

test("GET /health returns ok", async ({ request }) => {
  const res = await request.get("/health");
  expect(res.ok()).toBeTruthy();
  await expect(res).toBeOK();
  await expect(res.text()).resolves.toBe("ok");
});
