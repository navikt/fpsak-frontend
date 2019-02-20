import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { injectIntl } from 'react-intl';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { getKodeverk, getSelectedBehandlingId } from 'behandlingFpsak/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getBehandlingVersjon } from 'behandlingFpsak/src/behandlingSelectors';
import { arbeidsforholdPropType } from '@fpsak-frontend/fp-behandling-felles';
import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingFpsak/src/behandlingForm';
import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import PersonArbeidsforholdTable from './PersonArbeidsforholdTable';
import PersonArbeidsforholdDetailForm, { PERSON_ARBEIDSFORHOLD_DETAIL_FORM } from './PersonArbeidsforholdDetailForm';

// -------------------------------------------------------------------------------------------------------------
// Methods
// -------------------------------------------------------------------------------------------------------------

const removeDeleted = arbeidsforhold => arbeidsforhold.filter(a => !a.erSlettet);

const cleanUpArbeidsforhold = (newValues, originalValues, brukArbeidsforholdet) => {
  if (!brukArbeidsforholdet) {
    return {
      ...newValues,
      erNyttArbeidsforhold: undefined,
      erstatterArbeidsforholdId: undefined,
      tomDato: originalValues.tomDato,
    };
  }
  if (newValues.erNyttArbeidsforhold) {
    return {
      ...newValues,
      erstatterArbeidsforholdId: undefined,
    };
  }
  return newValues;
};

const findFomDato = (arbeidsforhold, replacedArbeidsforhold) => (arbeidsforhold.erstatterArbeidsforholdId
  ? replacedArbeidsforhold.fomDato : arbeidsforhold.originalFomDato);

const getUnresolvedArbeidsforhold = arbeidsforholdList => arbeidsforholdList.find(a => a.tilVurdering && !a.erEndret);

const hasArbeidsforholdAksjonspunkt = arbeidsforhold => arbeidsforhold && (arbeidsforhold.tilVurdering || arbeidsforhold.erEndret);

export const sortArbeidsforhold = arbeidsforhold => arbeidsforhold
  .sort((a1, a2) => {
    const i = a1.navn.localeCompare(a2.navn);
    if (i !== 0) {
      return i;
    }

    if (a1.mottattDatoInntektsmelding && a2.mottattDatoInntektsmelding) {
      return moment(a2.mottattDatoInntektsmelding, ISO_DATE_FORMAT).diff(moment(a1.mottattDatoInntektsmelding, ISO_DATE_FORMAT));
    }
    if (a1.mottattDatoInntektsmelding) {
      return -1;
    }
    if (a2.mottattDatoInntektsmelding) {
      return 1;
    }
    return a1.id.localeCompare(a2.id);
  });

export const sjekkKanFortsetteBehandlingForAktivtArbeidsforhodUtenIM = (arbeidsforhold) => {
  let isAllowed = true;
  const arbeidsforholdUtenInntektsmeldingTilVurdering = arbeidsforhold.filter(a => (a.tilVurdering || a.erEndret) && !a.mottattDatoInntektsmelding);

  arbeidsforholdUtenInntektsmeldingTilVurdering.forEach((a) => {
    const arbeidsforholdFraSammeArbeidsgiverMedInntekstmelding = arbeidsforhold
      .filter(b => a.id !== b.id && a.arbeidsgiverIdentifikator === b.arbeidsgiverIdentifikator && b.mottattDatoInntektsmelding);

    if (arbeidsforholdFraSammeArbeidsgiverMedInntekstmelding.length > 0) {
      isAllowed = false;
    }
  });
  return isAllowed;
};

const addReplaceableArbeidsforhold = arbeidsforholdList => arbeidsforholdList.map((a1) => {
  const matches = arbeidsforholdList.filter(a2 => a2.arbeidsgiverIdentifikator === a1.arbeidsgiverIdentifikator
    && a2.arbeidsforholdId && a1.arbeidsforholdId && a2.arbeidsforholdId !== a1.arbeidsforholdId);
  const hasSomeNewer = matches.some(m => moment(m.mottattDatoInntektsmelding).isAfter(a1.mottattDatoInntektsmelding));
  return {
    ...a1,
    replaceOptions: hasSomeNewer ? [] : matches,
  };
});

