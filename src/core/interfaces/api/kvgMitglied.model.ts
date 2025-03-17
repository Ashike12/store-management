export interface Tarif {
  tarifRef: string; // Tariff Reference
  unfalleinschluss: boolean; // Accident Coverage Included
  tarifGeschaeftsjahr: number; // Tariff Business Year
  regionKey: string; // Region Key
  altersklasseKey: string; // Age Class Key
  tarif: string; // Tariff Name
  franchisestufeKey: string; // Franchise Level Key
  franchiseKey: string; // Franchise Key
  praemieKrankheit: string; // Premium for Illness
  praemieUnfall: string; // Premium for Accident
  praemieTotal: string; // Total Premium
  umweltabgabe: string; // Environmental Fee
  basisPraemie: boolean; // Basic Premium
  basisFranchise: boolean; // Basic Franchise
  altersuntergruppeKey: string; // Age Subgroup Key
  tariftypKey: string; // Tariff Type Key
  tarifbezeichnung: string; // Tariff Description
}

export interface Adresse {
  strasse: string; // Street
  plz: string; // Postal Code
  ort: string; // City
  land: string; // Country
  hausnummer: string; // House Number
  gebaeudeAdresseId: number; // Building Address ID
  strasseId: number; // Street ID
  gebaeudeId: number; // Building ID
  gebaeudeEingangId: number; // Building Entrance ID
  bfsNr: number; // BFS Number
  kantonKey: string; // Canton Key
}

export interface Versicherter {
  partnerVersicherterRef: string; // Insured Partner Reference
  ahvNummer: string; // AHV Number (Social Security Number)
  name: string; // Last Name
  zugriffsschutzKey: string; // Access Protection Key
  vorname: string; // First Name
  geburtsdatum: string; // Date of Birth
  lebensstatusKey: string; // Life Status Key
  adresse: Adresse; // Address
}

export interface Gueltigkeit {
  gueltigAb: string; // Valid From
  ungueltigAb: string; // Invalid From
}

export interface IKVGMitgliedResponse {
  id: string; // Unique ID
  eintrittInKasse: string; // Entry into Fund
  mitgliedsnummer: string; // Membership Number
  mitgliedsstatusKey: string; // Membership Status Key
  eintrittsgrundKey: string; // Entry Reason Key
  avbRef: string; // AVB Reference
  partnerVersicherungsnehmerRef: string; // Policyholder Partner Reference
  zahlungsinfoPraemieRef: string; // Payment Info Premium Reference
  zahlungsrhythmusKey: string; // Payment Frequency Key
  zahlungsinfoLeistungForderungRef: string; // Payment Info Service Claim Reference
  zahlungsinfoLeistungAuszahlungRef: string; // Payment Info Service Payout Reference
  vertriebsmitarbeiterRef: string; // Sales Representative Reference
  abschlusskanalKey: string; // Sales Channel Key
  tarif: Tarif; // Tariff Details
  versicherter: Versicherter; // Insured Person Details
  gueltigkeit: Gueltigkeit; // Validity Period
  ereignisRef: string; // Event Reference
  vorversicherer: number; // Previous Insurer
  lerbHausarztRef: string; // General Practitioner Reference
}
