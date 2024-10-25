const CancelModalBtn = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-secondary"
    >
      Cancelar
    </button>
  );
};

export default CancelModalBtn;