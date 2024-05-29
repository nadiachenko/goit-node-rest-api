import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/Contacts.js"
import Contact from "../models/Contacts.js";

const getAllContacts = async (req, res, next) => {

  try {
    const result = await Contact.find()
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }

};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Contact.findById(id)
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
    const result = await Contact.create(req.body)
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
    const result = await Contact.findByIdAndUpdate(id, req.body)
    if (!result) {
      throw HttpError(404, `Contact not found`)
    }
    res.status(201).json(result)
  }
  catch (error) {
    next(error)
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body)
    if (error) {
      throw HttpError(400, error.message)
    }
    const { id } = req.params
    const result = await Contact.findByIdAndUpdate(id, req.body)
    if (!result) {
      throw HttpError(404, `Not found`)
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
    const result = await Contact.findByIdAndDelete(id)
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
  updateStatusContact,
  deleteContact
}

