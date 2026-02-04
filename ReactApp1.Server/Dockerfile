# ----- React build stage -----
FROM node:18 AS react-build
WORKDIR /client

COPY reactapp1.client/package*.json ./
RUN npm ci

COPY reactapp1.client ./
RUN npm run build


# ----- .NET build stage -----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ReactApp1.Server/ReactApp1.Server.csproj ReactApp1.Server/
RUN dotnet restore ReactApp1.Server/ReactApp1.Server.csproj

COPY ReactApp1.Server ReactApp1.Server/

# Copy React output into wwwroot
COPY --from=react-build /client/dist ReactApp1.Server/wwwroot

RUN dotnet publish ReactApp1.Server/ReactApp1.Server.csproj \
    -c Release \
    -o /app/publish \
    /p:UseAppHost=false


# ----- Runtime stage -----
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]
