import { useEffect, useState } from "react";
import useGetSelect from "../../hooks/useGetSelect";
import { ResourceType } from "../../types/Api";
import { useSelector } from "react-redux";

type ItemType = {
  id: string;
  name: string;
}

interface Props {
  entity: ResourceType;
  defaultValue?: string;
  onSelect: (id: string, name: string) => void;
  isActive: boolean;         // Nueva prop
  onFocus: () => void;       // Nueva prop
  onClose: () => void;       // Nueva prop
}

const SearchSelect = ({ onSelect, entity, defaultValue, isActive, onFocus, onClose }: Props) => {
  const [search, setSearch] = useState(defaultValue || "");
  const [selected, setSelected] = useState<string | null>(null);
  const JWT = useSelector((state: { auth: { JWT: string } }) => state.auth.JWT);

  const { data, isLoading } = useGetSelect<ItemType>(entity, JWT, search, isActive);

  useEffect(() => {
    if (!isActive && !defaultValue) setSearch("");
  }, [defaultValue, isActive]);

  function getSearchMessage() {
    if (isLoading && selected === null) return 'Cargando...';
    return 'No se encontraron resultados';
  }

  return (
    <div className="w-full relative">
      <input
        type="text"
        placeholder="Buscar estudiante..."
        className="w-full px-3 py-2 border rounded-t"
        value={selected || search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Escape") {
            onClose();  // Cierra al presionar Escape
          }}  
        }
        onFocus={onFocus}  // Usamos la prop del padre
      />

      {
        selected === null && isActive && (
          <div className="rounded-b p-2 bg-gray-900 shadow-md max-h-56 overflow-auto absolute w-full z-10">
            {data && data.length > 0 ? (
              data?.map((item: ItemType) => (
                <div
                  key={item.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-800"
                  onClick={() => {
                    onSelect(item.id, item.name);
                    setSelected(item.name);
                    onClose();  // Cierra al seleccionar
                  }}
                >
                  {item.name}
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                {
                  getSearchMessage()
                }
              </p>
            )}
          </div>
        )
      }

    </div>
  );
};

export default SearchSelect;
