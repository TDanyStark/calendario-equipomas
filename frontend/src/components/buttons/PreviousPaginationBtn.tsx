interface Props{
  notClickable: boolean;
  handleClick: () => void;
}

const PreviousPaginationBtn = ({notClickable, handleClick}: Props) => {
  return (
    <button
      className={`${
        notClickable ? "bg-gray-500" : "bg-primary"
      } p-3 rounded`}
      type="button"
      disabled={notClickable}
      onClick={handleClick}
    >
      <span className="sr-only">Previous</span>
      <svg
        className="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 6 10"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 1 1 5l4 4"
        />
      </svg>
    </button>
  );
};

export default PreviousPaginationBtn;
