import express, { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: '.env.local' });

const port = process.env.PORT || 3000;
const PEOPLE_COUNT = +(process.env.PEOPLE_COUNT ?? 5);

const app = express();

app.use(express.json());

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  prefix: string;
  countryCode: string;
}

let people: Person[] = [];

// Generate initial data
for (let i = 0; i < PEOPLE_COUNT; i++) {
  people.push({
    id: faker.string.uuid(),
    prefix: faker.person.prefix(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    countryCode: faker.location.countryCode('alpha-2'),
  });
}

// CRUD Operations

// Create a new person
app.post('/people', (req: Request, res: Response) => {
  const newPerson: Person = {
    id: faker.string.uuid(),
    prefix: req.body.prefix,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    countryCode: req.body.countryCode,
  };
  people.push(newPerson);
  res.status(201).json(newPerson);
});

// Read all people
app.get('/people', (req: Request, res: Response) => {
  res.json(people);
});

// Read a single person by ID
app.get('/people/:id', (req: Request, res: Response) => {
  const person = people.find((p) => p.id === req.params.id);
  if (!person) {
    return res.status(404).json({ message: 'Person not found' });
  }
  res.json(person);
});

// Update a person by ID
app.put('/people/:id', (req: Request, res: Response) => {
  const personIndex = people.findIndex((p) => p.id === req.params.id);
  if (personIndex === -1) {
    return res.status(404).json({ message: 'Person not found' });
  }
  const updatedPerson: Person = {
    id: req.params.id,
    prefix: req.body.prefix,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    countryCode: req.body.countryCode,
  };
  people[personIndex] = updatedPerson;
  res.json(updatedPerson);
});

// Delete a person by ID
app.delete('/people/:id', (req: Request, res: Response) => {
  const personIndex = people.findIndex((p) => p.id === req.params.id);
  if (personIndex === -1) {
    return res.status(404).json({ message: 'Person not found' });
  }
  people.splice(personIndex, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
