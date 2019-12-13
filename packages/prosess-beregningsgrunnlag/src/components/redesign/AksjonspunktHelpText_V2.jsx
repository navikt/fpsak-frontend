import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import advarselIkonUrl from '@fpsak-frontend/assets/images/advarsel2.svg';
import { Normaltekst } from 'nav-frontend-typografi';
import {
  FlexColumn, FlexContainer, FlexRow, Image,
} from '@fpsak-frontend/shared-components';


import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import styles from './aksjonspunktHelpText_V2.less';
import beregningsgrunnlagAksjonspunkterPropType from '../../propTypes/beregningsgrunnlagAksjonspunkterPropType';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag_V2.less';

const {
  FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS,
  VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE,
  FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD,
  FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET,
  FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE,
  VURDER_DEKNINGSGRAD,
} = aksjonspunktCodes;

const findAksjonspunktHelpTekst = (gjeldendeAksjonspunkt, erVarigEndring, erNyArbLivet, erNyoppstartet) => {
  switch (gjeldendeAksjonspunkt.definisjon.kode) {
    case FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS:
      return 'Beregningsgrunnlag.Helptext.Arbeidstaker2';
    case VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE:
      if (erVarigEndring) {
        return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende.VarigEndring';
      }
      if (erNyoppstartet) {
        return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende.Nyoppstartet';
      }

      return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende2';
    case FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD:
      return 'Beregningsgrunnlag.Helptext.TidsbegrensetArbeidsforhold2';
    case FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE:
      return 'Beregningsgrunnlag.Helptext.SelvstendigNaeringsdrivende2';
    case FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET:
      return 'Beregningsgrunnlag.Helptext.NyIArbeidslivetSN2';
    case VURDER_DEKNINGSGRAD:
      return 'Beregningsgrunnlag.Helptext.BarnetHarDødDeFørsteSeksUkene';
    default:
      return 'Beregningsgrunnlag.Helptext.Ukjent';
  }
};

const AksjonspunktHelpTextV2 = ({
  apneAksjonspunkt,
  intl,
  avvikProsent,
  erVarigEndring,
  erNyArbLivet,
  erNyoppstartet,
}) => {
  const elementStyle = apneAksjonspunkt.length === 1 ? styles.oneElement : styles.severalElements;
  if (!apneAksjonspunkt || apneAksjonspunkt.length === 0) {
    return null;
  }
  return (
    <div className={styles.container}>
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Image className={styles.image} alt={intl.formatMessage({ id: 'HelpText.Aksjonspunkt' })} src={advarselIkonUrl} />
          </FlexColumn>

          <FlexColumn className={styles.aksjonspunktText}>
            {apneAksjonspunkt.map((ap) => {
              const langId = findAksjonspunktHelpTekst(ap, erVarigEndring, erNyArbLivet, erNyoppstartet);
              const langIdIngress = `${langId}.Ingress`;
              return (
                <div key={ap.definisjon.kode} className={elementStyle}>

                  <Normaltekst className={styles.wordwrap}>
                    <span className={beregningStyles.semiBoldText}>
                      <FormattedMessage
                        key={`Ing${ap.definisjon.kode}`}
                        id={langIdIngress}
                        values={{ verdi: avvikProsent }}
                      />
                    </span>
                    <FormattedMessage key={ap.definisjon.kode} id={langId} values={{ verdi: avvikProsent }} />
                  </Normaltekst>
                </div>
              );
            })}
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  );
};

AksjonspunktHelpTextV2.propTypes = {
  intl: PropTypes.shape().isRequired,
  apneAksjonspunkt: PropTypes.arrayOf(beregningsgrunnlagAksjonspunkterPropType).isRequired,
  avvikProsent: PropTypes.number.isRequired,
  erVarigEndring: PropTypes.bool,
  erNyArbLivet: PropTypes.bool,
  erNyoppstartet: PropTypes.bool,
};

AksjonspunktHelpTextV2.defaultProps = {
  erVarigEndring: false,
  erNyArbLivet: false,
  erNyoppstartet: false,
};

export default injectIntl(AksjonspunktHelpTextV2);
