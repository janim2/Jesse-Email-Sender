import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let transporter = null;

const createTransporter = (emailUser, emailPassword) => {
  return nodemailer.createTransport({
    
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPassword
    }
  });
};

app.post('/api/send-email', async (req, res) => {
  const { emails, subject, message, isHtml, emailUser, emailPassword } = req.body;
  
  try {
    // Create or update transporter if credentials have changed
    if (!transporter || 
        transporter.options.auth.user !== emailUser || 
        transporter.options.auth.pass !== emailPassword) {
      transporter = createTransporter(emailUser, emailPassword);
    }

    const emailList = emails.split(',').map(email => email.trim());
    
    const mailOptions = {
      from: emailUser,
      to: emailList.join(', '),
      subject: subject,
    };

    if (isHtml) {
      mailOptions.html = message;
    } else {
      mailOptions.text = message;
    }

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});