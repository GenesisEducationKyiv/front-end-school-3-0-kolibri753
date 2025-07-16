import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SearchInput } from "./index";

const meta: Meta<typeof SearchInput> = {
  title: "Design System/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    placeholder: "Search...",
    debounce: 300,
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

const SearchInputWrapper = (args: React.ComponentProps<typeof SearchInput>) => {
  const [value, setValue] = useState("");
  return <SearchInput {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: SearchInputWrapper,
};
