import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import {
  KodeverkMedNavn, Vilkar, Kodeverk, Behandlingsresultat,
} from '@fpsak-frontend/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  decodeHtmlEntity, getLanguageCodeFromSprakkode, hasValidText, maxLength, minLength, requiredIfNotPristine, getKodeverknavnFn,
} from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import { hasIkkeOppfyltSoknadsfristvilkar } from '../felles/VedtakHelper';

import styles from './vedtakAvslagArsakOgBegrunnelsePanel.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

export const getAvslagArsak = (vilkar, behandlingsresultat, getKodeverknavn) => {
  const avslatteVilkar = vilkar.filter((v) => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${getKodeverknavn(avslatteVilkar[0].vilkarType)}: ${getKodeverknavn(behandlingsresultat.avslagsarsak, avslatteVilkar[0].vilkarType.kode)}`;
};

interface OwnProps {
  behandlingStatusKode: string;
  vilkar?: Vilkar[];
  behandlingsresultat: Behandlingsresultat;
  sprakkode: Kodeverk;
  readOnly: boolean;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  skalBrukeOverstyrendeFritekstBrev: boolean;
}

const VedtakAvslagArsakOgBegrunnelsePanel: FunctionComponent<OwnProps> = ({
  behandlingStatusKode,
  vilkar,
  behandlingsresultat,
  sprakkode,
  readOnly,
  alleKodeverk,
  skalBrukeOverstyrendeFritekstBrev,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      {getAvslagArsak(vilkar, behandlingsresultat, getKodeverknavn) && (
        <>
          <Undertekst><FormattedMessage id="VedtakForm.ArsakTilAvslag" /></Undertekst>
          <Normaltekst>
            {getAvslagArsak(vilkar, behandlingsresultat, getKodeverknavn)}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
        </>
      )}
      {!skalBrukeOverstyrendeFritekstBrev
          && behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES && hasIkkeOppfyltSoknadsfristvilkar(vilkar) && (
          <Row>
            <VerticalSpacer sixteenPx />
            <Column xs="7">
              <TextAreaField
                name="begrunnelse"
                label={<FormattedMessage id="VedtakForm.Fritekst" />}
                validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
                maxLength={1500}
                readOnly={readOnly}
                badges={[{
                  type: 'fokus',
                  textId: getLanguageCodeFromSprakkode(sprakkode),
                  title: 'Malform.Beskrivelse',
                }]}
              />
            </Column>
          </Row>
      )}
      {readOnly && behandlingsresultat.avslagsarsakFritekst && (
        <span>
          <VerticalSpacer twentyPx />
          <Undertekst><FormattedMessage id="VedtakForm.Fritekst" /></Undertekst>
          <VerticalSpacer eightPx />
          <div className={styles.fritekstItem}>{decodeHtmlEntity(behandlingsresultat.avslagsarsakFritekst)}</div>
        </span>
      )}
    </>
  );
};

export default VedtakAvslagArsakOgBegrunnelsePanel;
