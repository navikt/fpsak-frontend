import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Panel from 'nav-frontend-paneler';
import { Hovedknapp } from 'nav-frontend-knapper';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { PersonIndex } from '@fpsak-frontend/person-info';
import { behandlingForm } from '@fpsak-frontend/fp-felles';
import { AksjonspunktHelpText } from '@fpsak-frontend/shared-components';

import personAksjonspunkterPropType from '../propTypes/personAksjonspunkterPropType';

import styles from './grunnleggendePersoninfoPanel.less';

const personAksjonspunkter = [aksjonspunktCodes.AUTOMATISK_MARKERING_AV_UTENLANDSSAK];
const erMarkertUtenlandssak = (aksjonspunkter) => aksjonspunkter.some((ap) => ap.definisjon.kode === personAksjonspunkter[0]);

/**
 * Viser grunnleggende personinformasjon. Dette panelet blir
 * vist som del av søkeresultatet, når fagsaken ikke har behandling eller ved papirsøknad
 */
const GrunnleggendePersoninfoPanel = ({
  person,
  aksjonspunkter,
  readOnly,
  ...formProps
}) => (
  <Panel>
    {person && (
      <PersonIndex person={person} />
    )}
    {erMarkertUtenlandssak(aksjonspunkter) && (
      <form onSubmit={formProps.handleSubmit}>
        <div className={styles.bekreftAksjonspunktContainer}>
          <AksjonspunktHelpText isAksjonspunktOpen>
            {[<FormattedMessage key="OpptjeningUtland" id="PersonInfoPanel.OpptjeningUtland" />]}
          </AksjonspunktHelpText>
          {!readOnly && (
            <Hovedknapp mini className={styles.button} spinner={formProps.submitting} disabled={formProps.submitting}>
              <FormattedMessage id="PersonIndexPanel.Ok" />
            </Hovedknapp>
          )}
        </div>
      </form>
    )}
  </Panel>
);

GrunnleggendePersoninfoPanel.propTypes = {
  person: PropTypes.shape(),
  aksjonspunkter: PropTypes.arrayOf(personAksjonspunkterPropType).isRequired,
  readOnly: PropTypes.bool.isRequired,
};

GrunnleggendePersoninfoPanel.defaultProps = {
  person: undefined,
};

const mapStateToPropsFactory = (initialState, ownProps) => {
  const onSubmit = () => ownProps.submitCallback([{
    kode: personAksjonspunkter[0],
    begrunnelse: '',
  }]);
  return () => ({
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: 'PersonIndexPanel',
})(GrunnleggendePersoninfoPanel));
