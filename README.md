# Inventarisierungssystem

## Setup mit Docker

1. Klonen Sie das Repository und navigieren Sie in das Projektverzeichnis

2. Kopieren Sie die Umgebungsvariablen:
```bash
# Linux/macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

3. Starten Sie die Docker-Container:
```bash
docker-compose up -d
```

4. Führen Sie das Setup-Skript aus (für die erste Installation):
```bash
# Linux/macOS
chmod +x setup.sh
./setup.sh

# Windows (PowerShell)
.\setup.ps1
```

Das Setup-Skript führt automatisch folgende Schritte aus:
- Wartet auf die Datenbank-Verfügbarkeit
- Generiert den Prisma Client
- Führt die Datenbankmigrationen aus
- Seeded die Datenbank mit Initialdaten

5. Die Anwendung ist nun verfügbar unter:
- Frontend: http://localhost:3000

## Entwicklung

- Logs anzeigen: `docker-compose logs -f`
- Container neustarten: `docker-compose restart`
- Container stoppen: `docker-compose down`
- Container mit Build neustarten: `docker-compose up -d --build`

## Technologie-Stack

- Next.js 15
- React 19
- TypeScript
- Prisma (PostgreSQL)
- Shadcn UI
- Tailwind CSS
- Docker
