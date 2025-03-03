import ChangeAP from "@/components/ChangeAP";
import TableToAssignProfessors from "@/components/TableToAssignProfessors";
import Primaryh1 from "@/components/titles/Primaryh1";


const ProfessorsAssign = () => {
  return (
    <section className="section_page">
      <Primaryh1>Asignar Profesores</Primaryh1>
      <ChangeAP />
      <div>
        <TableToAssignProfessors />
      </div>
    </section>
  );
};

export default ProfessorsAssign;