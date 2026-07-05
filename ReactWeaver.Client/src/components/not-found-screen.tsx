import { Link } from "@tanstack/react-router";
import { buttonVariants } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

export function NotFoundScreen() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <Card className="min-w-96">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Sorry, this page does not exist</p>
        </CardContent>
        <CardFooter className="grid gap-3">
          <Link className={buttonVariants()} to="..">
            &larr; Back
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
