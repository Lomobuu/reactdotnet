# ----- Build stage -----
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore (faster layer caching)
COPY ["ReactApp1.Server.csproj", "./"]
RUN dotnet restore "ReactApp1.Server.csproj"

# Copy the rest and publish
COPY . .
RUN dotnet publish "ReactApp1.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ----- Runtime stage -----
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

# Azure Linux Web Apps expect the app to listen on 8080
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ReactApp1.Server.dll"]