// components/DataTablePagination.tsx

import React, { useCallback, useEffect } from "react";
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
  HeaderCellSelect,
  CellSelect,
  SelectTypes,
  useRowSelect,
} from "@table-library/react-table-library/select";
import { TableNode } from "@table-library/react-table-library/types";

import EditItemButton from "../buttons/EditItemButton";
import DeleteItemButton from "../buttons/DeleteItemButton";
import PrimaryButton from "../buttons/PrimaryButton";
import DeleteItemsBtn from "../buttons/DeleteItemsBtn";
import { Loader } from "../Loader/Loader";
import { ResourceType } from "../../types/Api";
import ErrorLoadingResourse from "../error/ErrorLoadingResourse";
import PageInfo from "../pagination/PageInfo";
import PreviousPaginationBtn from "../buttons/PreviousPaginationBtn";
import NextPaginationBtn from "../buttons/NextPaginationBtn";
import useFetchItemsWithPagination from "../../hooks/useFetchItemsWithPagination";
import { useSearchParams } from "react-router-dom";

interface Column<T> {
  label: string;
  renderCell: (item: T) => string | number;
}

interface DataTablePaginationProps<T> {
  entity: ResourceType;
  entityName: string;
  columns: Column<T>[];
  heightRow?: number;
  onCreate: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onDeleteSelected: (selectedIds: React.Key[]) => void;
  searchPlaceholder?: string;
  TextButtonCreate?: string;
  gridTemplateColumns: string;
  JWT: string;
}

function DataTablePagination<T extends TableNode>({
  entity,
  entityName,
  columns,
  heightRow = 52,
  onCreate,
  onEdit,
  onDelete,
  onDeleteSelected,
  searchPlaceholder = "Buscar",
  TextButtonCreate,
  gridTemplateColumns,
  JWT,
}: DataTablePaginationProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page") || "1");

  // Actualizar useFetchItems para usar los parámetros de la URL
  const { data: fetchedData, isLoading, isError } = useFetchItemsWithPagination(
    entity,
    JWT,
    page,
    query
  );

  const data: TableNode[] = (fetchedData?.data as TableNode[]) || [];
  const totalPages = fetchedData?.pages || 1;

  // Sincronizar página actual con el total de páginas
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", totalPages.toString());
      setSearchParams(newParams);
    }
  }, [page, totalPages, searchParams, setSearchParams]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("query", e.target.value);
    newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((newPage: number) => {
    const clampedPage = Math.max(1, Math.min(newPage, totalPages));
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", clampedPage.toString());
    setSearchParams(newParams);
  }, [totalPages, searchParams, setSearchParams]);

  const tableData = { nodes: data };

  const THEME = {
    Table: `
          ${gridTemplateColumns
        ? `--data-table-library_grid-template-columns: ${gridTemplateColumns};`
        : ""
      }
          border-spacing: 0;
          border-collapse: collapse;
          width: 100%;
          font-size: 16px;
          border: 1px solid white;
        `,
    Header: ``,
    Body: ``,
    BaseRow: `
          background-color: #000000;
          &.row-select-selected, &.row-select-single-selected {
            background-color: var(--theme-ui-colors-background-secondary);
            color: var(--theme-ui-colors-text);
          }
        `,
    HeaderRow: `
          font-size: 20px;
          .th {
            border-bottom: 1px solid white;
          }
        `,
    Row: `
          font-size: 16px;
          &:not(:last-of-type) .td {
            border-bottom: 1px solid white;
          }
          &:nth-of-type(odd) {
            background-color: #171717;
          }
          &:nth-of-type(even) {
            background-color: #000000;
          }
          &:hover {
            background-color: #000275;
          }
        `,
    BaseCell: `
          border-right: 1px solid white;
          padding: 8px;
          height: ${heightRow}px;
          text-align: center;
          svg {
            fill: var(--theme-ui-colors-text);
          }
        `,
    HeaderCell: `
          
          div div{
            justify-content: center;
            gap: 10px;
          }
          div div span svg{
            fill: #cacaca;
          }
        `,
    Cell: ``,
  };

  const theme = useTheme(THEME);

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

  const selectedIds = select.state.ids.filter((id: string) => id !== "");

  const handleDeleteItems = () => {
    onDeleteSelected(selectedIds);
    select.fns.onRemoveAll();
  };

  // totalPages ya viene del backend, ya no es necesario calcularlo aquí
  // const totalPages = Math.ceil(totalCount / 10);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <>
      {/* Búsqueda y acciones */}
      <div className="pt-6 flex flex-col gap-3 md:flex-row items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
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
          minHeight: `${heightRow * 11}px`,
        }}
      >
        <Table
          data={tableData}
          theme={theme}
          layout={{ fixedHeader: true, horizontalScroll: true, custom: true }}
          select={select}
        >
          {(tableList: T) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSelect />
                  {columns.map((column) => (
                    <HeaderCell key={column.label}>
                      {column.label}
                    </HeaderCell>
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
                            ${column.renderCell(item) === 'inactive' ? 'bg-red-200 text-red-900 font-medium px-3 py-1 rounded-full' : ''}
                            ${column.renderCell(item) === 'active' ? 'bg-green-200 text-green-900 font-medium px-3 py-1 rounded-full' : ''}`}>
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
        <PageInfo page={page} totalPage={totalPages} />
        <div className="flex gap-2">
          <PreviousPaginationBtn
            notClickable={page <= 1}
            handleClick={() => handlePageChange(page - 1)}
          />
          <NextPaginationBtn
            notClickable={page >= totalPages}
            handleClick={() => handlePageChange(page + 1)}
          />
        </div>
      </div>
    </>
  );
}

export default React.memo(DataTablePagination);
