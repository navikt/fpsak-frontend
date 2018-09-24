import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import {
  getBehandlingResultatstruktur, getBehandlingStatus,
  isBehandlingStatusReadOnly, getBehandlingsresultat, getBehandlingArsakTyper,
} from 'behandling/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector } from 'behandling/behandlingForm';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import { isInnvilget, isAvslag, isOpphor } from 'kodeverk/behandlingResultatType';
import behandlingStatusCode from 'kodeverk/behandlingStatus';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import behandlingArsakType from 'kodeverk/behandlingArsakType';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakRevurderingSubmitPanel from './VedtakRevurderingSubmitPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';


export const VEDTAK_REVURDERING_FORM_NAME = 'VEDTAK_REVURDERING_FORM';

/**
 * VedtakRevurderingForm
 *
 * Redux-form-komponent for revurdering-vedtak.
 */
export const VedtakRevurderingFormImpl = ({
  readOnly,
  behandlingStatusKode,
  behandlingsresultat,
  aksjonspunkter,
  previewVedtakCallback,
  begrunnelse,
  aksjonspunktKoder,
  antallBarn,
  isBehandlingReadOnly,
  ytelseType,
  revurderingsAarsakString,
  ...formProps
}) => (
  <VedtakAksjonspunktPanel
    behandlingStatusKode={behandlingStatusKode}
    aksjonspunktKoder={aksjonspunktKoder}
    readOnly={readOnly}
    isBehandlingReadOnly={isBehandlingReadOnly}
  >
    <VerticalSpacer eightPx />
    <ElementWrapper>
      {isInnvilget(behandlingsresultat.type.kode)
        && (
        <VedtakInnvilgetRevurderingPanel
          antallBarn={antallBarn}
          ytelseType={ytelseType}
          aksjonspunktKoder={aksjonspunktKoder}
          revurderingsAarsakString={revurderingsAarsakString}
          behandlingsresultat={behandlingsresultat}
          readOnly={readOnly}
        />
        )
        }
      { isAvslag(behandlingsresultat.type.kode)
        && (
        <VedtakAvslagRevurderingPanel
          behandlingStatusKode={behandlingStatusKode}
          aksjonspunkter={aksjonspunkter}
          behandlingsresultat={behandlingsresultat}
          readOnly={readOnly}
          ytelseType={ytelseType}
        />
        )
        }
      {isOpphor(behandlingsresultat.type.kode)
      && (
      <VedtakOpphorRevurderingPanel
        aksjonspunkter={aksjonspunkter}
        revurderingsAarsakString={revurderingsAarsakString}
        ytelseType={ytelseType}
        readOnly={readOnly}
      />
      )
      }
      {behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES
        && (
        <VedtakRevurderingSubmitPanel
          begrunnelse={begrunnelse}
          previewVedtakCallback={previewVedtakCallback}
          formProps={formProps}
          readOnly={readOnly}
          ytelseType={ytelseType}
        />
        )
        }
    </ElementWrapper>
  </VedtakAksjonspunktPanel>
);

VedtakRevurderingFormImpl.propTypes = {
  begrunnelse: PropTypes.string,
  previewVedtakCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseType: PropTypes.string.isRequired,
  revurderingsAarsakString: PropTypes.string,
  ...formPropTypes,
};

VedtakRevurderingFormImpl.defaultProps = {
  begrunnelse: undefined,
  antallBarn: undefined,
  revurderingsAarsakString: undefined,
};

const buildInitialValues = createSelector(
  [getBehandlingResultatstruktur, getBehandlingStatus, getSelectedBehandlingspunktAksjonspunkter, getFagsakYtelseType],
  (beregningResultat, behandlingstatus, aksjonspunkter, ytelseType) => {
    const aksjonspunktKoder = aksjonspunkter
      .filter(ap => ap.erAktivt)
      .map(ap => ap.definisjon.kode);

    if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
      if (beregningResultat) {
        return {
          antallBarn: beregningResultat.antallBarn,
          aksjonspunktKoder,
        };
      } if (behandlingstatus.kode !== behandlingStatusCode.AVSLUTTET) {
        return {
          antallBarn: null,
          aksjonspunktKoder,
        };
      }
      return { antallBarn: null };
    }
    return {
      aksjonspunktKoder,
    };
  },
);

const transformValues = values => values.aksjonspunktKoder.map(apCode => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
}));

const createAarsakString = (revurderingAarsaker) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return '';
  }
  const aarsakTekstList = [];
  const endringFraBrukerAarsak = revurderingAarsaker
    .find(aarsak => aarsak.kode === behandlingArsakType.RE_ENDRING_FRA_BRUKER);
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter(aarsak => aarsak.kode !== behandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map(aarsak => aarsak.navn);
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak !== undefined) {
    aarsakTekstList.push(endringFraBrukerAarsak.navn);
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
};

const mapStateToProps = (state, ownProps) => ({
  initialValues: buildInitialValues(state),
  isBehandlingReadOnly: isBehandlingStatusReadOnly(state),
  onSubmit: values => ownProps.submitCallback(transformValues(values)),
  ...behandlingFormValueSelector(VEDTAK_REVURDERING_FORM_NAME)(
    state,
    'antallBarn',
    'begrunnelse',
    'aksjonspunktKoder',
  ),
  behandlingStatusKode: getBehandlingStatus(state).kode,
  behandlingsresultat: getBehandlingsresultat(state),
  aksjonspunkter: getSelectedBehandlingspunktAksjonspunkter(state),
  ytelseType: getFagsakYtelseType(state).kode,
  aksjonspunktKoder: getSelectedBehandlingspunktAksjonspunkter(state).map(ap => ap.definisjon.kode),
  revurderingsAarsakString: createAarsakString(getBehandlingArsakTyper(state)),
});

const VedtakRevurderingForm = connect(mapStateToProps)(behandlingForm({
  form: VEDTAK_REVURDERING_FORM_NAME,
})(VedtakRevurderingFormImpl));

export default VedtakRevurderingForm;
