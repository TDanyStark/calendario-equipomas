import CloseIcon from "@/icons/CloseIcon.tsx";
import type { Selectable } from "../../types/Api.d.ts";
import type { ReactNode } from "react";

interface Props<T extends Selectable> {
  items: T[];
  propName: keyof T;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  title: string;
}

const SelectMultiple = <T extends Selectable>({
  items,
  propName,
  setItems,
  title,
}: Props<T>) => {
  const handleChangeSeleted = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item[propName]) === selectedValue) {
          return { ...item, selected: !item.selected };
        }
        return item;
      })
    );
  };

  const handleDelete = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.id) === id) {
          return { ...item, selected: false };
        }
        return item;
      })
    );
  };

  return (
    <div>
      <h3>Seleccione los {title}</h3>
      <select
        className="mt-2 px-2 py-2 w-full rounded"
        onChange={(e) => handleChangeSeleted(e)}
        value={""}
      >
        <option value={""} disabled>
          Elige {title}
        </option>
        {items.map((item) => (
          <option
            key={String(item[propName])}
            value={String(item[propName])}
            disabled={item.selected}
          >
            {item[propName] as ReactNode}
          </option>
        ))}
      </select>

      <div className="flex gap-1 flex-wrap py-2 font-light text-sm">
        {items.map(
          (item) =>
            item.selected && (
              <div
                key={String(item[propName])}
                className="flex items-center bg-gray-800 pl-2 rounded-full cursor-pointer"
                onClick={() => handleDelete(String(item.id))}
              >
                <span>{item[propName] as React.ReactNode}</span>
                <span className="text-gray-400 p-1">
                  <CloseIcon />
                </span>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default SelectMultiple;
