import { SidebarInset } from "#/components/ui/sidebar.tsx";

export function AdminInset(props: React.PropsWithChildren) {
  return (
    <SidebarInset>
      <div className="grid gap-6">{props.children}</div>
    </SidebarInset>
  );
}
