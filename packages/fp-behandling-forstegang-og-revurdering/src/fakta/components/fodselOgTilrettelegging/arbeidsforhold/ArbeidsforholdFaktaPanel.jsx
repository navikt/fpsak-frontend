import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';

import { getBehandlingFormPrefix } from '@fpsak-frontend/fp-felles';

import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import { getSelectedBehandlingId } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import ArbeidsforholdTable from './ArbeidsforholdTable';
import ArbeidsforholdDetailForm, { ARBEIDSFORHOLD_DETAIL_FORM_NAME } from './ArbeidsforholdDetailForm';

/**
 * Svangerskapspenger
 * Vise tabell med arbforhold og vise detaljer( fra søknad) når man klikker på et.
 */
export class ArbeidsforholdFaktaPanel extends Component {
  constructor() {
    super();
    this.state = {
      selectedArbeidsforhold: undefined,
    };
    this.setSelectedArbeidsforhold = this.setSelectedArbeidsforhold.bind(this);
    this.cancelArbeidsforhold = this.cancelArbeidsforhold.bind(this);
    this.updateArbeidsforhold = this.updateArbeidsforhold.bind(this);
    this.toggleArbeidsforhold = this.toggleArbeidsforhold.bind(this);
  }

  setSelectedArbeidsforhold(event, id, selectedArbeidsforhold) {
    const initialValues = {
      jordmorTilretteleggingFra: selectedArbeidsforhold.tilretteleggingBehovFom,
      kanGjennomfores: !!selectedArbeidsforhold.helTilretteleggingFom,
      kanGjennomforesDato: selectedArbeidsforhold.helTilretteleggingFom,
      kanIkkeGjennomfores: !!selectedArbeidsforhold.slutteArbeidFom,
      kanIkkeGjennomforesDato: selectedArbeidsforhold.slutteArbeidFom,
      redusertArbeid: !!selectedArbeidsforhold.delvisTilretteleggingFom,
      redusertArbeidDato: selectedArbeidsforhold.delvisTilretteleggingFom,
      redusertArbeidStillingsprosent: selectedArbeidsforhold.stillingsprosent,
      tilretteleggingDatoer: selectedArbeidsforhold.tilretteleggingDatoer,
    };
    this.initializeArbforholdForm(initialValues);
    this.toggleArbeidsforhold(selectedArbeidsforhold);
  }

  toggleArbeidsforhold(selectedArbeidsforhold) {
    const { settErArbeidsforholdValgt } = this.props;
    this.setState({ selectedArbeidsforhold });
    settErArbeidsforholdValgt(!!selectedArbeidsforhold);
  }

  initializeArbforholdForm(selectedArbeidsforhold) {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${ARBEIDSFORHOLD_DETAIL_FORM_NAME}`, selectedArbeidsforhold);
  }

  cancelArbeidsforhold() {
    this.initializeArbforholdForm({});
    this.toggleArbeidsforhold();
  }

  updateArbeidsforhold(values) {
    const {
      reduxFormChange: formChange, behandlingFormPrefix, arbeidsforhold, formName,
    } = this.props;
    const otherThanUpdated = arbeidsforhold.filter((a) => a.tilretteleggingId !== values.tilretteleggingId);
    const fieldValues = otherThanUpdated.concat(values).sort((a, b) => a.arbeidsgiverNavn.localeCompare(b.arbeidsgiverNavn));
    formChange(`${behandlingFormPrefix}.${formName}`, 'arbeidsforhold', fieldValues);
    this.toggleArbeidsforhold();
  }

  render() {
    const {
      arbeidsforhold,
      readOnly,
      submittable,
    } = this.props;
    const { selectedArbeidsforhold } = this.state;
    return (
      <FaktaGruppe titleCode="ArbeidsforholdFaktaPanel.Faktagruppe">
        <ArbeidsforholdTable
          arbeidsforhold={arbeidsforhold}
          selectArbeidsforholdCallback={this.setSelectedArbeidsforhold}
          selectedArbeidsforhold={selectedArbeidsforhold ? selectedArbeidsforhold.tilretteleggingId : undefined}
        />
        {selectedArbeidsforhold
        && (
        <ArbeidsforholdDetailForm
          readOnly={readOnly}
          selectedArbeidsforhold={selectedArbeidsforhold}
          cancelArbeidsforholdCallback={this.cancelArbeidsforhold}
          updateArbeidsforholdCallback={this.updateArbeidsforhold}
          leggTilPeriode={this.updateArbeidsforhold}
          submittable={submittable}
        />
        )}
      </FaktaGruppe>
    );
  }
}

ArbeidsforholdFaktaPanel.propTypes = {
  arbeidsforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  formName: PropTypes.string.isRequired,
  submittable: PropTypes.bool.isRequired,
  settErArbeidsforholdValgt: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => {
  const arbeidsforhold = behandlingFormValueSelector(props.formName)(state, 'arbeidsforhold');
  arbeidsforhold.sort((a, b) => a.arbeidsgiverNavn.localeCompare(b.arbeidsgiverNavn));
  return {
    arbeidsforhold,
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), behandlingSelectors.getBehandlingVersjon(state)),
  };
};

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidsforholdFaktaPanel);
