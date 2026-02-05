# ДЗ 66.1 — CRUD для MongoDB Atlas у Express

Це продовження проєкту з:
- авторизацією через **Passport (local strategy)** та **сесіями**
- інтеграцією з **MongoDB Atlas** через **Mongoose** (ДЗ 65.1)

У цьому ДЗ додано **CRUD-операції** (Create / Update / Delete) та розширено Read:
- **insertOne**, **insertMany**
- **updateOne**, **updateMany**, **replaceOne**
- **deleteOne**, **deleteMany**
- **find + projection** (вибір полів)

> Для зручності CRUD реалізований окремими API-маршрутами `/api/articles` (JSON).
> Сторінки `/articles` залишаються серверним рендерингом (EJS), як у домашці 65.1.

---

## Технології

- Node.js (18+)
- Express.js
- MongoDB Atlas
- Mongoose
- Passport (local strategy) + express-session
- PUG + EJS

---

## Встановлення і запуск

```bash
npm install
npm run seed
npm start
```

Сервер: `http://localhost:3000`

---

## Налаштування MongoDB Atlas

1) У MongoDB Atlas створіть:
- Cluster
- користувача в **Database Access**
- додайте ваш IP у **Network Access**

2) Скопіюйте **connection string (SRV)**.

---

## Змінні середовища

Створіть файл `.env` у корені проєкту (приклад у `.env.example`):

```env
PORT=3000
SESSION_SECRET=replace_me
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/task_65?retryWrites=true&w=majority
```

**Важливо:** у `MONGODB_URI` має бути вказана **назва бази** (`/task_66`), інакше MongoDB використає базу `test` за замовчуванням.

`.env` додано в `.gitignore` — комітити його не потрібно.

---

## READ (сторінки, EJS)

- `GET /articles` — список статей (MongoDB → EJS)
- `GET /articles/:articleId` — детальна сторінка статті (MongoDB → EJS)

---

## CRUD API для Articles (JSON)

Базовий шлях: `http://localhost:3000/api/articles`

### 1) Read: find + projection
**GET** `/api/articles`

Параметри:
- `q` — пошук по `title` або `description` (regex, case-insensitive)
- `limit` — ліміт (за замовчуванням 50, максимум 200)
- `fields` — проекція (наприклад `title,description`)
- `withId=false` — прибрати `_id` з відповіді

**Приклад:**
```bash
curl "http://localhost:3000/api/articles?q=express&fields=title,createdAt&limit=10"
```

---

### 2) Create: insertOne
**POST** `/api/articles/one`

Body (JSON):
```json
{ "title": "New", "description": "Created with insertOne" }
```

Приклад:
```bash
curl -X POST "http://localhost:3000/api/articles/one" \
  -H "Content-Type: application/json" \
  -d '{"title":"New","description":"Created with insertOne"}'
```

---

### 3) Create: insertMany
**POST** `/api/articles/many`

Body (JSON):
```json
{
  "articles": [
    { "title": "A", "description": "First" },
    { "title": "B", "description": "Second" }
  ]
}
```

Приклад:
```bash
curl -X POST "http://localhost:3000/api/articles/many" \
  -H "Content-Type: application/json" \
  -d '{"articles":[{"title":"A","description":"First"},{"title":"B","description":"Second"}]}'
```

---

### 4) Update: updateOne
**PATCH** `/api/articles/:articleId`

Body (JSON) — можна передати `title` і/або `description`.

Приклад:
```bash
curl -X PATCH "http://localhost:3000/api/articles/REPLACE_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title"}'
```

---

### 5) Update: updateMany
**PATCH** `/api/articles`

Body (JSON):
- `filter` — фільтр документів
- `update` — поля, які треба оновити

Приклад (оновити всі статті, де title = "A"):
```bash
curl -X PATCH "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -d '{"filter":{"title":"A"},"update":{"description":"Updated by updateMany"}}'
```

---

### 6) Update: replaceOne
**PUT** `/api/articles/:articleId`

Body (JSON) — **обов’язково** `title` і `description` (повна заміна документа).

Приклад:
```bash
curl -X PUT "http://localhost:3000/api/articles/REPLACE_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"Replaced","description":"Document replaced with replaceOne"}'
```

---

### 7) Delete: deleteOne
**DELETE** `/api/articles/:articleId`

Приклад:
```bash
curl -X DELETE "http://localhost:3000/api/articles/REPLACE_ID"
```

---

### 8) Delete: deleteMany
**DELETE** `/api/articles`

Body (JSON):
```json
{ "filter": { "title": "A" } }
```

Приклад:
```bash
curl -X DELETE "http://localhost:3000/api/articles" \
  -H "Content-Type: application/json" \
  -d '{"filter":{"title":"A"}}'
```

---

## Де це реалізовано в коді

- Підключення до Atlas: `src/config/db.js`
- Модель: `src/models/Article.js`
- API маршрути: `src/routes/articles.api.routes.js`
- API контролер: `src/controllers/articles.api.controller.js`
- EJS READ-сторінки: `src/routes/articles.routes.js`, `src/controllers/articles.controller.js`, `views/articles/*`

---

## Seed тестових даних

```bash
npm run seed
```

Після seed:
- `http://localhost:3000/articles` (EJS)
- `http://localhost:3000/api/articles` (JSON)

---


---

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