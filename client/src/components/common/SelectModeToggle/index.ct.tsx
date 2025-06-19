import { test, expect } from "@playwright/experimental-ct-react";
import { SelectModeToggle } from "./index";

test.describe("<SelectModeToggle />", () => {
  test("renders MultiSelect when selectionMode = false and fires onToggle", async ({
    mount,
  }) => {
    let toggled = false;

    const component = await mount(
      <SelectModeToggle
        selectionMode={false}
        onToggleMode={() => (toggled = true)}
        selectedCount={0}
        onBulkDelete={() => {}}
        bulkDeleteDisabled={true}
      />
    );

    const toggleBtn = component.getByTestId("select-mode-toggle");
    await expect(toggleBtn).toHaveText("Multi Select");
    await expect(toggleBtn).toHaveAttribute("aria-pressed", "false");
    await expect(component.getByTestId("bulk-delete-button")).toHaveCount(0);

    await toggleBtn.click();
    expect(toggled).toBe(true);
  });

  test("renders “Exit Select” & bulk-delete button when selectionMode = true", async ({
    mount,
  }) => {
    let bulkCalled = false;
    const component = await mount(
      <SelectModeToggle
        selectionMode={true}
        onToggleMode={() => {}}
        selectedCount={3}
        onBulkDelete={() => (bulkCalled = true)}
        bulkDeleteDisabled={false}
      />
    );

    const toggleBtn = component.getByTestId("select-mode-toggle");
    await expect(toggleBtn).toHaveText("Exit Select");
    await expect(toggleBtn).toHaveAttribute("aria-pressed", "true");

    const bulkBtn = component.getByTestId("bulk-delete-button");
    await expect(bulkBtn).toBeVisible();
    await expect(bulkBtn).toBeEnabled();
    await expect(bulkBtn).toHaveText("Delete 3");

    await bulkBtn.click();
    expect(bulkCalled).toBe(true);
  });

  test("disables bulk-delete when bulkDeleteDisabled = true", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle
        selectionMode={true}
        onToggleMode={() => {}}
        selectedCount={2}
        onBulkDelete={() => {}}
        bulkDeleteDisabled={true}
      />
    );

    const bulkBtn = component.getByTestId("bulk-delete-button");
    await expect(bulkBtn).toBeDisabled();
  });
});
