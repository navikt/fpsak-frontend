import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import { Column, Row } from 'nav-frontend-grid';
import { connect } from 'react-redux';
import {
  getBehandlingKlageFormkravResultatKA,
  getBehandlingKlageFormkravResultatNFP,
  getBehandlingKlageVurderingResultatNFP,
  getBehandlingKlageVurderingResultatNK,
  getBehandlingSprak,
  getBehandlingVilkar,
} from 'behandling/behandlingSelectors';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import { getLanguageCodeFromSprakkode } from 'utils/languageUtils';
import { hasValidText, required } from 'utils/validation/validators';
import { TextAreaField } from 'form/Fields';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import klageVurdering from 'kodeverk/klageVurdering';
import decodeHtmlEntity from 'utils/decodeHtmlEntityUtils';
import {
  findAvslagResultatText, maxLength1500, minLength3, shouldGiveBegrunnelse,
} from '../VedtakHelper';


import styles from '../vedtakAvslagPanel.less';

const klageVurderingErAvvist = klageVurderingResultat => (klageVurderingResultat && klageVurderingResultat.klageVurdering === klageVurdering.AVVIS_KLAGE);

export const getAvslagArsak = (klageVurderingResultatNK, klageVurderingResultatNFP) => {
  if (klageVurderingErAvvist(klageVurderingResultatNK)) {
    return klageVurderingResultatNK.klageAvvistArsakNavn;
  } if (klageVurderingErAvvist(klageVurderingResultatNFP)) {
    return klageVurderingResultatNFP.klageAvvistArsakNavn;
  }
  return null;
};

const getBegrunnelsesTekst = (klageVurderingResultatNK, klageVurderingResultatNFP, klageFormkavResultatNFP, klageFormkavResultatKA) => {
  if (klageVurderingResultatNK) {
    return klageVurderingResultatNK.begrunnelse ? klageVurderingResultatNK.begrunnelse : klageFormkavResultatKA.begrunnelse;
  }
  return klageVurderingResultatNFP.begrunnelse ? klageVurderingResultatNFP.begrunnelse : klageFormkavResultatNFP.begrunnelse;
};

export const VedtakAvslagKlagePanelImpl = ({
  intl,
  readOnly,
  behandlingStatus,
  behandlingsresultatTypeKode,
  klageVurderingResultatNK,
  klageVurderingResultatNFP,
  klageFormkavResultatNFP,
  klageFormkavResultatKA,
  behandlingsresultat,
  sprakkode,
  vilkar,
  ytelseType,
}) => (
  <div>
    <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.Resultat' })}</Undertekst>
    <Normaltekst>
      {intl.formatMessage({ id: findAvslagResultatText(behandlingsresultatTypeKode, ytelseType) })}
    </Normaltekst>
    <VerticalSpacer sixteenPx />
    { getAvslagArsak(klageVurderingResultatNK, klageVurderingResultatNFP)
    && (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.ArsakTilAvslag' })}</Undertekst>
      <Normaltekst>
        {getAvslagArsak(klageVurderingResultatNK, klageVurderingResultatNFP)}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
    </div>
    )
  }
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.BegrunnelseForKlage' })}</Undertekst>
      <Normaltekst>
        {getBegrunnelsesTekst(klageVurderingResultatNK, klageVurderingResultatNFP, klageFormkavResultatNFP, klageFormkavResultatKA)}
      </Normaltekst>
    </div>
    {shouldGiveBegrunnelse(klageVurderingResultatNK, klageVurderingResultatNFP, vilkar, behandlingStatus)
    && (
    <Row>
      <VerticalSpacer sixteenPx />
      <Column xs="7">
        <TextAreaField
          name="begrunnelse"
          label={intl.formatMessage({ id: 'VedtakKlageForm.Fritekst' })}
          validate={[required, minLength3, maxLength1500, hasValidText]}
          maxLength={1500}
          readOnly={readOnly}
          badges={[{
            type: 'fokus',
            textId: getLanguageCodeFromSprakkode(sprakkode),
            title: 'Malform.Beskrivelse',
          }]}
        />
      </Column>
    </Row>
    )
    }
    {readOnly && behandlingsresultat.avslagsarsakFritekst !== null
    && (
    <span>
      <VerticalSpacer twentyPx />
      <Undertekst>{intl.formatMessage({ id: 'VedtakKlageForm.Fritekst' })}</Undertekst>
      <VerticalSpacer eightPx />
      <div className={styles.fritekstItem}>{decodeHtmlEntity(behandlingsresultat.avslagsarsakFritekst)}</div>
    </span>
    )
    }
  </div>
);

VedtakAvslagKlagePanelImpl.propTypes = {
  intl: intlShape.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingStatus: PropTypes.string.isRequired,
  sprakkode: PropTypes.shape().isRequired,
  behandlingsresultat: PropTypes.shape(),
  klageVurderingResultatNFP: PropTypes.shape(),
  klageVurderingResultatNK: PropTypes.shape(),
  klageFormkavResultatNFP: PropTypes.shape(),
  klageFormkavResultatKA: PropTypes.shape(),
  behandlingsresultatTypeKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  ytelseType: PropTypes.string.isRequired,
};

VedtakAvslagKlagePanelImpl.defaultProps = {
  klageVurderingResultatNFP: undefined,
  klageVurderingResultatNK: undefined,
  klageFormkavResultatNFP: undefined,
  klageFormkavResultatKA: undefined,
  behandlingsresultat: null,
};


const mapStateToProps = state => ({
  vilkar: getBehandlingVilkar(state),
  klageVurderingResultatNFP: getBehandlingKlageVurderingResultatNFP(state),
  klageVurderingResultatNK: getBehandlingKlageVurderingResultatNK(state),
  klageFormkavResultatNFP: getBehandlingKlageFormkravResultatNFP(state),
  klageFormkavResultatKA: getBehandlingKlageFormkravResultatKA(state),
  ytelseType: getFagsakYtelseType(state).kode,
  sprakkode: getBehandlingSprak(state),
});

export default connect(mapStateToProps)(injectIntl(VedtakAvslagKlagePanelImpl));
