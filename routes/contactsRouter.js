import express from "express";
// import {
//   getAllContacts,
//   getOneContact,
//   deleteContact,
//   createContact,
//   updateContact,
// } from "../services/contactsServices.js";
//from "../controllers/contactsControllers.js";
import * as contactsServices from "../services/contactsServices.js"

const contactsRouter = express.Router();

contactsRouter.get("/", async(req, res) =>{
  
  const result = await contactsServices.getAllContacts()
  res.json(result)
} );

//contactsRouter.get("/:id", getOneContact);

//contactsRouter.delete("/:id", deleteContact);

//contactsRouter.post("/", createContact);

//contactsRouter.put("/:id", updateContact);

export default contactsRouter;
