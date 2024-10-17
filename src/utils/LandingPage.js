const getHomePage = (req, res) => {
  const htmlResponse = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Oculab Endpoint</title>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f0f0f0;
            }
  
            .container {
              text-align: center;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              background-color: #ffffff;
            }
  
            h1 {
              color: #794cff;
              font-size: 24px;
              margin-bottom: 20px;
            }
  
            p {
              color: #777;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Oculab Endpoint</h1>
            <p>Unauthorized access is strictly prohibited!</p>
          </div>
        </body>
        </html>
    `;
  res.send(htmlResponse);
};

module.exports = { getHomePage };
