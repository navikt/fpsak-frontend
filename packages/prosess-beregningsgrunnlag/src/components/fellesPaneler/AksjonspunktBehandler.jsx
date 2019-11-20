import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  BehandlingspunktSubmitButton, hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/fp-felles';


import styles from './aksjonspunktBehandler.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import AksjonspunktBehandlerAT from '../arbeidstaker/AksjonspunktBehandlerAT';
import AksjonspunktBehandlerFT from '../frilanser/AksjonspunktBehandlerFL';
import AksjonspunktBehandlerTB from '../arbeidstaker/AksjonspunktBehandlerTB';
import AksjonspunktBehandlerSN from '../selvstendigNaeringsdrivende/AkjsonspunktsbehandlerSN';

const minLength3 = minLength(3);
const maxLength1500 = maxLength(1500);


const finnAlleAndelerIFørstePeriode = (allePerioder) => {
  if (allePerioder && allePerioder.length > 0) {
    return allePerioder[0].beregningsgrunnlagPrStatusOgAndel;
  }
  return undefined;
};
const harFlereAksjonspunkter = (gjeldendeAksjonspunkter) => !!gjeldendeAksjonspunkter && gjeldendeAksjonspunkter.length > 1;
const finnATFLVurderingLabel = (gjeldendeAksjonspunkter) => {
  if (harFlereAksjonspunkter(gjeldendeAksjonspunkter)) {
    return <FormattedMessage id="Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag" />;
  }
  return <FormattedMessage id="Beregningsgrunnlag.Forms.Vurdering" />;
};

const AksjonspunktBehandler = ({
  readOnly,
  aksjonspunkter,
  formName,
  behandlingId,
  behandlingVersjon,
  readOnlySubmitButton,
  allePerioder,
  alleKodeverk,
  relevanteStatuser,
  tidsBegrensetInntekt,
}) => {
  const alleAndelerIForstePeriode = finnAlleAndelerIFørstePeriode(allePerioder);
  if (!aksjonspunkter || aksjonspunkter.length === 0) {
    return null;
  }
  if (!relevanteStatuser.isSelvstendigNaeringsdrivende) {
    return (
      <Panel className={!readOnly ? styles.aksjonspunktBehandlerBorder : beregningStyles.panel}>
        <Row>
          <Column xs="12">
            <Normaltekst className={beregningStyles.semiBoldText}>
              <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler" />
            </Normaltekst>
          </Column>
        </Row>
        <VerticalSpacer eightPx />
        {tidsBegrensetInntekt && (
        <AksjonspunktBehandlerTB
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          formName={formName}
          allePerioder={allePerioder}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          alleKodeverk={alleKodeverk}
          aksjonspunkter={aksjonspunkter}
        />
        )}
        {!tidsBegrensetInntekt && relevanteStatuser.isArbeidstaker && (
        <AksjonspunktBehandlerAT
          readOnly={readOnly}
          allePerioder={allePerioder}
          alleAndelerIForstePeriode={alleAndelerIForstePeriode}
          alleKodeverk={alleKodeverk}
        />
        )}
        {!tidsBegrensetInntekt && relevanteStatuser.isFrilanser && (
        <AksjonspunktBehandlerFT
          readOnly={readOnly}
          allePerioder={allePerioder}
          alleAndelerIForstePeriode={alleAndelerIForstePeriode}
        />
        )}

        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="12">
            <div id="readOnlyWrapper" className={readOnly ? styles.verticalLine : styles.textAreaWrapper}>
              <TextAreaField
                name="ATFLVurdering"
                label={finnATFLVurderingLabel(aksjonspunkter)}
                validate={[required, maxLength1500, minLength3, hasValidText]}
                maxLength={1500}
                readOnly={readOnly}
              />
            </div>
          </Column>
        </Row>
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="12">
            <BehandlingspunktSubmitButton
              formName={formName}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              isReadOnly={readOnly}
              isSubmittable={!readOnlySubmitButton}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </Column>
        </Row>
        <VerticalSpacer sixteenPx />
      </Panel>
    );
  }
  if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
    return (
      <Panel className={!readOnly ? styles.aksjonspunktBehandlerBorder : beregningStyles.panel}>
        <Row>
          <Column xs="12">
            <Normaltekst className={beregningStyles.semiBoldText}>
              <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler" />
            </Normaltekst>
          </Column>
        </Row>
        <VerticalSpacer eightPx />
        <AksjonspunktBehandlerSN
          readOnly={readOnly}
          allePerioder={allePerioder}
          alleAndelerIForstePeriode={alleAndelerIForstePeriode}
          aksjonspunkter={aksjonspunkter}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
        />
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="12">
            <BehandlingspunktSubmitButton
              formName={formName}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              isReadOnly={readOnly}
              isSubmittable={!readOnlySubmitButton}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
          </Column>
        </Row>
      </Panel>
    );
  }
  return null;
};
AksjonspunktBehandler.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  formName: PropTypes.string.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  tidsBegrensetInntekt: PropTypes.bool.isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  relevanteStatuser: PropTypes.shape().isRequired,
};

AksjonspunktBehandler.defaultProps = {
  allePerioder: undefined,
};
export default AksjonspunktBehandler;
