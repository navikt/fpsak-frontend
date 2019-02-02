import React from 'react';
import { PropTypes } from 'prop-types';
import Collapse from 'react-collapse';
import classnames from 'classnames/bind';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';

import PersonDetailedHeader from './panelHeader/PersonDetailedHeader';

import styles from './ekspanderbartPersonPanel.less';

/**
 * EkspanderbartPersonPanel
 *
 * Presentasjonskomponent som viser toppen av fanen med informasjon i de nedtrekkbare personopplysningskomponentene.
 * selected er hvilken personopplysning som er den aktive når komponenten kalles
 * setSelected er en callback funksjon som bytter aktiv person
 */

const classNames = classnames.bind(styles);

const EkspanderbartPersonPanel = ({
  primaryParent,
  secondaryParent,
  hasOpenAksjonspunkter,
  readOnly,
  selected,
  setSelected,
  children,
}) => (
  <div
    className={classNames(
      hasOpenAksjonspunkter && !readOnly ? 'statusAksjonspunkt' : undefined,
      'ekspanderbartPanel',
      {
        'ekspanderbartPanel--apen': selected,
        'ekspanderbartPanel--lukket': !selected,
      },
    )}
  >
    <div className={styles.container}>
      {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
      }
      <div
        className={classNames({ primary: secondaryParent, primaryfull: !secondaryParent })}
        onClick={() => (setSelected(primaryParent))}
        onKeyDown={() => (setSelected(primaryParent))}
        role="link"
        tabIndex="0"
      >
        <div className={classNames({ personprimary: secondaryParent, personprimaryfull: !secondaryParent, selected: selected === primaryParent })}>
          <PersonDetailedHeader personopplysninger={primaryParent} medPanel isPrimaryParent />
        </div>
        <div className={classNames({ personchevron: secondaryParent, personchevronfull: !secondaryParent })}>
          <button type="button" className={styles.invisibleButton}>
            {selected === primaryParent ? <OppChevron /> : <NedChevron />}
          </button>
        </div>
      </div>

      {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
        secondaryParent && (
        <div
          className={styles.secondary}
          onClick={() => (setSelected(secondaryParent))}
          onKeyDown={() => (setSelected(secondaryParent))}
          role="link"
          tabIndex="0"
        >
          <div className={classNames('personsecondary', { selected: selected === secondaryParent })}>
            <PersonDetailedHeader
              personopplysninger={secondaryParent}
              medPanel
              isPrimaryParent={false}
              hasAktorId={!!secondaryParent.aktoerId}
            />
          </div>
          <div className={classNames('personchevron')}>
            <button type="button" className={styles.invisibleButton}>
              {selected === secondaryParent ? <OppChevron /> : <NedChevron />}
            </button>
          </div>
        </div>
        )}
    </div>
    {children && (
    <Collapse isOpened={!!selected}>
      <article aria-label="Person panel" className="ekspanderbartPanel__innhold">
        {children}
      </article>
    </Collapse>
    )}
  </div>
);

EkspanderbartPersonPanel.propTypes = {
  primaryParent: PropTypes.shape({}).isRequired,
  secondaryParent: PropTypes.shape({}),
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  selected: PropTypes.shape({}),
  setSelected: PropTypes.func.isRequired,
  children: PropTypes.node,
};

EkspanderbartPersonPanel.defaultProps = {
  secondaryParent: null,
  selected: null,
  children: null,
};

export default EkspanderbartPersonPanel;
