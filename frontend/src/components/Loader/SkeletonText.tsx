interface Props {
  text: string;
}

const SkeletonText = ({ text }: Props) => {
  return (
    <span
      className={`bg-gray-800 rounded animate-pulse inline-block text-transparent`}
    >
      {text}
    </span>
  );
};

export default SkeletonText;
