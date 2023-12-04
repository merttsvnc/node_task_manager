const sgMail = require('@sendgrid/mail')
const sendgridAPIKey =
  process.env.SENDGRID_API_KEY ||
  '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'

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'merttsvnc@gmail.com',
    subject: 'Thanks for joining in!',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'merttsvnc@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`,
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
}
