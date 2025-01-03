import DeleteSvg from "../../icons/DeleteSvg";
import TimePicker from "./TimePicker";

interface TimeRangeRowProps {
  startTime: string;
  endTime: string;
  dayIndex: string;
  onChangeStart: (val: string) => void;
  onChangeEnd: (val: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}
const TimeRangeRow = ({
  startTime,
  endTime,
  dayIndex,
  onChangeStart,
  onChangeEnd,
  onRemove,
  canRemove,
}: TimeRangeRowProps) => {
  return (
    <div className="flex items-center gap-1">
      <TimePicker value={startTime} onChange={onChangeStart} dayIndex={dayIndex} />
      <span className="mx-1">-</span>
      <TimePicker value={endTime} onChange={onChangeEnd} dayIndex={dayIndex} />
      {canRemove && (
        <button onClick={onRemove} className="text-white">
          <DeleteSvg />
        </button>
      )}
    </div>
  );
};

export default TimeRangeRow;