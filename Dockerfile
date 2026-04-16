# 1. БАЗОВЫЙ ЭТАП
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080

# 2. ЭТАП СБОРКИ (SDK)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Копируем файл проекта
COPY ["WeatherAPI.csproj", "."]
RUN dotnet restore "./WeatherAPI.csproj"

# Копируем весь остальной код и компилируем его
COPY . .
WORKDIR "/src/."
RUN dotnet build "./WeatherAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

# 3. ЭТАП ПУБЛИКАЦИИ
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WeatherAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# 4. ФИНАЛЬНЫЙ ЭТАП
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeatherAPI.dll"]