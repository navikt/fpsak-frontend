import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';

import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { getSelectedBehandlingId } from 'behandlingForstegangOgRevurdering/src/duck';
import {
  getBehandlingVersjon,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import FaktaGruppe from 'behandlingForstegangOgRevurdering/src/fakta/components/FaktaGruppe';
import ArbeidsforholdTable from './ArbeidsforholdTable';
import ArbeidsforholdInnhold from './ArbeidsforholdInnhold';

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
    };
    this.initializeArbforholdForm(initialValues);
    this.setState({ selectedArbeidsforhold });
  }

  initializeArbforholdForm(selectedArbeidsforhold) {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${'selectedFodselOgTilretteleggingForm'}`, selectedArbeidsforhold);
  }

  cancelArbeidsforhold() {
    this.initializeArbforholdForm({});
    this.setState({ selectedArbeidsforhold: undefined });
  }

  updateArbeidsforhold(values) {
    const { reduxFormChange: formChange, behandlingFormPrefix, arbeidsforhold } = this.props;
    const otherThanUpdated = arbeidsforhold.filter(a => a.tilretteleggingId !== values.tilretteleggingId);
    const fieldValues = otherThanUpdated.concat(values).sort((a, b) => a.arbeidsgiverNavn.localeCompare(b.arbeidsgiverNavn));
    formChange(`${behandlingFormPrefix}.${'FodselOgTilretteleggingForm'}`, 'arbeidsforhold', fieldValues);
    this.setState({ selectedArbeidsforhold: undefined });
  }

  render() {
    const {
      arbeidsforhold,
      readOnly,
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
        <ArbeidsforholdInnhold
          readOnly={readOnly}
          selectedArbeidsforhold={selectedArbeidsforhold}
          cancelArbeidsforholdCallback={this.cancelArbeidsforhold}
          updateArbeidsforholdCallback={this.updateArbeidsforhold}
        />
        )
      }
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
};

const mapStateToProps = (state, props) => {
  const arbeidsforhold = behandlingFormValueSelector(props.formName)(state, 'arbeidsforhold');
  arbeidsforhold.sort((a, b) => a.arbeidsgiverNavn.localeCompare(b.arbeidsgiverNavn));
  return {
    arbeidsforhold,
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArbeidsforholdFaktaPanel);
