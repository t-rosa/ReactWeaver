import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function Root(props: React.PropsWithChildren) {
  return <div className="my-2 mr-2 w-full rounded-lg border">{props.children}</div>;
}

interface HeaderProps {
  title: string;
}

function Header(props: HeaderProps) {
  return (
    <header className="border-b p-2.5">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="data-[orientation=vertical]:h-6" />
        <h2 className="text-accent-foreground">{props.title}</h2>
      </div>
    </header>
  );
}

export const AppLayout = Object.assign(Root, {
  Header,
});
