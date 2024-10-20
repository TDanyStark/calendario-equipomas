import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RolesExisting } from "../../types/Roles";
import {Menus} from "../../data/Roles";

interface Props {
  role: RolesExisting;
}
const Sidebar = ({role}: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Estado para manejar múltiples submenús
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const Menu = Menus[role];

  console.log('Menu', Menu);

  const handleClickToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Función para alternar cualquier sección
  const toggleSection = (section: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <div className="aside relative">
      <aside
        id="sidebar-multi-level-sidebar"
        className={`relative z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? "" : "-translate-x-full hidden"
        }  sm:block sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-center py-4 mb-4">
            <img src="/images/logos/maslogo.webp" alt="Logo MAS" width="150px" height="80px" />
          </div>
          <ul className="space-y-2 font-medium">
            {
              Menu.map((item, index) => {
                if (item.subMenu) {
                  return (
                    <li key={index}>
                      <button
                        onClick={() => toggleSection(item.name)}
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
                      <ul
                        className={`${
                          openSections[item.name] ? "block" : "hidden"
                        } pl-4 mt-2 space-y-1`}
                      >
                        {item.subMenu.map((subitem, index) => (
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
                } else {
                  return (
                    <li key={index}>
                      <NavLink
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus
                        :ring-gray-600"
                      >
                        {item.name}
                      </NavLink>
                    </li>
                  );
                }
              })
            }
          </ul>
        </div>
      </aside>
      <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="absolute z-100 top-2 -right-12 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={handleClickToggle}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;
