import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import {
  change as reduxFormChange,
  reset as reduxFormReset,
  formPropTypes,
} from 'redux-form';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';
import {
  AksjonspunktHelpText, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  getBehandlingMedlemNew,
  getSoknad,
  getBehandlingRevurderingAvFortsattMedlemskapFom,
  getBehandlingVersjon, isBehandlingRevurderingFortsattMedlemskap,
}
  from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { bindActionCreators } from 'redux';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingForstegangOgRevurdering/src/duck';
import { guid } from '@fpsak-frontend/utils';
import OppholdInntektOgPeriodeForm from './OppholdInntektOgPeriodeForm';
import MedlemskapEndringerTabell from './MedlemskapEndringerTabell';

/**
 * OppholdInntektOgPerioderForm
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for faktapenelet til Medlemskapsvilkåret.
 */

const {
  AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT,
  AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP,
} = aksjonspunktCodes;

const getHelpTexts = (aksjonspunkter) => {
  const helpTexts = [];
  if (hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="HarFortsattMedlemskap" id="MedlemskapInfoPanel.HarFortsattMedlemskap" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_ER_BOSATT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="ErSokerBosattINorge" id="MedlemskapInfoPanel.ErSokerBosattINorge" />);
  }
  if (hasAksjonspunkt(AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="GyldigMedlemFolketrygden" id="MedlemskapInfoPanel.GyldigMedlemFolketrygden" />);
  }
  if (hasAksjonspunkt(AVKLAR_OPPHOLDSRETT, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="EOSBorgerMedOppholdsrett1" id="MedlemskapInfoPanel.EOSBorgerMedOppholdsrett" />);
  }
  if (hasAksjonspunkt(AVKLAR_LOVLIG_OPPHOLD, aksjonspunkter)) {
    helpTexts.push(<FormattedMessage key="IkkeEOSBorgerMedLovligOpphold" id="MedlemskapInfoPanel.IkkeEOSBorgerMedLovligOpphold" />);
  }
  return helpTexts;
};

const createNewPerioder = (perioder, id, values) => {
  const updatedIndex = perioder.findIndex(p => p.id === id);
  const updatedPeriode = perioder.find(p => p.id === id);

  return [
    ...perioder.slice(0, updatedIndex),
    {
      ...updatedPeriode,
      ...values,
    },
    ...perioder.slice(updatedIndex + 1),
  ];
};

export class OppholdInntektOgPerioderFormNew extends Component {
  constructor(props) {
    super(props);

    this.state = {
      valgtPeriode: undefined,
    };

    this.velgPeriodeCallback = this.velgPeriodeCallback.bind(this);
    this.updateOppholdInntektPeriode = this.updateOppholdInntektPeriode.bind(this);
    this.isConfirmButtonDisabled = this.isConfirmButtonDisabled.bind(this);
    this.periodeResetCallback = this.periodeResetCallback.bind(this);
  }


  componentWillMount() {
    const { initialValues } = this.props;
    const defaultPeriode = initialValues.perioder ? initialValues.perioder[0] : {};
    this.setValgtPeriode(defaultPeriode);
  }

  setValgtPeriode(valgtPeriode) {
    if (!valgtPeriode) {
      const { initialValues } = this.props;
      const defaultPeriode = initialValues.perioder ? initialValues.perioder[0] : {};
      this.setState({ valgtPeriode: defaultPeriode });
    }
    this.setState({ valgtPeriode });
  }

  periodeResetCallback() {
    const { behandlingFormPrefix, reduxFormReset: formReset } = this.props;
    const { valgtPeriode } = this.state;
    if (valgtPeriode) {
      formReset(`${behandlingFormPrefix}.OppholdInntektOgPeriodeForm-${valgtPeriode.id}`);
    }
  }

  velgPeriodeCallback(p, id, periode) {
    const valgtPeriode = {
      id,
      ...periode,
    };
    this.setState({ valgtPeriode });
  }

  updateOppholdInntektPeriode(values) {
    const {
      behandlingFormPrefix, perioder, reduxFormChange: formChange,
    } = this.props;

    const updatedPeriode = perioder.find(p => p.id === values.id);

    const newPeriodeObject = {
      ...updatedPeriode,
      ...values,
    };

    const newPerioder = createNewPerioder(perioder, values.id, newPeriodeObject);

    formChange(`${behandlingFormPrefix}.OppholdInntektOgPerioderForm`, 'perioder', newPerioder);
  }

  isConfirmButtonDisabled() {
    const {
      perioder, readOnly, submitting, dirty,
    } = this.props;

    if (!dirty) {
      return true;
    }

    if (perioder && perioder.length > 0) {
      const ubekreftPerioder = perioder.filter(periode => periode.aksjonspunkter.length > 0 && periode.begrunnelse === null);

      if (ubekreftPerioder.length > 0) {
        return true;
      }
    }

    return submitting || readOnly;
  }

