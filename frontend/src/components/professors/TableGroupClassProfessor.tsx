// components/MiniTable.tsx

import React, { useCallback, useState } from "react";
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

import { ResourceType } from "../../types/Api";
import ErrorLoadingResourse from "../error/ErrorLoadingResourse";
import PageInfo from "../pagination/PageInfo";
import PreviousPaginationBtn from "../buttons/PreviousPaginationBtn";
import NextPaginationBtn from "../buttons/NextPaginationBtn";
import CellItem from "../CellItem";
import { useDebounce } from "use-debounce";
import Theme from "@/lib/Theme";
import useGetDataForMiniTable from "@/hooks/useGetDataForMiniTable";
import Skeleton from "../Loader/Skeleton";
import { getActiveIdsForAEntity } from "@/utils/getActiveIdsForAEntity";
import { toast } from "react-toastify";
import { useQueryClient } from "react-query";

interface Column<T> {
  label: string;
  renderCell: (item: T) => string | number;
}

interface MiniTableProps<T> {
  entity: ResourceType;
  entityName: string;
  columns: Column<T>[];
  heightRow?: number;
  searchPlaceholder?: string;
  gridTemplateColumns: string;
  JWT: string;
  handleSelectedIds?: (ids: string[], entity: string) => void;
  idsSelected?: string[];
}

function TableGroupClassProfessor<T extends TableNode>({
  entity,
  entityName,
  columns,
  heightRow = 52,
  searchPlaceholder = "Buscar",
  gridTemplateColumns,
  JWT,
  handleSelectedIds,
  idsSelected = [],
}: MiniTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [debouncedQuery] = useDebounce(query, 500);

  const [checked, setChecked] = useState(false);
  const [waitGetIds, setWaitGetIds] = useState(false);

  // Actualizar useFetchItems para usar los parámetros de la URL
  const {
    data: fetchedData,
    isLoading,
    isError,
    isFetching,
  } = useGetDataForMiniTable(entity, JWT, page, debouncedQuery);
  const queryClient = useQueryClient();
  const dataCache = queryClient.getQueryData([entity, page, debouncedQuery]);

  const data: TableNode[] = (fetchedData?.data as TableNode[]) || [];
  const totalPages = fetchedData?.pages || 1;

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const tableData = { nodes: data };

  const THEME = Theme({ gridTemplateColumns, heightRow });
  const theme = useTheme(THEME);

  const select = useRowSelect(
    tableData,
    {
      state: {
        ids: idsSelected,
      },
      onChange: () => {
        if (select.state.ids.length === 0) {
          setChecked(false);
        }
        if (select.state.ids.includes("")) {
          select.fns.onRemoveAll();
        }
        const uniqueIds = Array.from(new Set(selectedIds));

        if (handleSelectedIds) {
          handleSelectedIds(uniqueIds as string[], entity);
        }
      },
    },
    {
      rowSelect: SelectTypes.MultiSelect,
      buttonSelect: SelectTypes.MultiSelect,
    }
  );

  const selectedIds = select.state.ids.filter((id: string) => id !== "");
  // que no hayan ids repetidos
  const handleSelectAll = async () => {
    setChecked(!checked);
    // tener en cuenta que aqui revisamos el antiguo estado de checked
    if (checked === true) {
      select.fns.onRemoveAll();
    } else {
      // select.fns.onAddAll(data.map((item) => item.id));
      try {
        setWaitGetIds(true);
        const res = await getActiveIdsForAEntity(JWT, entity);
        if (res && res.statusCode === 200) {
          select.fns.onRemoveAll();
          // pasar a string los ids de res.data
          const ids = res.data.map((id: number) => id.toString());
          select.fns.onAddAll(ids);
          setWaitGetIds(false);
        }
      } catch (e) {
        toast.error("Error al obtener las inscripciones activas");
        select.fns.onRemoveAll();
        setChecked(false);
        console.error(e);
      } finally {
        setWaitGetIds(false);
      }
    }
  };
  if (isLoading) return <Skeleton className="w-[986px] h-[694px]" />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <div>
      <div
        className={`flex mb-4 flex-col gap-3 md:flex-row items-center justify-between select-none`}
      >
        <div className="flex gap-6">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            className="input-primary w-full max-w-60"
          />
          <div className="flex gap-2 items-center">
            <input
              className="w-5 h-5"
              type="checkbox"
              id="selectAll"
              disabled={waitGetIds}
              checked={checked}
              onChange={handleSelectAll}
            />
            <label htmlFor="selectAll">Seleccionar Todos</label>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div
        style={{
          minHeight: `${heightRow * 11 + 20.4}px`,
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
                  {waitGetIds ? (
                    <th
                      role="columnheader"
                      data-table-library_th=""
                      data-hide="false"
                      data-resize-min-width="75"
                      className="th stiff css-w84skr-HEADER_CELL_CONTAINER_STYLE-HeaderCell"
                    >
                      <div>
                        <Skeleton className="w-5 h-5 mt-[5px]" />
                      </div>
                    </th>
                  ) : (
                    <HeaderCellSelect />
                  )}
                  {columns.map((column) => (
                    <HeaderCell key={column.label}>{column.label}</HeaderCell>
                  ))}
                </HeaderRow>
              </Header>
              <Body>
                {tableList.length > 0 ? (
                  tableList.map((item: T) => (
                    <Row key={item.id} item={item}>
                      {waitGetIds ? (
                        <td
                          role="gridcell"
                          data-table-library_td=""
                          className="td stiff css-1rqbzwa-CELL_CONTAINER_STYLE-Cell"
                        >
                          <div>
                            <Skeleton className="w-5 h-5 mt-[5px]" />
                          </div>
                        </td>
                      ) : (
                        <CellSelect item={item} />
                      )}
                      {columns.map((column) => (
                        <Cell key={column.label} className="text-lg">
                          <CellItem
                            item={item}
                            column={column}
                            isLoading={isFetching && !dataCache}
                          />
                        </Cell>
                      ))}
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
      <div className="flex justify-between items-end min-h-[36px] mt-4">
        <PageInfo page={page} totalPage={totalPages} />
        <div className="flex gap-2">
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
      </div>
    </div>
  );
}

export default React.memo(TableGroupClassProfessor);
