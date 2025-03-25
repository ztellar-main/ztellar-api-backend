export const template = (teamName, eventName, role) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Added to a Team</title>
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
          .logo {
            height: 80px;
          }
          .bigword {
            font-size: 56px;
            font-weight: 300;
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
            text-align: center;
          }
          .header {
            font-size: 32px;
            font-weight: 700;
            color: #333;
            margin-top: 10px;
            text-align: center;
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
            letter-spacing: 2px;
            margin-top: -40px;
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
              class="logo"
              src="https://firebasestorage.googleapis.com/v0/b/vizcom-6a8e0.appspot.com/o/ztellar%2Fztellar%20logo.svg?alt=media&token=3b281f17-56ad-4128-9b0c-bf4f7ca237bd"
              alt=""
            />
          </div>
    
          <!-- TITLE -->
          <h1 class="bigword">CONGRATULATIONS</h1>
          <div class="header">You have been added to a team</div>
    
          <!-- MESSAGE CONTENT -->
          <p class="content">
            Hello
            <br />
            <br />
            Great news! You’ve been added to team 
            <span class="highlight">${teamName}</span> , for
            <span class="highlight">${eventName}</span> as a
            <span class="highlight">${role}</span>! We’re excited to have you on
            board!
            <br />
            <br />
            Next Steps <br />
            ✅ Connect with your team. <br />
            ✅ Review event guidelines. <br />
            ✅ Stay updated on announcements.
            <br />
            <br />
            Manage your participation through your account. For any questions,
            contact us at admin@ztellar.tech.
            <br />
            <br />
            We look forward to your contributions—good luck!
            <br />
            <br />
    
            Best regards, <br />
            Your Ztellar.tech Family
          </p>
        </div>
      </body>
    </html>
    `;
};
