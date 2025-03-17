import {IKVGMitgliedResponse} from '@core/interfaces/api/kvgMitglied.model';

export interface IkvgMitgliedUIData extends IKVGMitgliedResponse {
  tarif_franchiseKey: string;
  tarif_unfalleinschluss: string;
  tarif_praemieTotal: number;
  tarif_tarifbezeichnung: string;
  tarif_praemieKrankheit_praemieUnfall: number;
  tarif_umweltabgabe: string;
  tarif_regionKey: string;
  versicherter_plz_ort_gemeindeName: string;
}
