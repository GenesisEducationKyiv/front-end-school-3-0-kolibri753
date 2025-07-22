import { test, expect } from "@playwright/experimental-ct-react";
import { SelectModeToggle } from "./index";

const createProps = (overrides = {}) => ({
  selectionMode: false,
  onToggleMode: () => {},
  selectedCount: 0,
  onBulkDelete: () => {},
  bulkDeleteDisabled: true,
  ...overrides,
});

test.describe("SelectModeToggle Component", () => {
  test("should toggle between Multi Select and Exit Select modes", async ({
    mount,
  }) => {
    let toggleCalled = false;
    const mockToggle = () => {
      toggleCalled = true;
    };

    const component = await mount(
      <SelectModeToggle {...createProps({ onToggleMode: mockToggle })} />
    );

    const toggleButton = component.locator(
      '[data-testid="select-mode-toggle"]'
    );
    await expect(toggleButton).toHaveText("Multi Select");
    await expect(toggleButton).toHaveAttribute("aria-pressed", "false");

    await toggleButton.click();
    expect(toggleCalled).toBe(true);
  });

  test("should show Exit Select and bulk delete button in selection mode", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle
        {...createProps({
          selectionMode: true,
          selectedCount: 3,
          bulkDeleteDisabled: false,
        })}
      />
    );

    const toggleButton = component.locator(
      '[data-testid="select-mode-toggle"]'
    );
    await expect(toggleButton).toHaveText("Exit Select");
    await expect(toggleButton).toHaveAttribute("aria-pressed", "true");

    const bulkButton = component.locator('[data-testid="bulk-delete-button"]');
    await expect(bulkButton).toBeVisible();
    await expect(bulkButton).toHaveText("Delete 3");
    await expect(bulkButton).toBeEnabled();
    await expect(bulkButton).not.toHaveAttribute("disabled");
  });

  test("should handle bulk delete functionality", async ({ mount }) => {
    let bulkDeleteCalled = false;
    const mockBulkDelete = () => {
      bulkDeleteCalled = true;
    };

    const component = await mount(
      <SelectModeToggle
        {...createProps({
          selectionMode: true,
          selectedCount: 2,
          onBulkDelete: mockBulkDelete,
          bulkDeleteDisabled: false,
        })}
      />
    );

    const bulkButton = component.locator('[data-testid="bulk-delete-button"]');
    await bulkButton.click();
    expect(bulkDeleteCalled).toBe(true);
  });

  test("should disable bulk delete when no items selected", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle
        {...createProps({
          selectionMode: true,
          selectedCount: 0,
          bulkDeleteDisabled: true,
        })}
      />
    );

    const bulkButton = component.locator('[data-testid="bulk-delete-button"]');
    await expect(bulkButton).toBeDisabled();
    await expect(bulkButton).toHaveAttribute("disabled");
  });

  test("should hide bulk delete button when not in selection mode", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle {...createProps({ selectionMode: false })} />
    );

    const bulkButton = component.locator('[data-testid="bulk-delete-button"]');
    await expect(bulkButton).not.toBeVisible();
  });

  test("should display correct selected count in bulk delete button with count 1", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle
        {...createProps({
          selectionMode: true,
          selectedCount: 1,
          bulkDeleteDisabled: false,
        })}
      />
    );

    const bulkButton = component.locator('[data-testid="bulk-delete-button"]');
    await expect(bulkButton).toHaveText("Delete 1");
  });

  test("should display correct selected count in bulk delete button with count 5", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle
        {...createProps({
          selectionMode: true,
          selectedCount: 5,
          bulkDeleteDisabled: false,
        })}
      />
    );

    const bulkButton = component.locator('[data-testid="bulk-delete-button"]');
    await expect(bulkButton).toHaveText("Delete 5");
  });

  test("should have proper accessibility attributes", async ({ mount }) => {
    const component = await mount(
      <SelectModeToggle {...createProps({ selectionMode: false })} />
    );

    const toggleButton = component.locator(
      '[data-testid="select-mode-toggle"]'
    );
    await expect(toggleButton).toHaveAttribute("aria-pressed", "false");
  });

  test("should have proper accessibility attributes in selection mode", async ({
    mount,
  }) => {
    const component = await mount(
      <SelectModeToggle {...createProps({ selectionMode: true })} />
    );

    const toggleButton = component.locator(
      '[data-testid="select-mode-toggle"]'
    );
    await expect(toggleButton).toHaveAttribute("aria-pressed", "true");
  });
});
