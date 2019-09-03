import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import vedtaksbrevAvsnittPropType from 'behandlingTilbakekreving/src/proptypes/vedtaksbrevAvsnittPropType';
import TilbakekrevingVedtakUtdypendeTekstPanel from './TilbakekrevingVedtakUtdypendeTekstPanel';

import styles from './tilbakekrevingEditerVedtaksbrevPanel.less';

const TilbakekrevingEditerVedtaksbrevPanel = ({
  vedtaksbrevAvsnitt,
  formName,
  readOnly,
}) => (
  <div className={styles.container}>
    <VerticalSpacer twentyPx />
    <Undertittel>
      <FormattedMessage id="TilbakekrevingVedtak.Vedtaksbrev" />
    </Undertittel>
    <VerticalSpacer eightPx />
    {vedtaksbrevAvsnitt.map((avsnitt) => {
      const underavsnitter = avsnitt.underavsnittsliste;
      return (
        <React.Fragment key={avsnitt.avsnittstype + avsnitt.fom}>
          <Ekspanderbartpanel
            className={styles.panel}
            tittel={avsnitt.overskrift}
            tag="h2"
            apen={false}
          >
            {underavsnitter.map((underavsnitt) => (
              <React.Fragment key={underavsnitt.underavsnittstype + avsnitt.fom}>
                {underavsnitt.overskrift && (
                  <Element>
                    {underavsnitt.overskrift}
                  </Element>
                )}
                {underavsnitt.brødtekst && (
                  <Normaltekst>
                    {underavsnitt.brødtekst}
                  </Normaltekst>
                )}
                {underavsnitt.fritekstTillatt && (
                  <>
                    <VerticalSpacer eightPx />
                    <TilbakekrevingVedtakUtdypendeTekstPanel
                      type={underavsnitt.underavsnittstype ? `${avsnitt.fom}_${avsnitt.tom}.${underavsnitt.underavsnittstype}` : avsnitt.avsnittstype}
                      formName={formName}
                      readOnly={readOnly}
                    />
                  </>
                )}
                <VerticalSpacer eightPx />
              </React.Fragment>
            ))}
          </Ekspanderbartpanel>
          <VerticalSpacer eightPx />
        </React.Fragment>
      );
    })}
  </div>
);

TilbakekrevingEditerVedtaksbrevPanel.propTypes = {
  vedtaksbrevAvsnitt: PropTypes.arrayOf(vedtaksbrevAvsnittPropType).isRequired,
  formName: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

TilbakekrevingEditerVedtaksbrevPanel.buildInitialValues = (vedtaksbrevAvsnitt) => vedtaksbrevAvsnitt
  .filter((avsnitt) => avsnitt.underavsnittsliste.some((underavsnitt) => underavsnitt.fritekst))
  .reduce((acc, avsnitt) => {
    const underavsnitter = avsnitt.underavsnittsliste;
    const friteksterForUnderavsnitt = underavsnitter
      .filter((underavsnitt) => underavsnitt.fritekst)
      .reduce((underAcc, underavsnitt) => ({
        ...underAcc,
        [underavsnitt.underavsnittstype ? underavsnitt.underavsnittstype : avsnitt.avsnittstype]: underavsnitt.fritekst,
      }), {});

    const nyeFritekster = avsnitt.fom
      ? { [`${avsnitt.fom}_${avsnitt.tom}`]: friteksterForUnderavsnitt }
      : friteksterForUnderavsnitt;

    return { ...acc, ...nyeFritekster };
  }, {});

export default TilbakekrevingEditerVedtaksbrevPanel;
