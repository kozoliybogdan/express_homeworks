# ДЗ 65.1 — MongoDB Atlas + Express (Passport)

Це продовження попереднього проєкту з авторизацією через **Passport (local strategy)** та **сесіями**.
У цьому ДЗ додано інтеграцію з **MongoDB Atlas** (через **Mongoose**) і реалізовано **операцію читання (READ)**
для відображення даних на сторінці сервера.

---

## Технології

- Node.js (18+)
- Express.js
- Passport (local strategy) + sessions
- MongoDB Atlas
- Mongoose
- PUG + EJS

---

## Запуск проєкту

Вимоги: **Node.js 18+**

```bash
npm install
npm start
```

Сервер стартує за адресою:

```
http://localhost:3000
```

> Cookie сесії має прапор `httpOnly`.
> Параметр `secure` автоматично вмикається лише у продакшені (`NODE_ENV=production`),
> оскільки на `http://localhost` з `secure: true` cookie не зберігається.

---

## Налаштування MongoDB Atlas

1. У MongoDB Atlas створіть:
   - Cluster
   - користувача в **Database Access**
   - додайте ваш IP у **Network Access**

2. Скопіюйте **connection string (SRV)** та додайте його в `.env`.

---

## Змінні середовища

Створіть файл `.env` у корені проєкту (приклад є у `.env.example`):

```env
PORT=3000
SESSION_SECRET=replace_me
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME?retryWrites=true&w=majority
```

- `.env` додано до `.gitignore`
- файл **не потрібно комітити**

---

## Операція читання даних (READ)

Дані статей отримуються безпосередньо з **MongoDB Atlas**
(база даних `task_65`, колекція `articles`) та відображаються через **EJS**.

### Доступні маршрути:

- `GET /articles` — список статей з MongoDB
- `GET /articles/:articleId` — детальна сторінка статті (пошук за Mongo `_id`)

---

## Seed тестових даних (опціонально)

Для швидкого наповнення бази тестовими статтями:

```bash
npm run seed
```

Після цього відкрийте:

```
http://localhost:3000/articles
```

---

## Авторизація (Passport Local)

Авторизація реалізована через **Passport Local Strategy**.

Поля користувача:
- `email`
- `password`

Для навчального завдання користувачі зберігаються **в памʼяті (in-memory)**.

---

### Маршрути авторизації

- `POST /auth/register` — реєстрація (та автоматичний логін)
- `POST /auth/login` — логін
- `POST /auth/logout` — вихід
- `GET /protected` — захищений маршрут (потрібна активна сесія)
- `GET /auth` — інформаційна сторінка з доступними маршрутами

---

## Приклади запитів (curl)

### Реєстрація

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "email=test@test.com&password=123"
```

### Логін

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "email=test@test.com&password=123"
```

### Доступ до захищеного маршруту

```bash
curl -i -b cookies.txt http://localhost:3000/protected
```

### Вихід

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/auth/logout
```

---

## Статичні файли та favicon

- `public/favicon.ico`
- Підключено у шаблонах:
  ```html
  <link rel="icon" href="/favicon.ico">
  ```

---

## Cookies (тема оформлення)

Тема зберігається у cookie `theme`.

- `GET /theme/set?theme=dark`
- `GET /theme/set?theme=light`

Тема застосовується через CSS-класи:
- `theme-dark`
- `theme-light`

---

## Шаблони

- **PUG**:
  - `/`
  - `/users`
  - `/users/:userId`

- **EJS**:
  - `/articles`
  - `/articles/:articleId`

---