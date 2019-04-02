import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, FlexRow, FlexColumn, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';

import {
  behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingTilbakekreving/src/behandlingForm';
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
const getDate = () => moment().subtract(30, 'months').format(DDMMYYYY_DATE_FORMAT);
const getApTekst = apCode => (apCode
  ? [<FormattedMessage id={`Foreldelse.AksjonspunktHelpText.${apCode}`} key="vurderForeldelse" values={{ dato: getDate() }} />]
  : []);

export const ForeldelsePanelImpl = ({
  foreldelsesresultatActivity,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  fagsakPerson,
  isApOpen,
  apCodes,
  readOnlySubmitButton,
  readOnly,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <Undertittel>
        <FormattedMessage id="Behandlingspunkt.Foreldelse" />
      </Undertittel>
      <VerticalSpacer twentyPx />
      {!apCodes[0] && (
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
      {foreldelsesresultatActivity && apCodes[0] && (
        <>
          <AksjonspunktHelpText isAksjonspunktOpen={isApOpen}>
            { getApTekst(apCodes[0]) }
          </AksjonspunktHelpText>
          <VerticalSpacer twentyPx />
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
              readOnly={readOnly}
            />
          </BpTimelinePanel>
          <VerticalSpacer twentyPx />
          <FlexRow>
            <FlexColumn>
              <BehandlingspunktSubmitButton
                formName={formName}
                isReadOnly={readOnly}
                isSubmittable={!readOnlySubmitButton}
                isBehandlingFormSubmitting={isBehandlingFormSubmitting}
                isBehandlingFormDirty={isBehandlingFormDirty}
                hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
              />
            </FlexColumn>
          </FlexRow>
        </>
      )
      }
    </FadingPanel>
  </form>
);

ForeldelsePanelImpl.propTypes = {
  foreldelsesresultatActivity: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  isApOpen: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
};

ForeldelsePanelImpl.defaultProps = {
  foreldelsesresultatActivity: undefined,
  apCodes: undefined,
};

export const transformValues = (values, apCode) => {
  const foreldelsePerioder = values.foreldelsesresultatActivity.map(period => ({
    fraDato: period.fom,
    tilDato: period.tom,
    begrunnelse: period.begrunnelse,
    foreldelseVurderingType: period.foreldet,
  }));
  return [
    {
      foreldelsePerioder,
      kode: apCode,
    }];
};
export const buildInitialValues = foreldelsePerioder => ({
  foreldelsesresultatActivity: addClassNameGroupIdToPerioder(foreldelsePerioder),
});

const mapStateToProps = (state, ownProps) => {
  const foreldelsePerioderResultat = getForeldelsePerioder(state).perioder;
  return {
    initialValues: buildInitialValues(foreldelsePerioderResultat),
    foreldelsesresultatActivity: behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), getBehandlingVersjon(state)),
    fagsakPerson: getFagsakPerson(state),
    onSubmit: values => ownProps.submitCallback(transformValues(values, ownProps.apCodes[0])),
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
})(ForeldelsePanelImpl)));

ForeldelsePanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.FORELDELSE || foreldelseAksjonspunkter.some(ap => apCodes.includes(ap));

export default ForeldelsePanel;
