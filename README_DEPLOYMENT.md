# AROSOFT Docker Deployment

Production domain:

```text
https://new.arosoft.io
```

This server uses aaPanel/OpenResty style Nginx config, not Ubuntu `sites-available`.

## Ports

- Frontend Docker service: `127.0.0.1:4020` -> container `80`
- API Docker service: `127.0.0.1:5001` -> container `5000`
- PostgreSQL: internal Docker network only, no public host port

The frontend container is an Nginx static server, so its production internal port is `80`.

## Docker

Run from `/www/wwwroot/new.arosoft.io`:

```sh
git pull origin main
cp .env.production.example .env
nano .env
sudo docker compose build
sudo docker compose up -d
sudo docker compose ps
sudo docker compose logs -f web
sudo docker compose logs -f api
```

The API container runs the database schema push and seed users before startup.

## aaPanel Nginx

Use the aaPanel vhost config path:

```sh
sudo ls -l /www/server/panel/vhost/cert/new.arosoft.io/fullchain.pem /www/server/panel/vhost/cert/new.arosoft.io/privkey.pem
sudo cp nginx/new.arosoft.io.conf /www/server/panel/vhost/nginx/new.arosoft.io.conf
sudo /etc/init.d/nginx configtest
sudo /etc/init.d/nginx reload
```

If those cert files do not exist, issue SSL in aaPanel first, then copy this config.

The config includes `/.well-known/acme-challenge/` so aaPanel Let's Encrypt file verification can read challenge files from:

```text
/www/wwwroot/new.arosoft.io/.well-known/acme-challenge/
```

## Cloudflare and SSL

For aaPanel Let's Encrypt file verification:

1. In Cloudflare DNS, keep `new.arosoft.io` pointing to `95.111.234.34`.
2. If SSL application fails while proxied, temporarily set the record to DNS only.
3. In aaPanel, use Website -> `new.arosoft.io` -> SSL -> Let's Encrypt -> File Verification.
4. After the certificate is issued, you may turn Cloudflare proxy back on.

## Proxy Targets

- `/` proxies to `http://127.0.0.1:4020/`
- `/api/` proxies to `http://127.0.0.1:5001/api/`
- `/uploads/` proxies to `http://127.0.0.1:5001/uploads/`

The frontend calls the API through `/api`, not localhost.
