import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { clearFields, formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { bindActionCreators } from 'redux';
import { injectIntl } from 'react-intl';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getBehandlingFormPrefix, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import { isAvslag, isInnvilget, isOpphor } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import behandlingArsakType from '@fpsak-frontend/kodeverk/src/behandlingArsakType';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';

import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getBehandlingArsakTyper, getBehandlingResultatstruktur } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import {
  behandlingFormForstegangOgRevurdering, behandlingFormValueSelector,
} from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import { getAlleKodeverk, getFagsakYtelseType, getSelectedBehandlingId } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { fetchVedtaksbrevPreview } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/duckBpForstegangOgRev';
import FritekstBrevPanel from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/FritekstBrevPanel';
import VedtakOverstyrendeKnapp from '../VedtakOverstyrendeKnapp';
import VedtakAksjonspunktPanel from '../VedtakAksjonspunktPanel';
import VedtakRevurderingSubmitPanel from './VedtakRevurderingSubmitPanel';
import VedtakInnvilgetRevurderingPanel from './VedtakInnvilgetRevurderingPanel';
import VedtakAvslagRevurderingPanel from './VedtakAvslagRevurderingPanel';
import VedtakOpphorRevurderingPanel from './VedtakOpphorRevurderingPanel';
import VedtakFritekstbrevModal from '../svp/VedtakFritekstbrevModal';

export const VEDTAK_REVURDERING_FORM_NAME = 'VEDTAK_REVURDERING_FORM';

const isVedtakSubmission = true;

const getPreviewAutomatiskBrevCallback = (formProps) => (e) => {
  const {
    begrunnelse, brødtekst, behandlingId,
  } = formProps;
  const formValues = {
    behandlingId,
    fritekst: begrunnelse,
    skalBrukeOverstyrendeFritekstBrev: false,
    fritekstBrev: brødtekst,
    finnesAllerede: false,
    overskrift: '',
    begrunnelse: '',
  };
  formProps.fetchVedtaksbrevPreview(formValues);
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
      behandlingsresultat,
      aksjonspunkter,
      previewVedtakCallback,
      previewManueltBrevCallback,
      begrunnelse,
      aksjonspunktKoder,
      antallBarn,
      isBehandlingReadOnly,
      ytelseType,
      revurderingsAarsakString,
      kanOverstyre,
      sprakkode,
      skalBrukeOverstyrendeFritekstBrev,
      initialValues,
      ...formProps
    } = this.props;
    const previewAutomatiskBrev = getPreviewAutomatiskBrevCallback(formProps);
    const visOverstyringKnapp = kanOverstyre || readOnly;
    return (
      <>
        <VedtakFritekstbrevModal
          readOnly={readOnly}
          behandlingsresultat={behandlingsresultat}
        />
        <VedtakAksjonspunktPanel
          behandlingStatusKode={behandlingStatusKode}
          aksjonspunktKoder={aksjonspunktKoder}
          readOnly={readOnly}
          isBehandlingReadOnly={isBehandlingReadOnly}
        >
          <VerticalSpacer eightPx />
          <ElementWrapper>
            {visOverstyringKnapp
            && (
              <VedtakOverstyrendeKnapp
                toggleCallback={this.onToggleOverstyring}
                readOnly={readOnly || (initialValues.skalBrukeOverstyrendeFritekstBrev === true)}
                keyName="skalBrukeOverstyrendeFritekstBrev"
                readOnlyHideEmpty={false}
              />
            )}

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
            )}
            {isAvslag(behandlingsresultat.type.kode)
            && (
              <VedtakAvslagRevurderingPanel
                behandlingStatusKode={behandlingStatusKode}
                aksjonspunkter={aksjonspunkter}
                behandlingsresultat={behandlingsresultat}
                readOnly={readOnly}
                ytelseType={ytelseType}
              />
            )}
            {isOpphor(behandlingsresultat.type.kode)
            && (
              <VedtakOpphorRevurderingPanel
                aksjonspunkter={aksjonspunkter}
                revurderingsAarsakString={revurderingsAarsakString}
                ytelseType={ytelseType}
                readOnly={readOnly}
              />
            )}

            {skalBrukeOverstyrendeFritekstBrev && ytelseType !== ytelseType.ENGANGSSTONAD
            && (
              <FritekstBrevPanel
                intl={intl}
                readOnly={readOnly}
                sprakkode={sprakkode}
                previewBrev={previewAutomatiskBrev}
              />
            )}
            {behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES
            && (
              <VedtakRevurderingSubmitPanel
                begrunnelse={begrunnelse}
                previewVedtakCallback={previewVedtakCallback}
                previewManueltBrevCallback={previewManueltBrevCallback}
                formProps={formProps}
                readOnly={readOnly}
                ytelseType={ytelseType}
                skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
              />
            )}
          </ElementWrapper>
        </VedtakAksjonspunktPanel>
      </>
    );
  }
}

VedtakRevurderingFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  begrunnelse: PropTypes.string,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewManueltBrevCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  antallBarn: PropTypes.number,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseType: PropTypes.string.isRequired,
  revurderingsAarsakString: PropTypes.string,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  ...formPropTypes,
};

VedtakRevurderingFormImpl.defaultProps = {
  begrunnelse: undefined,
  antallBarn: undefined,
  revurderingsAarsakString: undefined,
  kanOverstyre: undefined,
  skalBrukeOverstyrendeFritekstBrev: false,
};

const buildInitialValues = createSelector(
  [getBehandlingResultatstruktur, behandlingSelectors.getBehandlingStatus, behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter,
    getFagsakYtelseType, behandlingSelectors.getBehandlingsresultat, behandlingSelectors.getBehandlingSprak],
  (beregningResultat, behandlingstatus, aksjonspunkter, ytelseType, behandlingresultat, sprakkode) => {
    const aksjonspunktKoder = aksjonspunkter
      .filter((ap) => ap.erAktivt)
      .filter((ap) => ap.kanLoses)
      .map((ap) => ap.definisjon.kode);

    if (ytelseType === fagsakYtelseType.ENGANGSSTONAD) {
      if (beregningResultat) {
        return {
          antallBarn: beregningResultat.antallBarn,
          aksjonspunktKoder,
        };
      }
      if (behandlingstatus.kode !== behandlingStatusCode.AVSLUTTET) {
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
    .find((aarsak) => aarsak.kode === behandlingArsakType.RE_ENDRING_FRA_BRUKER);
  const alleAndreAarsakerNavn = revurderingAarsaker
    .filter((aarsak) => aarsak.kode !== behandlingArsakType.RE_ENDRING_FRA_BRUKER)
    .map((aarsak) => getKodeverknavn(aarsak));
  // Dersom en av årsakene er "RE_ENDRING_FRA_BRUKER" skal alltid denne vises først
  if (endringFraBrukerAarsak !== undefined) {
    aarsakTekstList.push(getKodeverknavn(endringFraBrukerAarsak));
  }
  aarsakTekstList.push(...alleAndreAarsakerNavn);
  return aarsakTekstList.join(', ');
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = (values) => ownProps.submitCallback(transformValues(values));
  const aksjonspunktKoder = behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(initialState).map((ap) => ap.definisjon.kode);
  const revurderingsAarsakString = createAarsakString(getBehandlingArsakTyper(initialState), getKodeverknavnFn(getAlleKodeverk(initialState), kodeverkTyper));

  return (state) => ({
    onSubmit,
    aksjonspunktKoder,
    revurderingsAarsakString,
    initialValues: buildInitialValues(state),
    isBehandlingReadOnly: behandlingSelectors.isBehandlingStatusReadOnly(state),
    ...behandlingFormValueSelector(VEDTAK_REVURDERING_FORM_NAME)(
      state,
      'antallBarn',
      'begrunnelse',
      'aksjonspunktKoder',
      'skalBrukeOverstyrendeFritekstBrev',
      'overskrift',
      'brødtekst',
    ),
    behandlingId: getSelectedBehandlingId(state),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), behandlingSelectors.getBehandlingVersjon(state)),
    behandlingStatusKode: behandlingSelectors.getBehandlingStatus(state).kode,
    behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
    aksjonspunkter: behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
    ytelseType: getFagsakYtelseType(state).kode,
    sprakkode: behandlingSelectors.getBehandlingSprak(state),
    kanOverstyre: behandlingSelectors.getRettigheter(state).kanOverstyreAccess.employeeHasAccess,
  });
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    clearFields,
    fetchVedtaksbrevPreview,
  }, dispatch),
});

const VedtakRevurderingForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingFormForstegangOgRevurdering({
  form: VEDTAK_REVURDERING_FORM_NAME,
})(VedtakRevurderingFormImpl)));

export default VedtakRevurderingForm;
