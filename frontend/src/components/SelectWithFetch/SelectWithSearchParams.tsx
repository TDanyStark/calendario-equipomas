import { RootState } from "@/store/store";
import { ResourceType } from "@/types/Api";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useGetSelect from "@/hooks/useGetSelect";
import { useDebounce } from "use-debounce";
import Skeleton from "../Loader/Skeleton";

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
  isActive,
  filter,
  onShow,
  onSelect,
}: Props) => {
  const [search, setSearch] = useState(filter || "");
  const [query] = useDebounce(search, 500);
  const JWT = useSelector((state: RootState) => state.auth.JWT);
  const [hasInitialized, setHasInitialized] = useState(false);
  // Fetch courses data
  const { data, isLoading, isError } = useGetSelect<ItemType[]>(
    entity,
    JWT,
    query,
    isActive,
    filter
  );
  const placeholder = `Filtrar por ${displayName}`;

  useEffect(() => {
    if (data && filter && !hasInitialized) {
      const selectedItem = data.find((item: ItemType) => item.id === filter);
      if (selectedItem) {
        setSearch(selectedItem.name);
        setHasInitialized(true);
      }
    }
  }, [data, filter, hasInitialized]);

  useEffect(() => {
    if (filter === undefined) {
      setSearch("");
    }
  }, [filter]);

  return (
    <div className="relative">
      {!hasInitialized && search !== "" && (
        <Skeleton className="w-64 h-[41.6px]" />
      )}
      {(hasInitialized || search === "") && (
        <input
          className="px-3 py-2 border rounded flex justify-between items-center gap-2 w-64 overflow-hidden"
          onClick={onShow}
          placeholder={placeholder}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          type="text"
        />
      )}
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
                  setSearch(item.name);
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
