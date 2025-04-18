import { useEffect, useRef, useState } from "react";
import useGetSelect from "../../hooks/useGetSelect";
import { ResourceType } from "../../types/Api";
import { useSelector } from "react-redux";
import useEscapeKey from "@/hooks/useEscapeKey";

type ItemType = {
  id: string;
  name: string;
};

interface Props {
  entity: ResourceType;
  defaultValue?: string | null;
  onSelect: (id: number | null, name?: string | null) => void;
  isActive: boolean; // Nueva prop
  onFocus: () => void; // Nueva prop
  onClose: () => void; // Nueva prop
}

const SearchSelect = ({
  onSelect,
  entity,
  defaultValue,
  isActive,
  onFocus,
  onClose,
}: Props) => {
  const [search, setSearch] = useState(defaultValue || "");
  const [selected, setSelected] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const JWT = useSelector((state: { auth: { JWT: string } }) => state.auth.JWT);

  const { data, isLoading } = useGetSelect<ItemType[]>(
    entity,
    JWT,
    search,
    isActive
  );

  useEscapeKey(onClose);

  useEffect(() => {
    if (!isActive && !defaultValue) setSearch("");
  }, [defaultValue, isActive]);

  function getSearchMessage() {
    if (isLoading && selected === null) return "Cargando...";
    return "No se encontraron resultados";
  }

  // Manejar pérdida de foco sin cerrar inmediatamente si se hace clic en el dropdown
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!dropdownRef.current?.contains(e.relatedTarget)) {
      onClose();
    }
  };

  return (
    <div className="w-full relative">
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar..."
          className="w-full px-3 py-2 border rounded-t"
          value={selected || search}
          onChange={(e) => {
            if (e.target.value === "") onSelect(null, null);
            setSearch(e.target.value);
            setSelected(null);
          }}
          onFocus={onFocus}
          onClick={onFocus}
          onBlur={handleBlur}
        />
        {search !== "" || selected !== null && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-200 hover:text-gray-500"
            onClick={() => {
              setSearch("");
              setSelected(null);
              onSelect(null, null);
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>

      {selected === null && isActive && (
        <div
          ref={dropdownRef}
          className="rounded-b p-2 bg-gray-900 shadow-md max-h-56 overflow-auto absolute w-full z-10"
          onMouseDown={(e) => e.preventDefault()} // Evita que el blur se active antes del click
        >
          {data && data.length > 0 ? (
            data?.map((item: ItemType) => (
              <div
                key={item.id}
                className="px-3 py-2 cursor-pointer hover:bg-gray-800"
                onClick={() => {
                  onSelect(Number(item.id), item.name);
                  setSelected(item.name);
                  onClose(); // Cierra al seleccionar
                  inputRef.current?.focus();
                }}
              >
                {item.name}
              </div>
            ))
          ) : (
            <p className="text-gray-500">{getSearchMessage()}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSelect;
