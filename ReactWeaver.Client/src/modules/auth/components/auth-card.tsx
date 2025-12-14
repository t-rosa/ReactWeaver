import { IconFrame } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

function Root(props: React.PropsWithChildren) {
  return (
    <div className="w-full max-w-md rounded-xl bg-card/50 shadow-md ring-1 ring-border">
      {props.children}
    </div>
  );
}

function Content(props: React.PropsWithChildren) {
  return <div className="p-7 sm:p-11">{props.children}</div>;
}

function Header(props: React.PropsWithChildren) {
  return (
    <div className="mb-8">
      <div className="flex items-start">
        <Link to="/" title="Accueil">
          <IconFrame />
        </Link>
      </div>
      {props.children}
    </div>
  );
}

function Title(props: React.PropsWithChildren) {
  return <h1 className="mt-8 text-base/6 font-medium">{props.children}</h1>;
}

function Description(props: React.PropsWithChildren) {
  return <p className="mt-1 text-sm/5 text-muted-foreground">{props.children}</p>;
}

function Footer(props: React.PropsWithChildren) {
  return (
    <div className="m-1.5 rounded-lg bg-card py-4 text-center text-sm/5 ring-1 ring-border">
      {props.children}
    </div>
  );
}

export const AuthCard = Object.assign(Root, {
  Content,
  Header,
  Title,
  Description,
  Footer,
});
