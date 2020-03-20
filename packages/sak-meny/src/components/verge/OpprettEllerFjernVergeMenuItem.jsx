import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { OkAvbrytModal } from '@fpsak-frontend/shared-components';

import MenuButton from '../MenuButton';

const submit = (operasjon, saksnummer, behandlingId, selectedBehandlingVersjon, toggleModal, push) => () => {
  toggleModal(false);
  return operasjon(push, saksnummer, behandlingId, selectedBehandlingVersjon);
};

/**
 * OpprettEllerFjernVergeMenuItem
 *
 * Presentasjonskomponent. Lager aksjonspunkt for registrering av verge
 */
const OpprettEllerFjernVergeMenuItem = ({
  fjernVerge,
  opprettVerge,
  saksnummer,
  behandlingId,
  behandlingVersjon,
  push,
}) => {
  const [showModal, toggleModal] = useState(false);
  return (
    <>
      <MenuButton
        onMouseDown={() => toggleModal(true)}
      >
        <FormattedMessage id={opprettVerge ? 'OpprettEllerFjernVergeMenuItem.OpprettVerge' : 'OpprettEllerFjernVergeMenuItem.FjernVerge'} />
      </MenuButton>
      {showModal && (
        <OkAvbrytModal
          textCode={opprettVerge ? 'OpprettEllerFjernVergeMenuItem.OpprettVergeSporsmal' : 'OpprettEllerFjernVergeMenuItem.FjernVergeSporsmal'}
          showModal={showModal}
          submit={submit(opprettVerge || fjernVerge, saksnummer, behandlingId, behandlingVersjon, toggleModal, push)}
          cancel={() => toggleModal(false)}
        />
      )}
    </>
  );
};

OpprettEllerFjernVergeMenuItem.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number,
  fjernVerge: PropTypes.func,
  opprettVerge: PropTypes.func,
  push: PropTypes.func.isRequired,
};

OpprettEllerFjernVergeMenuItem.defaultProps = {
  behandlingVersjon: undefined,
  fjernVerge: undefined,
  opprettVerge: undefined,
};

export default OpprettEllerFjernVergeMenuItem;
