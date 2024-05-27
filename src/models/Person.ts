import { Title } from './TitleEnum';

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title: Title;
  countryCode: string;
}
