import express from "express";
import validateBody from "../helpers/validateBody.js";
import contacntsController from "../controllers/contactsControllers.js";
import isValidId from "../middlewares/isValidId.js"


const contactsRouter = express.Router();

contactsRouter.get("/", contacntsController.getAllContacts);
contactsRouter.get("/:id", isValidId, contacntsController.getOneContact);
contactsRouter.delete("/:id", isValidId, contacntsController.deleteContact);
contactsRouter.post("/", validateBody, contacntsController.createContact);
contactsRouter.put("/:id", isValidId, validateBody, contacntsController.updateContact);
contactsRouter.patch("/:id/favorite", isValidId, validateBody, contacntsController.updateStatusContact);

export default contactsRouter;
