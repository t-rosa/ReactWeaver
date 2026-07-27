# React Weaver

Full-stack starter that ships a production-ready ASP.NET Core API with a modern React front-end, wired together with Identity, EF Core, and a PostgreSQL dev database.

## Template Quickstart _(delete after scaffolding)_

1. Clone the repo

```bash
git clone https://github.com/t-rosa/ReactWeaver.git
```

2. Install the template

```bash
cd ReactWeaver
```

```bash
dotnet new install .
```

3. Scaffold a new project

```bash
dotnet new react-weaver -o MyProject
```

## Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org)
- [.NET](https://dotnet.microsoft.com/en-us/download)
  - Tools .NET
    - [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/cli/dotnet)

### Recommended

- [GitHub CLI](https://cli.github.com/)
- [pgAdmin](https://www.pgadmin.org/)

## Getting started

1. Initialize git

```bash
rm -rf .git
```

```bash

git init
```

2. Launch the database

```bash
docker compose up -d
```

3. Build the app

```bash
dotnet publish ReactWeaver.Server -o ReactWeaver.Server/bin/Production
```

4. Launch the app

```bash
dotnet run --project ReactWeaver.Server
```

5. You can login with email "admin@react-weaver.com" and password "Admin123!"

- Enable SMTP (Gmail)

```bash
dotnet user-secrets set "SmtpOptions:Username" "value" --project ReactWeaver.Server
```

```bash
dotnet user-secrets set "SmtpOptions:Password" "value" --project ReactWeaver.Server
```

- Enable File Storage

Create a new bucket.

```bash
docker exec -it react-weaver.garage ./garage bucket create uploads
```

Create a new S3 key

```bash
docker exec -it react-weaver.garage ./garage key create react-weaver
```

Copy the “Key ID” and “Secret key” and paste them into the appsettings.Development.json file.

```bash
  "Storage": {
    "ServiceUrl": "http://localhost:3900",
    "AccessKey": "paste-key-id-here",
    "SecretKey": "paste-secret-key-here",
    "Bucket": "uploads"
  },
```

Add permissions to the bucket.

```bash
docker exec -it react-weaver.garage ./garage bucket allow uploads --key react-weaver --read --write --owner
```

- Execute automated tests:

Run the server end-to-end commands from the root, `ReactWeaver` directory.

```bash
dotnet test ReactWeaver.Tests
```

Run the client and end-to-end commands from the `ReactWeaver.Client` directory.

```bash
cd ReactWeaver.Client
npm run test
npx playwright test
```

## Debug

- VSCode

```json
// .vscode/launch.json
{
  "configurations": [
    {
      "name": "Server",
      "type": "dotnet",
      "request": "launch",
      "projectPath": "${workspaceFolder}/ReactWeaver.Server/ReactWeaver.Server.csproj"
    },
    {
      "name": "Client",
      "runtimeArgs": ["run-script", "dev"],
      "runtimeExecutable": "npm",
      "skipFiles": ["<node_internals>/**"],
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/ReactWeaver.Client"
    },
    {
      "name": "Browser",
      "request": "launch",
      "type": "msedge",
      "url": "https://localhost:7000",
      "webRoot": "${workspaceFolder}/ReactWeaver.Client"
    }
  ],
  "compounds": [
    {
      "name": "Debug",
      "configurations": ["Server", "Client", "Browser"],
      "presentation": {
        "hidden": false,
        "group": "",
        "order": 1
      },
      "stopAll": true
    }
  ]
}
```

## Production Preview

1. Publish the container image

```bash
rm -rf ReactWeaver.Server/bin/Production/ && dotnet publish ReactWeaver.Server -t:PublishContainer -p ContainerArchiveOutputPath=../server.tar.gz -o ReactWeaver.Server/bin/Production
```

2. Load the Docker image

```bash
docker load < server.tar.gz
```

3. Stop any running containers

```bash
docker compose down
```

4. Enable the `preview` service inside `compose.yaml`.

5. Restart the stack

```bash
docker compose up -d
```

6. Browse to `http://localhost:3000`.

## Deployment

```bash
rm -rf ReactWeaver.Server/bin/Publish && dotnet publish ReactWeaver.Server -t:PublishContainer -p ContainerArchiveOutputPath=../server.tar.gz -o ReactWeaver.Server/bin/Publish
```

## Migrations

From ReactWeaver.Server

- Add a new migration

```bash
dotnet ef migrations add MigrationName
```

- Delete the most recent migration that was not applied

```bash
dotnet ef migrations remove
```

- Revert the last migration

```bash
dotnet ef database update PreviousMigrationName
```

```bash
dotnet ef migrations remove
```

## Technologies

### Server

- [ASP NET Core](https://dotnet.microsoft.com/apps/aspnet)
- [EFCore](https://learn.microsoft.com/en-us/ef/core/)
- [Identity](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity)
- [FluentValidation](https://fluentvalidation.net/)
- [XUnit](https://xunit.net/)
- [Testcontainers](https://testcontainers.com/)
- [FluentAssertion](https://fluentassertions.com/)
- [Bogus](https://github.com/bchavez/Bogus)

---

### Client

- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tanstack/Router](https://tanstack.com/router/)
- [Tanstack/Query](https://tanstack.com/query/)
- [Tanstack/Table](https://tanstack.com/table/)
- [ReactHookForm](https://react-hook-form.com/)
- [Heyapi](https://heyapi.dev/docs/openapi/typescript/get-started)
- [Phosphor](https://phosphoricons.com/)
- [Tailwind](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

### Services

- [Garage](https://garagehq.deuxfleurs.fr/)
