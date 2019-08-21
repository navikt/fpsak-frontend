import React from 'react';
import PropTypes from 'prop-types';
import { intlShape, FormattedMessage } from 'react-intl';
import { Row, Column } from 'nav-frontend-grid';
import { Undertekst, Normaltekst } from 'nav-frontend-typografi';

import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import { TextAreaField } from '@fpsak-frontend/form';
import {
  minLength, maxLength, requiredIfNotPristine, hasValidText, decodeHtmlEntity, getLanguageCodeFromSprakkode,
} from '@fpsak-frontend/utils';
import { injectKodeverk } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer, ElementWrapper } from '@fpsak-frontend/shared-components';

import { getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import { hasIkkeOppfyltSoknadsfristvilkar } from './VedtakHelper';

import styles from './vedtakAvslagPanel.less';

const maxLength1500 = maxLength(1500);
const minLength3 = minLength(3);

export const getAvslagArsak = (vilkar, aksjonspunkter, behandlingsresultat, getKodeverknavn) => {
  const avslatteVilkar = vilkar.filter(v => v.vilkarStatus.kode === vilkarUtfallType.IKKE_OPPFYLT);
  if (avslatteVilkar.length === 0) {
    return <FormattedMessage id="VedtakForm.UttaksperioderIkkeGyldig" />;
  }

  return `${getKodeverknavn(avslatteVilkar[0].vilkarType)}: ${getKodeverknavn(behandlingsresultat.avslagsarsak, avslatteVilkar[0].vilkarType.kode)}`;
};


export const VedtakAvslagArsakOgBegrunnelsePanel = ({
  intl,
  behandlingStatusKode,
  vilkar,
  aksjonspunkter,
  behandlingsresultat,
  sprakkode,
  readOnly,
  getKodeverknavn,
}) => (
  <ElementWrapper>
    { getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat, getKodeverknavn)
    && (
    <div>
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.ArsakTilAvslag' })}</Undertekst>
      <Normaltekst>
        {getAvslagArsak(vilkar, aksjonspunkter, behandlingsresultat, getKodeverknavn)}
      </Normaltekst>
      <VerticalSpacer sixteenPx />
    </div>
    )
    }
    {behandlingStatusKode === behandlingStatus.BEHANDLING_UTREDES && hasIkkeOppfyltSoknadsfristvilkar(vilkar)
      && (
      <Row>
        <VerticalSpacer sixteenPx />
        <Column xs="7">
          <TextAreaField
            name="begrunnelse"
            label={intl.formatMessage({ id: 'VedtakForm.Fritekst' })}
            validate={[requiredIfNotPristine, minLength3, maxLength1500, hasValidText]}
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
      <Undertekst>{intl.formatMessage({ id: 'VedtakForm.Fritekst' })}</Undertekst>
      <VerticalSpacer eightPx />
      <div className={styles.fritekstItem}>{decodeHtmlEntity(behandlingsresultat.avslagsarsakFritekst)}</div>
    </span>
    )
    }
  </ElementWrapper>
);

VedtakAvslagArsakOgBegrunnelsePanel.propTypes = {
  intl: intlShape.isRequired,
  behandlingStatusKode: PropTypes.string.isRequired,
  vilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlingsresultat: PropTypes.shape().isRequired,
  sprakkode: PropTypes.shape().isRequired,
  readOnly: PropTypes.bool.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(VedtakAvslagArsakOgBegrunnelsePanel);
