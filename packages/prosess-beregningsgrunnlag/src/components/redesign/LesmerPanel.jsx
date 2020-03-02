import React, { Component } from 'react';
import Proptypes from 'prop-types';
import 'nav-frontend-lesmerpanel-style';
import { UnmountClosed } from 'react-collapse';
import { guid, omit } from 'nav-frontend-js-utils';
import classNames from 'classnames';
import LesMerToggle2 from './LesMerToggle';
import styles from './lesMerPanel.less';

const lesMerPanelCls = (props) => classNames(styles.lesMerPanel, props.className, props.border ? styles['lesMerPanel--border'] : '');

/**
 * Lesmerpanel
 */

class Lesmerpanel extends Component {
  constructor(props) {
    super(props);
    this.state = { erApen: props.defaultApen };
    this.toggle = this.toggle.bind(this);
  }

  toggle(e) {
    e.preventDefault();
    const { erApen } = this.state;
    const { onClose, onOpen } = this.props;
    this.setState({ erApen: !erApen });
    if (erApen) {
      onClose(e);
    } else {
      onOpen(e);
    }
  }

  render() {
    const {
      intro,
      children,
      apneTekst,
      lukkTekst,
      id = guid(),
      ...other
    } = this.props;
    const domProps = omit(other, 'border', 'onOpen', 'onClose', 'defaultApen');
    const { erApen } = this.state;
    return (
      <div
        id={id}
        className={lesMerPanelCls(this.props)}
        {...domProps}
      >
        <div className={styles.lesMerPanel__introWrapper}>
          {intro && (
            <div className={styles.lesMerPanel__intro}>
              { intro }
            </div>
          )}
          {children && (
          <LesMerToggle2
            aria-controls={id}
            apneTekst={apneTekst}
            lukkTekst={lukkTekst}
            erApen={erApen}
            onClick={(e) => { this.toggle(e); }}
          />
          )}
        </div>
        {children && (
        <div className={styles.lesMerPanel__merContainer}>
          <UnmountClosed isOpened={erApen}>
            <div className={styles.lesMerPanel__mer}>
              <div>
                {children}
              </div>
            </div>
          </UnmountClosed>
        </div>
        )}
      </div>
    );
  }
}

Lesmerpanel.propTypes = {
  /**
   * Hvorvidt panelet initielt er åpent
   */
  defaultApen: Proptypes.bool,
  /**
   * Funksjon som kalles når panelet åpnes
   */
  onOpen: Proptypes.func,
  /**
   * Funksjon som kalles når panelet lukkes
   */
  onClose: Proptypes.func,
  /**
   * Innhold som plasseres før "Åpne"
   */
  intro: Proptypes.node,
  /**
   * Innhold som vises når man klikker på "Åpne"
   */
  children: Proptypes.node.isRequired,
  /**
   * ID til panelet
   */
  id: Proptypes.string,
  /**
   * Tekst som vises for å lukke panelet
   */
  lukkTekst: Proptypes.string.isRequired,
  /**
   * Tekst som vises for å åpne panelet
   */
  apneTekst: Proptypes.string.isRequired,
  /**
   * Egendefinert klassenavn
   */
  className: Proptypes.string,
  /**
   * Hvis komponenten skal brukes på hvit bakgrunn kan denne brukes for å gi den en border
   */
  border: Proptypes.bool,

};
Lesmerpanel.defaultProps = {
  defaultApen: false,
  onClose: () => {},
  onOpen: () => {},
};
export default Lesmerpanel;
