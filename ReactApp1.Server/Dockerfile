# ---------- Build React ----------
FROM node:20-alpine AS react-build
WORKDIR /client

COPY reactapp1.client/package*.json ./
RUN npm ci

COPY reactapp1.client .
RUN npm run build


# ---------- Build .NET ----------
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS dotnet-build
WORKDIR /src

COPY ReactApp1.Server/ReactApp1.Server.csproj ReactApp1.Server/
RUN dotnet restore ReactApp1.Server/ReactApp1.Server.csproj

COPY ReactApp1.Server ReactApp1.Server

# Copy React output into ASP.NET static files
COPY --from=react-build /client/dist ReactApp1.Server/wwwroot

WORKDIR /src/ReactApp1.Server
RUN dotnet publish -c Release -o /app /p:UseAppHost=false


# ---------- Runtime ----------
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

COPY --from=dotnet-build /app .

EXPOSE 8080
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]
