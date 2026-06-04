# Docker Deployment for new.arosoft.io

Use the existing aaPanel website directory:

```sh
cd /www/wwwroot/new.arosoft.io
```

Do not deploy as `root`. Use the normal `arosoft` user with `sudo`.

## Pull Code

First setup in the existing directory:

```sh
git init
git remote add origin https://github.com/AROSOFTio/Arosoft-Inn.git
git pull origin main
```

Updates:

```sh
cd /www/wwwroot/new.arosoft.io
git pull origin main
```

## Environment

Create `.env` once:

```sh
cp .env.production.example .env
nano .env
```

Important ports:

```env
API_PORT=5001
FRONTEND_PORT=4020
```

Keep secrets private. Never commit `.env`.

## Docker

```sh
sudo docker compose build
sudo docker compose up -d
sudo docker compose ps
```

Expected ports:

```text
web: 127.0.0.1:4020 -> 80
api: 127.0.0.1:5001 -> 5000
postgres: internal only
```

The API container runs:

```sh
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run seed:users
pnpm --filter @workspace/api-server run start
```

## aaPanel Nginx

This server does not use `/etc/nginx/sites-available`.

Install the vhost config here:

```sh
cd /www/wwwroot/new.arosoft.io
sudo cp nginx/new.arosoft.io.conf /www/server/panel/vhost/nginx/new.arosoft.io.conf
sudo /etc/init.d/nginx configtest
sudo /etc/init.d/nginx reload
```

Proxy targets:

- `/` -> `http://127.0.0.1:4020/`
- `/api/` -> `http://127.0.0.1:5001/api/`
- `/uploads/` -> `http://127.0.0.1:5001/uploads/`

The config also serves:

```text
/.well-known/acme-challenge/
```

from:

```text
/www/wwwroot/new.arosoft.io/.well-known/acme-challenge/
```

This is required for aaPanel Let's Encrypt file verification.

## Cloudflare SSL

For aaPanel SSL issuance:

1. Cloudflare DNS record `new.arosoft.io` must point to `95.111.234.34`.
2. If aaPanel file verification fails, temporarily set Cloudflare proxy to DNS only.
3. Run aaPanel SSL -> Let's Encrypt -> File Verification.
4. After SSL is issued, turn Cloudflare proxy back on if desired.

## Checks

```sh
curl -I http://127.0.0.1:4020
curl http://127.0.0.1:5001/api/healthz
curl -I http://new.arosoft.io
curl http://new.arosoft.io/api/healthz
```

After SSL:

```sh
curl -I https://new.arosoft.io
curl https://new.arosoft.io/api/healthz
```