const sjekkFortsettUtenImAktivtArbeidsforhold = arbeidsforhold => (arbeidsforhold.brukMedJustertPeriode === true ? undefined
  : arbeidsforhold.fortsettBehandlingUtenInntektsmelding);

const sjekkBrukUendretArbeidsforhold = arbeidsforhold => arbeidsforhold.brukArbeidsforholdet && !arbeidsforhold.brukMedJustertPeriode;

const leggTilValuesForRendering = arbeidsforholdList => arbeidsforholdList.map(arbeidsforhold => ({
  ...arbeidsforhold,
  originalFomDato: arbeidsforhold.fomDato,
  brukUendretArbeidsforhold: sjekkBrukUendretArbeidsforhold(arbeidsforhold),
  fortsettUtenImAktivtArbeidsforhold: sjekkFortsettUtenImAktivtArbeidsforhold(arbeidsforhold),
  overstyrtTom: arbeidsforhold.tomDato,
}));

// -------------------------------------------------------------------------------------------------------------
// Component: PersonArbeidsforholdPanelImpl
// -------------------------------------------------------------------------------------------------------------

export class PersonArbeidsforholdPanelImpl extends Component {
  constructor() {
    super();
    this.state = {
      selectedArbeidsforhold: undefined,
    };
    this.setSelectedArbeidsforhold = this.setSelectedArbeidsforhold.bind(this);
    this.updateArbeidsforhold = this.updateArbeidsforhold.bind(this);
    this.cancelArbeidsforhold = this.cancelArbeidsforhold.bind(this);
    this.initializeActivityForm = this.initializeActivityForm.bind(this);
  }

  componentWillMount() {
    const { arbeidsforhold } = this.props;
    const selected = getUnresolvedArbeidsforhold(arbeidsforhold) || undefined;
    this.setSelectedArbeidsforhold(undefined, undefined, selected);
  }

  setSelectedArbeidsforhold(p, id, selectedArbeidsforhold) {
    this.initializeActivityForm(selectedArbeidsforhold);
    this.setState({ selectedArbeidsforhold });
  }

  setFormField(fieldName, fieldValue) {
    const { behandlingFormPrefix, reduxFormChange: formChange } = this.props;
    formChange(`${behandlingFormPrefix}.${'PersonInfoPanel'}`, fieldName, fieldValue);
  }

  initializeActivityForm(arbeidsforhold) {
    const { behandlingFormPrefix, reduxFormInitialize: formInitialize } = this.props;
    formInitialize(`${behandlingFormPrefix}.${PERSON_ARBEIDSFORHOLD_DETAIL_FORM}`, arbeidsforhold);
  }

  updateArbeidsforhold(values) {
    const { selectedArbeidsforhold } = this.state;
    const { arbeidsforhold } = this.props;
    const brukMedJustertPeriode = values.brukUendretArbeidsforhold === false && !!values.overstyrtTom;
    const brukArbeidsforholdet = values.brukUendretArbeidsforhold || brukMedJustertPeriode;
    const fortsettBehandlingUtenInntektsmelding = values.fortsettUtenImAktivtArbeidsforhold || brukMedJustertPeriode;
    const cleanedValues = cleanUpArbeidsforhold(values, selectedArbeidsforhold, brukArbeidsforholdet);
    const newValues = {
      ...cleanedValues,
      fortsettBehandlingUtenInntektsmelding,
      brukArbeidsforholdet,
      brukMedJustertPeriode,
    };

    let other = arbeidsforhold.filter(o => o.id !== newValues.id);
    const oldState = arbeidsforhold.find(a => a.id === newValues.id);
    let { fomDato } = newValues;
    if (newValues.erstatterArbeidsforholdId !== oldState.erstatterArbeidsforholdId) {
      if (oldState.erstatterArbeidsforholdId) {
        other = other.map(o => (o.id === oldState.erstatterArbeidsforholdId ? { ...o, erSlettet: false } : o));
      }
      if (newValues.erstatterArbeidsforholdId) {
        other = other.map(o => (o.id === newValues.erstatterArbeidsforholdId ? { ...o, erSlettet: true } : o));
      }
      fomDato = findFomDato(newValues, arbeidsforhold.find(a => a.id === newValues.erstatterArbeidsforholdId));
    }

    this.setFormField('arbeidsforhold', other.concat({
      ...newValues,
      fomDato,
      erEndret: true,
    }));

    const unresolvedArbeidsforhold = getUnresolvedArbeidsforhold(removeDeleted(other));
    this.setSelectedArbeidsforhold(undefined, undefined, unresolvedArbeidsforhold);
  }

