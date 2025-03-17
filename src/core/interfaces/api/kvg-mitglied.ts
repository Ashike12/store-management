export interface Gueltigkeit {
  gueltigAb: string; // validFrom
  ungueltigAb: string; // invalidFrom
}

export interface KvgMitgliedAPI {
  id: string;
  gueltigkeit: Gueltigkeit; // validity
  ereignisId: string; // event id
  mitgliedsnummer: string; // membership number
  eintrittInKasse: string; // entryKey
  eintrittsgrundKey: string; // entryReasonKey
  tarifGeschaeftsjahr: number; // tariffBusinessYear
  regionKey: string; // regionKey
  altersklasseKey: string; // ageGroupKey
  altersuntergruppeKey: string; // ageSubgroupKey
  unfalleinschluss: boolean; // accidentInclusion
  tarifTypKey: string; // tariffTypeKey
  tarif: number; // tariff
  franchisestufeKey: string; // franchiseLevelKey
  franchiseKey: string; // franchiseKey
  avbRef: string; // avbRef
  tarifRef: string; // tariffRef
  partnerVersicherterRef: string; // partnerInsuredRef
  partnerVersicherungsnehmerRef: string; // partnerPolicyholderRef
  zahlungsInfoPraemieRef: string; // paymentInfoPremiumRef
  zahlungsrhytmusKey: string; // paymentCycleKey
  zahlungsInfoLeistungForderungRef: string; // paymentInfoPerformanceClaimRef
  zahlungsInfoLeistungAuszahlungRef: string; // paymentInfoPerformancePayoutRef
  vertriebsmitarbeiterRef: string; // salesEmployeeRef
  abschlussKanalKey: string; // completionChannelKey
  basisPraemie: boolean; // basisPremium
  basisFranchise: boolean; // basisFranchise
  praemieTotal: string; // premiumTotal
  praemieKrankheit: string; // premiumIllness
  praemieUnfall: string; // premiumAccident
  umweltabgabe: string; // environmentalTax
  ahvNummer: string; // ahvNumber
  name: string; // name
  vorname: string; // firstName
  zugriffsschutzKey: string; // accessProtectionKey
  geburtsdatum: string; // dateOfBirth
  lebensStatusKey: string; // lifeStatusKey
  strasse: string; // street
  hausNummer: number; // houseNumber
  plz: string; // zip
  ort: string; // city
  land: string; // country
  bfsNr: number; // bfsNr
  gemeindeName: string; // municipalityName
  kantonKey: string; // cantonKey
}
