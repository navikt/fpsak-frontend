import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';

import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { behandlingForm, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import personAksjonspunkterPropType from '../propTypes/personAksjonspunkterPropType';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './FullPersonInfo';

const {
  AUTOMATISK_MARKERING_AV_UTENLANDSSAK, MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
} = aksjonspunktCodes;

const personAksjonspunkter = [AUTOMATISK_MARKERING_AV_UTENLANDSSAK, MANUELL_MARKERING_AV_UTLAND_SAKSTYPE];

/**
 * UtfyllendePersoninfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Tilleggsopplysninger.
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
      behandlingId,
      behandlingVersjon,
      sprakkode,
      personopplysninger,
      readOnly,
      submitCallback,
      aksjonspunkter,
      featureToggleUtland,
      alleKodeverk,
      familiehendelseRegister,
      ...formProps
    } = this.props;

    const filteredAps = aksjonspunkter.filter((ap) => personAksjonspunkter.includes(ap.definisjon.kode));
    const hasOpenAksjonspunkter = filteredAps.filter((ap) => isAksjonspunktOpen(ap.status.kode)).length > 0;
    const readOnlyTweaked = readOnly || !filteredAps.some((a) => a.erAktivt);


    const sivilstandTypes = alleKodeverk[kodeverkTyper.SIVILSTAND_TYPE];
    const personstatusTypes = alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE];

    const { selected } = this.state;
    const { barn } = personopplysninger.barn;
    const isPrimaryParent = personopplysninger === selected;
    return (
      <EkspanderbartPersonPanel
        primaryParent={personopplysninger}
        secondaryParent={personopplysninger.annenPart}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnlyTweaked}
        setSelected={this.setSelected}
        selected={selected}
      >
        {selected
        && (
        <form onSubmit={formProps.handleSubmit}>
          <FullPersonInfo
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            personopplysning={selected}
            familiehendelseRegister={familiehendelseRegister}
            isPrimaryParent={isPrimaryParent}
            sprakkode={sprakkode}
            hasAksjonspunkter={filteredAps.length > 0}
            hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            readOnly={readOnly}
            submitCallback={submitCallback}
            sivilstandTypes={sivilstandTypes}
            personstatusTypes={personstatusTypes}
            regBarn={barn}
            featureToggleUtland={featureToggleUtland || true}
            getKodeverknavn={getKodeverknavnFn(alleKodeverk, kodeverkTyper)}
          />
          <VerticalSpacer eightPx />
        </form>
        )}
      </EkspanderbartPersonPanel>
    );
  }
}

UtfyllendePersoninfoPanel.propTypes = {
  personopplysninger: PropTypes.shape().isRequired,
  relatertTilgrensendeYtelserForSoker: PropTypes.arrayOf(PropTypes.shape()),
  relatertTilgrensendeYtelserForAnnenForelder: PropTypes.arrayOf(PropTypes.shape()),
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func,
  aksjonspunkter: PropTypes.arrayOf(personAksjonspunkterPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  ...formPropTypes,
};

UtfyllendePersoninfoPanel.defaultProps = {
  relatertTilgrensendeYtelserForSoker: undefined,
  relatertTilgrensendeYtelserForAnnenForelder: undefined,
  submitCallback: undefined,
};

export default behandlingForm({ form: 'PersonInfoPanel' })(UtfyllendePersoninfoPanel);
