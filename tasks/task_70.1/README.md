# ДЗ 70.1 — Рефакторинг MongoDB Driver → Mongoose

Цей проєкт було **відрефакторено на Mongoose**:

- підключення до MongoDB Atlas виконується через `mongoose.connect()`;
- для колекцій описані **Mongoose-моделі** зі схемами, валідацією та індексами;
- усі операції доступу до БД переведені на **Mongoose Model API** (без `collection.insertOne/updateOne/...`).

## Технології

- Node.js + Express
- MongoDB Atlas
- **Mongoose**
- PUG та EJS для рендерингу сторінок
- Passport (sessions) для demo-авторизації

---

## 1) Встановлення

```bash
npm i
```

## 2) Налаштування MongoDB Atlas

Створіть файл `.env` у корені проєкту:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
SESSION_SECRET=super_secret
BASIC_AUTH_USER=admin
BASIC_AUTH_PASS=admin
```

> `MONGODB_URI` — рядок підключення до вашого Atlas-кластера.

## 3) Запуск

```bash
npm start
```

Сервер буде доступний на: `http://localhost:3000`

## 4) Заповнення БД демо-даними

```bash
npm run seed
```

Seed створює:
- **Articles** (демо-статті)
- **Users** (демо-користувачі)

---

## Моделі (Mongoose)

### `Article` (`src/models/Article.js`)

- `title: String` — required, trim
- `description: String` — default `""`
- `timestamps: true` → `createdAt`, `updatedAt`

### `User` (`src/models/User.js`)

- `name: String` — optional
- `email: String` — required, lowercase, regex validation
- `salt: String` — required
- `passwordHash: String` — required
- **index**: `email` unique

---

## Маршрути

### Сторінки (render)

- `GET /` — Home
- `GET /articles` — список статей (EJS)
- `GET /articles/:articleId` — стаття (EJS)
- `GET /users` — список користувачів (PUG) **з MongoDB**
- `GET /users/:userId` — користувач (PUG) **з MongoDB**

### Auth (Passport sessions)

- `POST /auth/register` — `{ email, password }`
- `POST /auth/login` — `{ email, password }`
- `POST /auth/logout`
- `GET /protected` — захищений роут (потрібна сесія)

### API для статей (Mongoose)

Базовий префікс: `http://localhost:3000/api/articles`

- `POST /api/articles/one` — create one
- `POST /api/articles/many` — insertMany
- `PATCH /api/articles/:articleId` — updateOne
- `PATCH /api/articles` — updateMany
- `PUT /api/articles/:articleId` — replaceOne
- `DELETE /api/articles/:articleId` — deleteOne
- `DELETE /api/articles` — deleteMany
- `GET /api/articles` — find + projection

#### Курсори

Це демонстрація перебору документів **потоком** (без накопичення у масиві):

- `GET /api/articles/cursor/stream` — NDJSON stream
- `GET /api/articles/cursor/stats` — статистика через cursor

#### Агрегація

- `GET /api/articles/aggregate/stats` — aggregate pipeline зі статистикою

---

## Примітки

- У `articles.api.controller.js` операції переписані на Mongoose (`create`, `insertMany`, `updateOne`, `find().cursor()`, `aggregate` тощо).
- У `passport.js` користувачі тепер зберігаються в MongoDB через модель `User`.
