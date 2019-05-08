import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { clearFields, formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Row, Column } from 'nav-frontend-grid';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import avslagsarsakCodes from '@fpsak-frontend/kodeverk/src/avslagsarsakCodes';
import {
  getAksjonspunkter, getBehandlingResultatstruktur,
  isBehandlingStatusReadOnly, getBehandlingIsOnHold, getBehandlingStatus,
  getBehandlingsresultat, getBehandlingVersjon, getBehandlingSprak,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { bindActionCreators } from 'redux';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { getSelectedBehandlingId, getFagsakYtelseType } from 'behandlingForstegangOgRevurdering/src/duck';
import { isInnvilget, isAvslag } from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import { getRettigheter } from 'navAnsatt/duck';
import FritekstBrevPanel from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vedtak/FritekstBrevPanel';
import behandlingStatusCode from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import classNames from 'classnames';
import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { fetchVedtaksbrevPreview } from 'fagsak/duck';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import styles from './vedtakForm.less';
import VedtakOverstyrendeKnapp from './VedtakOverstyrendeKnapp';

const getPreviewManueltBrevCallback = (formProps, finnesAllerede, skalOverstyre, previewManueltBrevCallback) => (e) => {
  if (formProps.valid || formProps.pristine) {
    const {
      begrunnelse, brødtekst, overskrift,
    } = formProps;
    const formValues = {
      fritekst: begrunnelse,
      skalBrukeOverstyrendeFritekstBrev: skalOverstyre,
      fritekstBrev: brødtekst,
      finnesAllerede,
      overskrift,
      begrunnelse,
    };
    previewManueltBrevCallback(formValues);
  } else {
    formProps.submit();
  }
  e.preventDefault();
};

const isVedtakSubmission = true;

export const ForhaandsvisningsKnapp = (props) => {
  const { previewFunction } = props;
  return (
    <a
      href=""
      onClick={previewFunction}
      onKeyDown={e => (e.keyCode === 13 ? previewFunction(e) : null)}
      className={classNames(styles.buttonLink, 'lenke lenke--frittstaende')}
    >
      <FormattedMessage id="VedtakForm.ForhandvisBrev" />
    </a>
  );
};

ForhaandsvisningsKnapp.propTypes = {
  previewFunction: PropTypes.func.isRequired,
};

function kanSendesTilGodkjenning(behandlingStatusKode) {
  return behandlingStatusKode === behandlingStatusCode.BEHANDLING_UTREDES;
}

const getPreviewAutomatiskBrevCallback = formProps => (e) => {
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

export class VedtakFormImpl extends Component {
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
      behandlingPaaVent,
      antallBarn,
      previewManueltBrevCallback,
      aksjonspunktKoder,
      isBehandlingReadOnly,
      kanOverstyre,
      isEngangsstonad,
      sprakkode,
      skalBrukeOverstyrendeFritekstBrev,
      initialValues,
      ...formProps
    } = this.props;
    const finnesAllerede = (behandlingStatusCode.BEHANDLING_UTREDES !== behandlingStatusKode);
    const previewAutomatiskBrev = getPreviewAutomatiskBrevCallback(formProps);
    const previewOverstyrtBrev = getPreviewManueltBrevCallback(formProps, finnesAllerede, true, previewManueltBrevCallback);
    const previewDefaultBrev = getPreviewManueltBrevCallback(formProps, false, false, previewManueltBrevCallback);
    const skalViseLink = (behandlingsresultat.avslagsarsak === null)
      || (behandlingsresultat.avslagsarsak && behandlingsresultat.avslagsarsak.kode !== avslagsarsakCodes.INGEN_BEREGNINGSREGLER);
    const visOverstyringKnapp = kanOverstyre || readOnly;
    return (
      <VedtakAksjonspunktPanel
        behandlingStatusKode={behandlingStatusKode}
        aksjonspunktKoder={aksjonspunktKoder}
        readOnly={readOnly}
        isBehandlingReadOnly={isBehandlingReadOnly}
      >
        {visOverstyringKnapp
          && (
            <VedtakOverstyrendeKnapp
              toggleCallback={this.onToggleOverstyring}
              readOnly={readOnly || (initialValues.skalBrukeOverstyrendeFritekstBrev === true)}
              keyName="skalBrukeOverstyrendeFritekstBrev"
              readOnlyHideEmpty={false}
            />
          )
          }

        {isInnvilget(behandlingsresultat.type.kode)
          && (
            <VedtakInnvilgetPanel
              intl={intl}
              antallBarn={antallBarn}
              behandlingsresultat={behandlingsresultat}
              readOnly={readOnly}
              skalBrukeOverstyrendeFritekstBrev={skalBrukeOverstyrendeFritekstBrev}
            />
          )
          }

        {isAvslag(behandlingsresultat.type.kode)
          && (
            <VedtakAvslagPanel
              behandlingStatusKode={behandlingStatusKode}
              aksjonspunkter={aksjonspunkter}
              behandlingsresultat={behandlingsresultat}
              readOnly={readOnly}
            />
          )
          }

        {skalBrukeOverstyrendeFritekstBrev && !isEngangsstonad
          && (
            <FritekstBrevPanel
              intl={intl}
              readOnly={readOnly}
              sprakkode={sprakkode}
              previewBrev={previewAutomatiskBrev}
            />
          )
          }

        {kanSendesTilGodkjenning(behandlingStatusKode)
          && (
            <Row>
              <Column xs="12">
                {!readOnly
                && (
                  <Hovedknapp
                    mini
                    className={styles.mainButton}
                    onClick={formProps.handleSubmit}
                    disabled={behandlingPaaVent || formProps.submitting}
                    spinner={formProps.submitting}
                  >
                    {intl.formatMessage({ id: 'VedtakForm.TilGodkjenning' })}
                  </Hovedknapp>
                )
                }
                {skalBrukeOverstyrendeFritekstBrev && skalViseLink
                && (
                  <ForhaandsvisningsKnapp previewFunction={previewOverstyrtBrev} />
                )
                }
                {!skalBrukeOverstyrendeFritekstBrev && skalViseLink
                && (
                  <ForhaandsvisningsKnapp previewFunction={previewDefaultBrev} />
                )
                }
              </Column>
            </Row>
          )
          }
      </VedtakAksjonspunktPanel>
    );
  }
}

