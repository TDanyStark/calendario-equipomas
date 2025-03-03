// components/DataTablePagination.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  Cell,
  HeaderCell,
} from "@table-library/react-table-library/table";
import { useTheme } from "@table-library/react-table-library/theme";
import { TableNode } from "@table-library/react-table-library/types";
import { Loader } from "../Loader/Loader";
import ErrorLoadingResourse from "../error/ErrorLoadingResourse";
import PageInfo from "../pagination/PageInfo";
import PreviousPaginationBtn from "../buttons/PreviousPaginationBtn";
import NextPaginationBtn from "../buttons/NextPaginationBtn";
import useFetchItemsWithPagination from "../../hooks/useFetchItemsWithPagination";
import { useSearchParams } from "react-router-dom";
import CellItem from "../CellItem";
import { useDebounce } from "use-debounce";
import Theme from "@/lib/Theme";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ProfessorType, ScheduleType, SelectableInstrument, SelectableRoom } from "@/types/Api";
import PlusSvg from "@/icons/PlusSvg";
import AssignProfessorModal from "./AssignProfessorModal";


const entity = "professors";
const entityName = "profesores";
const heightRow = 52;
const gridTemplateColumns = "180px 1fr 1fr 1fr 120px 130px";



function TableToAssignProfessors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page") || "1");
  const courseFilter = searchParams.get("course");
  const instrumentFilter = searchParams.get("instrument");
  const semesterFilter = searchParams.get("semester");

  // Estado para manejar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] =
    useState<ProfessorType | null>(null);

  const [debouncedQuery] = useDebounce(query, 500);

  // Memoizar los filtros para optimizar
  const filters = React.useMemo(
    () => ({
      course: courseFilter || "",
      instrument: instrumentFilter || "",
      semester: semesterFilter || "",
    }),
    [courseFilter, instrumentFilter, semesterFilter]
  );

  const JWT = useSelector((state: RootState) => state.auth.JWT);

  // Actualizar useFetchItems para usar los parámetros de la URL
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useFetchItemsWithPagination(entity, JWT, page, debouncedQuery, filters);

  const data: TableNode[] = (fetchedData?.data as TableNode[]) || [];
  const totalPages = fetchedData?.pages || 1;

  // Sincronizar página actual con el total de páginas
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", totalPages.toString());
      setSearchParams(newParams);
    }
  }, [page, totalPages, searchParams, setSearchParams]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("query", e.target.value);
      newParams.set("page", "1");
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const clampedPage = Math.max(1, Math.min(newPage, totalPages));
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", clampedPage.toString());
      setSearchParams(newParams);
    },
    [totalPages, searchParams, setSearchParams]
  );

  // Manejador para abrir el modal
  const handleOpenAssignModal = (professor: ProfessorType) => {
    setSelectedProfessor(professor);
    setIsModalOpen(true);
  };

  // Manejador para asignar el profesor
  const handleAssignProfessor = (contract: boolean, hours: number, instrumentsProfessor: SelectableInstrument[], roomsProfessor: SelectableRoom[], schedule: ScheduleType[]) => {
    // Aquí implementarías la lógica para guardar los datos
    console.log(
      "Asignando profesor:",
      selectedProfessor?.id,
      "Contrato:",
      contract,
      "Horas:",
      hours,
      "Instrumentos:",
      instrumentsProfessor,
      "Salones:",
      roomsProfessor,
      "Horario:",
      schedule
    );

    // Cerrar el modal después de asignar
    setIsModalOpen(false);
    setSelectedProfessor(null);
  };

  const columns = useMemo(
    () => [
      {
        label: "ID",
        sortKey: "id",
        renderCell: (item: unknown) => (item as ProfessorType).id,
      },
      {
        label: "Nombre",
        sortKey: "firstName",
        renderCell: (item: unknown) => (item as ProfessorType).firstName,
      },
      {
        label: "Apellido",
        sortKey: "lastName",
        renderCell: (item: unknown) => (item as ProfessorType).lastName,
      },
      {
        label: "Teléfono",
        sortKey: "phone",
        renderCell: (item: unknown) =>
          (item as ProfessorType).phone || "No disponible",
      },
      {
        label: "Estado",
        sortKey: "status",
        renderCell: (item: unknown) => (item as ProfessorType).status,
      },
    ],
    []
  );

  const tableData = { nodes: data };

  const THEME = Theme({ gridTemplateColumns, heightRow });
  const theme = useTheme(THEME);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorLoadingResourse resourse={entityName} />;

  return (
    <>
      <div
        className={`flex flex-col gap-3 mb-6 md:flex-row items-center justify-between select-none`}
      >
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="buscar"
            value={query}
            onChange={handleSearch}
            className="input-primary w-full max-w-60"
          />
        </div>
      </div>

      {/* Tabla */}
      <div
        style={{
          minHeight: `${heightRow * 11 + 18.4}px`,
        }}
      >
        <Table
          data={tableData}
          theme={theme}
          layout={{ fixedHeader: true, horizontalScroll: true, custom: true }}
        >
          {(tableList: ProfessorType) => (
            <>
              <Header>
                <HeaderRow>
                  {columns.map((column) => (
                    <HeaderCell key={column.label}>{column.label}</HeaderCell>
                  ))}
                  <HeaderCell>Acciones</HeaderCell>
                </HeaderRow>
              </Header>
              <Body>
                {tableList.length > 0 ? (
                  tableList.map((item: ProfessorType) => (
                    <Row key={item.id} item={item}>
                      {columns.map((column) => (
                        <Cell key={column.label} className="text-lg">
                          <CellItem item={item} column={column} />
                        </Cell>
                      ))}
                      <Cell>
                        <div className="flex gap-1 justify-center">
                          <button
                            className="flex gap-1 px-2 py-1 border rounded-md"
                            onClick={() => handleOpenAssignModal(item)}
                          >
                            <PlusSvg /> Asignar
                          </button>
                        </div>
                      </Cell>
                    </Row>
                  ))
                ) : (
                  <Row
                    key={"notFound"}
                    item={{ id: "" }}
                    className="select-none pointer-events-none"
                  >
                    <Cell
                      gridColumnStart={1}
                      gridColumnEnd={columns.length + 4}
                    >
                      No hay datos
                    </Cell>
                  </Row>
                )}
              </Body>
            </>
          )}
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between">
        <PageInfo page={page} totalPage={totalPages} />
        <div className="flex gap-2">
          <PreviousPaginationBtn
            notClickable={page <= 1}
            handleClick={() => handlePageChange(page - 1)}
          />
          <NextPaginationBtn
            notClickable={page >= totalPages}
            handleClick={() => handlePageChange(page + 1)}
          />
        </div>
      </div>

      {/* Modal para asignar profesor usando Headless UI */}
      <AssignProfessorModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        professor={selectedProfessor}
        onAssign={handleAssignProfessor}
        JWT={JWT}
      />

      {/* Estilos adicionales para animaciones */}
      <style>{`
        @keyframes expand {
          from { max-height: 0; opacity: 0; }
          to { max-height: 200px; opacity: 1; }
        }
        
        .animate-expand {
          animation: expand 0.3s ease-out;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default React.memo(TableToAssignProfessors);
