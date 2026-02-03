# ДЗ 64.1 — Passport авторизація + сесії (Express)

Це оновлення попереднього Express-проєкту (з PUG/EJS, cookies і статикою) з переходом на **Passport (local strategy)** та **сесії** для авторизації.

## Запуск

Вимоги: Node.js 18+

```bash
npm install
npm start
```

Сервер стартує на `http://localhost:3000` (порт 3000).

> Cookie сесії має `httpOnly`. Параметр `secure` увімкнений у продакшені (`NODE_ENV=production`), бо на звичайному `http://localhost` з `secure: true` cookie не збережеться.

## Авторизація (Passport Local)

Passport налаштований на локальну стратегію з полями:

- `email`
- `password`

Користувачі зберігаються в памʼяті (in-memory) — цього достатньо для навчального завдання.

### Маршрути авторизації

- `POST /auth/register` — реєстрація (і одразу логін)
- `POST /auth/login` — логін
- `POST /auth/logout` — вихід
- `GET /protected` — захищений маршрут (потрібна активна сесія)
- `GET /auth` — коротка підказка по маршрутам

### Приклади запитів (curl)

Реєстрація (записує cookie сесії у файл):

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "email=test@test.com&password=123"
```

Логін:

```bash
curl -i -c cookies.txt -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "email=test@test.com&password=123"
```

Доступ до захищеного маршруту:

```bash
curl -i -b cookies.txt http://localhost:3000/protected
```

Вихід:

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/auth/logout
```

## Статичні файли та favicon

- `public/favicon.ico`
- Підключено в шаблонах через:
  - `<link rel="icon" href="/favicon.ico">`

## Cookies (тема оформлення)

Тема зберігається в cookie `theme`.

- `GET /theme/set?theme=dark`
- `GET /theme/set?theme=light`

Тема застосовується до сторінок через клас `theme-dark` / `theme-light`.

## Шаблони

- PUG: `/users`, `/users/:userId`, `/` (Home)
- EJS: `/articles`, `/articles/:articleId`
