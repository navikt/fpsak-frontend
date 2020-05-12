import React, { FunctionComponent } from 'react';
import { FormattedMessage, injectIntl, WrappedComponentProps } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';

import {
  KodeverkMedNavn, Vilkar, Behandlingsresultat, Kodeverk,
} from '@fpsak-frontend/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { hasIkkeOppfyltSoknadsfristvilkar } from '../felles/VedtakHelper';
import VedtakFritekstPanel from '../felles/VedtakFritekstPanel';

export const getAvslagArsak = (vilkar, behandlingsresultat, getKodeverknavn) => {
  const avslatteVilkar = vilkar.filter((v) => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${getKodeverknavn(avslatteVilkar[0].vilkarType)}: ${getKodeverknavn(behandlingsresultat.avslagsarsak, avslatteVilkar[0].vilkarType.kode)}`;
};

interface OwnProps {
  behandlingStatusKode: string;
  vilkar: Vilkar[];
  behandlingsresultat: Behandlingsresultat;
  sprakkode: Kodeverk;
  readOnly: boolean;
  ytelseTypeKode: string;
  alleKodeverk: {[key: string]: KodeverkMedNavn[]};
  beregningErManueltFastsatt: boolean;
  skalBrukeOverstyrendeFritekstBrev: boolean;
}

const VedtakAvslagPanel: FunctionComponent<OwnProps & WrappedComponentProps> = ({
  intl,
  behandlingStatusKode,
  vilkar,
  behandlingsresultat,
  sprakkode,
  readOnly,
  ytelseTypeKode,
  alleKodeverk,
  beregningErManueltFastsatt,
  skalBrukeOverstyrendeFritekstBrev,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  const fritekstfeltForSoknadsfrist = behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES
    && hasIkkeOppfyltSoknadsfristvilkar(vilkar) && ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD;
  const textCode = beregningErManueltFastsatt ? 'VedtakForm.Fritekst.Beregningsgrunnlag' : 'VedtakForm.Fritekst';
  return (
    <>
      {getAvslagArsak(vilkar, behandlingsresultat, getKodeverknavn) && (
        <div>
          <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
          <Normaltekst>
            {getAvslagArsak(vilkar, behandlingsresultat, getKodeverknavn)}
          </Normaltekst>
          <VerticalSpacer sixteenPx />
        </div>
      )}
      {(!skalBrukeOverstyrendeFritekstBrev
        && (fritekstfeltForSoknadsfrist || behandlingsresultat.avslagsarsakFritekst || beregningErManueltFastsatt)) && (
        <VedtakFritekstPanel
          readOnly={readOnly}
          sprakkode={sprakkode}
          behandlingsresultat={behandlingsresultat}
          labelTextCode={textCode}
        />
      )}
    </>
  );
};

export default injectIntl(VedtakAvslagPanel);
