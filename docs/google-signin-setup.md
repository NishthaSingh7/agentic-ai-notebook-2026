# Google Sign-In setup

## Fix `Error 400: redirect_uri_mismatch`

This means Google does **not** have the exact callback URL your app is using.

### Step 1 — Open Google Cloud Console

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Select project **Agentic AI Notebook** (or your project name)
3. Click your **OAuth 2.0 Client ID** (type must be **Web application**)

### Step 2 — Add these URLs exactly

**Authorized JavaScript origins** (add both):

```
http://localhost:3000
https://agentic-ai-notebook-2026.netlify.app
```

**Authorized redirect URIs** (add both — copy/paste exactly):

```
http://localhost:3000/api/auth/callback/google
https://agentic-ai-notebook-2026.netlify.app/api/auth/callback/google
```

Rules:
- Use `http` for localhost (not `https`)
- Use `localhost` (not `127.0.0.1`)
- No trailing slash at the end
- Path must be `/api/auth/callback/google`

### Step 3 — OAuth consent screen (if app is in Testing)

1. Go to **OAuth consent screen**
2. Under **Test users**, add: `RiyaNishtha@gmail.com`
3. Save

### Step 4 — Wait and retry

- Click **Save** on the OAuth client
- Wait 1–2 minutes
- Restart local dev: `npm run dev`
- Open **http://localhost:3000** (not 127.0.0.1)
- Try Sign in again

### Step 5 — If it still fails

On Google's error page, click **error details**. It shows the `redirect_uri` your app sent. That exact string must appear in **Authorized redirect URIs**.

---

## Environment variables

| Variable | Local | Netlify production |
|----------|-------|-------------------|
| `AUTH_URL` | `http://localhost:3000` | `https://agentic-ai-notebook-2026.netlify.app` |
| `AUTH_GOOGLE_ID` | Same client ID | Same client ID |
| `AUTH_GOOGLE_SECRET` | Same secret | Same secret |
| `AUTH_SECRET` | Your generated secret | Same or separate |
| `MONGODB_URI` | Atlas connection string | Same |
| `MONGODB_DB_NAME` | `agentic-ai-notebook` | `agentic-ai-notebook` |
