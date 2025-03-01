export const template = ({ name, courseTitle }) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Reminder Message</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          text-align: center;
          padding: 20px;
        }
        .email-container {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .logo-container {
          display: flex;
        }
        .header {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-top: 10px;
        }
        .content {
          text-align: left;
          font-size: 16px;
          color: #333;
          line-height: 1.5;
        }
        .highlight {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <!-- WHOLE CONTAINER -->
      <div class="email-container">
        <!-- LOGO CONTAINER -->
        <div class="logo-container">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/ztellar-11a4f.appspot.com/o/course-reminder%2Flogo.png?alt=media&token=2f3f21f0-f5bf-4179-bd50-7fc76c4bec31"
            alt=""
          />
        </div>
  
 
  
        <!-- TITLE -->
        <div class="header">REMINDER</div>
  
        <!-- MESSAGE CONTENT -->
        <p class="content">
          Hi <span class="">${name}</span>,
          <br />
          <br />
          This is a friendly reminder that your learning session,
          <span class="highlight">${courseTitle}</span> is
          scheduled to begin in a moment.
          <br />
          <br />
          Please ensure you’re prepared and logged in a few minutes early to avoid
          any delays.
          <br />
          <br />
          We’re excited to have you join us and look forward to an insightful
          session!
          <br />
          <br />
          See you soon!
          <br />
          <br />
          Your Ztellar.tech Family
        </p>
      </div>
    </body>
  </html>
  
      `;
};
