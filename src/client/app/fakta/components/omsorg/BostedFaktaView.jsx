import React from 'react';
import { Row, Column } from 'nav-frontend-grid';
import personopplysningPropType from 'behandling/proptypes/personopplysningPropType';
import FaktaGruppe from 'fakta/components/FaktaGruppe';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import BostedSokerView from 'fakta/components/BostedSokerView';
import BostedBarnView from './BostedBarnView';
import styles from './bostedFaktaView.less';

const BostedFaktaView = ({
  personopplysning,
  ektefellePersonopplysning,
  className,
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
          <BostedSokerView typeSoker={<FormattedMessage id="BostedFaktaView.Soker" />} soker={personopplysning} />
          {ektefellePersonopplysning
          && <BostedSokerView typeSoker={<FormattedMessage id="BostedFaktaView.ForelderTo" />} soker={ektefellePersonopplysning} />
        }
        </Column>
      </Row>
    </FaktaGruppe>
  </div>
);

BostedFaktaView.propTypes = {
  personopplysning: personopplysningPropType.isRequired,
  ektefellePersonopplysning: personopplysningPropType,
  className: PropTypes.string,
};

BostedFaktaView.defaultProps = {
  ektefellePersonopplysning: undefined,
  className: styles.defaultBostedFakta,
};


export default BostedFaktaView;
