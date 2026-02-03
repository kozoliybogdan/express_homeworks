# ДЗ 60.1 - RESTful API з використанням Express

Навчальний проєкт з розробки RESTful API на **Node.js** з використанням **Express.js**.
Сервер має модульну структуру (routes + controllers) та повертає текстові відповіді для спрощення перевірки.

## Встановлення та запуск

### Вимоги
- Node.js 18+
- npm

### Запуск

```bash
npm install
npm start
```

Сервер запускається на порту **3000**:
```
http://localhost:3000
```

Архітектура побудована за принципом MVC:
- **routes** - опис маршрутів
- **controllers** - логіка обробки запитів
- **server/app** - ініціалізація сервера

## Маршрути

### Root

#### GET /
Повертає текст:
```
Get root route
```

---

### Users

#### GET /users
```
Get users route
```

#### POST /users
```
Post users route
```

#### GET /users/:userId
```
Get user by Id route: {userId}
```

#### PUT /users/:userId
```
Put user by Id route: {userId}
```

#### DELETE /users/:userId
```
Delete user by Id route: {userId}
```

---

### Articles

#### GET /articles
```
Get articles route
```

#### POST /articles
```
Post articles route
```

#### GET /articles/:articleId
```
Get article by Id route: {articleId}
```

#### PUT /articles/:articleId
```
Put article by Id route: {articleId}
```

#### DELETE /articles/:articleId
```
Delete article by Id route: {articleId}
```

## Перевірка через curl

```bash
curl http://localhost:3000/
curl http://localhost:3000/users
curl -X POST http://localhost:3000/users
curl http://localhost:3000/users/1
curl -X PUT http://localhost:3000/users/1
curl -X DELETE http://localhost:3000/users/1

curl http://localhost:3000/articles
curl -X POST http://localhost:3000/articles
curl http://localhost:3000/articles/10
curl -X PUT http://localhost:3000/articles/10
curl -X DELETE http://localhost:3000/articles/10
```

## Примітки

- Відповіді сервера є текстовими відповідно до вимог завдання
- Дані не зберігаються, API реалізоване з навчальною метою