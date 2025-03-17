import {IGetPartnerSearchResultData} from '@features/partnerSearch/interfaces/partner-search-result.interface';

export const PARTNER_SEARCH_RESULT_DATA: IGetPartnerSearchResultData = {
  data: [
    {
      id: 'a96d72cd-f2f8-11ef-a19f-52aa20e80cb1', // changed so that the customer can be pinned and routed properly
      gueltigkeit: {
        gueltigAb: '2025-01-01',
        ungueltigAb: '2025-12-31',
      },
      name: 'Habegger',
      vorname: 'Lukas',
      geburtsdatum: '24.01.1992',
      ahvNummer: '756.2362.9501.17',
      kvgMitglied: {
        mitgliedsnummer: 'M-2961',
        mitgliedId: '72299a99-ed2b-11ef-aacc-a67dbe3df937',
      },
      domizilAdresse: {
        strasse: 'Seestrasse',
        hausnummer: '100',
        plz: '8002',
        ort: 'Zürich',
        gemeindeName: 'Zürich',
      },
    },
    {
      id: 'b9369ef1-ea54-11ef-b93c-163161a104ce',
      gueltigkeit: {
        gueltigAb: '2025-01-01',
        ungueltigAb: '2025-12-31',
      },
      name: 'Petersmann',
      vorname: 'Lukás',
      geburtsdatum: '1985-08-11',
      ahvNummer: '756.9043.5365.78',
      kvgMitglied: {
        mitgliedsnummer: 'M-2501',
        mitgliedId: '7228e37c-ed2b-11ef-aacc-a67dbe3df937',
      },
      domizilAdresse: {
        strasse: 'Im Grossäcker',
        hausnummer: '14',
        plz: '8309',
        ort: 'Nürensdorf',
        gemeindeName: 'Nürensdorf',
      },
    },
    {
      id: 'b9a233b2-ea54-11ef-b93c-163161a104ce',
      gueltigkeit: {
        gueltigAb: '2025-01-01',
        ungueltigAb: '2025-12-31',
      },
      name: 'Graf',
      vorname: 'Lukas',
      geburtsdatum: '2024-02-24',
      ahvNummer: '756.4220.3671.29',
      kvgMitglied: {
        mitgliedsnummer: 'M-2565',
        mitgliedId: '7228f72d-ed2b-11ef-aacc-a67dbe3df937',
      },
      domizilAdresse: {
        strasse: 'Lettenstrasse',
        hausnummer: '26',
        plz: '8037',
        ort: 'Zürich',
        gemeindeName: 'Zürich',
      },
    },
    {
      id: 'bc93fd23-ea54-11ef-b93c-163161a104ce',
      gueltigkeit: {
        gueltigAb: '2025-01-01',
        ungueltigAb: '2025-12-31',
      },
      name: 'Graf',
      vorname: 'Lukas',
      geburtsdatum: '2009-07-18',
      ahvNummer: '756.2619.1815.61',
      kvgMitglied: {
        mitgliedsnummer: 'M-3015',
        mitgliedId: '7229af70-ed2b-11ef-aacc-a67dbe3df937',
      },
      domizilAdresse: {
        strasse: 'Badenerstrasse',
        hausnummer: '125',
        plz: '8004',
        ort: 'Zürich',
        gemeindeName: 'Zürich',
      },
    },
  ],
  metadata: {
    nextCursor:
      'WyI4LjE0NzE4NiIsImJjOTNmZDIzLWVhNTQtMTFlZi1iOTNjLTE2MzE2MWExMDRjZSJd',
    pageSize: 4,
    totalHits: 4,
  },
};
