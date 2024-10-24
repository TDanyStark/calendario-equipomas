import { ReactNode } from "react";

interface Props{
  children: ReactNode;
}

const Primaryh1 = ({ children }: Props) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-6xl font-bold">
        {children}
        </h1>
    </div>
  );
};

export default Primaryh1;
