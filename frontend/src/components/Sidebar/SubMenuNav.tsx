import { NavLink } from "react-router-dom";
import { useState } from "react";
import { MenuItem } from "../../types/Roles";
import { URL_BASE } from "../../variables";

interface Props {
  key: number;
  item: MenuItem;
}

export const SubMenuNav = ({ item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  return (
    <li>
      <button
        onClick={() => toggleSection()}
        className="flex items-center justify-between w-full p-2 rounded-lg text-white hover:bg-gray-700"
      >
        <div className="flex gap-2">
          <img
            className="w-7 h-7"
            src={URL_BASE + "images/icons/" + item.icon + ".png"}
            alt={item.name}
          />
          <span>{item.name}</span>
        </div>
        <svg
          className="w-6 h-6 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          ></path>
        </svg>
      </button>
      <ul className={`${isOpen ? "block" : "hidden"} pl-8 mt-2 space-y-1`}>
        {item.subMenu &&
          item.subMenu.map((subitem) => {
            if (subitem.isHidden) return;
            return (
              <li key={subitem.id}>
                <NavLink
                  to={subitem.path}
                  className="flex items-center p-2 rounded-lg font-normal text-white hover:bg-gray-700"
                >
                  {subitem.name}
                </NavLink>
              </li>
            );
          })}
      </ul>
    </li>
  );
};
