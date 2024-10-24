import { ReactNode } from "react";

interface Props{
  children: ReactNode;
  handleClick: () => void;
}

const PrimaryButton = ({children, handleClick}: Props) => {
  return (
    <button 
      className="btn-primary"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;