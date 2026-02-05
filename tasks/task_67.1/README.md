# ДЗ 67.1 — Курсори та агрегації (MongoDB)

У цьому розширенні додано маршрути, які:
- використовують **курсор** для перебору документів (без `toArray()`), щоб не зберігати всі дані в памʼяті;
- виконують **агрегаційний запит** (`aggregate`) для збору статистики.

> Базовий префікс API для статей: `http://localhost:3000/api/articles`

## 1) Курсори

### `GET /api/articles/cursor/stream`
Стрімить статті як **NDJSON** (кожен документ — окремий JSON у новому рядку).  
Це демонструє обробку великої кількості документів без збереження їх у масиві.

Параметри:
- `q` — пошук по title/description (regex, case-insensitive)
- `limit` — скільки документів надіслати (0 = без обмеження, але краще ставити)
- `fields` — проекція, напр. `title,createdAt`
- `withId=false` — прибрати `_id`
- `batchSize` — розмір батчу курсора (за замовчуванням 500)

Приклад:
```bash
curl -N "http://localhost:3000/api/articles/cursor/stream?limit=5&fields=title,createdAt"
```

Очікувано: у відповідь прийдуть 5 рядків NDJSON.

### `GET /api/articles/cursor/stats`
Обчислює статистику **через курсор**, не завантажуючи всі документи:
- `count`
- середня довжина title
- середня довжина description

Приклад:
```bash
curl "http://localhost:3000/api/articles/cursor/stats"
```

## 2) Агрегації

### `GET /api/articles/aggregate/stats`
Агрегаційний запит, який повертає:
- загальну кількість документів
- середні довжини title/description
- min/max createdAt
- кількість **унікальних title**

Приклад:
```bash
curl "http://localhost:3000/api/articles/aggregate/stats"
```

Приклад з фільтром:
```bash
curl "http://localhost:3000/api/articles/aggregate/stats?q=express"
```

## Як перевірити, що курсори корисні
1) Засій багато документів:
```bash
npm run seed
```
(за потреби можеш кілька разів)

2) Запусти `cursor/stream` з більшим `limit` і подивись, що відповідь приходить **потоком**, а не одним великим JSON:
```bash
curl -N "http://localhost:3000/api/articles/cursor/stream?limit=1000" | head
```
