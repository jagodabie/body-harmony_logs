import Skeleton from '@mui/material/Skeleton';

export function withSkeleton<T>(Component: React.ComponentType<T>, style: Record<string, string>) {
  return (props: T & { loading: boolean }) => {
    if (props.loading) {
      return <Skeleton variant="rectangular" style={style} />;
    }
    return <Component {...props} />;
  };
}