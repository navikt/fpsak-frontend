import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { clearFields, formPropTypes } from 'redux-form';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Row, Column } from 'nav-frontend-grid';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import avslagsarsakCodes from 'kodeverk/avslagsarsakCodes';
import {
  getAksjonspunkter, getBehandlingResultatstruktur,
  isBehandlingStatusReadOnly, getBehandlingIsOnHold, getBehandlingStatus,
  getBehandlingsresultat, getBehandlingVersjon, getBehandlingSprak,
} from 'behandling/behandlingSelectors';
import { bindActionCreators } from 'redux';
import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingsprosess/behandlingsprosessSelectors';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandling/behandlingForm';
import { getSelectedBehandlingId } from 'behandling/duck';
import { isInnvilget, isAvslag } from 'kodeverk/behandlingResultatType';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import { getRettigheter } from 'navAnsatt/duck';
import { CheckboxField } from 'form/Fields';
import behandlingStatusCode from 'kodeverk/behandlingStatus';
import FritekstBrevPanel from 'behandlingsprosess/components/vedtak/FritekstBrevPanel';
import classNames from 'classnames';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import { fetchVedtaksbrevPreview } from 'fagsak/duck';
import VedtakInnvilgetPanel from './VedtakInnvilgetPanel';
import VedtakAvslagPanel from './VedtakAvslagPanel';
import VedtakAksjonspunktPanel from './VedtakAksjonspunktPanel';
import styles from './vedtakForm.less';

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

const ForhaandsvisningsKnapp = (props) => {
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
          <div className={styles.manuell}>
            <CheckboxField
              key="skalBrukeOverstyrendeFritekstBrev"
              name="skalBrukeOverstyrendeFritekstBrev"
              label={{ id: 'VedtakForm.ManuellOverstyring' }}
              onChange={this.onToggleOverstyring}
              readOnly={readOnly || (initialValues.skalBrukeOverstyrendeFritekstBrev === true)}
              readOnlyHideEmpty={false}
            />
          </div>
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

const transformValues = values => values.aksjonspunktKoder.map(apCode => ({
  kode: apCode,
  begrunnelse: values.begrunnelse,
  fritekstBrev: values.brødtekst,
  skalBrukeOverstyrendeFritekstBrev: values.skalBrukeOverstyrendeFritekstBrev,
  overskrift: values.overskrift,
}));

const formName = 'VedtakForm';

const mapStateToProps = (state, initialProps) => ({
  initialValues: buildInitialValues(state),
  isBehandlingReadOnly: isBehandlingStatusReadOnly(state),
  onSubmit: values => initialProps.submitCallback(transformValues(values)),
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
  aksjonspunktKoder: getSelectedBehandlingspunktAksjonspunkter(state)
    .map(ap => ap.definisjon.kode),
  kanOverstyre: getRettigheter(state).kanOverstyreAccess.employeeHasAccess,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    clearFields,
    fetchVedtaksbrevPreview,
  }, dispatch),
});

const VedtakForm = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
})(VedtakFormImpl)));

export default VedtakForm;
