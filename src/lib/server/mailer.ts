import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	secure: false,
	tls: {
		rejectUnauthorized: false
	},
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASSWORD
	},
	sender: env.SMTP_FROM_EMAIL,
	from: env.SMTP_FROM_NAME,
	replyTo: env.SMTP_REPLY_TO
});

export const sendEmailOTP = (email: string, code: string) =>
	transporter.sendMail({
		from: `Auth Kit<${env.SMTP_FROM_EMAIL}>`,
		to: email,
		subject: 'Login Code',
		html: `

<h2>Your login code is <span style="background-color: #1d1d1d; color: #fff; padding: 5px"><b>${code}</b></span></h2>

<p> - <i>Auth Kit Team</i></p>
`
	});

export const sendRecoveryDetails = (email: string, url: string) =>
	transporter.sendMail({
		from: `Auth Kit<${env.SMTP_FROM_EMAIL}>`,
		to: email,
		subject: 'Recovery Details',
		html: `

    <h2>You have requested a <b>password reset</b></h2>

    <p style="font-size: 18px"><a href=${url}>Click here</a> to reset your password.</a></p>

    <p>Fill out the required fields and click on "Submit".</p>

    <p>The link will expire within 24 hours.</p>

    <p>If you did not request a password reset, please ignore this email.</p>

    <p> for more information, please contact us at: support@mkra.dev</p>
    <p> - <i>Auth Kit Team</i></p>
`
	});

export const sendFailedRegistrationAttempt = (email: string, url: string) =>
	transporter.sendMail({
		from: `Auth Kit<${env.SMTP_FROM_EMAIL}>`,
		to: email,
		subject: 'Registration Attempt',
		html: `

    <h2>You have attempted to register again, using this email</h2>

    <p>If this concerns you, please click on the link below to reset your password.</p>

    <p style="font-size: 18px"><a href=${url}>Click here</a> to reset your password.</a></p>

    <p>If you did this by mistake, please ignore this email.</p>

    <p> for more information, please contact us at: support@mkra.dev</p>
    <p> - <i>Auth Kit Team</i></p>
`
	});

export const sendOAuthOnboardingDetails = (email: string, generatedPassword: string) =>
	transporter.sendMail({
		from: `Auth Kit<${env.SMTP_FROM_EMAIL}>`,
		to: email,
		subject: 'Welcome to our platform!',
		html: `

    <h2>Welcome to our platform!</h2>

    <p>The following is your login details</p>

    <div>
      <p>Email: <span style="font-weight:bold">${email}</span></p>
      <p>Password: <strong>${generatedPassword} </strong></p>
    </div>

    <p>-<i>Auth Kit Team</i></p>
`
	});

export const sendOnboardingDetails = (
	email: string,
	generatedPassword: string,
	code: string,
	verifyUrl: string,
	loginUrl: string
) =>
	transporter.sendMail({
		from: `Auth Kit<${env.SMTP_FROM_EMAIL}>`,
		to: email,
		subject: 'Welcome to our platform!',
		html: `

    <h2>Welcome to our platform!</h2>

    <p>The following is your login details</p>

    <div>
      <p>Email: <span style="font-weight:bold">${email}</span></p>
      <p>Password: <strong>${generatedPassword} </strong></p>
      <p><a href="${loginUrl}">Click here</a> to login using the generated password</p>
    </div>

    <p>Alternatively, here is an initial login code: <span style="background-color: #1d1d1d; color: #fff; padding: 5px"><b>${code}</b></span></p>
    <p><a href="${verifyUrl}">Click here</a> to login using the OTP</p>

    <p>If you are not able to click the link above, please copy and paste the following URL into your browser</p>

    <pre>${verifyUrl}</pre>

    <p> - <i>Auth Kit Team</i></p>
`
	});
