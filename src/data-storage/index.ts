import { faker } from '@faker-js/faker';

import { Person, Title } from '../models';

const PEOPLE_COUNT = +(process.env.PEOPLE_COUNT ?? 5);

const people: Person[] = [];

for (let i = 0; i < PEOPLE_COUNT; i++) {
  people.push({
    id: faker.string.uuid(),
    title: faker.person.prefix() as Title,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    countryCode: faker.location.countryCode('alpha-2'),
  });
}

export { people };
