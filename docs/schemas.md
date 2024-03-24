# FormSchemas

## Auth

_Object containing the following properties:_

| Property            | Type                                                                                           |
| :------------------ | :--------------------------------------------------------------------------------------------- |
| **`key`** (\*)      | `string` (_email_) _or_ `string` (_min length: 3, max length: 16, regex: `/^[a-zA-Z0-9_]+$/`_) |
| **`password`** (\*) | `string`                                                                                       |

_(\*) Required._

## ChangePassword

_Object containing the following properties:_

| Property                   | Type                                                                                                                     |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **`oldPasswod`** (\*)      | `string`                                                                                                                 |
| **`password`** (\*)        | `string` (_min length: 8, max length: 64, regex: `/\d/`, regex: `/[!@#$%^&*-~_?]/`, regex: `/[A-Z]/`, regex: `/[a-z]/`_) |
| **`passwordConfirm`** (\*) | `string` (_min length: 8, max length: 64, regex: `/\d/`, regex: `/[!@#$%^&*-~_?]/`, regex: `/[A-Z]/`, regex: `/[a-z]/`_) |

_(\*) Required._

## OAuthProviderLink

_Object containing the following properties:_

| Property            | Type                              |
| :------------------ | :-------------------------------- |
| **`provider`** (\*) | [OAuthProviders](#oauthproviders) |
| **`userId`** (\*)   | `string`                          |

_(\*) Required._

## OAuthProviders

_Enum string, one of the following possible values:_

- `'github'`
- `'google'`

## OtpProvider

_Enum string, one of the following possible values:_

- `'email'`
- `'sms'`
 (_optional_)

_Default value:_ `'email'`

## Otp

_Object containing the following properties:_

| Property       | Type                        |
| :------------- | :-------------------------- |
| `provider`     | [OtpProvider](#otpprovider) |
| **`key`** (\*) | `string`                    |

_(\*) Required._

## Register

_Object containing the following properties:_

| Property         | Type               |
| :--------------- | :----------------- |
| **`email`** (\*) | `string` (_email_) |

_(\*) Required._

## ResetPassword

_Object containing the following properties:_

| Property                   | Type                                                                                                                     |
| :------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **`userId`** (\*)          | `string`                                                                                                                 |
| **`password`** (\*)        | `string` (_min length: 8, max length: 64, regex: `/\d/`, regex: `/[!@#$%^&*-~_?]/`, regex: `/[A-Z]/`, regex: `/[a-z]/`_) |
| **`passwordConfirm`** (\*) | `string` (_min length: 8, max length: 64, regex: `/\d/`, regex: `/[!@#$%^&*-~_?]/`, regex: `/[A-Z]/`, regex: `/[a-z]/`_) |

_(\*) Required._

## TotpSetup

_Object containing the following properties:_

| Property        | Type     |
| :-------------- | :------- |
| **`code`** (\*) | `string` |

_(\*) Required._

## TwoFactor

_Object containing the following properties:_

| Property       | Type                            | Default  |
| :------------- | :------------------------------ | :------- |
| `method`       | `'totp' \| 'password' \| 'otp'` | `'totp'` |
| `sudo`         | `boolean`                       | `false`  |
| **`key`** (\*) | `string`                        |          |

_(\*) Required._
