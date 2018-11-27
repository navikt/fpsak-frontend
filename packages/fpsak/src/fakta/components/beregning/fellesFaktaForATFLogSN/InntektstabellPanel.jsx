import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import PropTypes from 'prop-types';

import styles from './InntektstabellPanel.less';


/**
 * Inntektstabell
 *
 *
 */
const InntektstabellPanel = ({
  tabell,
  hjelpeTekstId,
  children,
  skalViseTabell,
}) => (
  <ElementWrapper>
    {children}
    <div className={styles.fadeinTabell}>
      <VerticalSpacer sixteenPx />
      {hjelpeTekstId && (
      <Element>
        <FormattedMessage id={hjelpeTekstId} />
      </Element>)}
      {skalViseTabell
      && tabell
      }
    </div>
  </ElementWrapper>
);


InntektstabellPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  tabell: PropTypes.node.isRequired,
  hjelpeTekstId: PropTypes.string,
  skalViseTabell: PropTypes.bool,
};


InntektstabellPanel.defaultProps = {
  hjelpeTekstId: undefined,
  skalViseTabell: true,
};


export default InntektstabellPanel;
