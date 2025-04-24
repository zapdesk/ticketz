# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["Ticketz.Api/Ticketz.Api.csproj", "Ticketz.Api/"]
COPY ["Ticketz.Core/Ticketz.Core.csproj", "Ticketz.Core/"]
COPY ["Ticketz.Infrastructure/Ticketz.Infrastructure.csproj", "Ticketz.Infrastructure/"]
COPY ["Ticketz.Application/Ticketz.Application.csproj", "Ticketz.Application/"]

RUN dotnet restore "Ticketz.Api/Ticketz.Api.csproj"

# Copy the rest of the code
COPY . .

# Build and publish
RUN dotnet build "Ticketz.Api/Ticketz.Api.csproj" -c Release -o /app/build
RUN dotnet publish "Ticketz.Api/Ticketz.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install wait-for-it script
RUN apt-get update && apt-get install -y wget
RUN wget -O /wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Copy the published app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 80

# Use wait-for-it to wait for the database
CMD ["/bin/bash", "-c", "/wait-for-it.sh $DB_HOST:5432 -t 60 -- dotnet Ticketz.Api.dll"] 