# Auth Kit

An Authentication Base Application built with SvelteKit.

Libraries Used:

- [x] [Drizzle ORM](https://orm.drizzle.team)
- [x] [Lucia v3](https://lucia-auth.com)
- [x] [Sveltekit-Superforms](https://superform.rocks)
- [x] [Shadcn-svelte](https://shadcn-svelte.com)

```sh
#.env
DATABASE_URL=local.db # For local development only
SMTP_HOST=smtp.example.com # your smtp host
SMTP_PORT=587 # your smtp port
SMTP_USER=your_email@example.com
SMTP_PASSWORD=password
SMTP_FROM_NAME="Auth Kit" # if with spaces
SMTP_FROM_EMAIL=noreply@example.com # only used for verifications,
SMTP_REPLY_TO=noreply@example.com #
ORIGIN="https://example.com" # your domain name
OTPLIMIT_SECRET=
VERIFYLIMIT_SECRET=
```

Registration

- [ ] Email is only required after that a confirmation will be sent to the email address

Login

- [x] User can login with username/email and password
- [x] User can login via OTP
  - [x] The email sent should also have a link and a state in the url

Rate limiting

- [ ] Sending OTP, IP+UA limitation should only be 5 per 15minutes
- [ ] Wrong OTP Verification should only be 5 per 15minutes

## Deploying
