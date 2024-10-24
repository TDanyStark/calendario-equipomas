// components/DataTable.tsx

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
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
import { usePagination } from "@table-library/react-table-library/pagination";
import EditItemButton from "../buttons/EditItemButton";
import DeleteItemButton from "../buttons/DeleteItemButton";

interface Column<T> {
  label: string;
  sortKey?: string;
  renderCell: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  selectedIds: React.Key[];
  onSelectionChange: (ids: React.Key[]) => void;
  search: string;
  heightRow?: number;
}

import { TableNode } from "@table-library/react-table-library/types";

function DataTable<T extends TableNode>({
  data,
  columns,
  onEdit,
  onDelete,
  selectedIds,
  onSelectionChange,
  search,
  heightRow = 52,
}: DataTableProps<T>) {
  // Filtrar datos basados en la búsqueda
  const filteredData = data.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const tableData = { nodes: filteredData };

  const THEME = {
    Table: `
    --data-table-library_grid-template-columns:  100px 100px 1fr 180px;
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

  // Configuración de sort
  const sort = useSort(
    tableData,
    {},
    {
      sortFns: columns.reduce((acc, column) => {
        if (column.sortKey) {
          acc[column.sortKey] = (array) =>
            array.sort((a, b) => {
              const aValue = a[column.sortKey];
              const bValue = b[column.sortKey];
              if (typeof aValue === "string") {
                return aValue.localeCompare(bValue);
              }
              return aValue - bValue;
            });
        }
        return acc;
      }, {}),
    }
  );

  // Configuración de selección
  const select = useRowSelect(
    tableData,
    {
      onChange: (action, state) => {
        onSelectionChange(state.ids);
      },
    },
    {
      rowSelect: SelectTypes.MultiSelect,
      buttonSelect: SelectTypes.MultiSelect,
    }
  );

  // Configuración de paginación
  const pagination = usePagination(tableData, {
    state: {
      page: 0,
      size: 10,
    },
  });

  return (
    <div
      style={{
        minHeight: `${heightRow * 11}px`,
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
        {(tableList: T[]) => (
          <>
            <Header>
              <HeaderRow>
                <HeaderCellSelect />
                {columns.map((column) => (
                  <HeaderCellSort key={column.label} sortKey={column.sortKey || ''}>
                    {column.label}
                  </HeaderCellSort>
                ))}
                <HeaderCellSort sortKey="none">Acciones</HeaderCellSort>
              </HeaderRow>
            </Header>
            <Body>
              {tableList.map((item) => (
                <Row key={item.id} item={item}>
                  <CellSelect item={item} />
                  {columns.map((column) => (
                    <Cell key={column.label}>{column.renderCell(item)}</Cell>
                  ))}
                  <Cell>
                    <div className="flex gap-1 justify-center">
                      <EditItemButton
                        handleClick={() => onEdit(item)}
                      />
                      <DeleteItemButton
                        handleClick={() => onDelete(item)}
                      />
                    </div>
                  </Cell>
                </Row>
              ))}
            </Body>
          </>
        )}
      </Table>
    </div>
  );
}

export default DataTable;
