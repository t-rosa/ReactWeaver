import { Container } from "@/components/container";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function Root(props: React.PropsWithChildren) {
  return (
    <div className="my-2 mr-2 w-full space-y-9 divide-y rounded-md border">{props.children}</div>
  );
}

interface TitleProps {
  title: string;
}

function Title(props: TitleProps) {
  return (
    <section>
      <Item>
        <ItemMedia>
          <SidebarTrigger />
        </ItemMedia>
        <Separator orientation="vertical" />
        <ItemContent>
          <ItemTitle>{props.title}</ItemTitle>
        </ItemContent>
      </Item>
    </section>
  );
}

function Content(props: React.PropsWithChildren) {
  return <Container>{props.children}</Container>;
}

export const AppLayout = Object.assign(Root, {
  Title,
  Content,
});
