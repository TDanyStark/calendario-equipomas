import { useQuery, useMutation, useQueryClient } from "react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux"; // Importar useSelector para acceder al JWT del store
import { RootState } from "../store/store"; // Importa el tipo RootState para tipar el selector
import { URL_BACKEND } from "../variables";
import { Loader } from "../components/Loader/Loader";

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
  useRowSelect,
  HeaderCellSelect,
  CellSelect,
} from "@table-library/react-table-library/select";

// Tipo para el instrumento
type Instrument = {
  id: string;
  instrumentName: string;
};

const fetchInstruments = async (token: string | null) => {
  const response = await axios.get(`${URL_BACKEND}instruments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return Array.isArray(response.data.data) ? response.data.data : []; // Validar que la respuesta sea un arreglo
};

const Instruments = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editInstrument, setEditInstrument] = useState<Instrument | null>(null);
  const [search, setSearch] = useState("");

  // Obtener el token desde el store
  const token = useSelector((state: RootState) => state.auth.JWT);

  // Fetch instruments data
  const {
    data: instruments,
    isLoading,
    isError,
  } = useQuery(
    "instruments",
    () => fetchInstruments(token),
    { enabled: !!token } // Solo ejecutar la query si existe el token
  );

  // Mutations para crear, actualizar y eliminar
  const createInstrument = useMutation(
    (newInstrument: Instrument) =>
      axios.post(`${URL_BACKEND}instruments`, newInstrument, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("instruments"); // Refresca la lista de instrumentos
        toast.success("Instrumento creado exitosamente");
        setIsOpen(false);
      },
      onError: () => {
        toast.error("Error creando el instrumento");
      },
    }
  );

  const updateInstrument = useMutation(
    (updatedInstrument: Partial<Instrument>) =>
      axios.put(
        `${URL_BACKEND}instruments/${editInstrument?.id}`,
        updatedInstrument,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("instruments");
        toast.success("Instrumento actualizado exitosamente");
        setEditInstrument(null);
        setIsOpen(false);
      },
      onError: () => {
        toast.error("Error actualizando el instrumento");
      },
    }
  );

  const deleteInstrument = useMutation(
    (id: string) =>
      axios.delete(`${URL_BACKEND}instruments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("instruments");
        toast.success("Instrumento eliminado exitosamente");
      },
      onError: () => {
        toast.error("Error eliminando el instrumento");
      },
    }
  );

  // Manejo del formulario con react-hook-form
  const { register, handleSubmit, setValue, reset } = useForm<Instrument>();

  const onSubmit = (data: Instrument) => {
    if (editInstrument) {
      updateInstrument.mutate({ instrumentName: data.instrumentName });
      reset();
    } else {
      createInstrument.mutate(data);
      reset();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  let data = { nodes: instruments || [] };

  data = {
    nodes: data.nodes.filter((item: Instrument) =>
      item.instrumentName.toLowerCase().includes(search.toLowerCase())
    ),
  };

  const THEME = {
    Table: `
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
        background-color: #121212;
      }
  
      &:hover {
        background-color: #181818;
      }
    `,
    BaseCell: `
      border-right: 1px solid white;
  
      padding: 8px;
      height: 52px;

      text-align: center;
  
      svg {
        fill: var(--theme-ui-colors-text);
      }
    `,
    HeaderCell: `
      div div{
        justify-content: center;
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

  const select = useRowSelect(data, {}, {});

  // Si hay error o está cargando
  if (isLoading) return <Loader />;
  if (isError) return <p>Error cargando instrumentos.</p>;

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-6xl font-bold">Instrumentos</h1>
      </div>
      <div className="pt-12 pb-6 flex items-center justify-between">
        <div>
          <input
            type="text"
            placeholder="Buscar instrumento"
            value={search}
            onChange={handleSearch}
            className="input-primary w-full max-w-60"
          />
        </div>
        <button
          onClick={() => {
            setEditInstrument(null);
            setIsOpen(true);
            reset();
          }}
          className="btn-primary"
        >
          Crear Instrumento
        </button>
      </div>

      {/* Tabla de instrumentos */}
      <Table
        data={data}
        theme={theme}
        layout={{ fixedHeader: true }}
        sort={sort}
        select={select}
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
                    <Cell>{item.id}</Cell>
                    <Cell>{item.instrumentName}</Cell>
                    <Cell>
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => {
                            setEditInstrument(item);
                            setIsOpen(true);
                            setValue("instrumentName", item.instrumentName);
                          }}
                          className="p-1 text-blue-400"
                          title="Editar"
                        >
                          <svg
                            className="feather feather-edit"
                            fill="red"
                            height="24"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteInstrument.mutate(item.id)}
                          className="p-1"
                          title="Eliminar"
                        >
                          <svg
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.0004 9.5L17.0004 14.5M17.0004 9.5L12.0004 14.5M4.50823 13.9546L7.43966 17.7546C7.79218 18.2115 7.96843 18.44 8.18975 18.6047C8.38579 18.7505 8.6069 18.8592 8.84212 18.9253C9.10766 19 9.39623 19 9.97336 19H17.8004C18.9205 19 19.4806 19 19.9084 18.782C20.2847 18.5903 20.5907 18.2843 20.7824 17.908C21.0004 17.4802 21.0004 16.9201 21.0004 15.8V8.2C21.0004 7.0799 21.0004 6.51984 20.7824 6.09202C20.5907 5.71569 20.2847 5.40973 19.9084 5.21799C19.4806 5 18.9205 5 17.8004 5H9.97336C9.39623 5 9.10766 5 8.84212 5.07467C8.6069 5.14081 8.38579 5.2495 8.18975 5.39534C7.96843 5.55998 7.79218 5.78846 7.43966 6.24543L4.50823 10.0454C3.96863 10.7449 3.69883 11.0947 3.59505 11.4804C3.50347 11.8207 3.50347 12.1793 3.59505 12.5196C3.69883 12.9053 3.96863 13.2551 4.50823 13.9546Z"
                              stroke="#ff3e3e"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </Cell>
                  </Row>
                ))
              ) : (
                <Row item={{ id: '', instrumentName: '' }}>
                  <Cell>No hay instrumentos</Cell>
                </Row>
              )}
            </Body>
          </>
        )}
      </Table>

      {/* Modal para crear o editar instrumento */}
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-10"
        >
          <div className="fixed inset-0 bg-principal-bg bg-opacity-80" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-principal-bg rounded-lg p-6 w-full max-w-md">
              <Dialog.Title className="text-lg font-bold">
                {editInstrument ? "Editar Instrumento" : "Crear Instrumento"}
              </Dialog.Title>
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
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Instruments;
