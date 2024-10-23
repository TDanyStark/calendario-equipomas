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

// Tipo para el instrumento
type Instrument = {
  instrumentID: string;
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
        `${URL_BACKEND}instruments/${editInstrument?.instrumentID}`,
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
  const { register, handleSubmit } = useForm<Instrument>();

  const onSubmit = (data: Instrument) => {
    if (editInstrument) {
      updateInstrument.mutate({ instrumentName: data.instrumentName });
    } else {
      createInstrument.mutate(data);
    }
  };

  // Si hay error o está cargando
  if (isLoading) return <Loader />;
  if (isError) return <p>Error cargando instrumentos.</p>;

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Instrumentos</h1>
        <button onClick={() => setIsOpen(true)} className="btn-primary">
          Crear Instrumento
        </button>
      </div>

      {/* Tabla de instrumentos */}
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {instruments &&
          Array.isArray(instruments) &&
          instruments.length > 0 ? (
            instruments.map((instrument: Instrument) => (
              <tr key={instrument.instrumentID}>
                <td className="border px-4 py-2">{instrument.instrumentID}</td>
                <td className="border px-4 py-2">
                  {instrument.instrumentName}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      setEditInstrument(instrument);
                      setIsOpen(true);
                    }}
                    className="btn-secondary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() =>
                      deleteInstrument.mutate(instrument.instrumentID)
                    }
                    className="btn-danger"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center p-4">
                No hay instrumentos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal para crear o editar instrumento */}
      {isOpen && (
        <Dialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          className="relative z-10"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-md">
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
                    defaultValue={editInstrument?.instrumentName || ""}
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
