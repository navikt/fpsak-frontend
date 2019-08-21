import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes, featureToggle } from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes, { hasAksjonspunkt } from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { getKodeverk, getFeatureToggles } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import {
  getBehandlingRelatertTilgrensendeYtelserForAnnenForelder,
  getBehandlingRelatertTilgrensendeYtelserForSoker,
  getPersonopplysning,
} from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { behandlingFormForstegangOgRevurdering } from 'behandlingForstegangOgRevurdering/src/behandlingFormForstegangOgRevurdering';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './panelBody/FullPersonInfo';
import utlandSakstypeKode from './panelBody/utland/utlandSakstypeKode';

const {
  AUTOMATISK_MARKERING_AV_UTENLANDSSAK, MANUELL_MARKERING_AV_UTLAND_SAKSTYPE,
} = aksjonspunktCodes;

const getUtlandSakstype = (aksjonspunkter) => {
  if (hasAksjonspunkt(AUTOMATISK_MARKERING_AV_UTENLANDSSAK, aksjonspunkter)) {
    return utlandSakstypeKode.EØS_BOSATT_NORGE;
  }
  if (hasAksjonspunkt(MANUELL_MARKERING_AV_UTLAND_SAKSTYPE, aksjonspunkter)) {
    return aksjonspunkter.find(ap => ap.definisjon.kode === MANUELL_MARKERING_AV_UTLAND_SAKSTYPE).begrunnelse;
  }
  return utlandSakstypeKode.NASJONAL;
};

/**
 * PersonInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp Redux Formen for Tilleggsopplysninger.
 * Denne brukes også funksjonen withDefaultToggling for å håndtere automatisk åpning av panelet
 * når det finnes åpne aksjonspunkter.
 */
export class PersonInfoPanelImpl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: null,
    };
    this.setSelected = this.setSelected.bind(this);
    this.getYtelser = this.getYtelser.bind(this);
  }

  componentWillReceiveProps(nextProps) {
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
      sprakkode,
      relatertYtelseStatus,
      relatertYtelseTypes,
      personopplysninger,
      personstatusTypes,
      sivilstandTypes,
      hasOpenAksjonspunkter,
      readOnly,
      submitCallback,
      aksjonspunkter,
      featureToggleUtland,
      ...formProps
    } = this.props;
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
            personopplysning={selected}
            isPrimaryParent={isPrimaryParent}
            ytelser={this.getYtelser(personopplysninger)}
            sprakkode={sprakkode}
            relatertYtelseTypes={relatertYtelseTypes}
            relatertYtelseStatus={relatertYtelseStatus}
            hasAksjonspunkter={aksjonspunkter.length > 0}
            hasOpenAksjonspunkter={hasOpenAksjonspunkter}
            utlandSakstype={getUtlandSakstype(aksjonspunkter)}
            readOnly={readOnly}
            submitCallback={submitCallback}
            sivilstandTypes={sivilstandTypes}
            personstatusTypes={personstatusTypes}
            regBarn={barn}
            featureToggleUtland={featureToggleUtland || true}
          />
          <VerticalSpacer eightPx />
        </form>
        )
        }
      </EkspanderbartPersonPanel>
    );
  }
}

PersonInfoPanelImpl.propTypes = {
  personopplysninger: PropTypes.shape().isRequired,
  relatertTilgrensendeYtelserForSoker: PropTypes.arrayOf(PropTypes.shape()),
  relatertTilgrensendeYtelserForAnnenForelder: PropTypes.arrayOf(PropTypes.shape()),
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func,
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relatertYtelseStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  ...formPropTypes,
};

PersonInfoPanelImpl.defaultProps = {
  relatertTilgrensendeYtelserForSoker: undefined,
  relatertTilgrensendeYtelserForAnnenForelder: undefined,
  submitCallback: undefined,
};

const mapStateToPropsFactory = (initialState) => {
  const featureToggleUtland = getFeatureToggles(initialState)[featureToggle.MARKER_UTENLANDSSAK];
  const sivilstandTypes = getKodeverk(kodeverkTyper.SIVILSTAND_TYPE)(initialState);
  const personstatusTypes = getKodeverk(kodeverkTyper.PERSONSTATUS_TYPE)(initialState);
  const relatertYtelseTypes = getKodeverk(kodeverkTyper.RELATERT_YTELSE_TYPE)(initialState);
  const relatertYtelseStatus = [
    ...getKodeverk(kodeverkTyper.FAGSAK_STATUS)(initialState),
    ...getKodeverk(kodeverkTyper.RELATERT_YTELSE_TILSTAND)(initialState),
  ];

  return state => ({
    sivilstandTypes,
    personstatusTypes,
    relatertYtelseStatus,
    relatertYtelseTypes,
    featureToggleUtland,
    personopplysninger: getPersonopplysning(state),
    relatertTilgrensendeYtelserForSoker: getBehandlingRelatertTilgrensendeYtelserForSoker(state),
    relatertTilgrensendeYtelserForAnnenForelder: getBehandlingRelatertTilgrensendeYtelserForAnnenForelder(state),
    sprakkode: behandlingSelectors.getBehandlingSprak(state),
  });
};

const ConnectedComponent = connect(mapStateToPropsFactory)(behandlingFormForstegangOgRevurdering({ form: 'PersonInfoPanel' })(PersonInfoPanelImpl));
const personAksjonspunkter = [AUTOMATISK_MARKERING_AV_UTENLANDSSAK, MANUELL_MARKERING_AV_UTLAND_SAKSTYPE];
const PersonInfoPanel = withDefaultToggling(faktaPanelCodes.PERSON, personAksjonspunkter)(ConnectedComponent);
PersonInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => personAksjonspunkter.includes(ap.definisjon.kode));

export default PersonInfoPanel;
