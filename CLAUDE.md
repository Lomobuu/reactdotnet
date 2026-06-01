# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Two things coexist here:

1. **A sample full-stack app** — an ASP.NET Core (`ReactApp1.Server`) + React (`reactapp1.client`) bouldering app for cataloguing climbing **holds**, **problems** (routes), and the ordered set of holds that make up each problem.
2. **The Azure ephemeral-environment infrastructure** (`.github/Terraform`, `.github/workflows`) that builds, deploys, and tears down that app per pull request. This is the primary focus of the repo — the app is the deployable artifact. See [README.md](README.md) for the full infra/CI-CD story; it is not duplicated here.

## Commands

All app commands run from the repo root unless noted.

**Backend** (`ReactApp1.Server`, .NET 10):
```powershell
dotnet build ReactApp1.Server/ReactApp1.Server.csproj
dotnet run --project ReactApp1.Server                 # https://localhost:7127 (also auto-starts the Vite client via SpaProxy)
dotnet ef migrations add <Name> --project ReactApp1.Server
dotnet ef database update --project ReactApp1.Server
```

**Frontend** (`reactapp1.client`, React 19 + Vite 7):
```powershell
cd reactapp1.client
npm install
npm run dev        # https://localhost:5173
npm run build
npm run lint       # eslint
```

**Container** (mirrors what CI deploys):
```powershell
docker build -f ReactApp1.Server/Dockerfile -t reactdotnet .   # build from repo root (Dockerfile expects repo-root context)
```

There is **no test suite** in this repo.

## Architecture

### Dev vs. production serving model — the key thing to understand
- **Development:** the client and server run as two processes. The React dev server is on `5173`; the API on `7127`. They are wired together two redundant ways: `vite.config.js` proxies `/api` → `7127`, *and* [api.js](reactapp1.client/src/services/api.js) hardcodes the absolute `https://localhost:7127/api` base when `import.meta.env.DEV`. CORS in [Program.cs](ReactApp1.Server/Program.cs) only whitelists `localhost:5173`, so that origin is load-bearing for dev.
- **Production:** `npm run build` output is copied into the server's `wwwroot` (see [Dockerfile](ReactApp1.Server/Dockerfile)), and the single .NET process serves both the SPA and the API. The client then uses a relative `/api` base. `app.MapFallbackToFile("/index.html")` routes non-API paths to the SPA.
- Running `dotnet run` locally also launches `npm run dev` automatically via `Microsoft.AspNetCore.SpaProxy` (configured in the `.csproj` and `launchSettings.json`).

### Data model (`ReactApp1.Server/Model`)
Three entities with a many-to-many through an explicit join carrying extra data:
- **Hold** — a physical hold on the board, with `PositionX`/`PositionY` float coordinates used for visual placement.
- **Problem** — a named route with a `Grade`.
- **ProblemHold** — join row linking a Problem to a Hold, plus `HoldOrder` (sequence) and `Role` (e.g. start/finish/foot). Queried via `GET /api/problemholds/byproblem/{problemId}`, which returns holds `OrderBy(HoldOrder)` with the `Hold` navigation included.

Persistence is EF Core against Azure SQL Server. The relationships are configured manually in [DataContext.cs](ReactApp1.Server/Data/DataContext.cs) (`OnModelCreating`). When you change a model, add a migration — the schema is migration-managed, not auto-created.

### Controllers
Thin REST controllers under `ReactApp1.Server/Controllers` (`Holds`, `Problems`, `ProblemHolds`), all `[Route("api/[controller]")]` and operating directly on the `DataContext` — no service/repository layer. Every frontend call lives in [api.js](reactapp1.client/src/services/api.js); keep that file as the single source of API calls when adding endpoints.

### Frontend
React 19 with `react-router-dom` v7. Routing and the top nav live in [App.jsx](reactapp1.client/src/App.jsx); `holds` are fetched once at the App level and passed down. Styling is **Tailwind CSS v4 via the `@tailwindcss/vite` plugin** — there is intentionally no `tailwind.config.js`; configuration is CSS-first.

## Configuration & secrets

The DB connection string is read from `ConnectionStrings:DefaultConnection`. Locally this lives in `appsettings.Development.json`, which is **gitignored and untracked** (only the default VS template version was ever committed — no secrets are in history). A `UserSecretsId` is also configured on the project for local secrets. In deployed environments, real secrets come from Azure Key Vault (per [README.md](README.md)).
