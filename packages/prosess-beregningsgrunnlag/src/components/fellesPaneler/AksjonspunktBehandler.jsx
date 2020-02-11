import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';
import { Column, Row } from 'nav-frontend-grid';
import { Element } from 'nav-frontend-typografi';
import { FormattedMessage, injectIntl } from 'react-intl';

import {
  dateFormat,
  hasValidText, maxLength, minLength, required,
} from '@fpsak-frontend/utils';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import {
  BehandlingspunktSubmitButton, hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/fp-felles';

import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import TextAreaField2 from '../redesign/TextAreaField_V2';
import styles from './aksjonspunktBehandler.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import AksjonspunktBehandlerAT from '../arbeidstaker/AksjonspunktBehandlerAT';
import AksjonspunktBehandlerFL from '../frilanser/AksjonspunktBehandlerFL';
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
const finnGjeldeneAksjonsPunkt = (aksjonspunkter, erNyiArbeidslivet, readOnly, erSNellerFL) => {
  if (erSNellerFL) {
    return aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  }
  if (erNyiArbeidslivet) {
    return aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET);
  }
  return aksjonspunkter.find((ap) => ap.definisjon.kode === aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE);
};

const lagEndretTekst = (aksjonspunkter, erNyiArbeidslivet, readOnly, erSNellerFL) => {
  if (!aksjonspunkter || !readOnly) return null;
  const aksjonspunkt = finnGjeldeneAksjonsPunkt(aksjonspunkter, erNyiArbeidslivet, readOnly, erSNellerFL);
  if (!aksjonspunkt) return null;
  const { endretAv, endretTidspunkt } = aksjonspunkt;
  if (!endretTidspunkt) return null;
  const godkjentEndretAv = /[a-zA-Z]{1}[0-9]{6}/.test(endretAv) ? endretAv : '';
  return (
    <FormattedMessage
      id="Beregningsgrunnlag.Forms.EndretTekst"
      values={{ endretAv: godkjentEndretAv, endretDato: dateFormat(endretTidspunkt) }}
    />
  );
};

const AksjonspunktBehandler = ({
  intl,
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
  let erVarigEndring = false;
  let erNyoppstartet = false;
  let erNyArbLivet = false;
  let visFL = false;
  let visAT = false;
  const snAndel = alleAndelerIForstePeriode.find(
    (andel) => andel.aktivitetStatus && andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE,
  );
  const flAndel = alleAndelerIForstePeriode.find(
    (andel) => andel.aktivitetStatus && andel.aktivitetStatus.kode === aktivitetStatus.FRILANSER,
  );
  const atAndel = alleAndelerIForstePeriode.find(
    (andel) => andel.aktivitetStatus && andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER,
  );
  if (flAndel) {
    visFL = flAndel.skalFastsetteGrunnlag;
  }
  if (atAndel) {
    visAT = atAndel.skalFastsetteGrunnlag;
  }
  if (snAndel && snAndel.erNyIArbeidslivet) {
    erNyArbLivet = snAndel.erNyIArbeidslivet;
  }
  erVarigEndring = snAndel && snAndel.næringer && snAndel.næringer.some((naring) => naring.erVarigEndret === true);
  erNyoppstartet = snAndel && snAndel.næringer && snAndel.næringer.some((naring) => naring.erNyoppstartet === true);
  if (!aksjonspunkter || aksjonspunkter.length === 0) {
    return null;
  }
  if (!relevanteStatuser.isSelvstendigNaeringsdrivende) {
    return (
      <div className={readOnly ? '' : styles.aksjonspunktBehandlerContainer}>
        <Panel className={readOnly ? beregningStyles.panelRight : styles.aksjonspunktBehandlerBorder}>
          <Row>
            <Column xs="12">
              <Element className={beregningStyles.avsnittOverskrift}>
                <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler" />
              </Element>
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
          {!tidsBegrensetInntekt && visAT && (
          <AksjonspunktBehandlerAT
            readOnly={readOnly}
            allePerioder={allePerioder}
            alleAndelerIForstePeriode={alleAndelerIForstePeriode}
            alleKodeverk={alleKodeverk}
          />
          )}
          {visFL && (
          <AksjonspunktBehandlerFL
            readOnly={readOnly}
            allePerioder={allePerioder}
            alleAndelerIForstePeriode={alleAndelerIForstePeriode}
          />
          )}

          <VerticalSpacer sixteenPx />
          <Row>
            <Column xs="12">

              <TextAreaField2
                name="ATFLVurdering"
                label={finnATFLVurderingLabel(aksjonspunkter)}
                validate={[required, maxLength1500, minLength3, hasValidText]}
                maxLength={1500}
                readOnly={readOnly}
                placeholder={intl.formatMessage({ id: 'Beregningsgrunnlag.Forms.VurderingAvFastsattBeregningsgrunnlag.Placeholder' })}
                endrettekst={lagEndretTekst(aksjonspunkter, erNyArbLivet, readOnly, true)}
              />
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
      </div>
    );
  }
  if (relevanteStatuser.isSelvstendigNaeringsdrivende) {
    return (
      <div className={readOnly ? '' : styles.aksjonspunktBehandlerContainer}>
        <Panel className={readOnly ? beregningStyles.panelRight : styles.aksjonspunktBehandlerBorder}>
          <Row>
            <Column xs="12">
              <Element className={beregningStyles.avsnittOverskrift}>
                {erNyArbLivet && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.NyIArbeidslivet" />
                )}
                {erNyoppstartet && !erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.Nyoppstartet" />
                )}
                {!erNyArbLivet && !erNyoppstartet && erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler.VarigEndring" />
                )}
                {!erNyArbLivet && erNyoppstartet && erVarigEndring && (
                  <FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.AksjonspunktBehandler" />
                )}
              </Element>
            </Column>
          </Row>
          <VerticalSpacer eightPx />
          <AksjonspunktBehandlerSN
            readOnly={readOnly}
            aksjonspunkter={aksjonspunkter}
            behandlingId={behandlingId}
            behandlingVersjon={behandlingVersjon}
            erNyArbLivet={erNyArbLivet}
            erVarigEndring={erVarigEndring}
            erNyoppstartet={erNyoppstartet}
            endretTekst={lagEndretTekst(aksjonspunkter, erNyArbLivet, readOnly, false)}
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
      </div>
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
  intl: PropTypes.shape().isRequired,
};

AksjonspunktBehandler.defaultProps = {
  allePerioder: undefined,
};

AksjonspunktBehandler.transformValues = (values) => values.ATFLVurdering;

export default injectIntl(AksjonspunktBehandler);
