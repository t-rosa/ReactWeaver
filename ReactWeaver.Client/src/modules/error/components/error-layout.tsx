export function ErrorLayout(props: React.PropsWithChildren) {
  return (
    <div className="isolate flex size-full items-center justify-center p-6 lg:p-8">
      {props.children}
    </div>
  );
}
