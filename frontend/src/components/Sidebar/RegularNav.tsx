import { MenuItem } from "../../types/Roles";
import { NavLink } from "react-router-dom";
import { URL_BASE } from "../../variables";

interface Props {
  key: number;
  item: MenuItem;
}

export const RegularNav = ({item}: Props) => {
  return (
    <li>
      <NavLink
        to={item.path}
        className="flex items-center p-2 gap-2 rounded-lg text-white hover:bg-gray-700"
      >
        <img className="w-7 h-7" src={URL_BASE + "images/icons/" + item.icon + ".png"} alt={item.name} />
        {item.name}
      </NavLink>
    </li>
  );
};
