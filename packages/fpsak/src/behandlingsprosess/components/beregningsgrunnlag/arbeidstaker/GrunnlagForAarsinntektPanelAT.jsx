import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { behandlingFormValueSelector } from 'behandling/behandlingForm';
import { InputField } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import Table from 'sharedComponents/Table';
import TableRow from 'sharedComponents/TableRow';
import TableColumn from 'sharedComponents/TableColumn';
import { formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber } from 'utils/currencyUtils';
import { required } from 'utils/validation/validators';
import aktivitetStatus from 'kodeverk/aktivitetStatus';
import { isAksjonspunktOpen } from 'kodeverk/aksjonspunktStatus';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import Image from 'sharedComponents/Image';
import endretUrl from 'images/endret_felt.svg';
import periodeAarsak from 'kodeverk/periodeAarsak';
import createVisningsnavnForAktivitet from 'utils/arbeidsforholdUtil';
import NaturalytelsePanel from './NaturalytelsePanel';
import styles from './grunnlagForAarsinntektPanelAT.less';

const createTableRows = (relevanteAndeler, harAksjonspunkt, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const rows = relevanteAndeler.map((andel, index) => (
    <TableRow key={`index${index + 1}`}>
      <TableColumn>
        <Normaltekst>
          {createVisningsnavnForAktivitet(andel.arbeidsforhold)}
        </Normaltekst>
      </TableColumn>
      <TableColumn><Normaltekst>{formatCurrencyNoKr(andel.beregnetPrAar)}</Normaltekst></TableColumn>
      { harAksjonspunkt
      && (
      <TableColumn className={styles.inntektField}>
        <div className={(isAksjonspunktClosed && readOnly) ? styles.adjustedField : undefined}>
          <InputField
            name={`inntekt${index}`}
            validate={[required]}
            readOnly={readOnly}
            parse={parseCurrencyInput}
            bredde="S"
          />
        </div>
      </TableColumn>
      )
      }
      { harAksjonspunkt && isAksjonspunktClosed && readOnly
      && (
      <TableColumn>
        <Image
          src={endretUrl}
          titleCode="Behandling.EditedField"
        />
      </TableColumn>
      )
      }
    </TableRow>
  ));

  const summaryRow = (
    <TableRow key="bruttoBeregningsgrunnlag">
      <TableColumn><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.SumArbeidsinntekt" /></TableColumn>
      <TableColumn><Element>{formatCurrencyNoKr(beregnetAarsinntekt)}</Element></TableColumn>
      { harAksjonspunkt
    && (
    <TableColumn>
      <Element>{formatCurrencyNoKr(bruttoFastsattInntekt)}</Element>
    </TableColumn>
    )
    }
      { harAksjonspunkt && isAksjonspunktClosed && readOnly
      // For å matche den ekstra kolonnen som kommer på for "endret av saksbehandler" ikonet
      && <TableColumn />
    }
    </TableRow>
  );
  rows.push(summaryRow);

  return rows;
};

/**
 * GrunnlagForAarsinntektPanelAT
 *
 * Presentasjonskomponent. Viser beregningsgrunnlagstabellen for arbeidstakere.
 * Ved aksjonspunkt vil tabellen ha en kolonne med input felter med en rad per arbeidsgiver.
 * Vises også hvis status er en kombinasjonsstatus som inkluderer arbeidstaker.
 */
export const GrunnlagForAarsinntektPanelATImpl = ({
  readOnly,
  alleAndeler,
  allePerioder,
  aksjonspunkt,
  bruttoFastsattInntekt,
  isAksjonspunktClosed,
  isKombinasjonsstatus,
}) => {
  const headers = ['Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver', 'Beregningsgrunnlag.AarsinntektPanel.Inntekt'];
  const relevanteAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  const perioderMedBortfaltNaturalytelse = allePerioder
    .filter(periode => periode.periodeAarsaker !== null && (periode.periodeAarsaker
      .map(({ kode }) => kode).includes(periodeAarsak.NATURALYTELSE_BORTFALT)));
  const harAksjonspunkt = aksjonspunkt
    ? aksjonspunkt.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS
    : false;
  if (harAksjonspunkt) {
    headers.push('Beregningsgrunnlag.AarsinntektPanel.FastsattInntekt');
  }
  return (
    <div className={styles.inntektTablePanel}>
      { isKombinasjonsstatus
      && (
      <div>
        <Element><FormattedMessage id="Beregningsgrunnlag.AarsinntektPanel.Arbeidstaker" /></Element>
        <VerticalSpacer eightPx />
      </div>
      )
      }
      <Table headerTextCodes={headers} noHover classNameTable={styles.inntektTable}>
        {createTableRows(relevanteAndeler, harAksjonspunkt, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed)}
      </Table>

      { perioderMedBortfaltNaturalytelse.length > 0
      && <NaturalytelsePanel />
      }

    </div>
  );
};

GrunnlagForAarsinntektPanelATImpl.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  alleAndeler: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  bruttoFastsattInntekt: PropTypes.number,
  aksjonspunkt: aksjonspunktPropType,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
};

GrunnlagForAarsinntektPanelATImpl.defaultProps = {
  aksjonspunkt: undefined,
  bruttoFastsattInntekt: 0,
  allePerioder: undefined,
};

GrunnlagForAarsinntektPanelATImpl.transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode) => {
  let inntektPrAndelList = null;
  let frilansInntekt = null;
  if (relevanteStatuser.isArbeidstaker) {
    inntektPrAndelList = alleAndelerIForstePeriode.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER)
      .map(({ andelsnr }, index) => {
        const overstyrtInntekt = values[`inntekt${index}`];
        return {
          inntekt: (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt),
          andelsnr,
        };
      });
  }
  if (relevanteStatuser.isFrilanser) {
    frilansInntekt = removeSpacesFromNumber(values.inntektFrilanser);
  }
  return [{
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: values.ATFLVurdering,
    inntektFrilanser: frilansInntekt,
    inntektPrAndelList,
  }];
};

const mapStateToProps = (state, initialProps) => {
  const { alleAndeler, aksjonspunkt } = initialProps;
  const relevanteAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  const closedAps = (aksjonspunkt && aksjonspunkt.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS)
    ? !isAksjonspunktOpen(aksjonspunkt.status.kode)
    : false;
  const overstyrteInntekter = relevanteAndeler.map((inntekt, index) => {
    const overstyrtInntekt = behandlingFormValueSelector('BeregningsgrunnlagForm')(state, `inntekt${index}`);
    return (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt);
  });
  const bruttoFastsattInntekt = overstyrteInntekter.reduce((a, b) => a + b);
  return {
    isAksjonspunktClosed: closedAps,
    bruttoFastsattInntekt,
  };
};

const GrunnlagForAarsinntektPanelAT = connect(mapStateToProps)(GrunnlagForAarsinntektPanelATImpl);

GrunnlagForAarsinntektPanelAT.buildInitialValues = (relevanteAndeler) => {
  const initialValues = { };
  relevanteAndeler.forEach((inntekt, index) => {
    initialValues[`inntekt${index}`] = formatCurrencyNoKr(inntekt.overstyrtPrAar);
  });
  return initialValues;
};

export default GrunnlagForAarsinntektPanelAT;