  render() {
    const {
      hasOpenAksjonspunkter,
      submittable,
      aksjonspunkter,
      readOnly,
      submitting,
      isRevurdering,
      ...formProps
    } = this.props;

    const { valgtPeriode } = this.state;

    return (
      <form onSubmit={formProps.handleSubmit}>
        <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter || !submittable}>{getHelpTexts(aksjonspunkter)}</AksjonspunktHelpText>

        { hasAksjonspunkt(AVKLAR_FORTSATT_MEDLEMSKAP, aksjonspunkter) && (
        <MedlemskapEndringerTabell
          selectedId={valgtPeriode ? valgtPeriode.id : undefined}
          velgPeriodeCallback={this.velgPeriodeCallback}
        />
        )}

        {valgtPeriode && (
        <OppholdInntektOgPeriodeForm
          isRevurdering={isRevurdering}
          readOnly={readOnly}
          valgtPeriode={valgtPeriode}
          aksjonspunkter={aksjonspunkter}
          submittable={submittable}
          updateOppholdInntektPeriode={this.updateOppholdInntektPeriode}
          periodeResetCallback={this.periodeResetCallback}
        />
        )}

        <VerticalSpacer twentyPx />
        <Hovedknapp
          mini
          disabled={this.isConfirmButtonDisabled()}
          spinner={submitting}
        >
          <FormattedMessage id="OppholdInntektOgPerioder.Bekreft" />
        </Hovedknapp>
      </form>
    );
  }
}

OppholdInntektOgPerioderFormNew.propTypes = {
  intl: intlShape.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType.isRequired).isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  isRevurdering: PropTypes.bool.isRequired,
  ...formPropTypes,
};

const medlemAksjonspunkter = [AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN, AVKLAR_OM_BRUKER_ER_BOSATT, AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE,
  AVKLAR_OPPHOLDSRETT, AVKLAR_LOVLIG_OPPHOLD, AVKLAR_FORTSATT_MEDLEMSKAP];

const transformValues = (values, aksjonspunkter) => {
  const aktiveMedlemAksjonspunkter = aksjonspunkter
    .filter(ap => medlemAksjonspunkter.includes(ap.definisjon.kode))
    .filter(ap => ap.definisjon.kode !== aksjonspunktCodes.AVKLAR_STARTDATO_FOR_FORELDREPENGERPERIODEN);


  return aktiveMedlemAksjonspunkter.map(ap => ({
    kode: ap.definisjon.kode,
    begrunnelse: '',
    bekreftedePerioder: values.perioder.map((periode) => {
      // TODO Kor mange felt er det i bekreftetPeriode? Kan ein heller laga nytt objekt med det ein treng?
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id, fixedMedlemskapPerioder, foreldre, inntekter, manuellVurderingType, hasBosattAksjonspunkt, hasPeriodeAksjonspunkt,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isBosattAksjonspunktClosed, isPeriodAksjonspunktClosed, opphold, personopplysninger, fom, termindato, årsaker,
        ...bekreftetPeriode
      } = periode;
      return bekreftetPeriode;
    }).filter(periode => periode.aksjonspunkter.includes(ap.definisjon.kode)
      || (periode.aksjonspunkter.length > 0 && ap.definisjon.kode === aksjonspunktCodes.AVKLAR_FORTSATT_MEDLEMSKAP)),
  }));
};


const buildInitalValues = createSelector([getSoknad, getFagsakPerson, getBehandlingMedlemNew, getBehandlingRevurderingAvFortsattMedlemskapFom],
(soknad, person, medlem = {}, gjeldendeFom = undefined) => ({
  soknad,
  person,
  gjeldendeFom,
  medlemskapPerioder: medlem.medlemskapPerioder || [],
  inntekter: medlem.inntekt,
  perioder: (medlem.perioder || []).map(periode => ({
    ...periode,
    id: guid(),
  })),
}));

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = values => ownProps.submitCallback(transformValues(values, ownProps.aksjonspunkter));
  const hasOpenAksjonspunkter = ownProps.aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const perioder = [];

  return (state) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state));
    return {
      behandlingFormPrefix,
      onSubmit,
      hasOpenAksjonspunkter,
      initialValues: buildInitalValues(state),
      perioder: behandlingFormValueSelector('OppholdInntektOgPerioderForm')(state, 'perioder') || perioder,
      isRevurdering: isBehandlingRevurderingFortsattMedlemskap(state),
    };
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormReset,
  }, dispatch),
});

export default connect(mapStateToPropsFactory, mapDispatchToProps)(behandlingForm({
  form: 'OppholdInntektOgPerioderForm',
  enableReinitialize: true,
})(injectIntl(OppholdInntektOgPerioderFormNew)));
