import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../models/Contacts.js"
import Contact from "../models/Contacts.js";

const getAllContacts = async (req, res, next) => {

  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit
    const result = await Contact.find({ owner }, "-createdAt -updatedAT", { skip, limit }).populate("owner", "email")
    res.status(200).json(result)
  }
  catch (error) {
    next(error)
  }

};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id: owner } = req.user
    const result = await Contact.findById({ _id: id, owner })
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
    const { _id: owner } = req.user
    const result = await Contact.create({ ...req.body, owner })
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
    const { _id: owner } = req.user
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, { new: true })
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
    const { _id: owner } = req.user
    const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, { new: true })
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
    const { _id: owner } = req.user
    const result = await Contact.findOneAndDelete({ _id: id, owner })
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

