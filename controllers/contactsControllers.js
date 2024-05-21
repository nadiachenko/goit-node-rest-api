import HttpError from "../helpers/HttpError.js";
import * as contactsService from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js"

const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsService.getAllContacts()
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.getOneContact(id)
    if (!result) {
      throw HttpError(404, `Contact not found`)
    }
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }
};


const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const result = await contactsService.createContact(req.body)
    res.status(201).json(result)

  }
  catch (error) {
    next(error)
  }
};
const updateContact = async (req, res, next) => {
  try {
    const { error } = updateContactSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const { id } = req.params
    const result = await contactsService.updateContact(id, req.body)
    if (!result) {
      throw HttpError(404, `Contact not found`)
    }
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.deleteContact(id)
    if (!result) {
      throw HttpError(404, `Contact not found`)
    }
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }
};


export default {
  getAllContacts,
  getOneContact,
  createContact,
  updateContact,
  deleteContact
}

