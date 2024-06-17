import express from "express";
import validateBody from "../helpers/validateBody.js";
import contacntsController from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js"
import authenticate from "../middlewares/authenticate.js";
import {createContactSchema, updateContactSchema, updateFavoriteSchema} from "../models/Contacts.js"

const contactsRouter = express.Router();

contactsRouter.use(authenticate)
contactsRouter.get("/", contacntsController.getAllContacts);
contactsRouter.get("/:id", isValidId, contacntsController.getOneContact);
contactsRouter.delete("/:id", isValidId, contacntsController.deleteContact);
contactsRouter.post("/", validateBody(createContactSchema), contacntsController.createContact);
contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), contacntsController.updateContact);
contactsRouter.patch("/:id/favorite", isValidId, validateBody(updateFavoriteSchema), contacntsController.updateStatusContact);

export default contactsRouter;
