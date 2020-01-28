import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFields, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, getKodeverknavnFn,
} from '@fpsak-frontend/fp-felles';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import BehandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import vedtakBeregningsresultatPropType from '../../propTypes/vedtakBeregningsresultatPropType';
import FritekstBrevPanel from '../FritekstBrevPanel';
import VedtakOverstyrendeKnapp from '../VedtakOverstyrendeKnapp';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakRevurderingSubmitPanel from './VedtakRevurderingSubmitPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakFritekstbrevModal from '../svp/VedtakFritekstbrevModal';

export const VEDTAK_REVURDERING_FORM_NAME = 'VEDTAK_REVURDERING_FORM';

const isVedtakSubmission = true;

const getPreviewAutomatiskBrevCallback = (previewCallback, begrunnelse) => (e) => {
  const data = {
    fritekst: begrunnelse,
    gjelderVedtak: true,
    vedtaksbrev: {
      kode: 'AUTOMATISK',
    },
  };
  previewCallback(data);
  e.preventDefault();
};

/**
 * VedtakRevurderingForm
 *
 * Redux-form-komponent for revurdering-vedtak.
 */
export class VedtakRevurderingFormImpl extends Component {
  constructor(props) {
    super(props);
    this.onToggleOverstyring = this.onToggleOverstyring.bind(this);
    this.state = {
      skalBrukeOverstyrendeFritekstBrev: props.skalBrukeOverstyrendeFritekstBrev,
    };
  }

  onToggleOverstyring() {
    const { behandlingFormPrefix, clearFields: clearFormFields } = this.props;
    const { skalBrukeOverstyrendeFritekstBrev } = this.state;
    this.setState({
      skalBrukeOverstyrendeFritekstBrev: !skalBrukeOverstyrendeFritekstBrev,
    });
    const fields = ['begrunnelse', 'overskrift', 'brødtekst'];
    clearFormFields(`${behandlingFormPrefix}.VedtakForm`, false, false, ...fields);
  }

  render() {
    const {
      intl,
      readOnly,
      behandlingStatusKode,
      behandlingresultat,
      aksjonspunkter,
      previewCallback,
      begrunnelse,
      aksjonspunktKoder,
      antallBarn,
      ytelseTypeKode,
      revurderingsAarsakString,
      kanOverstyre,
      sprakkode,
      skalBrukeOverstyrendeFritekstBrev,
      brødtekst,
      overskrift,
      initialValues,
      erBehandlingHenlagt,
      resultatstruktur,
      alleKodeverk,
      tilbakekrevingvalg,
      simuleringResultat,
      vilkar,
      sendVarselOmRevurdering,
      resultatstrukturOriginalBehandling,
      behandlingArsaker,
      medlemskapFom,
      ...formProps
    } = this.props;
    const previewAutomatiskBrev = getPreviewAutomatiskBrevCallback(previewCallback, begrunnelse);
    const visOverstyringKnapp = kanOverstyre || readOnly;
    return (
      <>
        <VedtakFritekstbrevModal
          readOnly={readOnly}
          behandlingsresultat={behandlingresultat}
          erSVP={ytelseTypeKode === fagsakYtelseType.SVANGERSKAPSPENGER}
        />
        <VedtakAksjonspunktPanel
          behandlingStatusKode={behandlingStatusKode}
          aksjonspunktKoder={aksjonspunktKoder}
          readOnly={readOnly}
          erBehandlingHenlagt={erBehandlingHenlagt}
        >
          <VerticalSpacer eightPx />
          <>
            {visOverstyringKnapp && (
              <VedtakOverstyrendeKnapp
                toggleCallback={this.onToggleOverstyring}
                readOnly={readOnly || (initialValues.skalBrukeOverstyrendeFritekstBrev === true)}
                keyName="skalBrukeOverstyrendeFritekstBrev"
                readOnlyHideEmpty={false}
              />
            )}

            {isInnvilget(behandlingresultat.type.kode) && (
              <VedtakInnvilgetRevurderingPanel
                antallBarn={antallBarn}
                ytelseTypeKode={ytelseTypeKode}
                aksjonspunktKoder={aksjonspunktKoder}
                revurderingsAarsakString={revurderingsAarsakString}
                behandlingsresultat={behandlingresultat}
                readOnly={readOnly}
                beregningResultat={resultatstruktur}
                sprakKode={sprakkode}
                aksjonspunkter={aksjonspunkter}
                tilbakekrevingvalg={tilbakekrevingvalg}
                simuleringResultat={simuleringResultat}
                alleKodeverk={alleKodeverk}
                originaltBeregningResultat={resultatstrukturOriginalBehandling}
              />
            )}
            {isAvslag(behandlingresultat.type.kode) && (
              <VedtakAvslagRevurderingPanel
                behandlingStatusKode={behandlingStatusKode}
                aksjonspunkter={aksjonspunkter}
                behandlingsresultat={behandlingresultat}
                readOnly={readOnly}
                alleKodeverk={alleKodeverk}
                beregningResultat={resultatstruktur}
                sprakkode={sprakkode}
                vilkar={vilkar}
                tilbakekrevingvalg={tilbakekrevingvalg}
                simuleringResultat={simuleringResultat}
                originaltBeregningResultat={resultatstrukturOriginalBehandling}
              />
            )}
            {isOpphor(behandlingresultat.type.kode) && (
              <VedtakOpphorRevurderingPanel
                aksjonspunkter={aksjonspunkter}
                revurderingsAarsakString={revurderingsAarsakString}
                ytelseTypeKode={ytelseTypeKode}
                readOnly={readOnly}
                behandlingsresultat={behandlingresultat}
                sprakKode={sprakkode}
                medlemskapFom={medlemskapFom}
                resultatstruktur={resultatstruktur}
              />
            )}

            {skalBrukeOverstyrendeFritekstBrev && ytelseTypeKode !== fagsakYtelseType.ENGANGSSTONAD && (
              <FritekstBrevPanel
                intl={intl}
                readOnly={readOnly}
                sprakkode={sprakkode}
                previewBrev={previewAutomatiskBrev}
              />
            )}
            {behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES && (
              <VedtakRevurderingSubmitPanel
                begrunnelse={begrunnelse}
                brodtekst={brødtekst}
                overskrift={overskrift}
                previewCallback={previewCallback}
                formProps={formProps}
                readOnly={readOnly}
                ytelseTypeKode={ytelseTypeKode}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
                beregningResultat={resultatstruktur}
                haveSentVarsel={sendVarselOmRevurdering}
                aksjonspunkter={aksjonspunkter}
                originaltBeregningResultat={resultatstrukturOriginalBehandling}
                behandlingArsaker={behandlingArsaker}
                behandlingResultat={behandlingresultat}
              />
            )}
          </>
        </VedtakAksjonspunktPanel>
      </>
    );
  }
}

VedtakRevurderingFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  begrunnelse: PropTypes.string,
  brødtekst: PropTypes.string,
  overskrift: PropTypes.string,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingresultat: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseTypeKode: PropTypes.string.isRequired,
  resultatstruktur: vedtakBeregningsresultatPropType,
  revurderingsAarsakString: PropTypes.string,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  ...formPropTypes,
};

VedtakRevurderingFormImpl.defaultProps = {
  begrunnelse: undefined,
  brødtekst: undefined,
  overskrift: undefined,
  antallBarn: undefined,
  revurderingsAarsakString: undefined,
  kanOverstyre: undefined,
  resultatstruktur: undefined,
  skalBrukeOverstyrendeFritekstBrev: false,
};

const buildInitialValues = createSelector(
  [(ownProps) => ownProps.resultatstruktur,
    (ownProps) => ownProps.behandlingStatusKode,
    (ownProps) => ownProps.aksjonspunkter,
    (ownProps) => ownProps.ytelseTypeKode,
    (ownProps) => ownProps.behandlingresultat,
    (ownProps) => ownProps.sprakkode],
  (beregningResultat, behandlingstatusKode, aksjonspunkter, ytelseTypeKode, behandlingresultat, sprakkode) => {
    const aksjonspunktKoder = aksjonspunkter
      .filter((ap) => ap.erAktivt)
      .filter((ap) => ap.kanLoses)
      .map((ap) => ap.definisjon.kode);

    if (ytelseTypeKode === fagsakYtelseType.ENGANGSSTONAD) {
      if (beregningResultat) {
        return {
          antallBarn: beregningResultat.antallBarn,
          aksjonspunktKoder,
        };
      }
      if (behandlingstatusKode !== behandlingStatusCode.AVSLUTTET) {
        return {
          antallBarn: null,
          aksjonspunktKoder,
        };
      }
      return { antallBarn: null };
    }
    return {
      sprakkode,
      aksjonspunktKoder,
      skalBrukeOverstyrendeFritekstBrev: behandlingresultat.vedtaksbrev.kode === 'FRITEKST',
      overskrift: decodeHtmlEntity(behandlingresultat.overskrift),
      brødtekst: decodeHtmlEntity(behandlingresultat.fritekstbrev),
    };
  },
);

const transformValues = (values) => values.aksjonspunktKoder.map((apCode) => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
  fritekstBrev: values.brødtekst,
  skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
  overskrift: values.overskrift,
  isVedtakSubmission,
}));

const createAarsakString = (revurderingAarsaker, getKodeverknavn) => {
  if (revurderingAarsaker === undefined || revurderingAarsaker.length < 1) {
    return '';
  }
  const aarsakTekstList = [];
  const endringFraBrukerAarsak = revurderingAarsaker
    .find((aarsak) => aarsak.kode === BehandlingArsakType.RE_ENDRING_FRA_BRUKER);
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter((aarsak) => aarsak.kode !== BehandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map((aarsak) => getKodeverknavn(aarsak));
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak !== undefined) {
    aarsakTekstList.push(getKodeverknavn(endringFraBrukerAarsak));
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
};

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback(transformValues(values));
  const aksjonspunktKoder = initialOwnProps.aksjonspunkter.map((ap) => ap.definisjon.kode);
  const behandlingArsaker = initialOwnProps.behandlingArsaker.map(({ behandlingArsakType }) => behandlingArsakType);
  const revurderingsAarsakString = createAarsakString(behandlingArsaker, getKodeverknavnFn(initialOwnProps.alleKodeverk, kodeverkTyper));

  return (state, ownProps) => ({
    onSubmit,
    aksjonspunktKoder,
    revurderingsAarsakString,
    initialValues: buildInitialValues(ownProps),
    ...behandlingFormValueSelector(VEDTAK_REVURDERING_FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'antallBarn',
      'begrunnelse',
      'aksjonspunktKoder',
      'skalBrukeOverstyrendeFritekstBrev',
      'overskrift',
      'brødtekst',
    ),
    behandlingFormPrefix: getBehandlingFormPrefix(ownProps.behandlingId, ownProps.behandlingVersjon),
  });
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearFields,
  }, dispatch),
});

const VedtakRevurderingForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: VEDTAK_REVURDERING_FORM_NAME,
})(VedtakRevurderingFormImpl)));

export default VedtakRevurderingForm;
