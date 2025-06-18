import { describe, it, expect, vi } from "vitest";
import { showToastMessage } from "./index";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

import { toast } from "react-toastify";

describe("showToastMessage", () => {
  it("calls toast with correct message and type", () => {
    showToastMessage("success", "Test success");
    expect(toast).toHaveBeenCalledWith(
      <span data-testid="toast-success">Test success</span>,
      { type: "success" }
    );

    showToastMessage("error", <b>Fail</b>);
    expect(toast).toHaveBeenCalledWith(
      <span data-testid="toast-error">
        <b>Fail</b>
      </span>,
      { type: "error" }
    );
  });
});
