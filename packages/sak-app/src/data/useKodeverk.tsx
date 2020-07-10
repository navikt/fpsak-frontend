import { KodeverkMedNavn, Kodeverk } from '@fpsak-frontend/types';
import { useGlobalStateRestApiData } from '@fpsak-frontend/rest-api-hooks';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { FpsakApiKeys } from './fpsakApiNyUtenRedux';

/**
 * Hook som henter et gitt kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useFpSakKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = useGlobalStateRestApiData<{[key: string]: T[]}>(FpsakApiKeys.KODEVERK);
  return alleKodeverk[kodeverkType];
}

/**
 * Hook som henter et gitt kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useFpTilbakeKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = useGlobalStateRestApiData<{[key: string]: T[]}>(FpsakApiKeys.KODEVERK_FPTILBAKE);
  return alleKodeverk[kodeverkType];
}

export function useFpSakKodeverkMedNavn<T = KodeverkMedNavn>(kodeverkOjekt: Kodeverk, undertype?: string): T {
  const kodeverkType = kodeverkTyper[kodeverkOjekt.kodeverk];
  let kodeverkForType = useFpSakKodeverk<T>(kodeverkType);

  if (!kodeverkForType || kodeverkForType.length === 0) {
    throw Error(`Det finnes ingen kodeverk for type ${kodeverkType} med kode ${kodeverkOjekt.kode}`);
  }

  if (undertype) {
    kodeverkForType = kodeverkForType[undertype];
  }

  const kodeverk = kodeverkForType.find((k) => k.kode === kodeverkOjekt.kode);
  return kodeverk;
}

export function useGetKodeverkFn() {
  const alleFpSakKodeverk = useGlobalStateRestApiData<{[key: string]: KodeverkMedNavn[]}>(FpsakApiKeys.KODEVERK);
  const alleFpTilbakeKodeverk = useGlobalStateRestApiData<{[key: string]: KodeverkMedNavn[]}>(FpsakApiKeys.KODEVERK_FPTILBAKE);

  return (kodeverkOjekt: Kodeverk, behandlingType: Kodeverk = { kode: BehandlingType.TILBAKEKREVING, kodeverk: 'DUMMY' }) => {
    const kodeverkType = kodeverkTyper[kodeverkOjekt.kodeverk];
    const kodeverkForType = behandlingType.kode === BehandlingType.TILBAKEKREVING ? alleFpTilbakeKodeverk[kodeverkType] : alleFpSakKodeverk[kodeverkType];
    if (!kodeverkForType || kodeverkForType.length === 0) {
      throw Error(`Det finnes ingen kodeverk for type ${kodeverkType} med kode ${kodeverkOjekt.kode}`);
    }
    const kodeverk = kodeverkForType.find((k) => k.kode === kodeverkOjekt.kode);
    return kodeverk;
  };
}
