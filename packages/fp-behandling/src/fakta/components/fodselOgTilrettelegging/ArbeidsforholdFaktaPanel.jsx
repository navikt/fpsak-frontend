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
    this.initializeArbforholdForm({});
    this.setState({ selectedArbeidsforhold });
  }

  initializeArbforholdForm() {
    const { reduxFormInitialize: formInitialize, behandlingFormPrefix } = this.props;
    formInitialize(`${behandlingFormPrefix}.${'selectedFodselOgTilretteleggingForm'}`);
  }

  cancelArbeidsforhold() {
    this.initializeArbforholdForm({});
    this.setState({ selectedArbeidsforhold: undefined });
  }

  updateArbeidsforhold(values) {
    const { reduxFormChange: formChange, behandlingFormPrefix, arbforhold } = this.props;
    // concat med nye verdier
    formChange(`${behandlingFormPrefix}.${'FodselOgTilretteleggingForm'}`, 'arbforhold', fieldValues);
  }

  render() {
    const {
      arbforhold,
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
};

ArbeidsforholdFaktaPanel.defaultProps = {
};


const mapStateToProps = (state, props) => {
  const arbforhold = behandlingFormValueSelector(props.formName)(state, 'arbforhold');
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
