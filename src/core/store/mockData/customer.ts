import {ICustomer} from '@core/interfaces/api/customer.model';

export const CUSTOMERS_DATA: ICustomer[] = [
  {
    id: '123456',
    gueltigkeit: {
      gueltigAb: '2024-01-01',
      ungueltigAb: '9999-12-31',
    },
    name: 'Muster',
    vorname: 'Peter',
    titel: 'Dr.',
    geschlechtKey: 'partner.partner.geschlecht.maennlich',
    geburtsjahr: 1990,
    geburtsdatum: '1990-07-15',
    todesdatum: '2025-02-24',
    lebensstatusKey: 'partner.partner.lebensstatus.lebend',
    sprache: 'de',
    korrespondenzSprache: 'de',
    zivilstandKey: 'partner.partner.zivilstand.verheiratet',
    ahvNummer: '756.1234.5678.90',
    nationalitaet: 'CH',
    aufenthaltsbewilligungKey: 'partner.partner.aufenthaltsbewilligung.c',
    zemisNummer: 'ABC.123.XYZ-9',
    aufenthaltBis: '2030-12-31',
    zugriffsschutzKey: 'partner.partner.zugriffsschutz.partner',
  },
  {
    id: '789101',
    gueltigkeit: {
      gueltigAb: '2024-01-01',
      ungueltigAb: '9999-12-31',
    },
    name: 'Schmidt',
    vorname: 'Anna',
    titel: 'Prof.',
    geschlechtKey: 'partner.partner.geschlecht.weiblich',
    geburtsjahr: 1985,
    geburtsdatum: '1985-05-20',
    todesdatum: '2025-02-24',
    lebensstatusKey: 'partner.partner.lebensstatus.lebend',
    sprache: 'fr',
    korrespondenzSprache: 'fr',
    zivilstandKey: 'partner.partner.zivilstand.geschieden',
    ahvNummer: '756.9876.5432.10',
    nationalitaet: 'FR',
    aufenthaltsbewilligungKey: 'partner.partner.aufenthaltsbewilligung.b',
    zemisNummer: 'XYZ.456.ABC-8',
    aufenthaltBis: '2035-06-15',
    zugriffsschutzKey: 'partner.partner.zugriffsschutz.partner',
  },
];

export const SINGLE_CUSTOMER_DATA = CUSTOMERS_DATA[0];
