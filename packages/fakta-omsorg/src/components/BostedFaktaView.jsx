import React from 'react';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';

import { FaktaGruppe } from '@fpsak-frontend/shared-components';
import BostedSokerFaktaIndex from '@fpsak-frontend/fakta-bosted-soker';

import omsorgPersonopplysningerPropType from '../propTypes/omsorgPersonopplysningerPropType';
import BostedBarnView from './BostedBarnView';

import styles from './bostedFaktaView.less';

const BostedFaktaView = ({
  personopplysning,
  ektefellePersonopplysning,
  className,
  alleKodeverk,
}) => (
  <div className={className}>
    <FaktaGruppe titleCode="BostedFaktaView.BosattAdresser">
      <Row>
        <Column xs="6">
          {personopplysning.barn.map((b, index) => (
            <BostedBarnView key={b.navn} barn={b} barnNr={index + 1} />
          ))}
        </Column>
        <Column xs="6">
          <BostedSokerFaktaIndex personopplysninger={personopplysning} alleKodeverk={alleKodeverk} />
          {ektefellePersonopplysning && (
            <BostedSokerFaktaIndex sokerTypeTextId="BostedFaktaView.ForelderTo" personopplysninger={ektefellePersonopplysning} alleKodeverk={alleKodeverk} />
          )}
        </Column>
      </Row>
    </FaktaGruppe>
  </div>
);

BostedFaktaView.propTypes = {
  personopplysning: omsorgPersonopplysningerPropType.isRequired,
  ektefellePersonopplysning: omsorgPersonopplysningerPropType,
  className: PropTypes.string,
  alleKodeverk: PropTypes.shape().isRequired,
};

BostedFaktaView.defaultProps = {
  ektefellePersonopplysning: undefined,
  className: styles.defaultBostedFakta,
};


export default BostedFaktaView;
