interface Props {
  handleClick: () => void;
}

const PlusBtn = ({ handleClick }: Props) => {
  return (
    <button
      onClick={handleClick}
      className="p-2 hover:bg-gray-800 rounded-md"
      title="Agregar"
    >
      <svg
        width="20px"
        height="20px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 12H20M12 4V20"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default PlusBtn;
