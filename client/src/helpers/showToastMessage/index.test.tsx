import { describe, it, expect, vi, beforeEach } from "vitest";
import { showToastMessage } from "./index";

vi.mock("react-toastify", () => ({
  toast: vi.fn(),
}));

import { toast } from "react-toastify";

describe("showToastMessage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call toast with success message", () => {
    showToastMessage("success", "Test success");

    expect(toast).toHaveBeenCalledWith(
      <span data-testid="toast-success">Test success</span>,
      { type: "success" }
    );
  });

  it("should call toast with error message", () => {
    showToastMessage("error", <b>Fail</b>);

    expect(toast).toHaveBeenCalledWith(
      <span data-testid="toast-error">
        <b>Fail</b>
      </span>,
      { type: "error" }
    );
  });
});
