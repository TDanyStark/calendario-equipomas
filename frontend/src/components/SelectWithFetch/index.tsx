import { RootState } from "@/store/store";
import { ResourceType } from "@/types/Api";
import useFetchItems from "@/hooks/useFetchItems";
import { useSelector } from "react-redux";
import ArrowSvg from "@/icons/ArrowSvg";

interface Props {
  entity: ResourceType;
  displayName: string;
  isActive: boolean;
  onShow: () => void;
  onSelect: (id: string) => void;
}

interface ItemType {
  id: string;
  name: string;
}

const SelectWithFetch = ({ entity, displayName, isActive, onShow, onSelect }: Props) => {
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  // Fetch courses data
  const { data, isLoading, isError } = useFetchItems(entity, JWT);

  return (
    <div className="relative">
      <button className="px-3 py-2 border rounded flex justify-between gap-4" onClick={onShow}>
        <span>Filtrar por {displayName}</span>
        <span>
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
                onClick={() => onSelect(item.id)}
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
