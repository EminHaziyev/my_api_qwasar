## Simple Animals API (Node.js)

Features:
- JWT auth (login/register)
- OAuth-style Bearer token
- CRUD for animals
- Public GET with pagination (max 20)
- Redis cache for GET; invalidated on writes
- Swagger docs at `/docs`
- Postman collection `postman_collection.json`

### Run locally
1. Install Node 18+ and Redis.
2. `npm install`
3. Copy `.env` (already created) and adjust as needed.
4. `npm run dev`

Default admin: `admin` / `admin123`

### Endpoints
- `POST /api/auth/login` -> `{ token }`
- `POST /api/auth/register`
- `GET /api/animals?page=&limit=` (public, limit max 20)
- `GET /api/animals/:id` (public)
- `POST /api/animals` (auth)
- `PUT /api/animals/:id` (auth)
- `DELETE /api/animals/:id` (auth)

### Deploy (Render example)
- Create new Web Service, Node build `npm install`, start `npm start`.
- Add Redis (Upstash or Redis add-on) and set `REDIS_URL`.
- Set `JWT_SECRET`.

### Postman Docs
Import `postman_collection.json` in Postman. Publish docs and paste link here.


