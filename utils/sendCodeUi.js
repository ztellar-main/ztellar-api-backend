

const sendCodeUi = (code) => {
    const ui = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Mukta+Malar:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet">
        <style>
            p{
                margin:0;
            }
            .container{
                font-family: "Mukta Malar", sans-serif;
                width:400px;
                background-color: #3C9AFC;
                padding:20px 10px;
                box-sizing: border-box;
            }
            .title{
                color:white;
                font-weight: bold;
                font-size: 40px;
                text-align: center;
            }
            .message{
                color:white;
                text-align: center;
                margin:10px 0;
            }
            .codeContainer{
                border:1px solid white;
                padding:10px;
                box-sizing: border-box;
                font-size: 40px;
                font-weight: bold;
                color:white;
                text-align: center;
                letter-spacing: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <p class="title">Welcome!</p>
            <p class="message">We are excited to get you started. First, you need to confirm your account. Just enter this code at the Ztellar platform.</p>
            <div class="codeContainer">${code}</div>
    
            <div class="message" style="color:lightgray">This code expires in 6:00 minutes.</div>
    
            <p class="message">If you have any questions, email us at ztellaradmin@gmail.com. We’re always happy to serve you.</p>
            <br>
            <p class="message">Yours,<br>
                The Ztellar Team</p>
        </div>
    
    </body>
    </html>`
        return ui
}

export default sendCodeUi
