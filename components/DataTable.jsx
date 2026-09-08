"use client";
import { React, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterDepartment from "./FilterDepartment";
import FilterShortlisted from "./FilterShortlisted";
import { FaSortAmountDownAlt } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Search } from "lucide-react";
import { Button } from "./ui/button";
import { CheckBoxComp } from "./CheckBoxComp";
import { toast } from "sonner";
import { CSV_Header } from "@/constants";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useFilters,
  usePagination,
  useRowSelect,
} from "react-table";
import { Input } from "@/components/ui/input";
import PaginationComp from "./PaginationComp";
import DialogComp from "./DialogComp";
import MailComposer from "./MailComposer";
import { CSVLink } from "react-csv";

const DataTable = ({ data }) => {
  const [rows, setRows] = useState(data);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [shortlistedFilter, setShortlistedFilter] = useState("");

  const tableData = useMemo(
    () =>
      rows.filter(
        (row) =>
          (!departmentFilter || row.Department === departmentFilter) &&
          (!shortlistedFilter || String(row.shortlisted) === shortlistedFilter)
      ),
    [rows, departmentFilter, shortlistedFilter]
  );

  const shortlistedCount = useMemo(
    () => tableData.filter((row) => row.shortlisted).length,
    [tableData]
  );

  const handleShortlist = useCallback(async (id, isShortlisted) => {
    try {
      const res = await fetch(`/api/shortlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortlisted: !isShortlisted }), // Send the new status
      });

      if (res.ok) {
        setRows((prev) =>
          prev.map((applicant) =>
            applicant._id === id
              ? { ...applicant, shortlisted: !isShortlisted }
              : applicant
          )
        );
        toast.success("Student status updated!");
      } else {
        console.error("Failed to update applicant status.");
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Error occurred while updating the status:", error.message);
      toast.error("Failed to update status");
    }
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Sr No",
        accessor: (row, index) => index + 1,
        id: "srNo",
      },
      {
        Header: "Name",
        accessor: "Name",
      },
      {
        Header: "Registration Number",
        accessor: "RegistrationNumber",
      },
      {
        Header: "Email",
        accessor: "Email",
      },
      {
        Header: "Phone",
        accessor: "Phone",
      },
      {
        Header: "Department",
        accessor: "Department",
      },
      {
        Header: "Gender",
        accessor: "Gender",
      },
      {
        Header: "Year",
        accessor: "Year of Study",
        id: "yearOfStudy",
      },
      {
        Header: "Shortlisted",
        accessor: "shortlisted",
        Cell: ({ row }) => (
          <button
            type="button"
            onClick={() =>
              handleShortlist(row.original._id, row.original.shortlisted)
            }
            className={`inline-flex w-[110px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
              row.original.shortlisted
                ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
                : "bg-primary/15 text-primary hover:bg-primary/25"
            }`}
          >
            {row.original.shortlisted ? "Unshortlist" : "Shortlist"}
          </button>
        ),
      },
    ],
    [handleShortlist]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data: tableData,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            disableSortBy: true,
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <CheckBoxComp {...getToggleAllRowsSelectedProps()} />
            ),
            Cell: ({ row }) => (
              <CheckBoxComp {...row.getToggleRowSelectedProps()} />
            ),
          },
          ...columns,
        ];
      });
    }
  );

  const { globalFilter, pageIndex } = state;

  const [pageSizeInputKey, setPageSizeInputKey] = useState(0);

  const handlePageSize = (e) => {
    const sz = Number(e.target.value);
    if (sz) {
      setPageSize(sz);
    } else {
      setPageSize(10);
    }
  };

  const handleResetFilters = () => {
    setDepartmentFilter("");
    setShortlistedFilter("");
    setGlobalFilter(undefined);
    setPageSize(10);
    gotoPage(0);
    setPageSizeInputKey((key) => key + 1);
  };

  const handleRowSelection = async (payloadData) => {
    const selectedApplicants = selectedFlatRows.map((row) => row.original);
    const request = {
      recipients: selectedApplicants,
      payloadData: payloadData,
    };

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        toast.success("Invite has been sent!");
      } else {
        toast.error("Failed to send invite. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("Failed to send invite. Please try again later.");
    }
  };

  const showRowData = () => {
    const selectedApplicants = selectedFlatRows.map((row) => row.original);
    return selectedApplicants;
  };

  const formatQuestionsForCsv = (item) => {
    if (!item?.Questions) return "";

    if (Array.isArray(item.Questions)) {
      return item.Questions
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (Array.isArray(entry)) return entry.join(": ");
          if (entry && typeof entry === "object") {
            return Object.entries(entry)
              .map(([key, value]) => `${key}: ${value}`)
              .join(" | ");
          }
          return String(entry ?? "");
        })
        .join(" | ");
    }

    if (typeof item.Questions === "object") {
      return Object.entries(item.Questions)
        .map(([question, answer]) => `${question}: ${answer}`)
        .join(" | ");
    }

    return String(item.Questions);
  };

  const csv_link = {
    headers: CSV_Header,
    data: tableData.map((item) => ({
      ...item,
      Questions: formatQuestionsForCsv(item),
    })),
  };

  return (
    <div className="container-page flex flex-col gap-4 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search applicants..."
            className="field pl-9"
          />
        </div>
        <Input
          key={pageSizeInputKey}
          className="field w-28"
          onChange={(e) => handlePageSize(e)}
          placeholder="Rows / page"
        />
        <FilterDepartment value={departmentFilter} onChange={setDepartmentFilter} />
        <FilterShortlisted value={shortlistedFilter} onChange={setShortlistedFilter} />
        <DialogComp selectedApplicants={showRowData} />
        <MailComposer recipients={selectedFlatRows.length} handleRowSelection={handleRowSelection} />
        <Button onClick={handleResetFilters} variant="outline" className="btn-secondary gap-2">
          <GrPowerReset />
          Reset Filters
        </Button>
        <Button className="btn-primary gap-2" asChild>
          <CSVLink {...csv_link}>
            <IoCloudDownloadOutline />
            Download CSV
          </CSVLink>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span>{tableData.length} records</span>
        <span>{shortlistedCount} shortlisted</span>
        <span>{selectedFlatRows.length} selected</span>
      </div>

      <div className="surface overflow-hidden">
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((hg) => {
              const { key: hgKey, ...hgProps } = hg.getHeaderGroupProps();
              return (
                <TableRow key={hgKey} {...hgProps} className="hover:bg-transparent">
                  {hg.headers.map((header) => {
                    const sortProps = header.canSort
                      ? header.getSortByToggleProps()
                      : {};
                    const { key: headerKey, ...headerProps } = header.getHeaderProps(sortProps);
                    return (
                      <TableHead
                        key={headerKey}
                        {...headerProps}
                        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                      >
                        <div className="inline-flex items-center gap-1">
                          {header.render("Header")}
                          {header.canSort && <FaSortAmountDownAlt className="h-3 w-3" />}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>
          <TableBody {...getTableBodyProps()}>
            {page.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="py-10 text-center text-sm text-muted-foreground">
                  No applicants match these filters.
                </TableCell>
              </TableRow>
            ) : (
              page.map((row) => {
                prepareRow(row);
                const { key: rowKey, ...rowProps } = row.getRowProps();
                return (
                  <TableRow key={rowKey} {...rowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } = cell.getCellProps();
                      return (
                        <TableCell key={cellKey} {...cellProps}>
                          {cell.render("Cell")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationComp
        pageIndex={pageIndex}
        pages={pageOptions.length}
        nextPage={nextPage}
        canNext={canNextPage}
        previousPage={previousPage}
        canPrev={canPreviousPage}
        goto={gotoPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default DataTable;
