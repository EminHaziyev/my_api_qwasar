import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/users.json"), "utf-8"));
const animals = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/animals.json"), "utf-8"));

let usersData = [...users];
let animalsData = [...animals];

const resolvers = {
  users: () => usersData,
  user: ({ id }) => usersData.find((u) => u.id === id),

  animals: () => animalsData,
  animal: ({ id }) => animalsData.find((a) => a.id === id),

  addUser: ({ name, email }) => {
    const newUser = { id: String(usersData.length + 1), name, email };
    usersData.push(newUser);
    return newUser;
  },

  addAnimal: ({ name, species }) => {
    const newAnimal = { id: String(animalsData.length + 1), name, species };
    animalsData.push(newAnimal);
    return newAnimal;
  }
};

export default resolvers;

