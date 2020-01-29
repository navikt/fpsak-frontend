import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import {
  FlexColumn, FlexContainer, FlexRow, VerticalSpacer,
} from '@fpsak-frontend/shared-components';

import { EtikettInfo } from 'nav-frontend-etiketter';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import styles from './fagsakProfile.less';

const hasLink = (link) => link && link.saksnr && link.saksnr.verdi && link.behandlingId;

const visSakDekningsgrad = (saksKode, dekningsgrad) => {
  const erForeldrepenger = saksKode === fagsakYtelseType.FORELDREPENGER;
  const gyldigDekningsGrad = dekningsgrad === 100 || dekningsgrad === 80;

  return erForeldrepenger && gyldigDekningsGrad;
};

/**
 * FagsakProfile
 *
 * Presentasjonskomponent. Viser fagsakinformasjon og knapper for å endre status eller lukke sak.
 */
export const FagsakProfile = ({
  saksnummer,
  sakstype,
  fagsakStatus,
  toggleShowAll,
  annenPartLink,
  alleKodeverk,
  createLink,
  renderBehandlingMeny,
  renderBehandlingVelger,
  dekningsgrad,
  intl,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  return (
    <>
      <FlexContainer>
        <FlexRow wrap spaceBetween alignItemsToBaseline>
          <FlexColumn>
            <Systemtittel>
              {getKodeverknavn(sakstype)}
            </Systemtittel>
          </FlexColumn>
          {visSakDekningsgrad(sakstype.kode, dekningsgrad) && (
            <FlexColumn>
              <EtikettInfo title={intl.formatMessage({ id: 'FagsakProfile.Dekningsgrad' }, { dekningsgrad })}>
                {`${dekningsgrad}%`}
              </EtikettInfo>
            </FlexColumn>
          )}
          <FlexColumn>
            {renderBehandlingMeny()}
          </FlexColumn>
        </FlexRow>
        <VerticalSpacer eightPx />
        <FlexRow>
          <FlexColumn>
            <Normaltekst>
              {`${saksnummer} - ${getKodeverknavn(fagsakStatus)}`}
            </Normaltekst>
          </FlexColumn>
          {hasLink(annenPartLink) && (
          <FlexColumn className={styles.pushRight}>
            <Element>
              <NavLink to={createLink(annenPartLink)} target="_blank" onClick={toggleShowAll}>
                <FormattedMessage id="FagsakProfile.AnnenPartSak" />
              </NavLink>
            </Element>
          </FlexColumn>
          )}
        </FlexRow>
      </FlexContainer>
      {renderBehandlingVelger()}
    </>
  );
};

FagsakProfile.propTypes = {
  saksnummer: PropTypes.number.isRequired,
  sakstype: PropTypes.shape().isRequired,
  fagsakStatus: PropTypes.shape().isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  annenPartLink: PropTypes.shape(),
  alleKodeverk: PropTypes.shape().isRequired,
  createLink: PropTypes.func.isRequired,
  renderBehandlingMeny: PropTypes.func.isRequired,
  renderBehandlingVelger: PropTypes.func.isRequired,
  dekningsgrad: PropTypes.number,
  intl: PropTypes.shape().isRequired,
};

FagsakProfile.defaultProps = {
  annenPartLink: undefined,
  dekningsgrad: undefined,
};

export default injectIntl(FagsakProfile);
