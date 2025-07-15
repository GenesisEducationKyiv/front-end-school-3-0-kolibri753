import type { Meta, StoryObj } from "@storybook/react";
import { ErrorMessage } from "./index";

const meta: Meta<typeof ErrorMessage> = {
  title: "Design System/ErrorMessage",
  component: ErrorMessage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    message: "Failed to load tracks. Please check your connection.",
  },
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {};

export const WithRetry: Story = {
  args: {
    onRetry: () => alert("Retry clicked!"),
  },
};
