import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';

import { behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingFpsak/src/behandlingForm';
import { getSelectedBehandlingId } from 'behandlingFpsak/src/duck';
import {
  getBehandlingVersjon,
} from 'behandlingFpsak/src/behandlingSelectors';
import FaktaGruppe from 'behandlingFpsak/src/fakta/components/FaktaGruppe';
import ArbeidsforholdTable from './ArbeidsforholdTable';
import ArbeidsforholdInnhold from './ArbeidsforholdInnhold';

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
      jordmorTilretteleggingFra: selectedArbeidsforhold.jordmor.tilretteleggingFra,
      begrunnelse: selectedArbeidsforhold.begrunnelse,
      kanGjennomfores: selectedArbeidsforhold.kanGjennomfores.kanGjennomfores,
      kanGjennomforesDato: selectedArbeidsforhold.kanGjennomfores.dato,
      kanIkkeGjennomfores: selectedArbeidsforhold.kanIkkeGjennomfores.kanIkkeGjennomfores,
      kanIkkeGjennomforesDato: selectedArbeidsforhold.kanIkkeGjennomfores.dato,
      redusertArbeid: selectedArbeidsforhold.redusertArbeid.redusertArbeid,
      redusertArbeidDato: selectedArbeidsforhold.redusertArbeid.dato,
      redusertArbeidStillingsprosent: selectedArbeidsforhold.redusertArbeid.stillingsprosent,
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
    const { reduxFormChange: formChange, behandlingFormPrefix, arbforhold } = this.props;
    const otherThanUpdated = arbforhold.filter(a => a.id !== values.id);
    const fieldValues = otherThanUpdated.concat(values).sort((a, b) => a.navn.localeCompare(b.navn));
    formChange(`${behandlingFormPrefix}.${'FodselOgTilretteleggingForm'}`, 'arbforhold', fieldValues);
    this.setState({ selectedArbeidsforhold: undefined });
  }

  render() {
    const {
      arbforhold,
      readOnly,
    } = this.props;
    const { selectedArbeidsforhold } = this.state;
    return (
      <FaktaGruppe titleCode="ArbeidsforholdFaktaPanel.Faktagruppe">
        <ArbeidsforholdTable
          arbeidsforhold={arbforhold}
          selectArbeidsforholdCallback={this.setSelectedArbeidsforhold}
          selectedArbeidsforhold={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
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
  arbforhold: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

const mapStateToProps = (state, props) => {
  const arbforhold = behandlingFormValueSelector(props.formName)(state, 'arbforhold');
  arbforhold.sort((a, b) => a.navn.localeCompare(b.navn));
  return {
    arbforhold,
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
