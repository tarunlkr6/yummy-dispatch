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
export const VERIFICATION_EMAIL = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>

<body style="font-family: Arial, Helvetica, sans-serif;">
    <header style="background-color: #4C585B; color: #ffffff; margin-bottom: 0; text-align: center;">
        <img src="https://res.cloudinary.com/do5jrlmqk/image/upload/v1735417956/logo_1_wjmfo2.png" alt="logo"
            style="padding-left: 1rem; padding-top: 0.5rem;">
    </header>

    <main
        style="background-color: #45494be0; color: #ffffff; font-size: 1.2rem; padding-top: 0.5rem; padding-left: 1rem; padding-bottom: 0.5rem;">
        <h3>Hi {username}</h3>
        <p>Thanks for signing up for Poshak Ghar! This email verification step is required to make sure we have an
            accurate email address to communicate important account events to you.</p>
        <p>To confirm your email address, your One Time Password (OTP) is:</p>
        <div style="text-align: center; font-size: 1.5rem; font-weight: 800;"><span>{Verification code}</span>
        </div>
        </div>
        <div>
            <p>This code will expire in 5 minutes for security reasons.</p>
            <p>Please do not reply to this mail.</p>
            <p>
                Thanks,<br>
                Support Team,<br>
                Poshak Ghar
            </p>
    </main>
    <footer
        style="background-color: #4C585B;padding-top: 0.1rem; margin-top: 0; text-align: center; padding-bottom: 0.1rem;">
        <p>&copy; 2024 Poshak Ghar. All rights reserved.</p>
        <p>Poshak Ghar</p>
        <p style="color: blue; font-size: 1.1rem;">Chhoti Durga Mandir, Purani Bazar, Lakhisarai, Bihar
            811311</p>
    </footer>
</body>

</html>`

export const WELCOME_EMAIL = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Poshak Ghar</title>
</head>

<body style="font-family: Arial, Helvetica, sans-serif;">
    <header style="background-color: #030303; color: #ffffff; margin-bottom: 0; text-align: center;">
        <img src="https://res.cloudinary.com/do5jrlmqk/image/upload/v1735417956/logo_1_wjmfo2.png" alt="logo"
            style="padding-left: 1rem; padding-top: 0.5rem;">
    </header>

    <main
        style="background-color: #3c3f41e0; color: #ffffff; font-size: 1.2rem; padding-top: 0.5rem; padding-left: 1rem; padding-bottom: 0.5rem;">
        <h1>Welcome to Poshak Ghar</h1>
        <p>Hi {username}, Thanks for registering to Poshak Ghar. Your account is verified and can start using now. We
            are all about bringing you the best products, exclusive deals, and a seamless shopping experience.<br>
            Here is what you can look forward to:</p>
        <ul>
            <li>A wide range of quality products tailored to your needs.</li>
            <li>Easy returns and secure checkout for hassle-free shopping.</li>
            <li>Exclusive discounts on top brands.</li>
        </ul>
        <p> To get started, check out our latest collections or <a href="#" style="text-decoration: none;">log in</a> to
            your account to personalize
            your shopping
            experience.</p>
        <div>
            <p>Please do not reply to this mail.</p>
            <p>
                Thanks,<br>
                Poshak Ghar
            </p>
    </main>
    <footer
        style="background-color: #030303;padding-top: 0.1rem; margin-top: 0; text-align: center; padding-bottom: 0.1rem; color: #ffffff">
        <p>&copy; 2024 Poshak Ghar. All rights reserved.</p>
        <p>Poshak Ghar</p>
        <p style="color: blue; font-size: 1.1rem;">Chhoti Durga Mandir, Purani Bazar, Lakhisarai, Bihar
            811311</p>
    </footer>
</body>

</html>`