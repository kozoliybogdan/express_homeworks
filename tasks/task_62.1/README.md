# ДЗ 62.1 — Інтеграція PUG та EJS у Express сервер

У цьому завданні до існуючого Express сервера додано шаблонізатори:
- **PUG** для сторінок користувачів (`/users`, `/users/:userId`)
- **EJS** для сторінок статей (`/articles`, `/articles/:articleId`)

Також підключені базові **CSS-стилі** (файл `public/styles.css`), щоб сторінки виглядали акуратніше.

## Встановлення та запуск

### Вимоги
- Node.js 18+
- npm

### Запуск
```bash
npm install
npm start
```

Сервер працює на:
`http://localhost:3000`

## Маршрути

### Root
- `GET /` — текстова відповідь:
  - `Get root route`

### Users (PUG)
- `GET /users` — сторінка списку користувачів (PUG)
- `GET /users/:userId` — сторінка деталей користувача (PUG)

Додатково (залишено для сумісності з попередніми ДЗ, відповіді текстові):
- `POST /users` — `Post users route` *(потрібен заголовок `Authorization` + body з `name`, `email`)*
- `PUT /users/:userId` — `Put user by Id route: {userId}` *(потрібен `Authorization` + `name`, `email`)*
- `DELETE /users/:userId` — `Delete user by Id route: {userId}` *(потрібен `Authorization`)*

### Articles (EJS)
- `GET /articles` — сторінка списку статей (EJS)
- `GET /articles/:articleId` — сторінка деталей статті (EJS)

Додатково (відповіді текстові):
- `POST /articles` — `Post articles route` *(потрібен заголовок `x-role: admin`)*
- `PUT /articles/:articleId` — `Put article by Id route: {articleId}` *(потрібен `x-role: admin`)*
- `DELETE /articles/:articleId` — `Delete article by Id route: {articleId}` *(потрібен `x-role: admin`)*

## Підключені стилі

CSS підключений для всіх HTML-сторінок як:
`/styles.css`

Файл: `public/styles.css`

## Приклади перевірки

### Відкрити сторінки в браузері
- `http://localhost:3000/users`
- `http://localhost:3000/users/1`
- `http://localhost:3000/articles`
- `http://localhost:3000/articles/1`

### Перевірка через curl (для методів з мідлварами)
```bash
curl -X POST http://localhost:3000/users -H "Authorization: test" -H "Content-Type: application/json" -d '{"name":"John","email":"john@test.com"}'
curl -X POST http://localhost:3000/articles -H "x-role: admin"
```