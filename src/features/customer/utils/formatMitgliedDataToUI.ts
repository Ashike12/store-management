import {IKVGMitgliedResponse} from '@core/interfaces/api/kvgMitglied.model';
import {IkvgMitgliedUIData} from '../interfaces/kvgMitgliedUIData';

export default function formatMitgliedDataToUI(
  data: IKVGMitgliedResponse,
): IkvgMitgliedUIData {
  return {
    ...data,
    tarif_franchiseKey: data.tarif.franchiseKey,
    tarif_regionKey: data.tarif.regionKey,
    tarif_unfalleinschluss: data.tarif.unfalleinschluss ? 'Ja' : 'Nein',
    tarif_praemieTotal: Number(data.tarif.praemieTotal),
    tarif_tarifbezeichnung: data.tarif.tarifbezeichnung,
    tarif_praemieKrankheit_praemieUnfall:
      Number(data.tarif.praemieKrankheit) + Number(data.tarif.praemieUnfall),
    tarif_umweltabgabe: data.tarif.umweltabgabe,
    versicherter_plz_ort_gemeindeName:
      data.versicherter.adresse.plz +
      ' ' +
      data.versicherter.adresse.ort,
  };
}
