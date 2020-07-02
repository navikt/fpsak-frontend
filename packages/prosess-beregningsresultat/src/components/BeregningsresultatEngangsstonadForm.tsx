import React, { FunctionComponent, useState, useCallback } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Column, Row } from 'nav-frontend-grid';
import {
  Element, Undertekst, Undertittel, Normaltekst,
} from 'nav-frontend-typografi';

import { BeregningsresultatEs } from '@fpsak-frontend/types';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer, OverstyringKnapp,
} from '@fpsak-frontend/shared-components';
import {
  formatCurrencyWithKr, hasValidInteger, maxValue, minValue, required, decodeHtmlEntity,
} from '@fpsak-frontend/utils';
import { InputField, behandlingForm } from '@fpsak-frontend/form';
import aksjonspunktCode from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { OverstyringPanel } from '@fpsak-frontend/prosess-felles';

import styles from './beregningsresultatEngangsstonadForm.less';

const minValue1 = minValue(1);
const maxValue500000 = maxValue(500000);

interface OwnProps {
  overrideReadOnly: boolean;
  kanOverstyre: boolean;
  toggleOverstyring: (fn: (oldArray: []) => void) => void;
  behandlingResultatstruktur?: BeregningsresultatEs;
  isOverstyrt?: boolean;
}

/**
 * BeregningsresultatEngangsstonadForm
 *
 * Presentasjonskomponent. Viser beregnet engangsstønad. Resultatet kan overstyres av Nav-ansatt
 * med overstyr-rettighet.
 */
export const BeregningsresultatEngangsstonadFormImpl: FunctionComponent<OwnProps & InjectedFormProps> = ({
  overrideReadOnly,
  kanOverstyre,
  toggleOverstyring,
  behandlingResultatstruktur,
  isOverstyrt,
  ...formProps
}) => {
  const [erOverstyrt, toggleOverstyringsknapp] = useState(false);
  const toggleAv = useCallback(() => {
    toggleOverstyringsknapp(false);
    formProps.reset();
    toggleOverstyring((oldArray) => oldArray.filter((code) => code !== aksjonspunktCode.OVERSTYR_BEREGNING));
  }, []);
  const togglePa = useCallback(() => {
    toggleOverstyringsknapp(true);
    toggleOverstyring((oldArray) => [...oldArray, aksjonspunktCode.OVERSTYR_BEREGNING]);
  }, []);

  return (
    <form onSubmit={formProps.handleSubmit}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Undertittel><FormattedMessage id="BeregningEngangsstonadForm.Beregning" /></Undertittel>
          </FlexColumn>
          {(kanOverstyre || overrideReadOnly) && (
            <FlexColumn>
              <OverstyringKnapp onClick={togglePa} erOverstyrt={erOverstyrt || !kanOverstyre} />
            </FlexColumn>
          )}
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
      <Row>
        <Column xs="2">
          <Undertekst><FormattedMessage id="BeregningEngangsstonadForm.Sats" /></Undertekst>
        </Column>
        <Column xs="2">
          <Element>{formatCurrencyWithKr(behandlingResultatstruktur.satsVerdi)}</Element>
        </Column>
      </Row>
      <Row>
        <Column xs="2">
          <Undertekst><FormattedMessage id="BeregningEngangsstonadForm.AntallBarn" /></Undertekst>
        </Column>
        <Column xs="2">
          <Element>{behandlingResultatstruktur.antallBarn}</Element>
        </Column>
      </Row>
      {!erOverstyrt && !isOverstyrt && (
        <>
          <Row>
            <Column xs="3">
              <hr className={styles.divider} />
            </Column>
          </Row>
          <Row>
            <Column xs="2">
              <Undertekst><FormattedMessage id="BeregningEngangsstonadForm.BeregnetEngangsstonad" /></Undertekst>
            </Column>
            <Column xs="2">
              <Element>{formatCurrencyWithKr(behandlingResultatstruktur.beregnetTilkjentYtelse)}</Element>
            </Column>
          </Row>
        </>
      )}
      {(erOverstyrt || isOverstyrt) && (
        <>
          <VerticalSpacer sixteenPx />
          <OverstyringPanel
            erOverstyrt={erOverstyrt}
            isSolvable
            erVilkarOk
            hasAksjonspunkt={isOverstyrt}
            overrideReadOnly={overrideReadOnly}
            isSubmitting={formProps.submitting}
            isPristine={formProps.pristine}
            toggleAv={toggleAv}
          >
            <FlexContainer>
              <FlexRow>
                <FlexColumn>
                  <Normaltekst className={!erOverstyrt || overrideReadOnly ? '' : styles.text}>
                    <FormattedMessage id="BeregningEngangsstonadForm.BeregnetEngangsstonad" />
                  </Normaltekst>
                </FlexColumn>
                <FlexColumn>
                  <InputField
                    name="beregnetTilkjentYtelse"
                    parse={(value) => {
                      const parsedValue = parseInt(value, 10);
                      return Number.isNaN(parsedValue) ? value : parsedValue;
                    }}
                    validate={[required, hasValidInteger, minValue1, maxValue500000]}
                    bredde="XS"
                    readOnly={!erOverstyrt || overrideReadOnly}
                  />
                </FlexColumn>
                <FlexColumn>
                  <Element className={!erOverstyrt || overrideReadOnly ? '' : styles.text}><FormattedMessage id="BeregningEngangsstonadForm.Kroner" /></Element>
                </FlexColumn>
              </FlexRow>
            </FlexContainer>
          </OverstyringPanel>
        </>
      )}
    </form>
  );
};

BeregningsresultatEngangsstonadFormImpl.defaultProps = {
  behandlingResultatstruktur: {
    beregnetTilkjentYtelse: 0,
    antallBarn: 0,
    satsVerdi: 0,
  },
  isOverstyrt: false,
};

const buildInitialValues = createSelector([
  (_state, ownProps) => ownProps.aksjonspunkter, (_state, ownProps) => ownProps.behandlingResultatstruktur],
(aksjonspunkter, behandlingResultatstruktur) => {
  const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCode.OVERSTYR_BEREGNING);
  return {
    begrunnelse: decodeHtmlEntity(aksjonspunkt && aksjonspunkt.begrunnelse ? aksjonspunkt.begrunnelse : ''),
    beregnetTilkjentYtelse: behandlingResultatstruktur.beregnetTilkjentYtelse,
  };
});

const transformValues = (values) => ({
  kode: aksjonspunktCode.OVERSTYR_BEREGNING,
  beregnetTilkjentYtelse: values.beregnetTilkjentYtelse,
  begrunnelse: values.begrunnelse,
});

const formName = 'BeregningsresultatEngangsstonadForm';

const mapStateToPropsFactory = (_initialState, staticOwnProps) => {
  const onSubmit = (values) => staticOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    onSubmit,
    isOverstyrt: !!ownProps.aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCode.OVERSTYR_BEREGNING),
    initialValues: buildInitialValues(state, ownProps),
  });
};

export default connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(BeregningsresultatEngangsstonadFormImpl));
