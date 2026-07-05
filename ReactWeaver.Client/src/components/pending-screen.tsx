import { Item, ItemContent, ItemMedia, ItemTitle } from "./ui/item";
import { Spinner } from "./ui/spinner";

export function PendingScreen() {
  return (
    <div className="isolate flex size-full items-center justify-center p-6 lg:p-8">
      <Item variant="muted">
        <ItemMedia>
          <Spinner />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">Loading...</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
