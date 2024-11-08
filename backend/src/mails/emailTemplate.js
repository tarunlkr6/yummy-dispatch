export const PASSWORD_RESET_REQUEST = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Scan & Dine</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      padding: 10px;
      color: #ffffff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .header>img {
      text-align: center;
      padding: 10px;
      color: #ffffff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .logo {
      width: 100px;
      margin: 0 auto;
      display: block;
    }

    .header h1 {
      margin: 10px 0 0;
      background-color: #0073e6;
      padding: 10px;
      font-size: 24px;
    }

    .content {
      padding: 20px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
    }

    .button-container {
      text-align: center;
      margin: 20px 0;
    }

    .button {
      background-color: #0073e6;
      color: #ffffff;
      padding: 12px 24px;
      font-size: 16px;
      border: none;
      border-radius: 5px;
      text-decoration: none;
      display: inline-block;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 10px;
      border-top: 1px solid #f0f0f0;
    }

    .footer a {
      color: #0073e6;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <img src="https://res.cloudinary.com/ddjkxutne/image/upload/v1731096836/scan-dine-logo_dmdllv.jpg"
        alt="Scan & Dine Logo" class="logo">
      <h1>Scan & Dine</h1>
    </div>
    <div class="content">
      <p>Hello, {userName}</p>
      <p>We received a request to reset the password for your Scan & Dine account. Click the button below to set a new
        password:</p>
      <div class="button-container">
        <a href="{reset_link}" class="button">Reset Password</a>
      </div>
      <p>If you did not request a password reset, please ignore this email or contact our support team.</p>
      <p>For any assistance, please feel free to reach out to us at <a
          href="mailto:scandine69@gmail.com">scandine69@gmail.com</a>.</p>
      <p>Thank you,<br>The Scan & Dine Team</p>
    </div>
    <div class="footer">
      <p>© 2024 Scan & Dine. All rights reserved.</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a> from these notifications.</p>
    </div>
  </div>
</body>

</html>
`

export const PASSWORD_RESET_SUCCESS = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful - Scan & Dine</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      color: #333;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      padding: 20px;
      color: #ffffff;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

    .logo {
      width: 100px;
      margin: 0 auto;
      display: block;
    }

    .header h1 {
      margin: 10px 0 0;
      background-color: #0073e6;
      font-size: 24px;
    }

    .content {
      padding: 20px;
    }

    .content p {
      font-size: 16px;
      line-height: 1.6;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #777;
      padding: 10px;
      border-top: 1px solid #f0f0f0;
    }

    .footer a {
      color: #0073e6;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header">
      <img src="https://res.cloudinary.com/ddjkxutne/image/upload/v1731096836/scan-dine-logo_dmdllv.jpg"
        alt="Scan & Dine Logo" class="logo">
      <h1>Scan & Dine</h1>
    </div>
    <div class="content">
      <p>Hello, {userName}</p>
      <p>Your password has been successfully reset. You can now log in to your Scan & Dine account using your new
        password.</p>
      <p>If you did not request this change, please contact our support team immediately at <a
          href="mailto:scandine69@gmail.com">scandine69@gmail.com</a>.</p>
      <p>Thank you,<br>The Scan & Dine Team</p>
    </div>
    <div class="footer">
      <p>© 2024 Scan & Dine. All rights reserved.</p>
      <p><a href="{{unsubscribe_link}}">Unsubscribe</a> from these notifications.</p>
    </div>
  </div>
</body>

</html>
`