
# Express — GET / POST / PUT / DELETE Routes

A route pairs an HTTP method with a path. The four CRUD verbs each map to one Express method.

## Syntax

```js
app.METHOD(PATH, HANDLER);
```

- `METHOD` — HTTP method in lowercase: `get`, `post`, `put`, `delete`.
- `PATH` — server path, e.g. `/items` or `/items/:id`.
- `HANDLER` — `(req, res) => { ... }`, run when method and path match.

`req` holds the request data (`req.body`, `req.params`, `req.query`); `res` sends the response.

## Setup

```bash
npm install express
```

```js
import express from 'express';

const app = express();
app.use(express.json()); // parse JSON bodies (POST/PUT)

app.listen(3000);
```

## The four verbs

| Verb | Method | Action | Path |
| --- | --- | --- | --- |
| GET | `app.get()` | Read | `/items`, `/items/:id` |
| POST | `app.post()` | Create | `/items` |
| PUT | `app.put()` | Update | `/items/:id` |
| DELETE | `app.delete()` | Delete | `/items/:id` |

`:id` is a route parameter, read from `req.params.id`.

### GET — read

```js
app.get('/items', (req, res) => {
  res.json(items);
});

app.get('/items/:id', (req, res) => {
  res.json(items.find((i) => i.id === Number(req.params.id)));
});
```

### POST — create

```js
app.post('/items', (req, res) => {
  items.push(req.body);
  res.status(201).json(req.body);
});
```

### PUT — update

```js
app.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const i = items.findIndex((x) => x.id === id);
  items[i] = { ...items[i], ...req.body };
  res.json(items[i]);
});
```

### DELETE — delete

```js
app.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  items = items.filter((x) => x.id !== id);
  res.status(204).send();
});
```

## Testing with curl

General form:

```bash
curl -X <METHOD> <URL> -H "Content-Type: application/json" -d '<json>'
```

GET:

```bash
curl http://localhost:3000/items
```

POST:

```bash
curl -X POST http://localhost:3000/items -H "Content-Type: application/json" -d '{"name":"example"}'
```

PUT:

```bash
curl -X PUT http://localhost:3000/items/1 -H "Content-Type: application/json" -d '{"name":"updated"}'
```

DELETE:

```bash
curl -X DELETE http://localhost:3000/items/1
```
