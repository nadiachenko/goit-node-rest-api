import express from "express";
import validateBody from "../helpers/validateBody.js";
import contacntsController from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contacntsController.getAllContacts);

contactsRouter.get("/:id", contacntsController.getOneContact);

contactsRouter.delete("/:id", contacntsController.deleteContact);

contactsRouter.post("/", validateBody, contacntsController.createContact);

contactsRouter.put("/:id", validateBody, contacntsController.updateContact);

export default contactsRouter;
