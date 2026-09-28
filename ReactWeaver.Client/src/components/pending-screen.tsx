import { m } from "#src/paraglide/messages.js";
import { Item, ItemContent, ItemMedia, ItemTitle } from "./ui/item";
import { Spinner } from "./ui/spinner";

export function PendingScreen() {
  return (
    <div className="isolate flex size-full items-center justify-center p-6 lg:p-8">
      <div className="w-full max-w-md rounded-xl border bg-card/50 shadow-md ring-1 ring-black/5">
        <Item variant="muted">
          <ItemMedia>
            <Spinner />
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">{m.pending_loading()}</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    </div>
  );
}
