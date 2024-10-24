import { useForm } from "react-hook-form";
import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { Loader } from "../components/Loader/Loader";
import { Instrument } from "../types/Api";
import useItemMutations from "../hooks/useItemsMutation";

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
import useFetchItems from "../hooks/useFetchItems";
import Primaryh1 from "../components/titles/Primaryh1";
import PrimaryButton from "../components/buttons/PrimaryButton";
import EditItemButton from "../components/buttons/EditItemButton";
import DeleteItemButton from "../components/buttons/DeleteItemButton";
import NextPaginationBtn from "../components/buttons/NextPaginationBtn";
import PreviousPaginationBtn from "../components/buttons/PreviousPaginationBtn";
import PageInfo from "../components/pagination/PageInfo";
import DataTable from "../components/table/DataTable";

const Instruments = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editInstrument, setEditInstrument] = useState<Instrument | null>(null);
  const [search, setSearch] = useState("");

  // Obtener el token desde el store
  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Fetch instruments data
  const {
    data: instruments,
    isLoading,
    isError,
  } = useFetchItems("instruments", JWT);

  // Mutaciones
  const { createItem, updateItem, deleteItem, deleteItems } =
    useItemMutations<Instrument>("instruments", JWT);

  // Manejo del formulario con react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<Instrument>();

  const onSubmit = (data: Instrument) => {
    if (editInstrument) {
      updateItem.mutate({
        id: editInstrument.id,
        instrumentName: data.instrumentName,
      });
      reset();
    } else {
      createItem.mutate(data);
      reset();
    }
    setIsOpen(false);
  };

  const handleClickBtnPrimary = () => {
    setEditInstrument(null);
    setIsOpen(true);
    reset();
  };

  const handleEdit = (item: Instrument) => {
    setEditInstrument(item);
    setIsOpen(true);
    setValue("instrumentName", item.instrumentName);
  };

  const handleDelete = (item: Instrument) => {
    deleteItem.mutate(item.id);
  };

  // tabla
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  let data = { nodes: instruments || [] };

  data = {
    nodes: data.nodes.filter((item: Instrument) =>
      item.instrumentName.toLowerCase().includes(search.toLowerCase())
    ),
  };

  const heightRow: number = 52;

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

  const sort = useSort(
    data,
    {},
    {
      sortFns: {
        ID: (array) => array.sort(),
        Instrument: (array) =>
          array.sort((a, b) =>
            a.instrumentName.localeCompare(b.instrumentName)
          ),
      },
    }
  );

  const select = useRowSelect(
    data,
    {
      onChange: onSelectChange,
    },
    {
      rowSelect: SelectTypes.MultiSelect,
      buttonSelect: SelectTypes.MultiSelect,
    }
  );

  function onSelectChange(action: { type: string }, state: unknown) {
    console.log("onSelectChange", action, state);
  }

  const selectedIds = select.state.ids;

  const pagination = usePagination(data, {
    state: {
      page: 0,
      size: 10,
    },
    onChange: (action, state) =>
      onPaginationChange(action, state as { page: number; size: number }),
  });

  function onPaginationChange(
    action: { type: string },
    state: { page: number; size: number }
  ) {
    console.log(action, state);
  }

  const columns = [
    {
      label: "ID",
      sortKey: "id",
      renderCell: (item: Instrument) => item.id,
    },
    {
      label: "Instrumento",
      sortKey: "instrumentName",
      renderCell: (item: Instrument) => item.instrumentName,
    },
    // Agrega más columnas si es necesario
  ];

  // Si hay error o está cargando
  if (isLoading) return <Loader />;
  if (isError) return <p>Error cargando instrumentos.</p>;

  return (
    <section className="p-4 flex flex-col gap-6">
      <Primaryh1>Instrumentos</Primaryh1>
      <div className="pt-6 flex flex-col gap-3 md:flex-row items-center justify-between">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Buscar instrumento"
            value={search}
            onChange={handleSearch}
            className="input-primary w-full max-w-60"
          />
          {selectedIds.length > 0 ? (
            <button
              onClick={() => {
                deleteItems.mutate(selectedIds);
                select.fns.onRemoveAll();
              }}
              className="px-4 py-2 bg-red-600 text-white rounded text-nowrap"
            >
              Eliminar {selectedIds.length}
            </button>
          ) : null}
        </div>
        <PrimaryButton handleClick={handleClickBtnPrimary}>
          Crear Instrumento
        </PrimaryButton>
      </div>

      {/* Tabla */}
      <div
        style={{
          minHeight: `${heightRow * 11}px`,
        }}
      >
        <Table
          data={data}
          theme={theme}
          layout={{ fixedHeader: true, horizontalScroll: true, custom: true }}
          sort={sort}
          select={select}
          pagination={pagination}
        >
          {(tableList: Instrument[]) => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCellSelect />
                  <HeaderCellSort sortKey="ID">ID</HeaderCellSort>
                  <HeaderCellSort sortKey="Instrument">
                    Instrumento
                  </HeaderCellSort>
                  <HeaderCellSort sortKey="">Acciones</HeaderCellSort>
                </HeaderRow>
              </Header>

              <Body>
                {tableList ? (
                  tableList.map((item) => (
                    <Row key={item.id} item={item}>
                      <CellSelect item={item} />
                      <Cell className="text-lg">{item.id}</Cell>
                      <Cell className="text-lg">{item.instrumentName}</Cell>
                      <Cell>
                        <div className="flex gap-1 justify-center">
                          <EditItemButton
                            handleClick={() => handleEdit(item)}
                          />
                          <DeleteItemButton
                            handleClick={() => handleDelete(item)}
                          />
                        </div>
                      </Cell>
                    </Row>
                  ))
                ) : (
                  <Row item={{ id: "", instrumentName: "" }}>
                    <Cell>No hay instrumentos</Cell>
                  </Row>
                )}
              </Body>
            </>
          )}
        </Table>
      </div>
      <DataTable
        data={instruments || []}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        selectedIds={selectedIds}
        onSelectionChange={(ids) => select.fns.onToggleAll(ids)}
        search={search}
        heightRow={52}
      />

      <div className="flex justify-between">
        <PageInfo page={pagination.state.page + 1} totalPage={pagination.state.getTotalPages(data.nodes)} />
        <div className="flex gap-2">
          <PreviousPaginationBtn 
            notClickable={pagination.state.page === 0}
            handleClick={() =>
              pagination.fns.onSetPage(pagination.state.page - 1)
            }
          />
          <NextPaginationBtn
            notClickable={
              pagination.state.page + 1 ===
              pagination.state.getTotalPages(data.nodes)
            }
            handleClick={() =>
              pagination.fns.onSetPage(pagination.state.page + 1)
            }
          />
        </div>
      </div>

      {/* Modal para crear o editar instrumento */}
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-principal-bg bg-opacity-80" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <DialogPanel className="bg-principal-bg border border-white border-opacity-40 rounded-lg p-6 w-full max-w-md">
              <DialogTitle className="text-lg font-bold">
                {editInstrument ? "Editar Instrumento" : "Crear Instrumento"}
              </DialogTitle>
              <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="InstrumentName"
                  >
                    Nombre del Instrumento
                  </label>
                  <input
                    id="InstrumentName"
                    {...register("instrumentName", { required: true })}
                    className="input-primary w-full"
                    type="text"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editInstrument ? "Actualizar" : "Crear"}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </Dialog>
      )}

      <ToastContainer theme="dark" limit={1} />
    </section>
  );
};

export default Instruments;
