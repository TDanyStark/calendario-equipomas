import { RootState } from "@/store/store";
import { ResourceType } from "@/types/Api";
import { useSelector } from "react-redux";
import ArrowSvg from "@/icons/ArrowSvg";
import { useEffect, useState } from "react";
import useFetchForSelect from "@/hooks/useFetchForSelect";

interface Props {
  entity: ResourceType;
  displayName: string;
  filter?: string;
  isActive: boolean;
  onShow: () => void;
  onSelect: (id: string) => void;
}

interface ItemType {
  id: string;
  name: string;
}

const SelectWithFetch = ({
  entity,
  displayName,
  filter,
  isActive,
  onShow,
  onSelect,
}: Props) => {
  const [dots, setDots] = useState(".");
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  // Fetch courses data
  const { data, isLoading, isError } = useFetchForSelect(entity, JWT, isActive, filter);
  const nameSelected = data?.find((item: ItemType) => item.id === filter)?.name;
  const placeholder = nameSelected ? nameSelected : `Filtrar por ${displayName}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative ">
      <button
        className="px-3 py-2 border rounded flex justify-between items-center gap-2 w-64 overflow-hidden"
        onClick={onShow}
      >
        <span className="truncate select-none">{isLoading ? dots : placeholder}</span>
        <span className="bg-principal-bg">
          <ArrowSvg />
        </span>
      </button>

      {isActive && (
        <ul className="flex flex-col rounded-b px-2 py-3 bg-gray-900 shadow-md max-h-56 overflow-auto absolute w-full z-10">
          {isLoading && <p>Cargando...</p>}
          {isError && <p>Error al cargar {displayName}</p>}
          {data &&
            data.map((item: ItemType) => (
              <li
                key={item.id}
                className="p-2 hover:bg-gray-800 rounded cursor-pointer"
                onClick={() => {
                  onSelect(item.id);
                }}
              >
                {item.name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SelectWithFetch;
