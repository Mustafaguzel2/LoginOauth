import { MailtrapClient } from "mailtrap";
import { MAILTRAP_TOKEN } from "./config.js";

export const mailtrapClient = new MailtrapClient({
  token: MAILTRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Mustafa Guzel",
};


/* 
const recipients = [
  {
    email: "mustafaguzel879@gmail.com",
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: "You are awesome!",
    text: "Congrats for sending test email with Mailtrap!",
    category: "Integration Test",
  })
  .then(console.log, console.error); */
