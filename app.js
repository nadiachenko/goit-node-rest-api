import express from "express";
import morgan from "morgan";
import cors from "cors";
import contactsRouter from "./routes/contactsRouter.js"
import mongoose from 'mongoose'
import usersRouter from "./routes/usersRouter.js";
import ElasticEmail from '@elasticemail/elasticemail-client'
import nodemailer from 'nodemailer'
import "dotenv/config"

const { DB_HOST, ELASTICEMAIL_API_KEY, ELASTICEMAIL_EMAIL_FROM, UKR_NET_EMAIL, UKR_NET_PASSWORD } = process.env


mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(3000, () => {
      console.log("Database connection successful");
    })
  })
  .catch(error => {
    console.log(error.message)
    process.exit(1)
  })

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/users", usersRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

// const nodemailerConfig = {
//   host: "smtp.ukr.net",
//   port: 465,
//   secure: true,
//   auth: {
//     user: UKR_NET_EMAIL,
//     pass: UKR_NET_PASSWORD,
//   }
// }

// const transport = nodemailer.createTransport(nodemailerConfig)

// const email = {
//   from: UKR_NET_EMAIL,
//   to: "nadiadiachenko93@gmail.com",
//   subject: "Test sbj",
//   html: "<strong> Test email </strong>"
// }

// transport.sendMail(email)
// .then(() => console.log("Email sent"))
// .catch(error => console.log(error.message))
// const defaultClient = ElasticEmail.ApiClient.instance;
 
// const {apikey} = defaultClient.authentications;
// apikey.apiKey = ELASTICEMAIL_API_KEY
 
// const api = new ElasticEmail.EmailsApi()
 
// const email = ElasticEmail.EmailMessageData.constructFromObject({
//   Recipients: [
//     new ElasticEmail.EmailRecipient("nadiadiachenko93@gmail.com")
//   ],
//   Content: {
//     Body: [
//       ElasticEmail.BodyPart.constructFromObject({
//         ContentType: "HTML",
//         Content: "My test email content"
//       })
//     ],
//     Subject: "test",
//     From: ELASTICEMAIL_EMAIL_FROM
//   }
// });
 
// const callback = function(error, data, response) {
//   if (error) {
//     console.error('Error:', error.response ? error.response.text : error.message);
//   } else {
//     console.log('API called successfully.', data);
//   }
// };

// api.emailsPost(email, callback);