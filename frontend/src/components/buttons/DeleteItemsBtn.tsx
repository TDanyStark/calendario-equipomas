interface Props{
  countItems: number;
  handleClick: () => void;
}

const DeleteItemsBtn = ({countItems, handleClick}: Props) => {
  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-red-600 text-white rounded text-nowrap"
    >
      Eliminar {countItems}
    </button>
  );
};

export default DeleteItemsBtn;
