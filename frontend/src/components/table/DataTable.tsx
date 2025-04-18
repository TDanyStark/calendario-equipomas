// components/DataTable.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
  HeaderCell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import {
  useSort,
  HeaderCellSort,
} from "@table-library/react-table-library/sort";
import {
  HeaderCellSelect,
  CellSelect,
  SelectTypes,
  useRowSelect,
} from "@table-library/react-table-library/select";
import { TableNode } from "@table-library/react-table-library/types";

import { usePagination } from "@table-library/react-table-library/pagination";
import EditItemButton from "../buttons/EditItemButton";
import DeleteItemButton from "../buttons/DeleteItemButton";
import NextPaginationBtn from "../buttons/NextPaginationBtn";
import PreviousPaginationBtn from "../buttons/PreviousPaginationBtn";
import PageInfo from "../pagination/PageInfo";
import PrimaryButton from "../buttons/PrimaryButton";
import DeleteItemsBtn from "../buttons/DeleteItemsBtn";
import Theme from "@/lib/Theme";

interface Column<T> {
  label: string;
  sortKey?: string;
  renderCell: (item: T) => string | number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  heightRow?: number;
  onCreate: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onDeleteSelected: (selectedIds: React.Key[]) => void;
  searchPlaceholder?: string;
  TextButtonCreate?: string;
  gridTemplateColumns: string;
}

function DataTable<T extends TableNode>({
  data,
  columns,
  heightRow = 52,
  onCreate,
  onEdit,
  onDelete,
  onDeleteSelected,
  searchPlaceholder = "Buscar",
  TextButtonCreate,
  gridTemplateColumns,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filtrar datos basados en la búsqueda
  const filteredData = data.filter((item) =>
    columns.some((column) =>
      String(column.renderCell(item))
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  const tableData = { nodes: filteredData };

  const THEME = Theme({ gridTemplateColumns, heightRow });

  const theme = useTheme(THEME);

  const sortFns: Record<string, (nodes: TableNode[]) => TableNode[]> =
    columns.reduce(
      (acc: Record<string, (nodes: TableNode[]) => TableNode[]>, column) => {
        if (column.sortKey) {
          acc[column.sortKey] = (nodes: TableNode[]) =>
            nodes.sort((a, b) => {
              const aValue = column.sortKey
                ? ((a as T)[column.sortKey as keyof T] as string | number)
                : "";
              const bValue = column.sortKey
                ? ((b as T)[column.sortKey as keyof T] as string | number)
                : "";
              if (typeof aValue === "string") {
                return String(aValue).localeCompare(String(bValue));
              }
              return (aValue as number) - (bValue as number);
            });
        }
        return acc;
      },
      {}
    );

  const sort = useSort(
    tableData,
    {},
    {
      sortFns,
    }
  );

  const select = useRowSelect(
    tableData,
    {
      onChange: () => {
        if (select.state.ids.includes("")) {
          select.fns.onRemoveAll();
        }
      },
    },
    {
      rowSelect: SelectTypes.MultiSelect,
      buttonSelect: SelectTypes.MultiSelect,
    }
  );

  // quitar los ids vacios ""
  const selectedIds = select.state.ids.filter((id: string) => id !== "");

  const pagination = usePagination(tableData, {
    state: {
      page: 0,
      size: 10,
    },
  });

  const handleDeleteItems = () => {
    onDeleteSelected(selectedIds);
    select.fns.onRemoveAll();
  };

  const totalPages = Math.max(1, pagination.state.getTotalPages(tableData.nodes));

   // Crear un ref para onSetPage para que no cambie en cada renderizado
  const onSetPageRef = useRef(pagination.fns.onSetPage);

  useEffect(() => {
    onSetPageRef.current(0);
  }, [search, data]); 

  return (
    <>
      {/* Búsqueda y acciones */}
      <div className="pt-6 flex flex-col gap-3 md:flex-row items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearch}
            className="input-primary w-full max-w-60"
          />
          {selectedIds.length > 0 ? (
            <DeleteItemsBtn
              countItems={selectedIds.length}
              handleClick={handleDeleteItems}
            />
          ) : null}
        </div>
        <PrimaryButton handleClick={onCreate}>
          Crear nuevo {TextButtonCreate}
        </PrimaryButton>
      </div>

      {/* Tabla */}
      <div
        style={{
          minHeight: `${(heightRow * 11) + 18.4}px`,
        }}
      >
        <Table
          data={tableData}
          theme={theme}
          layout={{ fixedHeader: true, horizontalScroll: true, custom: true }}
          sort={sort}
          select={select}
          pagination={pagination}
        >
          {(tableList: T) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSelect />
                  {columns.map((column) => (
                    <HeaderCellSort
                      key={column.label}
                      sortKey={column.sortKey || ""}
                    >
                      {column.label}
                    </HeaderCellSort>
                  ))}
                  <HeaderCell>Acciones</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.length > 0 ? (
                  tableList.map((item: T) => (
                    <Row key={item.id} item={item}>
                      <CellSelect item={item} />
                      {columns.map((column) => (
                        <Cell key={column.label} className="text-lg">
                          <span className={`
                            ${column.renderCell(item) === 'inactivo' ? 'bg-red-200 text-red-900 font-medium px-3 py-1 rounded-full' : ''}
                            ${column.renderCell(item) === 'activo' ? 'bg-green-200 text-green-900 font-medium px-3 py-1 rounded-full' : ''}`}>
                            {column.renderCell(item)}
                          </span>
                        </Cell>
                      ))}
                      <Cell>
                        <div className="flex gap-1 justify-center">
                          <EditItemButton handleClick={() => onEdit(item)} />
                          <DeleteItemButton
                            handleClick={() => onDelete(item)}
                          />
                        </div>
                      </Cell>
                    </Row>
                  ))
                ) : (
                  <Row
                    key={"notFound"}
                    item={{ id: "" }}
                    className="select-none pointer-events-none"
                  >
                    <Cell
                      gridColumnStart={1}
                      gridColumnEnd={columns.length + 4}
                    >
                      No hay datos
                    </Cell>
                  </Row>
                )}
              </Body>
            </>
          )}
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between">
        <PageInfo page={pagination.state.page + 1} totalPage={totalPages} />
        <div className="flex gap-2">
          <PreviousPaginationBtn
            notClickable={pagination.state.page === 0}
            handleClick={() =>
              pagination.fns.onSetPage(pagination.state.page - 1)
            }
          />
          <NextPaginationBtn
            notClickable={pagination.state.page + 1 === totalPages}
            handleClick={() =>
              pagination.fns.onSetPage(pagination.state.page + 1)
            }
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(DataTable)  as <T extends TableNode>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => JSX.Element;
