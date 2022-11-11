const path = require('path');

const { htmlToText } = require('html-to-text');
const nodemailer = require('nodemailer');
const pug = require('pug');

class Email {
  // constructor function calls whenever we create a new instance of the class.
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Mohammad Rumman <${process.env.EMAIL_FROM}>`;
  }

  // Create transporter based on environment.
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return 1;
    }

    return nodemailer.createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // send method responsible for sending actual emails.
  async send(template, subject) {
    // 1)Render HTML based on a pug template.
    const html = pug.renderFile(
      path.join(__dirname, '.', 'email-templates', `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText(html),
      html,
    };

    // 3) Actually send emails using transporter
    await this.newTransport().sendMail(mailOptions);
  }

  // sendWelcome responsible for only welcome message
  async sendWelcome() {
    await this.send('welcome', 'Welcome to our Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }
}

module.exports = Email;
