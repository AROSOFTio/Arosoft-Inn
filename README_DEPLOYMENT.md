# AROSOFT Docker Deployment

Production domain:

```text
https://new.arosoft.io
```

## Ports

- Frontend Docker service: host `4020` -> container `80`
- API Docker service: host `5000` -> container `5000`
- PostgreSQL: internal Docker network only, no public host port

The frontend container is an Nginx static server, so its production internal port is `80`.

## Docker

Run from `/www/wwwroot/new.arosoft.io`:

```sh
git pull origin main
cp .env.production.example .env
nano .env
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f web
docker compose logs -f api
```

Use `sudo docker ...` if the deploy user is not in the Docker group.

The API container runs the database schema push and seed users before startup.

## Nginx

Copy the repo Nginx config to the system site config:

```sh
sudo cp nginx/new.arosoft.io.conf /etc/nginx/sites-available/new.arosoft.io
sudo ln -s /etc/nginx/sites-available/new.arosoft.io /etc/nginx/sites-enabled/new.arosoft.io
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d new.arosoft.io
```

If the symlink already exists, skip the `ln -s` command or replace it intentionally.

## Proxy Targets

- `/` proxies to `http://127.0.0.1:4020/`
- `/api/` proxies to `http://127.0.0.1:5000/api/`
- `/uploads/` proxies to `http://127.0.0.1:5000/uploads/`

The frontend should call the API through `/api`, not localhost.
