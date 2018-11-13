import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Undertittel } from 'nav-frontend-typografi';
import FadingPanel from '@fpsak-frontend/shared-components/FadingPanel';
import VerticalSpacer from '@fpsak-frontend/shared-components/VerticalSpacer';
import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import { Column, Row } from 'nav-frontend-grid';
import { getSimuleringResultat } from 'behandling/behandlingSelectors';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import AvregningSummary from './AvregningSummary';
import AvregningTable from './AvregningTable';

export class AvregningPanelImpl extends Component {
  constructor() {
    super();
    this.toggleDetails = this.toggleDetails.bind(this);

    this.state = {
      showDetails: [],
    };
  }

  toggleDetails(id) {
    const { showDetails } = this.state;
    const tableIndex = showDetails.findIndex(table => table.id === id);
    let newShowDetailsArray = [];

    if (tableIndex !== -1) {
      const updatedTable = {
        id,
        show: !showDetails[tableIndex].show,
      };

      newShowDetailsArray = [
        ...showDetails.slice(0, tableIndex),
        updatedTable,
        ...showDetails.slice(tableIndex + 1, showDetails.length - 1),
      ];
    } else {
      newShowDetailsArray = showDetails.concat({
        id,
        show: true,
      });
    }
    this.setState({ showDetails: newShowDetailsArray });
  }

  render() {
    const { showDetails } = this.state;
    const { simuleringResultat } = this.props;
    return (
      <FadingPanel>
        <Undertittel>
          <FormattedMessage id="Avregning.Title" />
        </Undertittel>
        <VerticalSpacer twentyPx />
        <div>
          <Row>
            <Column xs="12">
              <AvregningSummary
                fom={simuleringResultat.periodeFom}
                tom={simuleringResultat.periodeTom}
                feilutbetaling={simuleringResultat.sumFeilutbetaling}
                etterbetaling={simuleringResultat.sumEtterbetaling}
                inntrekk={simuleringResultat.sumInntrekk}
              />
              <AvregningTable
                showDetails={showDetails}
                toggleDetails={this.toggleDetails}
                simuleringResultat={simuleringResultat}
              />
            </Column>
          </Row>
        </div>
      </FadingPanel>
    );
  }
}

AvregningPanelImpl.propTypes = {
  simuleringResultat: PropTypes.shape().isRequired,
};

const mapStateToProps = state => ({
  simuleringResultat: getSimuleringResultat(state),
});

const AvregningPanel = connect(mapStateToProps)(injectIntl(AvregningPanelImpl));

AvregningPanel.supports = bp => bp === behandlingspunktCodes.AVREGNING;

export default AvregningPanel;
