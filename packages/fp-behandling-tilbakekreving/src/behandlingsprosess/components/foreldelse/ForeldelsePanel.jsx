import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';
import {
  FadingPanel, VerticalSpacer, FlexRow, FlexColumn,
} from '@fpsak-frontend/shared-components';
import { Hovedknapp } from 'nav-frontend-knapper';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from 'behandlingTilbakekreving/src/behandlingForm';
import { getBehandlingVersjon, getForeldelsePerioder } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckTilbake';
import { addClassNameGroupIdToPerioder } from '../felles/behandlingspunktTimelineSkjema/BpTimelineHelper';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import ForeldelseForm from './ForeldelseForm';
import styles from './foreldelsePanel.less';

const ACTIVITY_PANEL_NAME = 'foreldelsesresultatActivity';
const formName = 'ForeldelseForm';
const foreldelseAksjonspunkter = [
  aksjonspunktCodes.VURDER_FORELDELSE,
];
export const getKjonn = person => (person.erKvinne ? 'K' : 'M');

const ForeldelsePanelImpl = ({
  foreldelsesresultatActivity,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  fagsakPerson,
  isApOpen,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Foreldelse" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      {!isApOpen && (
        <div className={styles.bold}>
          <FlexRow>
            <FlexColumn>
              <FormattedMessage id="Foreldelse.Foreldelsesloven" />
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer eightPx />
          <FlexRow>
            <FlexColumn>
              <FormattedMessage id="Foreldelse.AutomatiskVurdert" />
            </FlexColumn>
          </FlexRow>
        </div>
      )
      }
      {foreldelsesresultatActivity && isApOpen && (
        <>
          <BpTimelinePanel
            hovedsokerKjonnKode={getKjonn(fagsakPerson)}
            resultatActivity={foreldelsesresultatActivity}
            activityPanelName={ACTIVITY_PANEL_NAME}
            behandlingFormPrefix={behandlingFormPrefix}
            reduxFormChange={formChange}
            reduxFormInitialize={formInitialize}
            formName={formName}
          >
            <ForeldelseForm
              behandlingFormPrefix={behandlingFormPrefix}
              formName={formName}
              activityPanelName={ACTIVITY_PANEL_NAME}
            />
          </BpTimelinePanel>
          <VerticalSpacer twentyPx />
          <FlexRow>
            <FlexColumn>
              <Hovedknapp
                mini
                disabled={false}
                spinner={formProps.submitting}
              >
                <FormattedMessage id="Uttak.Confirm" />
              </Hovedknapp>
            </FlexColumn>
          </FlexRow>
        </>
      )
      }
    </FadingPanel>
  </form>
);

ForeldelsePanelImpl.propTypes = {
  foreldelsesresultatActivity: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  fagsakPerson: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
};

export const transformValues = values => [{
  ...values,
  kode: '5555',
}];

export const buildInitialValues = foreldelsePerioder => ({
  foreldelsesresultatActivity: addClassNameGroupIdToPerioder(foreldelsePerioder),
});

const mapStateToProps = (state, ownProps) => {
  const foreldelsePerioderResultat = getForeldelsePerioder(state).periodeDtoListe;
  return {
    initialValues: buildInitialValues(foreldelsePerioderResultat),
    foreldelsesresultatActivity: behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    fagsakPerson: getFagsakPerson(state),
    onSubmit: values => ownProps.submitCallback(transformValues(values)),
  };
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const ForeldelsePanel = connect(mapStateToProps, mapDispatchToProps)(injectIntl(behandlingForm({
  form: formName,
  enableReinitialize: true,
})(ForeldelsePanelImpl)));

ForeldelsePanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.FORELDELSE || foreldelseAksjonspunkter.some(ap => apCodes.includes(ap));

export default ForeldelsePanel;
