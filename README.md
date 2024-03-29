# Auth Kit

An Authentication Base Application built with SvelteKit.

Libraries Used:

- [x] [Drizzle ORM](https://orm.drizzle.team)
- [x] [Lucia v3](https://lucia-auth.com)
- [x] [Sveltekit-Superforms](https://superform.rocks)
- [x] [Shadcn-svelte](https://shadcn-svelte.com)

## Goals

Registration

- [x] Email is only required after that a confirmation will be sent to the email address

Login

- [x] User can login with username/email and password
- [x] User can login via OTP
  - [x] The email sent should also have a link and a state in the url

Rate limiting

- [x] Sending OTP, IP+UA limitation should only be 5 per 15minutes
- [x] Wrong OTP Verification should only be 5 per 15minutes

Onboarding

- [x] Welcome, Update Account, Select Tier Subscription, Select Payment Method, Finished Section

Documentation

- [ ] Guide into changing database to postgres and mariadb
- [ ] Diagrams for how the authentication flow works

Admin dashboard

- [ ] To manage backups etc...

Demo dashboard apps

- [ ] AI Prompt
- [ ] Customer Maanager + Invoices (localfirst ?)
- [ ] Chat Application
- [ ] File Manager(emulate a google drive like)

## Development

In order to start the development server, run the following command:

Environment Setup

```sh
cp .env.example .env # Creates a copy of .env.example to .env
```

```sh
#.env
DATABASE_URL=postgres://username:password@host:port/dbname # For local development only
SMTP_HOST=smtp.example.com # your smtp host
SMTP_PORT=587 # your smtp port
SMTP_USER=your_email@example.com
SMTP_PASSWORD=password
SMTP_FROM_NAME="Auth Kit" # if with spaces
SMTP_FROM_EMAIL=noreply@example.com # only used for verifications,
SMTP_REPLY_TO=noreply@example.com #
ORIGIN="https://example.com" # your domain name
GITHUB_CLIENT_ID="" # This is provided by github
GITHUB_CLIENT_SECRET="" # This is provided by github
GITHUB_CALLBACK_URL="http://localhost:5173/login/github/callback"
GOOGLE_CLIENTID="" # This is provided by google console
GOOGLE_CLIENTSECRET="" # This is provided by google console
GOOGLE_CALLBACK_URL="http://localhost:5173/login/google/callback"
STORAGE_ACCESS_KEY=accesskey
STORAGE_SECRET_KEY=secretkey
STORAGE_URL=customdomain or .r2 # domain given by your provider
STORAGE_ENDPOINT=https://your url.r2.cloudflarestorage.com # do not include /bucketname or any S3 provider
STORAGE_BUCKET=bucketname #bucket name
```

Create a bucket and get your credentials from the storage provider
This requires a storage provider like minio, r2, or any s3 compatible provider.
READ more about it [here](https://developers.cloudflare.com/r2/get-started/)

Create your Database for now the schemas are written in postgres, create a neon or vercel postgres database, or run your own in a container for development

e.g

```sh
pnpm db:migrate # or npm run db:migrate
# Optional if you just want to login and check whats inside
pnpm db:seed # or npm run db:seed
```

Run the development server

```sh
pnpm dev # or npm run dev
```

# Deploying

WIP but a dockerfile is included.
