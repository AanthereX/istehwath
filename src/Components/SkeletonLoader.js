import Skeleton from "react-loading-skeleton";
const SkeletonLoader = ({
  loading,
  children,
  width,
  height,
  borderRadius,
  ...props
}) => {
  return (
    <>
      {loading ? (
        <Skeleton
          width={width}
          height={height}
          duration={2}
          enableAnimation={true}
          borderRadius={borderRadius}
          {...props}
        />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default SkeletonLoader;
