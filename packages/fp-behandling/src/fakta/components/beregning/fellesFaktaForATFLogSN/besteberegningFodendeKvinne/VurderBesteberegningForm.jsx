import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FieldArray } from 'redux-form';
import { Element } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import {
  getVurderBesteberegning,
} from 'behandlingFpsak/src/behandlingSelectors';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { LINK_TIL_BESTE_BEREGNING_REGNEARK } from '@fpsak-frontend/fp-felles';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { ArrowBox } from '@fpsak-frontend/shared-components';
import InntektFieldArray from '../InntektFieldArray';
import { getFormValuesForBeregning } from '../../BeregningFormUtils';

import styles from '../kunYtelse/kunYtelseBesteberegningPanel.less';

export const besteberegningField = 'vurderbesteberegningField';

export const inntektFieldArrayName = 'besteberegningInntekt';

/**
 * VurderBesteberegningPanel
 *
 * Presentasjonskomponent. Behandling av aksjonspunktet for fastsetting av bg for kun ytelse
 *  med vurdering av besteberegning.
 */

const VurderBesteberegningPanelImpl = ({
  readOnly,
  isAksjonspunktClosed,
  erBesteberegning,
  andeler,
}) => (
  <div>
    <Row>
      <Column xs="9">
        <RadioGroupField
          name={besteberegningField}
          readOnly={readOnly}
          isEdited={isAksjonspunktClosed}
          label={<FormattedMessage id="BeregningInfoPanel.VurderBestebergning.HarBesteberegning" />}
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
    {erBesteberegning
    && (
      <ArrowBox alignOffset={-5}>
        <Row>
          <Column xs="12">
            <Element>
              <FormattedMessage id="KunYtelsePanel.OverskriftBesteberegning" />
            </Element>
          </Column>
        </Row>
        <Row>
          <Column xs="12">
            <FieldArray
              name={inntektFieldArrayName}
              component={InntektFieldArray}
              readOnly={readOnly}
              skalHaBesteberegning={erBesteberegning}
              andeler={andeler}
              skalKunneLeggeTilAndel={false}
            />
          </Column>
        </Row>
      </ArrowBox>
    )
  }
  </div>
);

VurderBesteberegningPanelImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  erBesteberegning: PropTypes.bool,
  andeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

VurderBesteberegningPanelImpl.defaultProps = {
  erBesteberegning: undefined,
};


VurderBesteberegningPanelImpl.buildInitialValues = (vurderBesteberegning, faktaOmBeregningTilfeller) => {
  if (!faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)) {
    return {};
  }
  if (!vurderBesteberegning || !vurderBesteberegning.andeler || vurderBesteberegning.andeler.length === 0) {
    return {};
  }
  const initialValues = {
    [besteberegningField]: vurderBesteberegning.skalHaBesteberegning,
  };
  return {
    ...initialValues,
    [inntektFieldArrayName]: InntektFieldArray.buildInitialValues(vurderBesteberegning.andeler),
  };
};

VurderBesteberegningPanelImpl.validate = (values, aktivertePaneler) => {
  if (!values || !aktivertePaneler.includes(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING)) {
    return {};
  }
  const errors = {};
  errors[besteberegningField] = required(values[besteberegningField]);
  if (errors[besteberegningField]) {
    return errors;
  }
  if (!values[besteberegningField]) {
    return errors;
  }
  errors[inntektFieldArrayName] = InntektFieldArray.validate(values[inntektFieldArrayName]);
  return errors;
};


VurderBesteberegningPanelImpl.transformValues = (values, faktaOmBeregning) => {
  if (!faktaOmBeregning || !faktaOmBeregning.vurderBesteberegning) {
    return {};
  }
  const skalHaBesteberegning = values[besteberegningField];
  if (!skalHaBesteberegning) {
    return {
      besteberegningAndeler: {
        besteberegningAndelListe: [],
      },
    };
  }
  const verdierPrAndel = InntektFieldArray.transformValues(values[inntektFieldArrayName]);
  const transformedValues = verdierPrAndel.map(verdi => ({
    andelsnr: verdi.andelsnr,
    nyAndel: verdi.nyAndel,
    lagtTilAvSaksbehandler: verdi.lagtTilAvSaksbehandler,
    aktivitetStatus: verdi.nyAndel ? aktivitetStatus.DAGPENGER : null,
    fastsatteVerdier: {
      fastsattBeløp: verdi.fastsattBeløp,
      inntektskategori: verdi.inntektskategori,
    },
  }));
  return {
    besteberegningAndeler: { besteberegningAndelListe: transformedValues },
  };
};


export const vurderBesteberegningTransform = faktaOmBeregning => values => ({
  faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE],
  ...VurderBesteberegningPanelImpl.transformValues(values, faktaOmBeregning),
});

const mapStateToProps = (state) => {
  const vurderBesteberegning = getVurderBesteberegning(state);
  return {
    andeler: vurderBesteberegning.andeler,
    erBesteberegning: getFormValuesForBeregning(state)[besteberegningField],
  };
};

export default connect(mapStateToProps)(VurderBesteberegningPanelImpl);
