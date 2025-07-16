import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { FilterSelect } from "./index";

const meta: Meta<typeof FilterSelect> = {
  title: "Design System/FilterSelect",
  component: FilterSelect,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Genre",
    options: ["Rock", "Pop", "Jazz", "Classical", "Electronic"],
  },
};

export default meta;
type Story = StoryObj<typeof FilterSelect>;

const FilterSelectWrapper = (
  args: React.ComponentProps<typeof FilterSelect>
) => {
  const [value, setValue] = useState("");
  return <FilterSelect {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: FilterSelectWrapper,
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: FilterSelectWrapper,
};

export const Error: Story = {
  args: {
    error: true,
  },
  render: FilterSelectWrapper,
};
