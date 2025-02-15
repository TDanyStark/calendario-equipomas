// components/DataTablePagination.tsx

import React, { useCallback, useEffect, useState } from "react";
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
import CellItem from "../CellItem";
import { useDebounce } from "use-debounce";
import Theme from "@/lib/Theme";
import FilterEnrolls from "../Filters/FilterEnrolls";

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
  filtersProps?: string;
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
  filtersProps,
}: DataTablePaginationProps<T>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page") || "1");
  const courseFilter = searchParams.get("course");
  const instrumentFilter = searchParams.get("instrument");
  const semesterFilter = searchParams.get("semester");

  const [debouncedQuery] = useDebounce(query, 500);

  const [filterActive, setFilterActive] = useState<string | null>(null);

  // Memoizar los filtros para optimizar
  const filters = React.useMemo(
    () => ({
      course: courseFilter || "",
      instrument: instrumentFilter || "",
      semester: semesterFilter || "",
    }),
    [courseFilter, instrumentFilter, semesterFilter]
  );

  // Actualizar useFetchItems para usar los parámetros de la URL
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useFetchItemsWithPagination(entity, JWT, page, debouncedQuery, filters);

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

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("query", e.target.value);
      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const clampedPage = Math.max(1, Math.min(newPage, totalPages));
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", clampedPage.toString());
      setSearchParams(newParams);
    },
    [totalPages, searchParams, setSearchParams]
  );

  const onSelect = (id: string, filter: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", "1");
    newParams.set(filter, id);
    setSearchParams(newParams);
    setFilterActive(null);
  };

  const onShow = (filter: string) => {
    if (filterActive === filter) {
      setFilterActive(null);
    } else {
      setFilterActive(filter);
    }
  };

  const handleClearFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("course");
    newParams.delete("instrument");
    newParams.delete("semester");
    newParams.delete("query");
    newParams.set("page", "1"); // Reiniciar la paginación
    setSearchParams(newParams);
  };

  

  const tableData = { nodes: data };

  const THEME = Theme({ gridTemplateColumns, heightRow });
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

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <>
      {filtersProps === "enrolls" && (
        <>
          <FilterEnrolls
            courseFilter={courseFilter || ""}
            instrumentFilter={instrumentFilter || ""}
            semesterFilter={semesterFilter || ""}
            filterActive={filterActive || ""}
            onShow={onShow}
            onSelect={onSelect}
            handleClearFilters={handleClearFilters}
            setFilterActive={setFilterActive}
            debouncedQuery={debouncedQuery}
          />
        </>
      )}
      <div className={`${filtersProps ? '':'pt-6' } flex flex-col gap-3 md:flex-row items-center justify-between select-none`}>
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
          minHeight: `${(heightRow * 11) + 18.4}px`,
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
                    <HeaderCell key={column.label}>{column.label}</HeaderCell>
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
                          <CellItem item={item} column={column} />
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
