import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';

import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import { omit } from 'utils/objectUtils';
import { getKodeverk } from 'kodeverk/duck';
import kodeverkTyper from 'kodeverk/kodeverkTyper';
import {
  getBehandlingRelatertTilgrensendeYtelserForAnnenForelder,
  getBehandlingRelatertTilgrensendeYtelserForSoker,
  getBehandlingSprak,
  getPersonopplysning,
  getBehandlingArbeidsforhold,
} from 'behandling/behandlingSelectors';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import { behandlingForm } from 'behandling/behandlingForm';
import withDefaultToggling from 'fakta/withDefaultToggling';
import faktaPanelCodes from 'fakta/faktaPanelCodes';
import EkspanderbartPersonPanel from './EkspanderbartPersonPanel';
import FullPersonInfo from './panelBody/FullPersonInfo';
import PersonArbeidsforholdPanel from './panelBody/arbeidsforhold/PersonArbeidsforholdPanel';

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
      sprakkode, relatertYtelseStatus, relatertYtelseTypes, personopplysninger,
      hasOpenAksjonspunkter, readOnly, aksjonspunkter, isBekreftButtonReadOnly, ...formProps
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
            readOnly={readOnly}
          />
          {isPrimaryParent && aksjonspunkter.length > 0
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
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
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
  arbeidsforhold: values.arbeidsforhold.map(a => omit(a, 'erEndret', 'replaceOptions', 'originalFomDato')),
  kode: aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD,
});

const mapStateToProps = (state, initialProps) => ({
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
  initialValues: PersonArbeidsforholdPanel.buildInitialValues(getBehandlingArbeidsforhold(state)),
  onSubmit: values => initialProps.submitCallback([transformValues(values)]),
  dirty: !initialProps.notSubmittable && initialProps.dirty,
});

const personAksjonspunkter = [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD];

const ConnectedComponent = connect(mapStateToProps)(behandlingForm({
  form: 'PersonInfoPanel',
})(PersonInfoPanelImpl));

const PersonInfoPanel = withDefaultToggling(faktaPanelCodes.PERSON, personAksjonspunkter)(ConnectedComponent);

PersonInfoPanel.supports = aksjonspunkter => aksjonspunkter.some(ap => ap.definisjon.kode === personAksjonspunkter[0]);

export default PersonInfoPanel;
