interface Props {
  className: string;
}

const Skeleton = ({ className }: Props) => {
  return <span className={`bg-gray-800 rounded animate-pulse inline-block ${className}`} />;
};

export default Skeleton;
