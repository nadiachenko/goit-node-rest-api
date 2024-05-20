import fs from "fs/promises"
import path from "path"
import { nanoid } from "nanoid"

const contactsPath = path.resolve("db", "./contacts.json")

export async function getAllContacts() {
  const result = await fs.readFile(contactsPath, "utf-8")
  return JSON.parse(result);
}

export async function getOneContact(contactId) {
  const contacts = await getAllContacts();
  const result = contacts.find(contact => contact.id === contactId)
  return result || null;
}

export async function deleteContact(contactId) {
  const contacts = await getAllContacts()
  const index = contacts.findIndex(contact => contact.id === contactId)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return result;
}

export async function updateContact(contactId, data) {
  const contacts = await getAllContacts()
  const index = contacts.findIndex(contact => contact.id === contactId)
  if (index === -1) {
    return null
  }
  contacts[index] = { ...contacts[index], ...data }
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return contacts[index];
}

export const createContact = async ({ id, name, email, phone }) => {
  const contacts = await getAllContacts();
  const newUser = {
    id: nanoid(),
    name,
    email,
    phone
  }

  contacts.push(newUser)
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))
  return newUser;
}

