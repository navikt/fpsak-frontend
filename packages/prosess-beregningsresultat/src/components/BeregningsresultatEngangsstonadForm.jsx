import React from 'react';
import PropTypes from 'prop-types';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst, Undertittel } from 'nav-frontend-typografi';

import {
  behandlingForm, behandlingFormValueSelector, OverstyrBegrunnelsePanel, OverstyrBekreftKnappPanel,
  OverstyrVurderingVelger,
} from '@fpsak-frontend/fp-felles';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import {
  formatCurrencyWithKr, hasValidInteger, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { InputField } from '@fpsak-frontend/form';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import styles from './beregningsresultatEngangsstonadForm.less';

const minValue1 = minValue(1);
const maxValue500000 = maxValue(500000);

/**
 * BeregningsresultatEngangsstonadForm
 *
 * Presentasjonskomponent. Viser beregnet engangsstønad. Resultatet kan overstyres av Nav-ansatt
 * med overstyr-rettighet.
 */
export const BeregningsresultatEngangsstonadFormImpl = ({
  intl,
  beregningResultat,
  isOverstyrt,
  isReadOnly,
  overrideReadOnly,
  kanOverstyreAccess,
  aksjonspunktCodes,
  toggleOverstyring,
  ...formProps
}) => (
  <form onSubmit={formProps.handleSubmit}>
    <Row>
      <Column xs="9">
        <Undertittel>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Beregning' })}</Undertittel>
      </Column>
      <Column xs="3">
        <OverstyrVurderingVelger
          isBeregningOverstyrer
          aksjonspunktCode={aksjonspunktCode.OVERSTYR_BEREGNING}
          resetValues={formProps.reset}
          overrideReadOnly={overrideReadOnly}
          kanOverstyreAccess={kanOverstyreAccess}
          aksjonspunktCodes={aksjonspunktCodes}
          toggleOverstyring={toggleOverstyring}
        />
      </Column>
    </Row>
    <VerticalSpacer eightPx />
    <Row>
      <Column xs="3">
        <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.BeregnetEngangsstonad' })}</Undertekst>
        {(!isOverstyrt || isReadOnly)
          && <Normaltekst>{formatCurrencyWithKr(beregningResultat.beregnetTilkjentYtelse)}</Normaltekst>}
        {isOverstyrt && !isReadOnly
          && (
          <FlexContainer fluid>
            <FlexRow>
              <FlexColumn>
                <InputField
                  name="beregningResultat.beregnetTilkjentYtelse"
                  parse={(value) => {
                    const parsedValue = parseInt(value, 10);
                    return Number.isNaN(parsedValue) ? value : parsedValue;
                  }}
                  validate={[required, hasValidInteger, minValue1, maxValue500000]}
                  bredde="XS"
                />
              </FlexColumn>
              <FlexColumn>
                <Normaltekst className={styles.editAdjuster}>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Kroner' })}</Normaltekst>
              </FlexColumn>
            </FlexRow>
          </FlexContainer>
          )}
      </Column>
      <Column xs="2">
        <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.AntallBarn' })}</Undertekst>
        <Normaltekst className={isOverstyrt && !isReadOnly ? styles.editAdjuster : ''}>{beregningResultat.antallBarn}</Normaltekst>
      </Column>
      <Column xs="2">
        <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Sats' })}</Undertekst>
        <Normaltekst className={isOverstyrt && !isReadOnly ? styles.editAdjuster : ''}>{formatCurrencyWithKr(beregningResultat.satsVerdi)}</Normaltekst>
      </Column>
    </Row>
    {isOverstyrt
      && (
      <div>
        <OverstyrBegrunnelsePanel isBeregningConfirmation overrideReadOnly={overrideReadOnly} />
        <OverstyrBekreftKnappPanel
          submitting={formProps.submitting}
          pristine={formProps.pristine}
          overrideReadOnly={overrideReadOnly}
        />
      </div>
      )}
  </form>
);

BeregningsresultatEngangsstonadFormImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  beregningResultat: PropTypes.shape(),
  isOverstyrt: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  kanOverstyreAccess: PropTypes.shape({
    isEnabled: PropTypes.bool.isRequired,
  }).isRequired,
  aksjonspunktCodes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  ...formPropTypes,
};

BeregningsresultatEngangsstonadFormImpl.defaultProps = {
  beregningResultat: {
    beregnetTilkjentYtelse: 0,
    antallBarn: 0,
    satsVerdi: 0,
  },
  isOverstyrt: false,
  isReadOnly: false,
};

const buildInitialValues = createSelector([
  (state, ownProps) => ownProps.aksjonspunkter, (state, ownProps) => ownProps.behandlingResultatstruktur],
(aksjonspunkter, beregningResultat) => {
  const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCode.OVERSTYR_BEREGNING);
  return {
    beregningResultat,
    isOverstyrt: aksjonspunkt !== undefined,
    ...OverstyrBegrunnelsePanel.buildInitialValues(aksjonspunkt),
  };
});

const transformValues = (values) => ({
  kode: aksjonspunktCode.OVERSTYR_BEREGNING,
  beregnetTilkjentYtelse: values.beregningResultat.beregnetTilkjentYtelse,
  ...OverstyrBegrunnelsePanel.transformValues(values),
});

const formName = 'BeregningsresultatEngangsstonadForm';

const mapStateToPropsFactory = (initialState, staticOwnProps) => {
  const onSubmit = (values) => staticOwnProps.submitCallback([transformValues(values)]);
  const { behandlingId, behandlingVersjon } = staticOwnProps;
  const aksjonspunktCodes = staticOwnProps.aksjonspunkter.map((a) => a.definisjon.kode);
  return (state, ownProps) => ({
    onSubmit,
    aksjonspunktCodes,
    initialValues: buildInitialValues(state, ownProps),
    isReadOnly: ownProps.overrideReadOnly,
    ...behandlingFormValueSelector(formName, behandlingId, behandlingVersjon)(state, 'beregningResultat', 'isOverstyrt'),
  });
};

export default connect(mapStateToPropsFactory)(injectIntl(behandlingForm({
  form: formName,
})(BeregningsresultatEngangsstonadFormImpl)));
