interface Props {
  onClick: () => void;
}

const CloseModalBtn = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      className="end-2 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
      onClick={onClick}
    >
      <svg
        className="w-3 h-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
        />
      </svg>
      <span className="sr-only">Close modal</span>
    </button>
  );
};

export default CloseModalBtn;
