import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertekst, Element } from 'nav-frontend-typografi';
import { Row, Column } from 'nav-frontend-grid';
import {
  NavFieldGroup, InputField, SelectField, PeriodpickerField, DecimalField,
} from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils/validation/validators';
import { getEndringBeregningsgrunnlagPerioder } from 'behandling/behandlingSelectors';
import Image from '@fpsak-frontend/shared-components/Image';
import addCircleIcon from '@fpsak-frontend/images/add-circle.svg';
import ElementWrapper from '@fpsak-frontend/shared-components/ElementWrapper';
import { getKodeverk } from '@fpsak-frontend/kodeverk/duck';
import kodeverkPropType from '@fpsak-frontend/kodeverk/kodeverkPropType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/kodeverkTyper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/aktivitetStatus';
import inntektskategorier, { isSelvstendigNæringsdrivende } from '@fpsak-frontend/kodeverk/inntektskategorier';
import { parseCurrencyInput, removeSpacesFromNumber, formatCurrencyNoKr, createVisningsnavnForAktivitet, isArrayEmpty } from '@fpsak-frontend/utils';
import { getUniqueListOfArbeidsforhold, arbeidsforholdProptype } from '../../ArbeidsforholdHelper';

import styles from './renderEndringBGFieldArray.less';

const skalVereLavereEnnInntektmeldingMessage = () => ([{ id: 'BeregningInfoPanel.EndringBG.Validation.LavereEnnInntektsmelding' }]);

const skalVereLavereEnnInntektmelding = (
  value, belopFraInntektsmelding,
) => ((value > belopFraInntektsmelding) ? skalVereLavereEnnInntektmeldingMessage() : undefined);

const skalVereLikFordelingForrigeBehandlingMessage = fordelingForrigeBehandling => (
  [{ id: 'BeregningInfoPanel.EndringBG.Validation.LikFordelingForrigeBehandling' },
    { fordelingForrigeBehandling }]);

const likFordelingForrigeBehandling = (
  value, fordelingForrigeBehandling,
) => ((value !== fordelingForrigeBehandling) ? skalVereLikFordelingForrigeBehandlingMessage(formatCurrencyNoKr(fordelingForrigeBehandling)) : undefined);

const defaultBGFordeling = {
  nyAndel: true,
  fordelingForrigeBehandling: 0,
  fastsattBeløp: formatCurrencyNoKr(0),
  lagtTilAvSaksbehandler: true,
};

const fieldLabel = (index, labelId) => {
  if (index === 0) {
    return { id: labelId };
  }
  return '';
};


const arbeidsgiverSelectValues = arbeidsforholdList => (arbeidsforholdList
  .map(arbeidsforhold => (
    <option value={arbeidsforhold.andelsnr.toString()} key={arbeidsforhold.andelsnr}>
      {createVisningsnavnForAktivitet(arbeidsforhold)}
    </option>
  )));


const inntektskategoriSelectValues = kategorier => kategorier.map(ik => (
  <option value={ik.kode} key={ik.kode}>
    {ik.navn}
  </option>
));

const hentArbeidsperiode = (field, arbeidsforholdList) => {
  if (field.nyAndel === false) {
    return null;
  }
  let arbeidsperiode = null;
  arbeidsforholdList.forEach((af) => {
    if (af.andelsnr.toString() === field.andel) {
      arbeidsperiode = {
        arbeidsperiodeFom: af.startdato,
        arbeidsperiodeTom: af.opphoersdato,
      };
    }
  });
  return arbeidsperiode;
};

const summerFordelingForrigeBehandling = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fordelingForrigeBehandling ? Number(removeSpacesFromNumber(fields.get(index).fordelingForrigeBehandling)) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const summerFordeling = (fields) => {
  let sum = 0;
  fields.forEach((andelElementFieldId, index) => {
    sum += fields.get(index).fastsattBeløp ? Number(removeSpacesFromNumber(fields.get(index).fastsattBeløp)) : 0;
  });
  return sum > 0 ? formatCurrencyNoKr(sum) : '';
};

const isSelvstendigOrFrilanser = fieldVal => (isSelvstendigNæringsdrivende(fieldVal.inntektskategori)
  || inntektskategorier.FRILANSER === fieldVal.inntektskategori);

