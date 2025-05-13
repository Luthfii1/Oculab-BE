const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Use Gmail service
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendWelcomeEmail = async (userEmail, username, password) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  
  const mailOptions = {
    from: `"Oculab" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: 'Welcome to Oculab - Your Account Details',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to Oculab! 🎉</h2>
        
        <p>Your account has been successfully created. Here are your login credentials:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Temporary Password:</strong> ${password}</p>
        </div>
        
        <p>You can access the application here: <a href="${appUrl}">${appUrl}</a></p>
        
        <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #856404; margin-top: 0;">Important Security Notice</h3>
          <p>For security reasons, please change your password after your first login.</p>
        </div>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <p>Best regards,<br>The Oculab Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send welcome email');
  }
}; 