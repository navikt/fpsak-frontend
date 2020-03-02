import React from 'react';
import PropTypes from 'prop-types';
import {
  Element, Normaltekst, Undertekst, EtikettLiten,
} from 'nav-frontend-typografi';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import {
  FlexColumn, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';
import { Column, Row } from 'nav-frontend-grid';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import { dateFormat, formatCurrencyNoKr } from '@fpsak-frontend/utils';
import Lesmerpanel from '../redesign/LesmerPanel';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import styles from './naeringsOpplysningsPanel.less';
import LinkTilEksterntSystem from '../redesign/LinkTilEksterntSystem';
import AvsnittSkiller from '../redesign/AvsnittSkiller';

const finnvirksomhetsTypeKode = (naring) => {
  const { virksomhetType } = naring;
  if (!virksomhetType) {
    return 'UDEFINERT';
  }
  const { kode } = virksomhetType;
  if (!kode) {
    return 'UDEFINERT';
  }
  return kode;
};
const virksomhetsDatoer = (naringsAndel) => {
  const { oppstartsdato, opphoersdato } = naringsAndel;
  if (!oppstartsdato) {
    return undefined;
  }
  return opphoersdato ? `${dateFormat(oppstartsdato)}-${dateFormat(opphoersdato)} ` : `${dateFormat(oppstartsdato)}-`;
};

const revisorDetaljer = (naring) => {
  const { regnskapsførerNavn, regnskapsførerTlf } = naring;
  if (!regnskapsførerNavn) {
    return null;
  }
  return regnskapsførerTlf ? `${regnskapsførerNavn}-${regnskapsførerTlf} ` : `${regnskapsførerNavn}-`;
};

const finnBedriftsnavn = (naring) => {
  const { virksomhetNavn } = naring;
  return virksomhetNavn || 'Ukjent bedriftsnavn';
};

const lagIntroTilEndringspanel = (naring) => {
  const {
    oppstartsdato, erVarigEndret, endringsdato,
  } = naring;
  const hendelseTekst = erVarigEndret ? 'Beregningsgrunnlag.NaeringsOpplysningsPanel.VarigEndret' : 'Beregningsgrunnlag.NaeringsOpplysningsPanel.Nyoppstaret';
  const hendelseDato = erVarigEndret ? endringsdato : oppstartsdato;
  if (!hendelseDato) {
    return null;
  }
  return (
    <span>
      <FormattedHTMLMessage id={hendelseTekst} values={{ dato: dateFormat(hendelseDato) }} />
    </span>
  );
};

const erNæringNyoppstartetEllerVarigEndret = (naring) => {
  const {
    erNyoppstartet, erVarigEndret,
  } = naring;
  return erVarigEndret || erNyoppstartet;
};

const lagBeskrivelsePanel = (naringsAndel, intl) => (
  <>
    <VerticalSpacer fourPx />
    <Lesmerpanel
      className={styles.lesMer}
      intro={lagIntroTilEndringspanel(naringsAndel)}
      lukkTekst={intl.formatMessage({ id: 'Beregningsgrunnlag.NaeringsOpplysningsPanel.SkjulBegrunnelse' })}
      apneTekst={intl.formatMessage({ id: 'Beregningsgrunnlag.NaeringsOpplysningsPanel.VisBegrunnelse' })}
      defaultApen
    >
      {naringsAndel.begrunnelse && naringsAndel.begrunnelse !== '' && (
      <Normaltekst className={styles.merTekstBorder}>
        {naringsAndel.begrunnelse}
      </Normaltekst>
      )}
    </Lesmerpanel>
  </>
);


const søkerHarOppgittInntekt = (naring) => naring.oppgittInntekt || naring.oppgittInntekt === 0;

export const NaeringsopplysningsPanel = ({
  alleAndelerIForstePeriode,
  intl,
}) => {
  const snAndel = alleAndelerIForstePeriode.find((andel) => andel.aktivitetStatus.kode === aktivitetStatus.SELVSTENDIG_NAERINGSDRIVENDE);
  const userIdent = null; // TODO denne må hentes fra brukerID enten fra brukerObjectet eller på beregningsgrunnlag må avklares
  if (!snAndel.næringer) {
    return null;
  }

  return (
    <>
      <AvsnittSkiller luftOver luftUnder />
      <FlexRow key="SNNareingOverskrift">
        <FlexColumn>
          <Element className={beregningStyles.avsnittOverskrift}>
            <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.Overskrift" />
          </Element>
        </FlexColumn>
        <FlexColumn>
          {userIdent && (
            <LinkTilEksterntSystem linkText="SØ" userIdent={userIdent} type="SØ" />
          )}
        </FlexColumn>
      </FlexRow>
      <VerticalSpacer eightPx />
      {snAndel.næringer.map((naring) => (
        <React.Fragment key={`NaringsWrapper${naring.orgnr}`}>
          <Row key="SNInntektIngress">
            <Column xs="9" />
            <Column xs="3" className={beregningStyles.colAarText}>
              {søkerHarOppgittInntekt(naring) && (
                <Undertekst>
                  <FormattedMessage id="Beregningsgrunnlag.NaeringsOpplysningsPanel.OppgittAar" />
                </Undertekst>
              )}
            </Column>
          </Row>
          <Row key={`NaringsNavn${naring.orgnr}`}>
            <Column xs="6">
              <Normaltekst className={beregningStyles.semiBoldText}>
                {finnBedriftsnavn(naring)}
              </Normaltekst>
            </Column>
            <Column xs="4">
              <EtikettLiten className={styles.naringsType}>
                <FormattedMessage id={`Beregningsgrunnlag.NaeringsOpplysningsPanel.VirksomhetsType.${finnvirksomhetsTypeKode(naring)}`} />
              </EtikettLiten>
            </Column>
            <Column xs="2" className={beregningStyles.colAarText}>
              {søkerHarOppgittInntekt(naring)
                && (
                <Normaltekst className={beregningStyles.semiBoldText}>
                  {formatCurrencyNoKr(naring.oppgittInntekt)}
                </Normaltekst>
                )}
            </Column>
          </Row>
          <Row key={`NaringsDetaljer${naring.orgnr}`}>
            <Column xs="2">
              <Normaltekst>
                {naring && naring.orgnr ? naring.orgnr : ''}
              </Normaltekst>
            </Column>
            <Column xs="4">
              {virksomhetsDatoer(naring)
                && (
                <Undertekst>
                  {virksomhetsDatoer(naring)}
                </Undertekst>
                )}
            </Column>
          </Row>
          <Row key={`RevisorRad${naring.orgnr}`}>
            <Column xs="10">
              {naring.regnskapsførerNavn && (
                <Normaltekst>
                  {revisorDetaljer(naring)}
                </Normaltekst>
              )}
            </Column>
          </Row>
          {erNæringNyoppstartetEllerVarigEndret(naring)
            && (
            <Row>
              {lagBeskrivelsePanel(naring, intl)}
            </Row>
            )}
          <VerticalSpacer twentyPx />
        </React.Fragment>
      ))}
    </>
  );
};

NaeringsopplysningsPanel.propTypes = {
  alleAndelerIForstePeriode: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
};
NaeringsopplysningsPanel.defaultProps = {
  alleAndelerIForstePeriode: undefined,
};


export default injectIntl(NaeringsopplysningsPanel);