const getErrorMessage = (meta, intl) => (meta.error && (meta.submitFailed) ? intl.formatMessage(...meta.error) : null);


const arbeidsforholdReadOnlyOrSelect = (fields, index, elementFieldId, selectVals, isReadOnly) => (
  <ElementWrapper>
    {(!fields.get(index).nyAndel)
      && (
      <InputField
        name={`${elementFieldId}.andel`}
        bredde="L"
        readOnly
      />
      )
      }
    {fields.get(index).nyAndel
      && (
      <SelectField
        name={`${elementFieldId}.andel`}
        bredde="l"
        label={fieldLabel(index, 'BeregningInfoPanel.EndringBG.Andel')}
        selectValues={selectVals}
        readOnly={isReadOnly}
      />
      )
      }
  </ElementWrapper>
);


function skalViseSletteknapp(index, fields, readOnly) {
  return (fields.get(index).nyAndel || fields.get(index).lagtTilAvSaksbehandler) && !readOnly;
}

/**
 *  RenderEndringBGFieldArray
 *
 * Presentasjonskomponent: Viser fordeling av brutto beregningsgrunnlag ved endret beregningsgrunnlag
 * Komponenten må rendres som komponenten til et FieldArray.
 */
export const RenderEndringBGFieldArrayImpl = ({
  fields,
  meta,
  intl,
  arbeidsforholdList,
  inntektskategoriKoder,
  readOnly,
  periodeUtenAarsak,
  isAksjonspunktClosed,
}) => {
  const sumFordelingForrigeBehandling = summerFordelingForrigeBehandling(fields);
  const sumFordeling = summerFordeling(fields);
  fields.forEach((andelElementFieldId, index) => {
    const field = fields.get(index);
    const arbeidsperiode = hentArbeidsperiode(field, arbeidsforholdList);
    if (arbeidsperiode !== null) {
      field.arbeidsperiodeFom = arbeidsperiode.arbeidsperiodeFom;
      field.arbeidsperiodeTom = arbeidsperiode.arbeidsperiodeTom;
    }
  });
  const selectVals = arbeidsgiverSelectValues(arbeidsforholdList);
  return (
    <NavFieldGroup errorMessage={getErrorMessage(meta, intl)}>
      {fields
        .map((andelElementFieldId, index) => (
          <Row key={andelElementFieldId}>
            <Column xs="12">
              {index === 0
              && (
              <Row className={styles.divider}>
                <Column xs="2">
                  <Undertekst>
                    {' '}
                    <FormattedMessage id="BeregningInfoPanel.EndringBG.Andel" />
                  </Undertekst>
                </Column>
                <Column xs="2" className={styles.periodeColumn}>
                  <Undertekst>
                    {' '}
                    <FormattedMessage id="BeregningInfoPanel.EndringBG.Arbeidsperiode" />
                  </Undertekst>
                </Column>
                <Column xs="1" className={styles.fordelingForrige}>
                  <Undertekst>
                    {' '}
                    <FormattedMessage
                      id="BeregningInfoPanel.EndringBG.FordelingForrigeBehandling"
                    />
                  </Undertekst>
                </Column>
                <Column xs="1" className={styles.fordelingForrige}>
                  <Undertekst>
                    {' '}
                    <FormattedMessage
                      id="BeregningInfoPanel.EndringBG.AndelIArbeid"
                    />
                  </Undertekst>
                </Column>
                <Column xs="1" className={styles.refusjon}>
                  <Undertekst>
                    {' '}
                    <FormattedMessage id="BeregningInfoPanel.EndringBG.Refusjonskrav" />
                  </Undertekst>
                </Column>
                <Column xs="2" className={styles.nyFordeling}>
                  <Undertekst>
                    {' '}
                    <FormattedMessage id="BeregningInfoPanel.EndringBG.Fordeling" />
                  </Undertekst>
                </Column>
                <Column xs="2" className={styles.rightAlignInput}>
                  <Undertekst>
                    {' '}
                    <FormattedMessage id="BeregningInfoPanel.EndringBG.Inntektskategori" />
                  </Undertekst>
                </Column>
              </Row>
              )
              }
              <Row className={styles.notLastRow}>
                <Column xs="2">
                  {arbeidsforholdReadOnlyOrSelect(fields, index, andelElementFieldId, selectVals, readOnly)}
                </Column>
                <Column xs="2" className={styles.periodeColumn}>
                  {!isSelvstendigOrFrilanser(fields.get(index))
                  && (
                  <PeriodpickerField
                    names={[`${andelElementFieldId}.arbeidsperiodeFom`, `${andelElementFieldId}.arbeidsperiodeTom`]}
                    readOnly
                    defaultValue={null}
                    renderIfMissingDateOnReadOnly
                  />
                  )
                  }
                </Column>
                <Column xs="1" className={styles.fordelingForrige}>
                  <InputField
                    name={`${andelElementFieldId}.fordelingForrigeBehandling`}
                    bredde="S"
                    readOnly
                    parse={parseCurrencyInput}
                  />
                </Column>
                <Column xs="1" className={styles.fordelingForrige}>
                  <DecimalField
                    name={`${andelElementFieldId}.andelIArbeid`}
                    readOnly
                    bredde="S"
                    format={(value) => {
                      if (value || value === 0) {
                        return `${value} %`;
                      }
                      return '';
                    }}
                    normalizeOnBlur={value => (Number.isNaN(value) ? value : parseFloat(value).toFixed(2))}
                  />
                </Column>
                <Column xs="1" className={styles.refusjon}>
                  <InputField
                    name={`${andelElementFieldId}.refusjonskrav`}
                    bredde="XS"
                    readOnly={readOnly || !fields.get(index).skalKunneEndreRefusjon}
                    parse={parseCurrencyInput}
                  />
                </Column>
                <Column xs="2" className={styles.nyFordeling}>
                  <InputField
                    name={`${andelElementFieldId}.fastsattBeløp`}
                    bredde="XS"
                    parse={parseCurrencyInput}
                    readOnly={readOnly}
                    isEdited={isAksjonspunktClosed && !periodeUtenAarsak}
                  />
                </Column>
                <Column xs="2" className={styles.rightAlignInput}>
                  <SelectField
                    label=""
                    name={`${andelElementFieldId}.inntektskategori`}
                    bredde="s"
                    selectValues={inntektskategoriSelectValues(inntektskategoriKoder)}
                    value={fields.get(index).inntektskategori}
                    readOnly={readOnly}
                    isEdited={isAksjonspunktClosed && !periodeUtenAarsak}
                  />
                </Column>
                {skalViseSletteknapp(index, fields, readOnly)
                && (
                <Column xs="1" className={styles.deleteBtn}>
                  <button
                    className={styles.buttonRemove}
                    type="button"
                    onClick={() => {
                      fields.remove(index);
                    }}
                  />
                </Column>
                )
                }
              </Row>
            </Column>
          </Row>
        ))}
      <Row className={styles.sumRow}>
        <Column xs="3">
          <Undertekst>
            {' '}
            <FormattedMessage
              id="BeregningInfoPanel.EndringBG.Sum"
            />
          </Undertekst>
        </Column>
        <Column xs="1" className={styles.periodeColumn} />
        <Column xs="1" className={styles.fordelingForrige}>
          <Element>
            {sumFordelingForrigeBehandling}
          </Element>
        </Column>
        <Column xs="1" className={styles.fordelingForrige} />
        <Column xs="1" className={styles.refusjon} />
        <Column xs="1" className={styles.nyFordeling}>
          <Element>
            {sumFordeling}
          </Element>
        </Column>
      </Row>
      {!readOnly
      && (
      <Row className={styles.buttonRow}>
        <Column xs="3">
          {// eslint-disable-next-line jsx-a11y/click-events-have-key-events
          }
          <div
            id="leggTilAndelDiv"
            onClick={() => {
              fields.push(defaultBGFordeling);
            }}
            onKeyDown={() => fields.push(defaultBGFordeling)}
            className={styles.addPeriode}
            role="button"
            tabIndex="0"
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
      )
      }
    </NavFieldGroup>
  );
};


RenderEndringBGFieldArrayImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  fields: PropTypes.shape().isRequired,
  meta: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
  arbeidsforholdList: PropTypes.arrayOf(arbeidsforholdProptype).isRequired,
  inntektskategoriKoder: kodeverkPropType.isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  periodeUtenAarsak: PropTypes.bool.isRequired,
};

const aktivitetErIkkjeFrilansBrukersAndelEllerSN = aktivitetstatus => !(aktivitetstatus === aktivitetStatus.BRUKERS_ANDEL
  || aktivitetstatus === aktivitetStatus.FRILANS || aktivitetstatus === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);

const RenderEndringBGFieldArray = injectIntl(RenderEndringBGFieldArrayImpl);

const validateRefusjonsbelop = (refusjonskrav, skalKunneEndreRefusjon, belopFraInntektsmelding, aktivitetstatus) => {
  let refusjonskravError;
  if (skalKunneEndreRefusjon) {
    refusjonskravError = required(refusjonskrav);
    if (aktivitetErIkkjeFrilansBrukersAndelEllerSN(aktivitetstatus)) {
      refusjonskravError = refusjonskravError
        || skalVereLavereEnnInntektmelding(refusjonskrav !== '' ? Number(removeSpacesFromNumber(refusjonskrav)) : 0, belopFraInntektsmelding);
    }
  }
  return refusjonskravError;
};

