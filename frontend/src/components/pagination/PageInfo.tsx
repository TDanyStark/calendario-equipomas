interface Props{
  page: number;
  totalPage: number;
}

const PageInfo = ({ page, totalPage}: Props) => {
  return (
    <span>
      Pagina {page} de{" "}
      {totalPage}
  </span>
  );
};

export default PageInfo;
