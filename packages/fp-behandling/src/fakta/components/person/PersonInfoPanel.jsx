import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import { getFeatureToggles } from 'app/duck';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { withDefaultToggling } from '@fpsak-frontend/fp-behandling-felles';
import { faktaPanelCodes, featureToggle } from '@fpsak-frontend/fp-felles';
import { omit } from '@fpsak-frontend/utils';
import { getKodeverk } from 'behandlingFpsak/src/duck';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import {
  getBehandlingRelatertTilgrensendeYtelserForAnnenForelder,
  getBehandlingRelatertTilgrensendeYtelserForSoker,
  getBehandlingSprak,
  getPersonopplysning,
  getBehandlingArbeidsforhold,
} from 'behandlingFpsak/src/behandlingSelectors';
import { ElementWrapper, VerticalSpacer } from '@fpsak-frontend/shared-components';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from 'behandlingFpsak/src/behandlingForm';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './panelBody/FullPersonInfo';
import PersonArbeidsforholdPanel from './panelBody/arbeidsforhold/PersonArbeidsforholdPanel';

const {
  AVKLAR_ARBEIDSFORHOLD, INNHENT_DOKUMENTASJON_FRA_UTENLANDS_TRYGDEMYNDIGHET,
} = aksjonspunktCodes;

const hasAksjonspunkt = (aksjonspunktCode, aksjonspunkter) => aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCode);
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
      aksjonspunkter,
      isBekreftButtonReadOnly,
      featureToggleUtland,
      ...formProps
    } = this.props;
    const { selected } = this.state;
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
            erUtenlandssak={hasAksjonspunkt(INNHENT_DOKUMENTASJON_FRA_UTENLANDS_TRYGDEMYNDIGHET, aksjonspunkter)}
            readOnly={readOnly}
            sivilstandTypes={sivilstandTypes}
            personstatusTypes={personstatusTypes}
            featureToggleUtland={featureToggleUtland}
          />
          {isPrimaryParent && hasAksjonspunkt(AVKLAR_ARBEIDSFORHOLD, aksjonspunkter)
            && (
            <ElementWrapper>
              <VerticalSpacer twentyPx />
              <Hovedknapp mini spinner={formProps.submitting} disabled={readOnly || isBekreftButtonReadOnly || formProps.submitting}>
                <FormattedMessage id="FullPersonInfo.Confirm" />
              </Hovedknapp>
            </ElementWrapper>
            )
          }
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
  isBekreftButtonReadOnly: PropTypes.bool.isRequired,
  relatertYtelseTypes: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  relatertYtelseStatus: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  ...formPropTypes,
};

PersonInfoPanelImpl.defaultProps = {
  relatertTilgrensendeYtelserForSoker: undefined,
  relatertTilgrensendeYtelserForAnnenForelder: undefined,
};

const transformValues = values => ({
  arbeidsforhold: values.arbeidsforhold.map(a => omit(a, 'erEndret', 'replaceOptions', 'originalFomDato',
    'brukUendretArbeidsforhold', 'fortsettUtenImAktivtArbeidsforhold')),
  kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
});

const buildInitialValues = createSelector(
  [getBehandlingArbeidsforhold],
  arbeidsforhold => ({
    ...PersonArbeidsforholdPanel.buildInitialValues(arbeidsforhold),
  }),
);

const mapStateToProps = (state, initialProps) => ({
  sivilstandTypes: getKodeverk(kodeverkTyper.SIVILSTAND_TYPE)(state),
  personstatusTypes: getKodeverk(kodeverkTyper.PERSONSTATUS_TYPE)(state),
  personopplysninger: getPersonopplysning(state),
  relatertTilgrensendeYtelserForSoker: getBehandlingRelatertTilgrensendeYtelserForSoker(state),
  relatertTilgrensendeYtelserForAnnenForelder: getBehandlingRelatertTilgrensendeYtelserForAnnenForelder(state),
  sprakkode: getBehandlingSprak(state),
  relatertYtelseTypes: getKodeverk(kodeverkTyper.RELATERT_YTELSE_TYPE)(state),
  relatertYtelseStatus: [
    ...getKodeverk(kodeverkTyper.FAGSAK_STATUS)(state),
    ...getKodeverk(kodeverkTyper.RELATERT_YTELSE_TILSTAND)(state),
  ],
  isBekreftButtonReadOnly: PersonArbeidsforholdPanel.isReadOnly(state),
  initialValues: buildInitialValues(state),
  onSubmit: values => initialProps.submitCallback([transformValues(values)]),
  dirty: !initialProps.notSubmittable && initialProps.dirty,
  featureToggleUtland: getFeatureToggles(state)[featureToggle.MARKER_UTENLANDSSAK],
});

const ConnectedComponent = connect(mapStateToProps)(behandlingForm({ form: 'PersonInfoPanel' })(PersonInfoPanelImpl));
const personAksjonspunkter = [AVKLAR_ARBEIDSFORHOLD, INNHENT_DOKUMENTASJON_FRA_UTENLANDS_TRYGDEMYNDIGHET];
const PersonInfoPanel = withDefaultToggling(faktaPanelCodes.PERSON, personAksjonspunkter)(ConnectedComponent);
PersonInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => personAksjonspunkter.includes(ap.definisjon.kode));

export default PersonInfoPanel;
