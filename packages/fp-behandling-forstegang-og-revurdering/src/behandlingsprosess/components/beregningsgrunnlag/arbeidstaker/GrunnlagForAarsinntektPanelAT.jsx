import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { behandlingFormValueSelector } from 'behandlingForstegangOgRevurdering/src/behandlingForm';
import { InputField } from '@fpsak-frontend/form';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import {
  Image, VerticalSpacer, Table, TableRow, TableColumn,
} from '@fpsak-frontend/shared-components';
import {
  required, formatCurrencyNoKr, parseCurrencyInput, removeSpacesFromNumber,
} from '@fpsak-frontend/utils';
import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duck';
import { createVisningsnavnForAktivitet } from 'behandlingForstegangOgRevurdering/src/visningsnavnHelper';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import endretUrl from '@fpsak-frontend/assets/images/endret_felt.svg';
import periodeAarsak from '@fpsak-frontend/kodeverk/src/periodeAarsak';
import NaturalytelsePanel from './NaturalytelsePanel';
import styles from './grunnlagForAarsinntektPanelAT.less';

const formName = 'BeregningForm';

const createTableRows = (relevanteAndeler, harAksjonspunkt, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed, getKodeverknavn) => {
  const beregnetAarsinntekt = relevanteAndeler.reduce((acc, andel) => acc + andel.beregnetPrAar, 0);
  const rows = relevanteAndeler.map((andel, index) => (
    <TableRow key={`index${index + 1}`}>
      <TableColumn>
        <Normaltekst>
          {createVisningsnavnForAktivitet(andel.arbeidsforhold, getKodeverknavn)}
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

const harFastsettBgAtFlAksjonspunkt = aksjonspunkter => aksjonspunkter !== undefined && aksjonspunkter !== null
  && aksjonspunkter.some(ap => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);

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
  aksjonspunkter,
  bruttoFastsattInntekt,
  isAksjonspunktClosed,
  isKombinasjonsstatus,
  getKodeverknavn,
}) => {
  const headers = ['Beregningsgrunnlag.AarsinntektPanel.Arbeidsgiver', 'Beregningsgrunnlag.AarsinntektPanel.Inntekt'];
  const relevanteAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  const perioderMedBortfaltNaturalytelse = allePerioder
    .filter(periode => periode.periodeAarsaker !== null && (periode.periodeAarsaker
      .map(({ kode }) => kode).includes(periodeAarsak.NATURALYTELSE_BORTFALT)));
  const harAksjonspunkt = harFastsettBgAtFlAksjonspunkt(aksjonspunkter);
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
        {createTableRows(relevanteAndeler, harAksjonspunkt, bruttoFastsattInntekt, readOnly, isAksjonspunktClosed, getKodeverknavn)}
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
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  isAksjonspunktClosed: PropTypes.bool.isRequired,
  isKombinasjonsstatus: PropTypes.bool.isRequired,
  allePerioder: PropTypes.arrayOf(PropTypes.shape()),
  getKodeverknavn: PropTypes.func.isRequired,
};

GrunnlagForAarsinntektPanelATImpl.defaultProps = {
  bruttoFastsattInntekt: 0,
  allePerioder: undefined,
};

const mapStateToProps = (state, initialProps) => {
  const { alleAndeler, aksjonspunkter } = initialProps;
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS);
  const closedAps = aksjonspunkt ? !isAksjonspunktOpen(aksjonspunkt.status.kode) : false;
  const relevanteAndeler = alleAndeler.filter(andel => andel.aktivitetStatus.kode === aktivitetStatus.ARBEIDSTAKER);
  const overstyrteInntekter = relevanteAndeler.map((inntekt, index) => {
    const overstyrtInntekt = behandlingFormValueSelector(formName)(state, `inntekt${index}`);
    return (overstyrtInntekt === undefined || overstyrtInntekt === '') ? 0 : removeSpacesFromNumber(overstyrtInntekt);
  });
  const bruttoFastsattInntekt = overstyrteInntekter.reduce((a, b) => a + b);
  return {
    isAksjonspunktClosed: closedAps,
    bruttoFastsattInntekt,
  };
};

const GrunnlagForAarsinntektPanelAT = connect(mapStateToProps)(injectKodeverk(getAlleKodeverk)(GrunnlagForAarsinntektPanelATImpl));

GrunnlagForAarsinntektPanelAT.buildInitialValues = (relevanteAndeler) => {
  const initialValues = { };
  relevanteAndeler.forEach((inntekt, index) => {
    initialValues[`inntekt${index}`] = formatCurrencyNoKr(inntekt.overstyrtPrAar);
  });
  return initialValues;
};

GrunnlagForAarsinntektPanelAT.transformValues = (values, relevanteStatuser, alleAndelerIForstePeriode) => {
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
  return {
    kode: aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
    begrunnelse: values.ATFLVurdering,
    inntektFrilanser: frilansInntekt,
    inntektPrAndelList,
  };
};

export default GrunnlagForAarsinntektPanelAT;
