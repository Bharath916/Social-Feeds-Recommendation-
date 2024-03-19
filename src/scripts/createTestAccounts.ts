import bcrypt from "bcrypt";
import * as DynamicModels from "../models/dynamicModels";
import { config } from "../config/config";

const Config = new config();

export const createTestAccounts = async () => {
  const users = [
    {
      firstName: "Amy",
      lastName: "Johnson",
      email: "test-amy@gmail.com",
      phone: 312223445,
    },
    {
      firstName: "Randall",
      lastName: "Stewart",
      email: "test-randall@gmail.com",
      phone: 312899554,
    },
    {
      firstName: "Marge",
      lastName: "Reynolds",
      email: "test-marge@gmail.com",
      phone: 312867530,
    },
    {
      firstName: "Jackie",
      lastName: "Rogue",
      email: "test-jackie@gmail.com",
      phone: 847998342,
    },
    {
      firstName: "Aaron",
      lastName: "James",
      email: "test-aaron@gmail.com",
      phone: 847998342,
    },
    {
      firstName: "Tom",
      lastName: "Wright",
      email: "test-tom@gmail.com",
      phone: 888346890,
    },
    {
      firstName: "Tina",
      lastName: "Anderson",
      email: "test-tina@gmail.com",
      phone: 312677435,
    },
    {
      firstName: "Scotty",
      lastName: "Maxwell",
      email: "test-scotty@gmail.com",
      phone: 312333224,
    },
    {
      firstName: "Eden",
      lastName: "James",
      email: "test-eden@gmail.com",
      phone: 313877667,
    },
    {
      firstName: "Denise",
      lastName: "Foles",
      email: "test-denise@gmail.com",
      phone: 312762189,
    },
    {
      firstName: "Howard",
      lastName: "Johnson",
      email: "test-howard@gmail.com",
      phone: 954123456,
    },
    {
      firstName: "Sandy",
      lastName: "Bell",
      email: "test-sandy@gmail.com",
      phone: 336845007,
    },
    {
      firstName: "Leah",
      lastName: "Peterson",
      email: "test-leah@gmail.com",
      phone: 312455046,
    },
    {
      firstName: "Burt",
      lastName: "White",
      email: "test-burt@gmail.com",
      phone: 323664589,
    },
  ];
  const passwords = users.map((user) => {
    const firstNameFirstLetter = user.firstName.charAt(0).toUpperCase();
    const lastNameFirstLetter = user.lastName.charAt(0).toUpperCase();
    return `${firstNameFirstLetter}${lastNameFirstLetter}Task!515`;
  });
  const saltRounds = 12;
  const now = new Date();
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const password = passwords[i];
    let hash: any = await bcrypt.hash(password, saltRounds);
    let insertData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: hash,
      phone: user.phone,
      createdAt: now,
    };
    await DynamicModels.add(Config.availableCollection.userAccount, insertData);
  }
};
