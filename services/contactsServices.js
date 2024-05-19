import fs from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"

const contactsPath = path.resolve("db", "./contacts.json")

async function getAllContacts() {
  const result = await fs.readFile(contactsPath, "utf-8")
  return JSON.parse(result);
}

async function getOneContact(contactId) {
  const contacts = await getAllContacts();
  const result = contacts.find(contact => contact.id === contactId)
  return result || null;
}

async function deleteContact(contactId) {
  const contacts = await getAllContacts()
  const index = contacts.findIndex(contact => contact.id === contactId)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result;
}

async function createContact(id, name, email, phone) {
  const newUser = {
    id: nanoid(),
    name,
    email,
    phone
  }
  const contacts = await getAllContacts();
  contacts.push(newUser)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newUser;
}

export default {
    getAllContacts,
    getOneContact,
    createContact,
    deleteContact
  };
  