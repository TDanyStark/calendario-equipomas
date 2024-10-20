import { NavLink } from "react-router-dom";
import { useState } from "react";
import { MenuItem } from "../../types/Roles";

interface Props {
  key: number;
  item: MenuItem;
} 


export const SubMenuNav = ({ key, item }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };
  return (
    <li key={key}>
      <button
        onClick={() => toggleSection()}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span>{item.name}</span>
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
      <ul className={`${isOpen ? "block" : "hidden"} pl-4 mt-2 space-y-1`}>
        {item.subMenu && item.subMenu.map((subitem, index) => (
          <li key={index}>
            <NavLink
              to={subitem.path}
              className="block px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
              {subitem.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
};
