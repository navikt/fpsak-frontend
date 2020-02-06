import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import AktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { LINK_TIL_BESTE_BEREGNING_REGNEARK } from '@fpsak-frontend/fp-felles';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';

import styles from '../kunYtelse/kunYtelseBesteberegningPanel.less';

export const besteberegningField = 'vurderbesteberegningField';


/**
 * VurderBesteberegningPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for kun ytelse
 *  med vurdering av besteberegning.
 */

const VurderBesteberegningPanelImpl = ({
  readOnly,
  isAksjonspunktClosed,
}) => (
  <div>
    <Row>
      <Column xs="9">
        <Normaltekst>
          <FormattedMessage id="BeregningInfoPanel.VurderBestebergning.HarBesteberegning" />
        </Normaltekst>
        <VerticalSpacer eightPx />
        <RadioGroupField
          name={besteberegningField}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
        >
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Ja" />} value />
          <RadioOption label={<FormattedMessage id="BeregningInfoPanel.FormAlternativ.Nei" />} value={false} />
        </RadioGroupField>
      </Column>
      <Column xs="3">
        <a
          className={styles.navetLink}
          href={LINK_TIL_BESTE_BEREGNING_REGNEARK}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FormattedMessage id="BeregningInfoPanel.FastsettBBFodendeKvinne.RegnarkNavet" />
        </a>
      </Column>
    </Row>
  </div>
);

VurderBesteberegningPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
};


VurderBesteberegningPanelImpl.buildInitialValues = (vurderBesteberegning, faktaOmBeregningTilfeller) => {
  if (!(faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)
    || faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE))) {
    return {};
  }
  if (!vurderBesteberegning) {
    return {};
  }
  return {
    [besteberegningField]: vurderBesteberegning.skalHaBesteberegning,
  };
};

VurderBesteberegningPanelImpl.validate = (values, aktivertePaneler) => {
  if (!values || !(aktivertePaneler.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)
  || aktivertePaneler.includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE))) {
    return {};
  }
  const errors = {};
  errors[besteberegningField] = required(values[besteberegningField]);
  return errors;
};

VurderBesteberegningPanelImpl.transformValues = (values, faktaOmBeregning, inntektPrAndel) => {
  if (!faktaOmBeregning || !faktaOmBeregning.vurderBesteberegning) {
    return {};
  }
  const skalHaBesteberegning = values[besteberegningField];
  if (!skalHaBesteberegning || !inntektPrAndel) {
    return {
      besteberegningAndeler: {
        besteberegningAndelListe: [],
      },
    };
  }
  const transformedValues = inntektPrAndel
    .filter(({ nyAndel }) => nyAndel !== true)
    .map((verdi) => ({
      andelsnr: verdi.andelsnr,
      nyAndel: verdi.nyAndel,
      lagtTilAvSaksbehandler: verdi.lagtTilAvSaksbehandler,
      fastsatteVerdier: {
        fastsattBeløp: verdi.fastsattBelop,
        inntektskategori: verdi.inntektskategori,
      },
    }));
  const nyDagpengeAndel = inntektPrAndel
    .find((a) => a.nyAndel && a.aktivitetStatus === AktivitetStatus.DAGPENGER);
  return {
    besteberegningAndeler: {
      besteberegningAndelListe: transformedValues,
      nyDagpengeAndel: nyDagpengeAndel ? {
        fastsatteVerdier: {
          fastsattBeløp: nyDagpengeAndel.fastsattBelop,
          inntektskategori: nyDagpengeAndel.inntektskategori,
        },
      } : null,
    },
  };
};


export const vurderBesteberegningTransform = (faktaOmBeregning) => (values, inntektPrAndel) => {
  const tilfeller = faktaOmBeregning.faktaOmBeregningTilfeller ? faktaOmBeregning.faktaOmBeregningTilfeller : [];
  if (!(tilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)
      || tilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE))) {
    return {};
  }
  const besteberegningValues = VurderBesteberegningPanelImpl.transformValues(values, faktaOmBeregning, inntektPrAndel);
  const faktaOmBeregningTilfeller = [faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING];
  if (besteberegningValues.besteberegningAndeler.besteberegningAndelListe.length > 0) {
    faktaOmBeregningTilfeller.push(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);
  }
  return ({
    faktaOmBeregningTilfeller,
    ...besteberegningValues,
  });
};

const mapStateToProps = (state, ownProps) => ({
  erBesteberegning: getFormValuesForBeregning(state, ownProps)[besteberegningField],
});

export default connect(mapStateToProps)(VurderBesteberegningPanelImpl);
