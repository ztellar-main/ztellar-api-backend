export const template = (
  teamName: string,
  eventName: string,
  teamMates: any
) => {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Creating a Team</title>
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
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: -10px;
          }
          th,
          td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f4f4f4;
          }
          .team-list {
            margin-top: 10px;
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
          <h1 class="bigword">THANK YOU</h1>
          <div class="header">for CREATING A TEAM</div>
    
          <!-- MESSAGE CONTENT -->
          <p class="content">
            Hello,
            <br />
            <br />
            Congratulations! Your team, <span class="highlight">${teamName}</span>,
            has been successfully created for
            <span class="highlight">${eventName}</span>. We’re excited to have you
            and your team participate in this event and look forward to your
            collaboration and performance!
            <br />
            <br />
          </p>
          <p class="highlight">Team Members & Roles</p>
          <br />
          <table>
            <tr>
              <th>Email Address</th>
              <th>Role</th>
            </tr>

            ${teamMates.map((teamMate) => {
              return `<tr>
       
                <td>${teamMate.email}</td>
                <td>${teamMate.role}</td>
              </tr>`;
            })}
       
           
          </table>
          <p class="content">
            <br />
            Next Steps <br />
            ✅ Ensure all team members are ready for the event.
     <br />✅ Review the
            event rules and guidelines.
     <br />✅ Stay updated with announcements
            and schedules.
            <br />
            <br />
            You can manage your team and track event details through your account.
            If you need any assistance, feel free to reach out to our support team
            at admin@ztellar.tech.
            <br />
            <br />
            We’re thrilled to have you on board and can’t wait to see your team in
            action. Best of luck in <span class="highlight">${eventName}</span> !
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
