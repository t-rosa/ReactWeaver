import { m } from "#src/paraglide/messages.js";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export function NotFoundScreen() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle>{m.notfound_title()}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{m.notfound_description()}</p>
        </CardContent>
        <CardFooter className="grid gap-3">
          <Link className={buttonVariants()} to="..">
            &larr; {m.notfound_back()}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
