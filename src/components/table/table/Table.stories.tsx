import type { Meta, StoryObj } from "@storybook/react";
import { Table } from ".";
import { TableHeader } from "../table-header";
import { TableRow } from "../table-row";
import { TableHead } from "../table-head";
import { TableBody } from "../table-body";
import { TableCell } from "../table-cell";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  argTypes: {
    children: {
      table: { disable: true },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  args: {
    children: (
      <>
        <TableHeader>
          <TableRow>
            {Array.from(Array(3)).map((_, headIndex) => (
              <TableHead key={headIndex}>Column Head {headIndex}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from(Array(5)).map((_, index) => (
            <TableRow key={index}>
              {Array.from(Array(3)).map((_, cellIndex) => (
                <TableCell key={`${index}-${cellIndex}`}>
                  Cell {index + 1}.{cellIndex}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </>
    ),
  },
};
