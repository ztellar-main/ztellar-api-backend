export const template = (username: string, movieName: string) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Subscription Expired</title>
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
          .header {
            font-size: 32px;
            font-weight: 700;
    
            text-align: center;
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.3);
            letter-spacing: 2px;
            margin-top: 40px;
            margin-bottom: 40px;
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
        <div class="email-container">
          <div class="logo-container">
            <img
              class="logo"
              src="https://firebasestorage.googleapis.com/v0/b/vizcom-6a8e0.appspot.com/o/ztellar%2Fztellar%20logo.svg?alt=media&token=3b281f17-56ad-4128-9b0c-bf4f7ca237bd"
              alt="Ztellar Logo"
            />
          </div>
          <div class="header">Your Subscription Has Expired</div>
          <p class="content">
            Hi <span class="highlight">${username}</span>, <br /><br />
            We hope you enjoyed watching
            <span class="highlight">${movieName}</span>! Unfortunately, your
            subscription has expired. <br /><br />
            Don’t miss out—renew now and continue enjoying your favorite movies!
            <br /><br />
            If you have any questions, feel free to contact us at
            support@ztellar.tech.
            <br /><br />
            We hope to see you back soon!
            <br /><br />
            Best regards, <br />
            Your Ztellar.tech Family
          </p>
        </div>
      </body>
    </html>
    `;
};
