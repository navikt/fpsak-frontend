import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './FullPersonInfo';

/**
 * UtfyllendePersoninfoPanel
 */
export class UtfyllendePersoninfoPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
    this.setSelected = this.setSelected.bind(this);
  }

  setSelected(parent) {
    const { selected } = this.state;
    if (selected === parent) {
      this.setState({ selected: null });
    } else {
      this.setState({ selected: parent });
    }
  }

  render() {
    const {
      sprakkode,
      personopplysninger,
      alleKodeverk,
    } = this.props;

    const sivilstandTypes = alleKodeverk[kodeverkTyper.SIVILSTAND_TYPE];
    const personstatusTypes = alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE];

    const { selected } = this.state;
    const isPrimaryParent = personopplysninger === selected;
    return (
      <EkspanderbartPersonPanel
        primaryParent={personopplysninger}
        secondaryParent={personopplysninger.annenPart}
        hasOpenAksjonspunkter={false}
        readOnly
        setSelected={this.setSelected}
        selected={selected}
      >
        {selected && (
          <>
            <FullPersonInfo
              personopplysning={selected}
              isPrimaryParent={isPrimaryParent}
              sprakkode={sprakkode}
              sivilstandTypes={sivilstandTypes}
              personstatusTypes={personstatusTypes}
              getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
            />
            <VerticalSpacer eightPx />
          </>
        )}
      </EkspanderbartPersonPanel>
    );
  }
}

UtfyllendePersoninfoPanel.propTypes = {
  personopplysninger: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default UtfyllendePersoninfoPanel;
