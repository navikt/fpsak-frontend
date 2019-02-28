import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
  }

  setSelectedArbeidsforhold(event, id, selectedArbeidsforhold) {
    // this.initializeActivityForm(selectedArbeidsforhold);
    this.setState({ selectedArbeidsforhold });
  }

  cancelArbeidsforhold() {
    // this.initializeActivityForm({});
    this.setState({ selectedArbeidsforhold: undefined });
  }

  render() {
    const { tilrettelegging } = this.props;
    const { selectedArbeidsforhold } = this.state;
    return (
      <FaktaGruppe titleCode="ArbeidsforholdFaktaPanel.Faktagruppe">
        <ArbeidsforholdTable
          arbeidsforhold={tilrettelegging.arbforhold}
          selectArbeidsforholdCallback={this.setSelectedArbeidsforhold}
          selectedArbeidsforhold={selectedArbeidsforhold ? selectedArbeidsforhold.id : undefined}
        />
        {selectedArbeidsforhold
        && (
        <ArbeidsforholdInnhold
          selectedArbeidsforhold={selectedArbeidsforhold}
          cancelArbeidsforholdCallback={this.cancelArbeidsforhold}
        />
        )
      }
      </FaktaGruppe>
    );
  }
}
ArbeidsforholdFaktaPanel.propTypes = {
  tilrettelegging: PropTypes.shape().isRequired,
};

ArbeidsforholdFaktaPanel.defaultProps = {
};

export default ArbeidsforholdFaktaPanel;
