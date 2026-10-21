import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../table";

describe("Table", () => {
  it("renders semantic table parts", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>document.txt</TableCell>
            <TableCell>12 KB</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>4 objects</TableCell>
          </TableRow>
        </TableFooter>
        <TableCaption>Objects</TableCaption>
      </Table>,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "document.txt" })).toBeInTheDocument();
    expect(screen.getByText("Objects")).toBeInTheDocument();
  });

  it("keeps the parts in their native slots", () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>document.txt</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    const slots = [
      "table",
      "table-header",
      "table-body",
      "table-row",
      "table-head",
      "table-cell",
    ];
    for (const slot of slots) {
      expect(
        document.querySelector(`[data-slot="${slot}"]`),
      ).toBeInTheDocument();
    }
  });

  it("passes scope through to a row header", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHead scope="row">document.txt</TableHead>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("rowheader", { name: "document.txt" })).toBeInTheDocument();
  });
});
