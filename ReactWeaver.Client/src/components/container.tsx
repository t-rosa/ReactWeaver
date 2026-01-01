import { cn } from "@/lib/utils";

export function Container(props: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn(props.className, "px-6 lg:px-8")}>
      <div className="mx-auto max-w-3xl xl:max-w-4xl">{props.children}</div>
    </div>
  );
}
