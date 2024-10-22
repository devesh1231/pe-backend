
const nodemailer = require('nodemailer');
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USERNAME = process.env.SMTP_USERNAME;
const SMTP_EMAIL = process.env.SMTP_EMAIL;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'deveshpathak67@gmail.com',
    pass: 'mpkb ebjq fbff hkfi' // Hardcoded password
  }
});



async function sendEmailService(email, clientName, message, date, time) {
  const mailOptions = {
    from: 'deveshpathak67@gmail.com',
    to: email,
    subject: '📅 New Appointment Request! 📅',
    html: `
      <div style="font-family: 'Arial', sans-serif; color: #333;">
        <!-- Header section -->
        <div style="background-color: #28a745; padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
          <h1 style="font-size: 28px;">📅 New Appointment Request 📅</h1>
          <p style="font-size: 18px;">A client would like to schedule an appointment with you! 💬</p>
        </div>

        <!-- Body section -->
        <div style="padding: 25px; background-color: #f0f8e0;">
          <p style="font-size: 16px;">Hello <strong>${email}</strong>,</p>
          <p style="font-size: 16px;">You have received a new appointment request from:</p>

          <div style="padding: 15px; background-color: #c8e6c9; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h2 style="color: #28a745;">👤 ${clientName}</h2>
            <h3 style="color: #28a745;">📅 Preferred Date: ${date}</h3>
            <h3 style="color: #28a745;">⏰ Preferred Time: ${time}</h3>
          </div>

          <p style="font-size: 16px;">Message: <strong>${message}</strong></p>
          <p style="font-size: 16px;">Please review the details and confirm the appointment at your earliest convenience! 😊</p>
        </div>

        <!-- Footer section -->
        <div style="background-color: #28a745; padding: 20px; text-align: center; color: white; border-radius: 0 0 10px 10px;">
          <p style="font-size: 12px;">If you have any questions, feel free to contact us at aryanmaurya698@example.com</p>
          <p style="font-size: 12px;">We look forward to your confirmation! 💬</p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Appointment request email sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending appointment request email:', error);
  }
}


// // Example usage
// sendEmailService(
//   'pathakdevesh165@gmail.com',
//   'Devesh Pathak',
//   'I would like to schedule an appointment to discuss training progress.',
//   '2024-10-15',
//   '10:00 AM'
// );




function getCurrentDateTime() {
  const now = new Date();

  const options = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const formattedDate = formatter.format(now).replace(',', '');

  // Convert to ISO format: YYYY-MM-DDTHH:MM:SS
  const dateParts = formattedDate.split(' ');
  const date = dateParts[0].split('/').reverse().join('-'); // Converts DD/MM/YYYY to YYYY-MM-DD
  const time = dateParts[1];

  return `${date}  ${time}`; // Returns ISO format without timezone
}

console.log(getCurrentDateTime());

// getCurrentDateTime()
const generateOtpController = () => {
  const otp = Math.floor(Math.random() * 900000) + 100000;
  console.log(otp)
  return otp;
}




module.exports = { getCurrentDateTime, generateOtpController, sendEmailService }
