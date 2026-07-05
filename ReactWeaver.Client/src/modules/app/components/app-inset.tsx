import { SidebarInset } from "@/components/ui/sidebar";

export function AppInset(props: React.PropsWithChildren) {
  return (
    <SidebarInset>
      <div className="grid gap-6">{props.children}</div>
    </SidebarInset>
  );
}
