import { useState } from "react";
import useGetSelect from "../../hooks/useGetSelect";
import { ResourceType } from "../../types/Api";
import { useSelector } from "react-redux";

type ItemType = {
  id: string;
  name: string;
}

interface Props {
  entity: ResourceType;
  onSelect: (id: string, name: string) => void;
}

const SearchSelect = ({ onSelect, entity }: Props) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [viewResults, setViewResults] = useState(false);
  const JWT = useSelector((state: { auth: { JWT: string } }) => state.auth.JWT);

  const { data, isLoading } = useGetSelect<ItemType>(entity, JWT, search);

  function getSearchMessage() {
    if (search.length <= 3) return 'Debes ingresar más de 3 dígitos';
    if (isLoading && selected === null) return 'Cargando...';
    return 'No se encontraron resultados';
  }

  return (
    <div className="w-full relative">
      <input
        type="text"
        placeholder="Buscar estudiante..."
        className="w-full px-3 py-2 border rounded-t"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelected(null);
        }}
        onFocus={() => setViewResults(true)}
      />

      {
        selected === null && viewResults && (
          <div className="rounded-b p-2 bg-gray-900 shadow-md max-h-56 overflow-auto absolute w-full z-10">
            {data && data.length > 0 ? (
              data?.map((item: ItemType) => (
                <div
                  key={item.id}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-800"
                  onClick={() => {
                    onSelect(item.id, item.name);
                    setSelected(item.name);
                    setSearch(item.name);
                    setViewResults(false);
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
