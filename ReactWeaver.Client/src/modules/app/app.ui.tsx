import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function Root(props: React.PropsWithChildren) {
  return <div className="my-2 mr-2 w-full rounded-md border">{props.children}</div>;
}

interface HeaderProps {
  title: string;
}

function Header(props: HeaderProps) {
  return (
    <header className="mx-3 border-b">
      <Item>
        <ItemMedia>
          <SidebarTrigger />
        </ItemMedia>
        <Separator orientation="vertical" />
        <ItemContent>
          <ItemTitle>{props.title}</ItemTitle>
        </ItemContent>
      </Item>
    </header>
  );
}

export const AppLayout = Object.assign(Root, {
  Header,
});
