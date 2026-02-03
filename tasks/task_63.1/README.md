# ДЗ 63.1 — Static files, Cookies та JWT (Express)

Це продовження сервера з попередніх ДЗ (60.1–62.1):
- PUG для сторінок **/users**
- EJS для сторінок **/articles**
- CSS у `public/styles.css`

У цьому завданні додано:
- статичні файли (favicon)
- cookies для збереження теми
- JWT авторизацію з токеном у cookies (httpOnly)

## Встановлення та запуск
```bash
npm install
npm start
```

Сервер стартує на `http://localhost:3000` (або порт з `PORT`, якщо задано).

## Статичні файли
- `public/favicon.ico` віддається як `/favicon.ico`
- `public/styles.css` віддається як `/styles.css`
- В усіх шаблонах додано:
  ```html
  <link rel="icon" href="/favicon.ico">
  ```

## Cookies: тема оформлення
Тема зберігається у cookie `theme` (`dark` або `light`).

### Маршрут
- `GET /theme/set?theme=dark`
- `GET /theme/set?theme=light`

Після встановлення cookie сервер робить редірект назад на сторінку, з якої прийшли.

## JWT авторизація (token в cookie)
JWT генерується на реєстрації/логіні та зберігається в cookie `token` з `httpOnly: true`.

### Маршрути
- `POST /auth/register`
  - body (JSON): `{ "username": "test", "password": "123" }`
  - відповідь: текст `Registered and logged in`
- `POST /auth/login`
  - body (JSON): `{ "username": "test", "password": "123" }`
  - відповідь: текст `Logged in`
- `POST /auth/logout`
  - відповідь: текст `Logged out`
- `GET /auth/protected`
  - потребує cookie `token`
  - відповідь: `Protected route. Hello, {username}`

## Існуючі маршрути (з попередніх ДЗ)
### Root
- `GET /` → `Get root route`

### Users (PUG)
- `GET /users` → HTML (PUG)
- `GET /users/:userId` → HTML (PUG)
- `POST /users` → `Post users route` *(є базова перевірка заголовка Authorization з 61.1)*
- `PUT /users/:userId` → `Put user by Id route: {userId}` *(Authorization)*
- `DELETE /users/:userId` → `Delete user by Id route: {userId}` *(Authorization)*

### Articles (EJS)
- `GET /articles` → HTML (EJS)
- `GET /articles/:articleId` → HTML (EJS)
- `POST /articles` → `Post articles route` *(перевірка `x-role: editor` з 61.1)*
- `PUT /articles/:articleId` → `Put article by Id route: {articleId}` *(x-role)*
- `DELETE /articles/:articleId` → `Delete article by Id route: {articleId}` *(x-role)*

## Нотатки
- Тему можна перемикати через посилання **Dark/Light** у меню на сторінках users/articles.
- Секрети беруться з env, якщо задано:
  - `JWT_SECRET`
  - `SESSION_SECRET`
