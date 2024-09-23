export const template = (otp) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
    
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>OTP</title>
    
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700&display=swap');
    
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: "Roboto", sans-serif;
          }
    
          .container {
            width: 500px;
            border: 1px solid rgba(96, 125, 139, 0.5);
            border-radius: 8px;
            padding: 10px;
          }
    
          .logo {
            height: 65px;
            
          }
    
          .title, .number {
            font-family: roboto;
            font-size: 32px;
            font-weight: 700;
            color: #1A66CC;
            text-align: center;
          }
    
          .paragraph, .team {
            text-align: center;
            color: #57595A;
            margin: 0 25px;
            margin-top: 30px;
          }
    
          .number {
            font-size: 40px;
            text-decoration: underline;
            margin-top: 30px;
          }
    
          .timer {
            text-align: center;
            font-size: 14px;
            color: #8E9090;
            margin-top: 20px;
          }
    
          .Timer {
            font-weight: 700;
          }
    
          .team {
            margin-bottom: 20px;
          }
    
    
        </style>
      </head>
      <body
      <div class="container">
        <img class="logo" src="https://firebasestorage.googleapis.com/v0/b/ztellar-11a4f.appspot.com/o/ztellar%2FGroup%207363.png?alt=media&token=4a7ac4cd-7d2a-4572-9ba9-d8fde4277650" alt="Description of image">
        <h1 class="title">Let's verify your account</h1>
        <p class="paragraph">We are excited to get you started. First, you just need to confirm your account. Just enter this code at the Ztellar platform</p>
        <p class="number">${otp}</p>
        <p class="timer">This code will expires in <span class="Timer">5:00</span> minutes.</p>
        <p class="paragraph">If you have any questions, email us at ztellaradmin@gmail.com. We’re always happy to serve you.</p>
        <p class="team">Yours,<br/>Ztellar Team</p>
    
      </div>
      </body>
    </html>
    `;
};
