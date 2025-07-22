import type { Meta, StoryObj } from "@storybook/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const meta: Meta<typeof ToastContainer> = {
  title: "Design System/Toast",
  component: ToastContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "select",
      options: ["light", "dark", "colored"],
    },
    position: {
      control: "select",
      options: [
        "top-right",
        "top-left",
        "top-center",
        "bottom-right",
        "bottom-left",
        "bottom-center",
      ],
    },
    autoClose: {
      control: { type: "number", min: 1000, max: 10000, step: 1000 },
    },
    hideProgressBar: { control: "boolean" },
    newestOnTop: { control: "boolean" },
    closeOnClick: { control: "boolean" },
    pauseOnHover: { control: "boolean" },
    draggable: { control: "boolean" },
  },
  args: {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    newestOnTop: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
  },
};

export default meta;
type Story = StoryObj<typeof ToastContainer>;

export const Playground: Story = {
  render: (args) => (
    <div className="flex flex-col items-center space-y-4">
      <ToastContainer {...args} key={`${args.theme}-${args.position}`} />
      <p className="text-sm text-center max-w-xs">
        Use the Controls tab to configure toast properties, then click the
        button to test.
      </p>
      <button
        onClick={() => toast.success("This is a test toast!")}
        className="btn btn-primary"
      >
        Trigger Test Toast
      </button>
    </div>
  ),
};

export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col items-center space-y-4">
      <ToastContainer />
      <p className="text-sm text-center">
        Click the buttons to see different toast types.
      </p>
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => toast.success("Success message!")}
          className="btn btn-success btn-sm"
        >
          Success
        </button>
        <button
          onClick={() => toast.error("Error message!")}
          className="btn btn-error btn-sm"
        >
          Error
        </button>
        <button
          onClick={() => toast.warning("Warning message!")}
          className="btn btn-warning btn-sm"
        >
          Warning
        </button>
        <button
          onClick={() => toast.info("Info message!")}
          className="btn btn-info btn-sm"
        >
          Info
        </button>
        <button onClick={() => toast("Default message")} className="btn btn-sm">
          Default
        </button>
      </div>
    </div>
  ),
};
