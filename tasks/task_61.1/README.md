# ДЗ 61.1 — Розширення Express сервера за допомогою мідлварів

Навчальний проєкт з розширення існуючого Express сервера (ДЗ 60.1) шляхом інтеграції мідлварів для логування, автентифікації, валідації даних, перевірки прав доступу, роботи з сесіями та централізованої обробки помилок.

Сервер побудований на Node.js та Express.js, використовує модульну структуру та дотримується патерна MVC. Усі відповіді сервера є текстовими.

## Встановлення та запуск

### Вимоги
- Node.js 18+
- npm

### Запуск

```bash
npm install
npm start
```

Після запуску сервер доступний за адресою:

http://localhost:3000

## Архітектура проєкту

- routes - опис маршрутів
- controllers - логіка обробки запитів
- middlewares - логування, автентифікація, валідація, перевірка доступу, обробка помилок

Мідлвари інтегровані без перепроектування основної архітектури сервера.

## Використані мідлвари

- Логування HTTP-запитів
- Робота з сесіями через express-session
- Базова автентифікація (перевірка заголовка Authorization)
- Валідація body для маршрутів користувачів
- Валідація параметрів userId та articleId
- Перевірка прав доступу до статей (x-role: admin)
- Централізована обробка помилок 404 та 500

## Маршрути

### Root

GET /  
Відповідь:
Get root route

### Users (потрібен заголовок Authorization)

GET /users  
Get users route

POST /users (потрібні поля name та email)  
Post users route

GET /users/:userId  
Get user by Id route: {userId}

PUT /users/:userId (потрібні поля name та email)  
Put user by Id route: {userId}

DELETE /users/:userId  
Delete user by Id route: {userId}

### Articles (потрібен заголовок x-role: admin)

GET /articles  
Get articles route

POST /articles  
Post articles route

GET /articles/:articleId  
Get article by Id route: {articleId}

PUT /articles/:articleId  
Put article by Id route: {articleId}

DELETE /articles/:articleId  
Delete article by Id route: {articleId}

## Приклади запитів

```bash
curl http://localhost:3000/

curl -H "Authorization: test" http://localhost:3000/users

curl -X POST -H "Authorization: test" -H "Content-Type: application/json"   -d '{"name":"John","email":"john@test.com"}' http://localhost:3000/users

curl -H "x-role: admin" http://localhost:3000/articles
```