const validateFastsattBelop = (fastsattBelop, belopFraInntektsmelding, aktivitetstatus) => {
  let error = required(fastsattBelop);
  if (aktivitetErIkkjeFrilansBrukersAndelEllerSN(aktivitetstatus)) {
    error = error || skalVereLavereEnnInntektmelding(Number(removeSpacesFromNumber(fastsattBelop)), belopFraInntektsmelding);
  }
  return error;
};

const hasFieldErrors = fieldErrors => (fieldErrors.refusjonskrav || fieldErrors.andel
  || fieldErrors.fastsattBeløp || fieldErrors.inntektskategori);

RenderEndringBGFieldArray.validate = (values) => {
  const arrayErrors = values.map(({
    refusjonskrav, fastsattBeløp, belopFraInntektsmelding, skalKunneEndreRefusjon,
    aktivitetstatus, andel, harPeriodeAarsakGraderingEllerRefusjon, inntektskategori, refusjonskravFraInntektsmelding,
  }) => {
    if (!harPeriodeAarsakGraderingEllerRefusjon) {
      return null;
    }
    const fieldErrors = {};
    fieldErrors.refusjonskrav = validateRefusjonsbelop(
      refusjonskrav, skalKunneEndreRefusjon,
      refusjonskravFraInntektsmelding, aktivitetstatus,
    );
    fieldErrors.fastsattBeløp = validateFastsattBelop(fastsattBeløp, belopFraInntektsmelding, aktivitetstatus);
    fieldErrors.andel = required(andel);
    fieldErrors.inntektskategori = required(inntektskategori);

    return hasFieldErrors(fieldErrors) ? fieldErrors : null;
  });

  if (arrayErrors.some(errors => errors !== null)) {
    return arrayErrors;
  }

  if (isArrayEmpty(values)) {
    return null;
  }

  const sumFordelingForrigeBehandling = values
    .map(({ fordelingForrigeBehandling }) => (fordelingForrigeBehandling ? removeSpacesFromNumber(fordelingForrigeBehandling) : 0))
    .reduce((sum, fordeling) => sum + fordeling, 0);
  const sumFastsattBelop = values.map(({ fastsattBeløp }) => (fastsattBeløp ? removeSpacesFromNumber(fastsattBeløp) : 0))
    .reduce((sum, fastsattBeløp) => sum + fastsattBeløp, 0);

  const fastsattBeløpError = sumFordelingForrigeBehandling !== 0 ? likFordelingForrigeBehandling(sumFastsattBelop, sumFordelingForrigeBehandling) : null;
  if (fastsattBeløpError) {
    return { _error: fastsattBeløpError };
  }

  return null;
};

const mapStateToProps = (state) => {
  const arbeidsforholdList = getUniqueListOfArbeidsforhold(getEndringBeregningsgrunnlagPerioder(state)
    ? getEndringBeregningsgrunnlagPerioder(state).flatMap(p => p.endringBeregningsgrunnlagAndeler) : undefined);
  return {
    arbeidsforholdList,
    inntektskategoriKoder: getKodeverk(kodeverkTyper.INNTEKTSKATEGORI)(state),
  };
};


export default connect(mapStateToProps)(RenderEndringBGFieldArray);
