import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Undertittel, Element } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import TilbakekrevingVedtakUtdypendeTekstPanel, { feltnavn } from './TilbakekrevingVedtakUtdypendeTekstPanel';

import styles from './tilbakekrevingEditerVedtaksbrevPanel.less';

const TilbakekrevingEditerVedtaksbrevPanel = ({
  vedtaksbrevData,
  formName,
  readOnly,
}) => {
  const {
    oppsummering, perioder, ekstraInformasjon,
  } = vedtaksbrevData;
  return (
    <div className={styles.container}>
      <VerticalSpacer twentyPx />
      <Undertittel>
        <FormattedMessage id="TilbakekrevingVedtak.Vedtaksbrev" />
      </Undertittel>
      <VerticalSpacer eightPx />
      <Ekspanderbartpanel
        className={styles.panel}
        tittel={oppsummering.overskrift}
        tag="h2"
        apen={false}
      >
        <Normaltekst>
          {oppsummering.brodtekst}
        </Normaltekst>
        <TilbakekrevingVedtakUtdypendeTekstPanel type={feltnavn.OPPSUMMERING} formName={formName} readOnly={readOnly} />
      </Ekspanderbartpanel>
      <VerticalSpacer eightPx />
      {perioder.map(periode => (
        <React.Fragment key={periode.overskrift}>
          <Ekspanderbartpanel
            className={styles.panel}
            tittel={periode.overskrift}
            tag="h2"
            apen={false}
          >
            <Normaltekst>
              {periode.brodtekst1}
            </Normaltekst>
            <VerticalSpacer eightPx />
            <TilbakekrevingVedtakUtdypendeTekstPanel type={`${periode.fom}.${feltnavn.BRODTEKST1}`} formName={formName} readOnly={readOnly} />
            <VerticalSpacer eightPx />
            <Element>
              {periode.underoverskrift}
            </Element>
            <Normaltekst>
              {periode.brodtekst2}
            </Normaltekst>
            <VerticalSpacer eightPx />
            <TilbakekrevingVedtakUtdypendeTekstPanel type={`${periode.fom}.${feltnavn.BRODTEKST2}`} formName={formName} readOnly={readOnly} />
            <VerticalSpacer eightPx />
            <Normaltekst>
              {periode.brodtekst3}
            </Normaltekst>
            <VerticalSpacer eightPx />
            <TilbakekrevingVedtakUtdypendeTekstPanel type={`${periode.fom}.${feltnavn.BRODTEKST3}`} formName={formName} readOnly={readOnly} />
          </Ekspanderbartpanel>
          <VerticalSpacer eightPx />
        </React.Fragment>
      ))}
      <Ekspanderbartpanel
        className={styles.panel}
        tittel={ekstraInformasjon.overskrift}
        tag="h2"
        apen={false}
      >
        <Normaltekst>
          {ekstraInformasjon.brodtekst}
        </Normaltekst>
        <VerticalSpacer eightPx />
        <Element>
          {ekstraInformasjon.skattOverskrift}
        </Element>
        <VerticalSpacer eightPx />
        <Element>
          {ekstraInformasjon.klageOverskrift}
        </Element>
        <Normaltekst>
          {ekstraInformasjon.klageBrodtekst1}
        </Normaltekst>
        <VerticalSpacer fourPx />
        <Normaltekst>
          {ekstraInformasjon.klageBrodtekst2}
        </Normaltekst>
        <VerticalSpacer eightPx />
        <Element>
          {ekstraInformasjon.innsynOverskrift}
        </Element>
        <Normaltekst>
          {ekstraInformasjon.innsynBrodtekst}
        </Normaltekst>
        <VerticalSpacer eightPx />
        <Element>
          {ekstraInformasjon.sporsmalOverskrift}
        </Element>
        <Normaltekst>
          {ekstraInformasjon.sporsmalBrodtekst}
        </Normaltekst>
        <VerticalSpacer eightPx />
        <Element>
          {ekstraInformasjon.hilsenBrodtekst}
        </Element>
        <Normaltekst>
          {ekstraInformasjon.hilsenNavn}
        </Normaltekst>
      </Ekspanderbartpanel>
    </div>
  );
};

TilbakekrevingEditerVedtaksbrevPanel.propTypes = {
  vedtaksbrevData: PropTypes.shape({}).isRequired,
  formName: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues = () => ({
  oppsummering: 'Dette er en utdypende tekst for Du må betale tilbake foreldrepenger',
  '10-04-2019': {
    brodtekst1: 'Dette er en utdypende tekst for periode med start 10 april',
  },
});

export default TilbakekrevingEditerVedtaksbrevPanel;
