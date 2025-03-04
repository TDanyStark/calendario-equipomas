interface Props<T,>{
  item: T;
  column: {
    label: string;
    renderCell: (item: T) => string | number | JSX.Element;
  };
}

const CellItem = <T,>({ item, column }: Props<T>) => {
  return (
    <span className={`
      ${column.renderCell(item) === 'inactivo' ? 'bg-red-100 text-red-900 font-normal px-3 py-1 m-1 rounded-full border-2 border-red-600 text-sm' : ''}
      ${column.renderCell(item) === 'activo' ? 'bg-green-100 text-green-900 font-normal px-3 py-1 rounded-full border-2 border-green-600 text-sm' : ''}`}>
      {column.renderCell(item)}
    </span>
  );
};

export default CellItem;