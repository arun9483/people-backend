import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Route,
  Body,
  Path,
  Example,
  SuccessResponse,
  Response,
  Res,
  TsoaResponse,
} from 'tsoa';

import { Person, Title } from '../models';

import { faker } from '@faker-js/faker';

import { people } from './../data-storage';

@Route('people')
export class PersonController extends Controller {
  constructor() {
    super();
  }

  @Example<Person[]>([
    {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: Title.Mr,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      countryCode: 'US',
    },
    {
      id: '123e4567-e89b-12d3-a456-426614174001',
      title: Title.Ms,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      countryCode: 'IN',
    },
  ])
  @Get()
  public async getPeople(): Promise<Person[]> {
    return people;
  }

  @Example<Person>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: Title.Mr,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    countryCode: 'US',
  })
  @Response<Error>(404, 'Person not found')
  @Get('{id}')
  public async getPerson(
    @Path() id: string,
    @Res() notFound: TsoaResponse<404, { message: string }>
  ): Promise<Person> {
    const person = people.find((p) => p.id === id);
    if (!person) return notFound(404, { message: 'Person not found' });
    return person;
  }

  @Example<Person>({
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: Title.Mr,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    countryCode: 'US',
  })
  @SuccessResponse('201', 'Created') // Custom success response
  @Post()
  public async createPerson(@Body() body: Omit<Person, 'id'>): Promise<Person> {
    const newPerson: Person = {
      id: faker.string.uuid(),
      ...body,
    };
    people.push(newPerson);
    return newPerson;
  }

  @Example<Omit<Person, 'id'>>({
    title: Title.Ms,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    countryCode: 'US',
  })
  @Response<Error>(404, 'Person not found')
  @Put('{id}')
  public async updatePerson(
    @Path() id: string,
    @Body() body: Omit<Person, 'id'>,
    @Res() notFound: TsoaResponse<404, { message: string }>
  ): Promise<Person> {
    const personIndex = people.findIndex((p) => p.id === id);
    if (personIndex === -1)
      return notFound(404, { message: 'Person not found' });
    const updatedPerson = { id, ...body };
    people[personIndex] = updatedPerson;
    return updatedPerson;
  }

  @Response<Error>(404, 'Person not found')
  @Delete('{id}')
  public async deletePerson(
    @Path() id: string,
    @Res() notFound: TsoaResponse<404, { message: string }>
  ): Promise<void> {
    const personIndex = people.findIndex((p) => p.id === id);
    if (personIndex === -1)
      return notFound(404, { message: 'Person not found' });
    people.splice(personIndex, 1);
  }
}
