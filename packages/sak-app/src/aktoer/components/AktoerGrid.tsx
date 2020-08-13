import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Lenkepanel from 'nav-frontend-lenkepanel';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import VisittkortSakIndex from '@fpsak-frontend/sak-visittkort';
import {
  KodeverkMedNavn, Fagsak, FagsakPerson,
} from '@fpsak-frontend/types';
import relasjonsRolleType from '@fpsak-frontend/kodeverk/src/relasjonsRolleType';

import { FpsakApiKeys, useGlobalStateRestApiData } from '../../data/fpsakApi';
import { pathToFagsak } from '../../app/paths';

import styles from './aktoerGrid.less';

interface OwnProps {
  data: {
    fagsaker: Fagsak[];
    person: FagsakPerson;
  };
}

export const AktoerGrid: FunctionComponent<OwnProps> = ({
  data,
}) => {
  const alleKodeverk = useGlobalStateRestApiData<{[key: string]: [KodeverkMedNavn]}>(FpsakApiKeys.KODEVERK);
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const vFagsak = data.fagsaker.length > 0 ? data.fagsaker[0] : { relasjonsRolleType: { kode: relasjonsRolleType.MOR } };

  return (
    <>
      <VisittkortSakIndex
        alleKodeverk={alleKodeverk}
        fagsak={{
          ...vFagsak,
          person: data.person,
        } as Fagsak}
      />
      <div className={styles.list}>
        {data.fagsaker.length ? data.fagsaker.map((fagsak) => (
          <Lenkepanel
            linkCreator={(props) => (
              <Link to={pathToFagsak(fagsak.saksnummer)} className={props.className}>
                {props.children}
              </Link>
            )}
            key={fagsak.saksnummer}
            href="#"
            tittelProps="normaltekst"
          >
            {getKodeverknavn(fagsak.sakstype)}
            {` (${fagsak.saksnummer}) `}
            {getKodeverknavn(fagsak.status)}
          </Lenkepanel>
        )) : <FormattedMessage id="AktoerGrid.IngenFagsaker" />}
      </div>
    </>
  );
};

export default AktoerGrid;