VedtakFormImpl.propTypes = {
  intl: intlShape.isRequired,
  begrunnelse: PropTypes.string,
  antallBarn: PropTypes.number,
  behandlingStatusKode: PropTypes.string.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  behandlingPaaVent: PropTypes.bool.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewManueltBrevCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isBehandlingReadOnly: PropTypes.bool.isRequired,
  kanOverstyre: PropTypes.bool,
  skalBrukeOverstyrendeFritekstBrev: PropTypes.bool,
  sprakkode: PropTypes.shape().isRequired,
  ...formPropTypes,
};

VedtakFormImpl.defaultProps = {
  antallBarn: undefined,
  begrunnelse: undefined,
  kanOverstyre: undefined,
  skalBrukeOverstyrendeFritekstBrev: false,
};

export const buildInitialValues = createSelector(
  [getBehandlingStatus, getBehandlingResultatstruktur, getSelectedBehandlingspunktAksjonspunkter, getFagsakYtelseType, getBehandlingsresultat,
    getBehandlingSprak],
  (status, beregningResultat, aksjonspunkter, ytelseType, behandlingresultat, sprakkode) => ({
    sprakkode,
    isEngangsstonad: beregningResultat && ytelseType ? ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD : false,
    antallBarn: beregningResultat ? beregningResultat.antallBarn : undefined,
    aksjonspunktKoder: aksjonspunkter.filter(ap => ap.kanLoses)
      .map(ap => ap.definisjon.kode),
    skalBrukeOverstyrendeFritekstBrev: behandlingresultat.vedtaksbrev.kode === 'FRITEKST',
    overskrift: decodeHtmlEntity(behandlingresultat.overskrift),
    brødtekst: decodeHtmlEntity(behandlingresultat.fritekstbrev),
  }),
);

export const getAksjonspunktKoder = createSelector(
  [getSelectedBehandlingspunktAksjonspunkter], aksjonspunkter => aksjonspunkter.map(ap => ap.definisjon.kode),
);

const transformValues = values => values.aksjonspunktKoder.map(apCode => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
  fritekstBrev: values.brødtekst,
  skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
  overskrift: values.overskrift,
  isVedtakSubmission,
}));

const formName = 'VedtakForm';

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback(transformValues(values));
  return state => ({
    onSubmit,
    initialValues: buildInitialValues(state),
    isBehandlingReadOnly: isBehandlingStatusReadOnly(state),
    ...behandlingFormValueSelector(formName)(
      state,
      'antallBarn',
      'begrunnelse',
      'aksjonspunktKoder',
      'skalBrukeOverstyrendeFritekstBrev',
      'overskrift',
      'brødtekst',
    ),
    behandlingId: getSelectedBehandlingId(state),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    behandlingStatusKode: getBehandlingStatus(state).kode,
    aksjonspunkter: getAksjonspunkter(state),
    behandlingsresultat: getBehandlingsresultat(state),
    behandlingPaaVent: getBehandlingIsOnHold(state),
    sprakkode: getBehandlingSprak(state),
    aksjonspunktKoder: getAksjonspunktKoder(state),
    kanOverstyre: getRettigheter(state).kanOverstyreAccess.employeeHasAccess,
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
    fetchVedtaksbrevPreview,
  }, dispatch),
});

const VedtakForm = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
})(VedtakFormImpl)));

export default VedtakForm;
