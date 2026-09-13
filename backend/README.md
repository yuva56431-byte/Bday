# Birthday Backend

ASP.NET Core 8 Minimal API backend for the birthday website. It stores friend wishes in SQLite and exposes JSON REST endpoints for the submission page and wish bowl.

## Restore Packages

```bash
cd birthday-backend
dotnet restore
```

## Run The API

```bash
dotnet run
```

The backend also serves the frontend files from `BdayWish` after build. Once running, open:

```text
http://localhost:5000/index.html
http://localhost:5000/add-wish.html
```

In Development mode, Swagger is available at:

```text
https://localhost:<port>/swagger
http://localhost:<port>/swagger
```

## SQLite Database

The API uses SQLite with this connection string:

```json
"Data Source=birthday.db"
```

On first run, Entity Framework Core applies the included migration and creates `birthday.db` in the backend project folder. If the `Wishes` table is empty, `SeedData` inserts 5 sample wishes automatically.

## Endpoints

### POST `/api/wishes`

Adds one wish.

```bash
curl -X POST http://localhost:5000/api/wishes ^
  -H "Content-Type: application/json" ^
  -d "{\"friendName\":\"Priya\",\"wishMessage\":\"Happy Birthday! Stay happy always.\"}"
```

Success response:

```json
{
  "success": true,
  "message": "Wish added successfully."
}
```

Validation errors return `400`. Duplicate friend names return `409`.

### GET `/api/wishes`

Returns all wishes ordered by creation time.

```bash
curl http://localhost:5000/api/wishes
```

### GET `/api/wishes/random`

Returns one random wish.

```bash
curl http://localhost:5000/api/wishes/random
```

### DELETE `/api/wishes/{id}`

Deletes a wish by id.

```bash
curl -X DELETE http://localhost:5000/api/wishes/1
```

Returns `204 No Content` on success.

## CORS

Allowed origins are configured in `appsettings.json`:

```json
[
  "http://localhost:5500",
  "http://127.0.0.1:5500",
  "https://localhost:5500"
]
```

Update this list if the frontend is served from a different host or port.

## Hosting Both Frontend And Backend Together

The project copies the existing `BdayWish` frontend into `wwwroot` during build/publish, then serves it from the same ASP.NET Core app as the API.

Publish locally with:

```bash
dotnet publish -c Release -o publish
```

Deploy the `publish` folder to any host that supports ASP.NET Core 8, such as Azure App Service, Render, Railway, Fly.io, or a Windows/Linux VPS.

For production, make sure SQLite has persistent storage. If your host has ephemeral disks, configure a persistent volume and update the `BirthdayDatabase` connection string to point to that volume.
