import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { change as reduxFormChange, initialize as reduxFormInitialize } from 'redux-form';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import { BehandlingspunktSubmitButton, FaktaGruppe, getBehandlingFormPrefix } from '@fpsak-frontend/fp-behandling-felles';
import {
  FadingPanel, VerticalSpacer, FlexRow, FlexColumn, AksjonspunktHelpText,
} from '@fpsak-frontend/shared-components';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils';
import navBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import {
  behandlingFormTilbakekreving, behandlingFormValueSelector, isBehandlingFormDirty,
  hasBehandlingFormErrorsOfType, isBehandlingFormSubmitting,
} from 'behandlingTilbakekreving/src/behandlingFormTilbakekreving';
import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getSelectedBehandlingId, getFagsakPerson } from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import { addClassNameGroupIdToPerioder } from '../felles/behandlingspunktTimelineSkjema/BpTimelineHelper';
import BpTimelinePanel from '../felles/behandlingspunktTimelineSkjema/BpTimelinePanel';
import ForeldelseForm from './ForeldelseForm';
import tilbakekrevingAksjonspunktCodes from '../../../kodeverk/tilbakekrevingAksjonspunktCodes';

import styles from './foreldelsePanel.less';

const ACTIVITY_PANEL_NAME = 'foreldelsesresultatActivity';
const formName = 'ForeldelseForm';
const foreldelseAksjonspunkter = [
  tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE,
];

const getDate = () => moment().subtract(30, 'months').format(DDMMYYYY_DATE_FORMAT);
const getApTekst = apCode => (apCode
  ? [<FormattedMessage id={`Foreldelse.AksjonspunktHelpText.${apCode}`} key="vurderForeldelse" values={{ dato: getDate() }} />]
  : []);

export const ForeldelsePanelImpl = ({
  foreldelsesresultatActivity,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  reduxFormInitialize: formInitialize,
  kjonn,
  isApOpen,
  apCodes,
  readOnlySubmitButton,
  readOnly,
  merknaderFraBeslutter,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <FadingPanel>
      <FaktaGruppe
        aksjonspunktCode={tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE}
        merknaderFraBeslutter={merknaderFraBeslutter}
        withoutBorder
      >
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
              hovedsokerKjonnKode={kjonn}
              resultatActivity={foreldelsesresultatActivity}
              detailPanelForm={ACTIVITY_PANEL_NAME}
              fieldNameToStoreDetailInfo={ACTIVITY_PANEL_NAME}
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
            <BehandlingspunktSubmitButton
              formName={formName}
              isReadOnly={readOnly}
              isSubmittable={!readOnlySubmitButton}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </>
        )
        }
      </FaktaGruppe>
    </FadingPanel>
  </form>
);

ForeldelsePanelImpl.propTypes = {
  foreldelsesresultatActivity: PropTypes.arrayOf(PropTypes.shape()),
  behandlingFormPrefix: PropTypes.string.isRequired,
  reduxFormChange: PropTypes.func.isRequired,
  reduxFormInitialize: PropTypes.func.isRequired,
  kjonn: PropTypes.string.isRequired,
  isApOpen: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string),
  readOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  merknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool.isRequired,
  }).isRequired,
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

const mapStateToPropsFactory = (initialState, ownProps) => {
  const submitCallback = values => ownProps.submitCallback(transformValues(values, ownProps.apCodes[0]));
  return state => ({
    initialValues: buildInitialValues(behandlingSelectors.getForeldelsePerioder(state).perioder),
    foreldelsesresultatActivity: behandlingFormValueSelector(formName)(state, ACTIVITY_PANEL_NAME),
    behandlingFormPrefix: getBehandlingFormPrefix(getSelectedBehandlingId(state), behandlingSelectors.getBehandlingVersjon(state)),
    kjonn: getFagsakPerson(state).erKvinne ? navBrukerKjonn.KVINNE : navBrukerKjonn.MANN,
    merknaderFraBeslutter: behandlingSelectors.getMerknaderFraBeslutter(tilbakekrevingAksjonspunktCodes.VURDER_FORELDELSE)(state),
    onSubmit: submitCallback,
  });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators({
    reduxFormChange,
    reduxFormInitialize,
  }, dispatch),
});

const ForeldelsePanel = connect(mapStateToPropsFactory, mapDispatchToProps)(injectIntl(behandlingFormTilbakekreving({
  form: formName,
})(ForeldelsePanelImpl)));

ForeldelsePanel.supports = (bp, apCodes) => bp === behandlingspunktCodes.FORELDELSE || foreldelseAksjonspunkter.some(ap => apCodes.includes(ap));

export default ForeldelsePanel;
