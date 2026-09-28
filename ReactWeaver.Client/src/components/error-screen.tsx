import { Button } from "#src/components/ui/button.tsx";
import { ScrollArea, ScrollBar } from "#src/components/ui/scroll-area.tsx";
import { m } from "#src/paraglide/messages.js";
import { CodeSimpleIcon, CopyIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

interface ErrorProps {
  error?: { message: string };
  reset?: () => void;
}

export function ErrorScreen(props: ErrorProps) {
  const [showDetails, setShowDetails] = React.useState(false);
  function handleShowDetailsClick() {
    setShowDetails(!showDetails);
  }

  async function handleCopyClick() {
    if (props.error?.message) {
      await navigator.clipboard.writeText(props.error.message);
    }
  }

  function handleReload() {
    location.reload();
  }

  return (
    <div className="isolate flex size-full items-center justify-center p-6 lg:p-8">
      <div className="w-full max-w-md rounded-xl border bg-card/50 shadow-md ring-1 ring-black/5">
        <div className="p-7 sm:p-11">
          <div>
            <div className="flex items-start">
              <Link to="/">
                <CodeSimpleIcon />
              </Link>
            </div>
            <h1 className="mt-4 text-base/6 font-medium">{m.error_title()}</h1>
            <p className="mt-1 text-sm/5 text-muted-foreground">{m.common_error_occurred()}</p>
          </div>

          <div className="mt-8 space-y-6">
            <p>{m.error_intro()}</p>
            <div className="grid gap-2">
              <Button onClick={handleReload} className="cursor-pointer">
                {m.error_reload()}
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer text-xs text-muted-foreground"
                onClick={handleShowDetailsClick}
              >
                {showDetails ? m.error_hide_details() : m.error_show_details()}
              </Button>
            </div>
            {showDetails && (
              <div>
                <Button variant="link" className="cursor-pointer" onClick={handleCopyClick}>
                  <CopyIcon /> {m.error_copy()}
                </Button>

                {props.error ? (
                  <ScrollArea className="overflow-auto rounded-lg border bg-muted p-3 text-xs text-muted-foreground">
                    {props.error.message ?? JSON.stringify(props.error.message, null, 2)}
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                ) : (
                  <pre className="rounded-lg border bg-muted p-2 text-xs text-muted-foreground">
                    {m.error_unknown()}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
