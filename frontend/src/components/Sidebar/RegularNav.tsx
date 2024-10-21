import { MenuItem } from "../../types/Roles";
import { NavLink } from "react-router-dom";

interface Props {
  key: number;
  item: MenuItem;
}

export const RegularNav = ({item}: Props) => {
  return (
    <li>
      <NavLink
        to={item.path}
        className="block px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        {item.name}
      </NavLink>
    </li>
  );
};
