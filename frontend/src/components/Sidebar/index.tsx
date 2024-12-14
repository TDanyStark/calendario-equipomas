import { useState } from "react";
import { NavLink } from "react-router-dom";
import { RolesExisting } from "../../types/Roles";
import { Menus } from "../../data/Roles";
import { SubMenuNav } from "./SubMenuNav";
import { RegularNav } from "./RegularNav";

interface Props {
  role: RolesExisting;
}
const Sidebar = ({ role }: Props) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const Menu = Menus[role];

  const handleClickToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="aside relative bg-secondary-bg">
      <aside
        id="sidebar-multi-level-sidebar"
        className={`relative z-30 w-64 h-screen transition-transform ${
          isSidebarOpen ? "" : "-translate-x-full hidden"
        }  sm:block sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pt-4 pb-8 overflow-y-auto flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-center py-4 mb-4">
              <img
                src="/images/logos/maslogo.webp"
                alt="Logo MAS"
                width="150px"
                height="80px"
              />
            </div>
            <ul className="space-y-2 font-medium">
              {Menu.map((item) => {
                if (item.subMenu) {
                  return <SubMenuNav key={item.id} item={item} />;
                } else {
                  if(item.isHidden)return
                  return <RegularNav key={item.id} item={item} />;
                }
              })}
            </ul>
          </div>
          <div className="mt-2">
            <NavLink
              to="/logout"
              className="flex items-center justify-center p-2 rounded-lg font-normal text-white hover:bg-gray-700 group "
            >
              <svg
                className="flex-shrink-0 w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"
                />
              </svg>
              <span className="ms-3 whitespace-nowrap">
                Cerrar Sesión
              </span>
            </NavLink>
          </div>
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
