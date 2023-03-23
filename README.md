# Soul Search API

1. [Database migration](#database-migrations)
2. [Using cli (soulctl)](#using-cli--soulctl-)
3. [Service config](#service-config)
4. [How to start?](#how-to-start)

### Database migrations

For generate or create migration use next command

```shell
npm run migrations:create {migration_name}
```

or

```shell
npm run migrations:generate {migration_name}
```

where replace `{migration_name}` to your migration name

For roll your migration run

```shell
npm run migrations:run
```

where replace `{migration_name}` to your migration name

### Using cli (soulctl)

For start using cli, you should clone this repo, and in root directory run

- `npm run build:cli`
- `npm link`
- then in you will have command `soulctl`

### Service config

For configuration service use environment variables, also you can provide .env file

| Name                    | Type   | Required | Default Value     | Description                                                                                 |
|-------------------------|--------|----------|-------------------|---------------------------------------------------------------------------------------------|
| PORT                    | Number | No       | 4300              | The port number on which the service should listen for incoming requests.                   |
| HOST                    | String | No       | '127.0.0.1'       | The host address on which the service should listen for incoming requests.                  |
| SERVICE_NAME            | String | No       | 'soul-search-api' | The name of the service.                                                                    |
| NODE_ENV                | String | No       |                   | The environment in which the service is running, such as 'development', 'production', etc.  |
| ENV                     | String | No       | 'stage'           | The environment in which the service is running. Valid values are 'stage' and 'production'. |
| DATABASE_URL            | String | Yes      |                   | The URL of the database to which the service should connect.                                |
| FRONTEND_REDIRECT_URL   | String | Yes      |                   | The URL to which the frontend should be redirected after authentication.                    |
| IMAGES_S3_ACCESS_KEY    | String | No       |                   | The access key for the AWS S3 bucket where images will be stored.                           |
| IMAGES_S3_SECRET_KEY    | String | No       |                   | The secret key for the AWS S3 bucket where images will be stored.                           |
| IMAGES_S3_ENDPOINT      | String | No       |                   | The endpoint URL for the AWS S3 bucket where images will be stored.                         |
| IMAGES_S3_REGION        | String | No       | 'us-east-1'       | The AWS region where the S3 bucket is located.                                              |
| IMAGES_S3_CDN           | String | No       |                   | The URL of the CDN to use for serving images.                                               |
| IMAGES_S3_BUCKET        | String | Yes      |                   | The name of the AWS S3 bucket where images will be stored.                                  |
| IMAGES_S3_LIMIT         | Number | No       | 5000000 (5 MB)    | The maximum size of an image that can be uploaded to the AWS S3 bucket, in bytes.           |
| SUBGRAPH_URL            | String | Yes      |                   | The URL of the subgraph to use for querying data.                                           |
| PASSWORD_SALT_ROUNDS    | Number | No       | 10                | The number of salt rounds to use when hashing passwords.                                    |
| DEFAULT_ADMIN_PASSWORD  | String | No       | 'admin123'        | The default password for the admin user.                                                    |
| JWT_SECRET              | String | No       | 'secret'          | The secret to use for JWT encryption.                                                       |
| JWT_EXPIRE_SECONDS      | Number | No       | 2592000 (30 days) | The number of seconds for which JWT tokens should be valid.                                 |
| INSTAGRAM_CLIENT_ID     | String | Yes      |                   | The client ID for the Instagram API.                                                        |
| INSTAGRAM_CLIENT_SECRET | String | Yes      |                   | The client secret for the Instagram API.                                                    |
| DISCORD_CLIENT_ID       | String | Yes      |                   | The client ID for the Discord API.                                                          |
| DISCORD_CLIENT_SECRET   | String | Yes      |                   | The client secret for the Discord API.                                                      |

### How to start?

- Create .env file, or use environment variables by example in `.env.example`
- `docker compose -f ./cd/docker-compose.yaml up -d`
- `npm install`
- `npm run tools:create-database`
- `npm run migrations:run`
- `npm run start`