  cancelArbeidsforhold() {
    this.initializeActivityForm({});
    this.setState({ selectedArbeidsforhold: undefined });
  }

  render() {
    const {
      readOnly, hasAksjonspunkter, hasOpenAksjonspunkter, arbeidsforhold, fagsystemer, kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM,
    } = this.props;
    const { selectedArbeidsforhold } = this.state;
    return (
      <ElementWrapper>
        <FaktaGruppe aksjonspunktCode={aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD} titleCode="PersonArbeidsforholdPanel.ArbeidsforholdHeader">
          <PersonArbeidsforholdTable
            selectedId={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
            alleArbeidsforhold={removeDeleted(arbeidsforhold)}
            selectArbeidsforholdCallback={this.setSelectedArbeidsforhold}
            fagsystemer={fagsystemer}
          />
          {hasArbeidsforholdAksjonspunkt(selectedArbeidsforhold)
          && (
          <PersonArbeidsforholdDetailForm
            arbeidsforhold={selectedArbeidsforhold}
            readOnly={readOnly}
            hasAksjonspunkter={hasAksjonspunkter}
            hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            updateArbeidsforhold={this.updateArbeidsforhold}
            cancelArbeidsforhold={this.cancelArbeidsforhold}
            kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM={kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM}
          />
          )
        }
        </FaktaGruppe>
        <VerticalSpacer twentyPx />
      </ElementWrapper>
    );
  }
}

PersonArbeidsforholdPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  hasAksjonspunkter: PropTypes.bool.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  fagsystemer: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const arbeidsforhold = sortArbeidsforhold(behandlingFormValueSelector('PersonInfoPanel')(state, 'arbeidsforhold'));
  return {
    arbeidsforhold,
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    fagsystemer: getKodeverk(kodeverkTyper.FAGSYSTEM)(state),
    kanFortsetteBehandlingForAktivtArbeidsforhodUtenIM: sjekkKanFortsetteBehandlingForAktivtArbeidsforhodUtenIM(arbeidsforhold),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const PersonArbeidsforholdPanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(PersonArbeidsforholdPanelImpl));

PersonArbeidsforholdPanel.buildInitialValues = (arbeidsforhold) => {
  const mArbeidsforhold = leggTilValuesForRendering(addReplaceableArbeidsforhold(arbeidsforhold));
  return {
    arbeidsforhold: mArbeidsforhold,
  };
};

PersonArbeidsforholdPanel.isReadOnly = (state) => {
  const isDetailFormOpen = !!behandlingFormValueSelector(PERSON_ARBEIDSFORHOLD_DETAIL_FORM)(state, 'navn');
  if (isDetailFormOpen) {
    return true;
  }
  const arbeidsforhold = behandlingFormValueSelector('PersonInfoPanel')(state, 'arbeidsforhold');
  return !arbeidsforhold || !!getUnresolvedArbeidsforhold(arbeidsforhold);
};

export default PersonArbeidsforholdPanel;
