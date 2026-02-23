## ДЗ 68.1 — Docker + Express + MongoDB (Docker Compose)

### Docker
> Потрібно: встановлений Docker Desktop / Docker Engine.

```bash
docker compose up --build

docker-compose up --build
```

Відкрити у браузері: `http://localhost:3000`

### Перевірка інтеграції з MongoDB (окрема колекція `messages`)
1) Створити запис у MongoDB:
```bash
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello from Docker + Mongo!"}'
```

2) Отримати список:
```bash
curl http://localhost:3000/api/messages
```

### Hot reload (volumes)
У `docker-compose.yml` налаштовано `volumes`, тому можна змінювати код локально і сервер автоматично перезапуститься через `nodemon`.

---