import React, { FunctionComponent, useState } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import {
  Normaltekst, Element, Undertekst, Undertittel,
} from 'nav-frontend-typografi';

import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer, OverstyringKnapp,
} from '@fpsak-frontend/shared-components';
import {
  formatCurrencyWithKr, hasValidInteger, maxValue, minValue, required,
} from '@fpsak-frontend/utils';
import { InputField, behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import OverstyrBegrunnelsePanel from './OverstyrBegrunnelsePanel';
import OverstyrBekreftKnappPanel from './OverstyrBekreftKnappPanel';
import OverstyrVurderingVelger from './OverstyrVurderingVelger';

import styles from './beregningsresultatEngangsstonadForm.less';

const minValue1 = minValue(1);
const maxValue500000 = maxValue(500000);

interface OwnProps {
  overrideReadOnly: boolean;
  kanOverstyreAccess: {
    isEnabled: boolean;
  };
  toggleOverstyring: () => void;
  beregningResultat?: {};
  isOverstyrt?: boolean;
  isReadOnly?: boolean;
  aksjonspunktCodes: string[];
}

/**
 * BeregningsresultatEngangsstonadForm
 *
 * Presentasjonskomponent. Viser beregnet engangsstønad. Resultatet kan overstyres av Nav-ansatt
 * med overstyr-rettighet.
 */
export const BeregningsresultatEngangsstonadFormImpl: FunctionComponent<OwnProps & WrappedComponentProps & InjectedFormProps> = ({
  intl,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  beregningResultat,
  isOverstyrt,
  isReadOnly,
  aksjonspunktCodes,
  ...formProps
}) => {
  const [erOverstyrt, toggleOverstyringsknapp] = useState(false);
  return (
    <form onSubmit={formProps.handleSubmit}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Undertittel>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Beregning' })}</Undertittel>
          </FlexColumn>
          <FlexColumn>
            <OverstyringKnapp onClick={toggleOverstyringsknapp} erOverstyrt={false} />
            <OverstyrVurderingVelger
              isBeregningOverstyrer
              aksjonspunktCode={aksjonspunktCode.OVERSTYR_BEREGNING}
              resetValues={formProps.reset}
              overrideReadOnly={overrideReadOnly}
              kanOverstyreAccess={kanOverstyreAccess}
              aksjonspunktCodes={aksjonspunktCodes}
              toggleOverstyring={() => toggleOverstyring((oldArray) => [...oldArray, aksjonspunktCode.OVERSTYR_BEREGNING])}
            />
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="2">
          <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.Sats' })}</Undertekst>
        </Column>
        <Column xs="2">
          <Element>{formatCurrencyWithKr(beregningResultat.satsVerdi)}</Element>
        </Column>
      </Row>
      <Row>
        <Column xs="2">
          <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.AntallBarn' })}</Undertekst>
        </Column>
        <Column xs="2">
          <Element>{beregningResultat.antallBarn}</Element>
        </Column>
      </Row>
      {!erOverstyrt && (
      <>
        <Row>
          <Column xs="3">
            <hr className={styles.divider} />
          </Column>
        </Row>
        <Row>
          <Column xs="2">
            <Undertekst>{intl.formatMessage({ id: 'BeregningEngangsstonadForm.BeregnetEngangsstonad' })}</Undertekst>
          </Column>
          <Column xs="2">
            <Element>{formatCurrencyWithKr(beregningResultat.beregnetTilkjentYtelse)}</Element>
          </Column>
        </Row>
      </>
      )}
      {erOverstyrt && (
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
        </Row>
      )}
      {isOverstyrt && (
      <div>
        <VerticalSpacer eightPx />
        <OverstyrBegrunnelsePanel isBeregningConfirmation overrideReadOnly={overrideReadOnly} />
        <VerticalSpacer sixteenPx />
        <OverstyrBekreftKnappPanel
          submitting={formProps.submitting}
          pristine={formProps.pristine}
          overrideReadOnly={overrideReadOnly}
        />
      </div>
      )}
    </form>
  );
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
