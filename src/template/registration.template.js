exports.registrationOtpVerificationtemplate = (
  company,
  username,
  email,
  OTP,
  flink
) => {
  return `
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Email verification OTP</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 520px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #6c63ff, #00c6ff);
      padding: 25px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }
    .content {
      padding: 25px;
      color: #444;
      font-size: 16px;
      line-height: 1.6;
    }
    .highlight {
      color: #6c63ff;
      font-weight: bold;
    }
    .code-box {
      display: inline-block;
      background: #f0f4ff;
      color: #1a73e8;
      font-size: 24px;
      letter-spacing: 5px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #d0daff;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #6c63ff, #00c6ff);
      color: white;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 6px;
      margin-top: 20px;
      transition: 0.3s;
    }
    .btn:hover {
      background: linear-gradient(135deg, #00c6ff, #6c63ff);
    }
    .footer {
      background-color: #f9f9f9;
      text-align: center;
      font-size: 12px;
      color: #888;
      padding: 15px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Welcome to ${company}</h1>
    </div>
    <!-- Content -->
    <div class="content">
      <p>Hi <span class="highlight">${username}</span>,</p>
      <p>We’re thrilled to have you join us! To activate your account, please use the verification code below:</p>

      <!-- Verification Code -->
      <div class="code-box">${OTP}</div>

      <p>This code is valid for <strong>10 minutes</strong>. If you didn’t create this account, simply ignore this email.</p>

      <!-- Button -->
      <a href="${flink}" class="btn">Verify My Email</a>

      <p>We can’t wait for you to explore everything we have to offer.</p>
      <p>Best regards,<br><strong>The Team</strong></p>
    </div>
    <!-- Footer -->
    <div class="footer">
      &copy; ${2025} ${company}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};

// resendOtp verication
exports.resendOtpVerificationtemplate = (
  company,
  username,
  email,
  OTP,
  flink
) => {
  return `
<html lang="en" style="margin:0;padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Email verification resend OTP</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 520px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #6c63ff, #00c6ff);
      padding: 25px;
      text-align: center;
      color: white;
    }
    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: bold;
    }
    .content {
      padding: 25px;
      color: #444;
      font-size: 16px;
      line-height: 1.6;
    }
    .highlight {
      color: #6c63ff;
      font-weight: bold;
    }
    .code-box {
      display: inline-block;
      background: #f0f4ff;
      color: #1a73e8;
      font-size: 24px;
      letter-spacing: 5px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 8px;
      margin: 20px 0;
      border: 1px solid #d0daff;
    }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #6c63ff, #00c6ff);
      color: white;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 6px;
      margin-top: 20px;
      transition: 0.3s;
    }
    .btn:hover {
      background: linear-gradient(135deg, #00c6ff, #6c63ff);
    }
    .footer {
      background-color: #f9f9f9;
      text-align: center;
      font-size: 12px;
      color: #888;
      padding: 15px;
      border-top: 1px solid #eee;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>Welcome to ${company}</h1>
    </div>
    <!-- Content -->
    <div class="content">
      <p>Hi <span class="highlight">${username}</span>,</p>
      <p>We’re thrilled to have you join us! To activate your account, please use the verification code below:</p>

      <!-- Verification Code -->
      <div class="code-box">${OTP}</div>

      <p>This code is valid for <strong>10 minutes</strong>. If you didn’t create this account, simply ignore this email.</p>

      <!-- Button -->
      <a href="${flink}" class="btn">Verify My Email</a>

      <p>We can’t wait for you to explore everything we have to offer.</p>
      <p>Best regards,<br><strong>The Team</strong></p>
    </div>
    <!-- Footer -->
    <div class="footer">
      &copy; ${2025} ${company}. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
};
// resendOtp verication
exports.resetPassword = (flink) => {
  return `
<html lang="en" style="margin:0; padding:0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f6f8; color:#333;">
  <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; margin:auto; background-color:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0px 4px 10px rgba(0,0,0,0.1);">
    <tr>
      <td style="background: linear-gradient(135deg, #4A90E2, #357ABD); padding:20px; text-align:center;">
        <h1 style="color:white; margin:0; font-size:24px;">Password Reset Request</h1>
      </td>
    </tr>

    <tr>
      <td style="padding:30px;">
        <p style="font-size:16px; line-height:1.6; margin-bottom:20px;">
          We received a request to reset your password. If you did not make this request, you can ignore this email.
        </p>

        <p style="font-size:16px; line-height:1.6; margin-bottom:10px;">
          To reset your password, click the link below:
        </p>

        <!-- Only clickable link -->
        <p style="text-align:center; margin:25px 0;">
          <a href="${flink}" style="background-color:#4A90E2; color:white; text-decoration:none; padding:12px 20px; border-radius:6px; font-size:16px; display:inline-block;">
            Reset Password
          </a>
        </p>

        <!-- Expiry notice -->
        <p style="font-size:14px; line-height:1.4; color:#d9534f; font-weight:bold; text-align:center; margin:10px 0;">
          This link is valid for 10 minutes.
        </p>

        <p style="font-size:14px; line-height:1.4; color:#777;">
          If the button doesn't work, copy and paste this link into your browser:<br>
          ${flink}
        </p>
      </td>
    </tr>

    <tr>
      <td style="background-color:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#999;">
        &copy; 2025 Your Company. All rights reserved.
      </td>
    </tr>
  </table>
</body>
</html>

`;
};
