"use client";

import { useState } from "react";

import {
  Pagination,
  PaginationNext,
  PaginationPager,
  PaginationPrev,
} from "@/components/ui";
import { DemoStage } from "@/components/docs/demo-stage";

/**
 * Pagination demos — imported by the doc panel (`page.mdx`). The complete
 * code for each demo lives in the fenced block under it on the page.
 * This file is a client component because one demo reads React state.
 */

export function PaginationRail() {
  return (
    <DemoStage>
      <Pagination defaultPage={4} totalPages={12}>
        <PaginationPrev />
        <PaginationPager />
        <PaginationNext />
      </Pagination>
    </DemoStage>
  );
}

export function PaginationControlled() {
  const [page, setPage] = useState(2);

  return (
    <DemoStage>
      <div className="flex flex-col items-start gap-2">
        <Pagination
          page={page}
          onPageChange={setPage}
          totalPages={7}
          className="items-center gap-2"
        >
          <PaginationPrev />
          <PaginationPager />
          <PaginationNext />
        </Pagination>
        <span className="font-mono text-[11px] text-ink-muted">
          reading order: page {page} of 7
        </span>
      </div>
    </DemoStage>
  );
}

export function PaginationSmall() {
  return (
    <DemoStage>
      <Pagination size="sm" totalPages={5} siblings={0}>
        <PaginationPrev />
        <PaginationPager />
        <PaginationNext />
      </Pagination>
    </DemoStage>
  );
}
