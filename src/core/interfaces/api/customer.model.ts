export interface ICustomerResponse {
  id: string;
  partnerNummer: string;
  ereignisRef: string;
  name: string;
  gueltigkeit: IValidity;
  vorname: string;
  titel: string;
  geschlechtKey: string;
  geburtsjahr: number;
  geburtsdatum: string;
  lebensstatusKey: string;
  sprache: string;
  korrespondenzSprache: string;
  zivilstandKey: string;
  ahvNummer: string;
  nationalitaet: string;
  zugriffsschutzKey: string;
}

export interface ICustomer extends ICustomerResponse {
  fullName?: string;
}
export interface IValidity {
  gueltigAb: string;
  ungueltigAb: string;
}
