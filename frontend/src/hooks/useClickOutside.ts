import { useEffect } from "react";

// Hook personalizado para manejar el clic fuera de un componente
const useClickOutside = (
  ref: React.RefObject<HTMLDivElement>,
  onClickOutside: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, onClickOutside]);
};

export default useClickOutside;
