import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import removeIcon from '@fpsak-frontend/assets/images/remove.svg';
import {
 Table, TableColumn, TableRow, DateLabel, Image,
} from '@fpsak-frontend/shared-components';

import styles from './tilretteleggingTable.less';

const headerTextCodes = [
  'TilretteleggingTable.NodvendigTilrettelegging',
  'TilretteleggingTable.Dato',
  'TilretteleggingTable.Stillingsprosent',
  'EMPTY',
];

const getTextCode = (type) => {
  if (type === 'kanGjennomfores') {
    return 'ArbeidsforholdCheckboxes.Arbeidsgiver.KanGjennomfores';
  }
  return type === 'redusertArbeid'
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
      tilrettelegginger,
      valgtTilrettelegging,
      slettTilrettelegging,
    } = this.props;

    if (tilrettelegginger.length === 0) {
      return null;
    }

    return (
      <Table headerTextCodes={headerTextCodes}>
        {tilrettelegginger.map(t => (
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
              <Normaltekst>{`${t.stillingsprosent}%`}</Normaltekst>
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
  tilrettelegginger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  settValgtTilrettelegging: PropTypes.func.isRequired,
  slettTilrettelegging: PropTypes.func.isRequired,
  valgtTilrettelegging: PropTypes.shape(),
};

TilretteleggingTable.defaultProps = {
  valgtTilrettelegging: undefined,
};

export default TilretteleggingTable;
