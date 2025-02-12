import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import ArrowSvg from "@/icons/ArrowSvg";
import axios from "axios";
import BackgroundDiv from "../modal/BackgroundDiv";
import { useMutation, useQueryClient } from "react-query";
import { URL_BACKEND } from "@/variables";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Props {
  isActive: boolean;
  entity: string;
  filters: string;
  onShow: () => void;
}

const SelectToChange = ({ isActive, entity, filters, onShow }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const JWT = useSelector((state: RootState) => state.auth.JWT);


  const queryClient = useQueryClient();

  const updateItem = useMutation(
    (updatedItem: {option:string}) =>
      axios.put(`${URL_BACKEND}${entity}/changegroup${filters}`, updatedItem, {
        headers: { Authorization: `Bearer ${JWT}` },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [entity], exact: false });
      }
    }
  );

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (selectedOption) {
      updateItem.mutate({ option: selectedOption });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <div className="w-10 flex"><span className="mx-auto"> -&gt;</span></div>
        <div className="relative">
          <p className="absolute w-full -top-5 text-sm px-2">(Pasar el filtro actual a:)</p>
          <div
            className="px-3 py-2 border rounded flex justify-between items-center gap-2 w-64 overflow-hidden cursor-pointer"
            onClick={onShow}
          >
            <span>Seleccione una opción</span>
            <span className="bg-principal-bg">
              <ArrowSvg />
            </span>
          </div>
        </div>
      </div>
      {isActive && (
        <ul className="rounded-b p-2 bg-gray-900 shadow-md max-h-56 overflow-auto absolute ml-10 w-[calc(100%-2.5rem)] z-10">
          <li className="px-3 py-2 rounded cursor-pointer hover:bg-gray-800" onClick={() => handleSelect("activo")}>Pasar a activo ✅</li>
          <li className="px-3 py-2 rounded cursor-pointer hover:bg-gray-800" onClick={() => handleSelect("inactivo")}>Pasar a inactivo ❌</li>
        </ul>
      )}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <BackgroundDiv />
        <div className="modal_container">
          <DialogPanel className="dialog_panel">
            <div className="modal_header">
              <DialogTitle className="dialog_title">Confirmación</DialogTitle>
            </div>
            <p>¿Está seguro que desea pasar todo el filtro a <span className="font-bold">{selectedOption}</span>?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button className="px-4 py-2 btn-secondary rounded" onClick={() => setIsOpen(false)}>Cancelar</button>
              <button className="px-4 py-2 btn-primary rounded text-white" onClick={handleConfirm}>Confirmar</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default SelectToChange;
