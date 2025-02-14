interface Props {
  className: string;
}

const Skeleton = ({ className }: Props) => {
  return <div className={`bg-gray-800 rounded animate-pulse ${className}`} />;
};

export default Skeleton;
