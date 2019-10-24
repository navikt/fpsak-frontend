import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';

import {
  behandlingForm, faktaPanelCodes, withDefaultToggling, getKodeverknavnFn,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import personAksjonspunkterPropType from '../propTypes/personAksjonspunkterPropType';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './FullPersonInfo';
import utlandSakstypeKode from './utland/utlandSakstypeKode';

const {
  AUTOMATISK_MARKERING_AV_UTENLANDSSAK, MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
} = aksjonspunktCodes;

const getUtlandSakstype = (aksjonspunkter) => {
  if (hasAksjonspunkt(AUTOMATISK_MARKERING_AV_UTENLANDSSAK, aksjonspunkter)) {
    return utlandSakstypeKode.EØS_BOSATT_NORGE;
  }
  if (hasAksjonspunkt(MANUELL_MARKERING_AV_UTLAND_SAKSTYPE, aksjonspunkter)) {
    return aksjonspunkter.find((ap) => ap.definisjon.kode === MANUELL_MARKERING_AV_UTLAND_SAKSTYPE).begrunnelse;
  }
  return utlandSakstypeKode.NASJONAL;
};

/**
 * UtfyllendePersoninfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Tilleggsopplysninger.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export class UtfyllendePersoninfoPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
    this.setSelected = this.setSelected.bind(this);
    this.getYtelser = this.getYtelser.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { openInfoPanels } = this.props;
    const { selected } = this.state;
    if (openInfoPanels !== nextProps.openInfoPanels) {
      const pers = selected !== null ? selected : nextProps.personopplysninger;
      this.setState({ selected: nextProps.openInfoPanels.includes(faktaPanelCodes.PERSON) ? pers : null });
    }
  }

  setSelected(parent) {
    const { toggleInfoPanelCallback } = this.props;
    const { selected } = this.state;
    if (selected === parent) {
      this.setState({ selected: null });
      toggleInfoPanelCallback(faktaPanelCodes.PERSON);
    } else {
      if (selected === null) {
        toggleInfoPanelCallback(faktaPanelCodes.PERSON);
      }
      this.setState({ selected: parent });
    }
  }

  getYtelser(primaryParent) {
    const { relatertTilgrensendeYtelserForSoker, relatertTilgrensendeYtelserForAnnenForelder } = this.props;
    const { selected } = this.state;
    return selected.aktoerId === primaryParent.aktoerId
      ? relatertTilgrensendeYtelserForSoker
      : relatertTilgrensendeYtelserForAnnenForelder;
  }

  render() {
    const {
      behandlingId,
      behandlingVersjon,
      sprakkode,
      personopplysninger,
      hasOpenAksjonspunkter,
      readOnly,
      readOnlyOriginal,
      submitCallback,
      aksjonspunkter,
      featureToggleUtland,
      alleKodeverk,
      ...formProps
    } = this.props;

    const sivilstandTypes = alleKodeverk[kodeverkTyper.SIVILSTAND_TYPE];
    const personstatusTypes = alleKodeverk[kodeverkTyper.PERSONSTATUS_TYPE];
    const relatertYtelseTypes = alleKodeverk[kodeverkTyper.RELATERT_YTELSE_TYPE];
    const relatertYtelseStatus = [
      ...alleKodeverk[kodeverkTyper.FAGSAK_STATUS],
      ...alleKodeverk[kodeverkTyper.RELATERT_YTELSE_TILSTAND],
    ];

    const { selected } = this.state;
    const { barn } = personopplysninger.barn;
    const isPrimaryParent = personopplysninger === selected;
    return (
      <EkspanderbartPersonPanel
        primaryParent={personopplysninger}
        secondaryParent={personopplysninger.annenPart}
        hasOpenAksjonspunkter={hasOpenAksjonspunkter}
        readOnly={readOnly}
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
            isPrimaryParent={isPrimaryParent}
            ytelser={this.getYtelser(personopplysninger)}
            sprakkode={sprakkode}
            relatertYtelseTypes={relatertYtelseTypes}
            relatertYtelseStatus={relatertYtelseStatus}
            hasAksjonspunkter={aksjonspunkter.length > 0}
            hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            utlandSakstype={getUtlandSakstype(aksjonspunkter)}
            readOnly={readOnlyOriginal}
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
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnlyOriginal: PropTypes.bool.isRequired,
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

const personAksjonspunkter = [AUTOMATISK_MARKERING_AV_UTENLANDSSAK, MANUELL_MARKERING_AV_UTLAND_SAKSTYPE];

export default withDefaultToggling(faktaPanelCodes.PERSON, personAksjonspunkter)(behandlingForm({ form: 'PersonInfoPanel' })(UtfyllendePersoninfoPanel));