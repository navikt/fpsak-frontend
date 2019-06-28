import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst, Element } from 'nav-frontend-typografi';

import tilretteleggingType from '@fpsak-frontend/kodeverk/src/tilretteleggingType';
import removeIcon from '@fpsak-frontend/assets/images/remove.svg';
import {
 Table, TableColumn, TableRow, DateLabel, Image, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import styles from './tilretteleggingTable.less';

const headerTextCodes = [
  'TilretteleggingTable.NodvendigTilrettelegging',
  'TilretteleggingTable.Dato',
  'TilretteleggingTable.Stillingsprosent',
  'EMPTY',
];

const getTextCode = (type) => {
  if (type.kode === tilretteleggingType.HEL_TILRETTELEGGING) {
    return 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores';
  }
  return type.kode === tilretteleggingType.DELVIS_TILRETTELEGGING
    ? 'ArbeidsforholdCheckboxes.Arbeidsgiver.RedusertArbeid'
    : 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanIkkeGjennomfores';
};

/**
 * TilretteleggingTable
 *
 * Viser tilretteleggingsalternativer for et gitt arbeidsforhold
 */
class TilretteleggingTable extends Component {
  nodes = [];

  settTilrettelegging = (event, id, selectedTilrettelegging) => {
    const { settValgtTilrettelegging } = this.props;
    if (this.nodes.some(node => node && node.contains(event.target))) {
      return;
    }
    settValgtTilrettelegging(selectedTilrettelegging);
  }

  render() {
    const {
      tilretteleggingDatoer,
      valgtTilrettelegging,
      slettTilrettelegging,
    } = this.props;

    if (tilretteleggingDatoer.length === 0) {
        return (
          <>
            <Element><FormattedMessage id="TilretteleggingTable.IngenTilretteleggingDatoer" /></Element>
            <VerticalSpacer eightPx />
          </>
        );
    }

    return (
      <Table headerTextCodes={headerTextCodes}>
        {tilretteleggingDatoer.map(t => (
          <TableRow
            key={t.fom}
            model={t}
            onMouseDown={this.settTilrettelegging}
            onKeyDown={this.settTilrettelegging}
            isSelected={t === valgtTilrettelegging}
          >
            <TableColumn>
              <Normaltekst><FormattedMessage id={getTextCode(t.type)} /></Normaltekst>
            </TableColumn>
            <TableColumn>
              <Normaltekst><DateLabel dateString={t.fom} /></Normaltekst>
            </TableColumn>
            <TableColumn>
              <Normaltekst>{t.stillingsprosent ? `${t.stillingsprosent}%` : ''}</Normaltekst>
            </TableColumn>
            <TableColumn>
              <div ref={(node) => { this.nodes.push(node); }}>
                <Image
                  src={removeIcon}
                  className={styles.removeImage}
                  onMouseDown={() => slettTilrettelegging(t)}
                  onKeyDown={() => slettTilrettelegging(t)}
                  tabIndex="0"
                />
              </div>
            </TableColumn>
          </TableRow>
        ))}
      </Table>
    );
  }
}

TilretteleggingTable.propTypes = {
  tilretteleggingDatoer: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settValgtTilrettelegging: PropTypes.func.isRequired,
  slettTilrettelegging: PropTypes.func.isRequired,
  valgtTilrettelegging: PropTypes.shape(),
};

TilretteleggingTable.defaultProps = {
  valgtTilrettelegging: undefined,
};

export default TilretteleggingTable;
