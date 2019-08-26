import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import addCircleIcon from '@fpsak-frontend/assets/images/add-circle.svg';
import { getKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { kodeverkPropType } from '@fpsak-frontend/prop-types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { Image } from '@fpsak-frontend/shared-components';
import styles from './addAndelButton.less';


const defaultAndel = (aktivitetStatuser, erKunYtelse) => ({
  andel: erKunYtelse ? aktivitetStatuser.filter(({ kode }) => kode === aktivitetStatus.BRUKERS_ANDEL)[0].navn : undefined,
  fastsattBelop: '',
  inntektskategori: '',
  nyAndel: true,
  skalKunneEndreAktivitet: true,
  lagtTilAvSaksbehandler: true,
});


const onKeyDown = (fields, aktivitetStatuser, erKunYtelse) => ({ keyCode }) => {
  if (keyCode === 13) {
    fields.push(defaultAndel(aktivitetStatuser, erKunYtelse));
  }
};

export const AddAndelButtonImpl = ({
  erKunYtelse,
  intl,
  fields,
  aktivitetStatuser,
}) => (
  <Row className={styles.buttonRow}>
    <Column xs="3">
      {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
        }
      <div
        id="leggTilAndelDiv"
        onClick={() => {
          fields.push(defaultAndel(aktivitetStatuser, erKunYtelse));
        }}
        onKeyDown={onKeyDown(fields, aktivitetStatuser, erKunYtelse)}
        className={styles.addPeriode}
        role="button"
        tabIndex="0"
        title={intl.formatMessage({ id: 'BeregningInfoPanel.FordelingBG.LeggTilAndel' })}
      >
        <Image
          className={styles.addCircleIcon}
          src={addCircleIcon}
        />
        <Undertekst className={styles.imageText}>
          {' '}
          <FormattedMessage
            id="BeregningInfoPanel.FordelingBG.LeggTilAndel"
          />
        </Undertekst>
      </div>
    </Column>
  </Row>
);

AddAndelButtonImpl.propTypes = {
  fields: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  aktivitetStatuser: kodeverkPropType.isRequired,
  erKunYtelse: PropTypes.bool.isRequired,
};

const AddAndelButton = injectIntl(AddAndelButtonImpl);

export const mapStateToProps = (state) => {
  const aktivitetStatuser = getKodeverk(kodeverkTyper.AKTIVITET_STATUS)(state);
  return {
    aktivitetStatuser,
  };
};

export default connect(mapStateToProps)(AddAndelButton);
