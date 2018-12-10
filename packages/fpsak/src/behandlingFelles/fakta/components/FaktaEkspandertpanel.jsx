import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { EkspanderbartpanelPure } from 'nav-frontend-ekspanderbartpanel';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel } from 'nav-frontend-typografi';
import classnames from 'classnames/bind';
import styles from './faktaEkspandertpanel.less';


/**
 * FaktaEkspandertpanel
 *
 * Presentasjonskomponent. Wrapper for å slippe å duplisere logikk og styles i de
 * ulike faktapanelene. Avgjør om panelet skal åpnes eller lukkes og viser en
 * gul stripe i penelet om det er åpne aksjonspunkter.
 */

const classNames = classnames.bind(styles);

const FaktaEkspandertpanel = ({
  title,
  hasOpenAksjonspunkter,
  isInfoPanelOpen,
  toggleInfoPanelCallback,
  faktaId,
  readOnly,
  disabled,
  disabledTextCode,
  children,
}) => {
  if (disabled && disabledTextCode) {
    return (
      <Panel className={styles.disabledPanel}>
        <Undertittel className={styles.disabledPanelText}>
          <FormattedMessage id={disabledTextCode} />
        </Undertittel>
      </Panel>
    );
  }

  return (
    <EkspanderbartpanelPure
      className={hasOpenAksjonspunkter && !readOnly ? classNames('statusAksjonspunkt', `aksjonspunkt--${faktaId}`) : styles.statusOk}
      tittel={title}
      apen={isInfoPanelOpen}
      onClick={() => toggleInfoPanelCallback(faktaId)}
    >
      {children}
    </EkspanderbartpanelPure>
  );
};

FaktaEkspandertpanel.propTypes = {
  /**
   * Tittel på faktapanelet
   */
  title: PropTypes.node.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  isInfoPanelOpen: PropTypes.bool,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  /**
   * Indikerer faktatype. For eksempel 'medlemskapsvilkaret'
   */
  faktaId: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  disabledTextCode: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

FaktaEkspandertpanel.defaultProps = {
  isInfoPanelOpen: false,
  disabled: false,
  disabledTextCode: undefined,
};

export default FaktaEkspandertpanel;
