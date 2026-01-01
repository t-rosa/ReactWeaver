import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CodeSimpleIcon, CopyIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

export function Root(props: React.PropsWithChildren) {
  return (
    <div className="w-full max-w-md rounded-lg border bg-card/50 shadow-md ring-1 ring-black/5">
      {props.children}
    </div>
  );
}

function Container(props: React.PropsWithChildren) {
  return <div className="p-7 sm:p-11">{props.children}</div>;
}

function Header() {
  return (
    <div>
      <div className="flex items-start">
        <Link to="/" title="Home">
          <CodeSimpleIcon />
        </Link>
      </div>
      <h1 className="mt-4 text-base/6 font-medium">Oups.</h1>
      <p className="mt-1 text-sm/5 text-muted-foreground">An error has occurred</p>
    </div>
  );
}

interface ContentProps {
  error?: { message?: string };
  onReloadClick: () => void;
  onCopyClick: () => void;
}

function Content(props: ContentProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  function handleShowDetailsClick() {
    setShowDetails(!showDetails);
  }

  return (
    <div className="mt-8 space-y-6">
      <p>We encountered an error, please excuse us for the inconvenience.</p>
      <div className="grid gap-2">
        <Button onClick={props.onReloadClick} className="cursor-pointer">
          Reload page
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer text-xs text-muted-foreground"
          onClick={handleShowDetailsClick}
        >
          {showDetails ? "Hide details" : "Show details"}
        </Button>
      </div>
      {showDetails && (
        <div>
          <Button variant="link" className="cursor-pointer" onClick={props.onCopyClick}>
            <CopyIcon /> Copy error message
          </Button>
          {props.error ?
            <ScrollArea className="overflow-auto border bg-muted p-3 text-xs text-muted-foreground">
              {props.error.message ?? JSON.stringify(props.error.message, null, 2)}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          : <pre className="rounded bg-muted p-2 text-xs text-muted-foreground">Unknown error.</pre>
          }
        </div>
      )}
    </div>
  );
}

export const ErrorCard = Object.assign(Root, {
  Container,
  Header,
  Content,
});
