import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';

import TilbakekrevingVedtakUtdypendeTekstPanel from './TilbakekrevingVedtakUtdypendeTekstPanel';
import vedtaksbrevAvsnittPropType from '../../propTypes/vedtaksbrevAvsnittPropType';
import underavsnittType from '../../kodeverk/avsnittType';

import styles from './tilbakekrevingEditerVedtaksbrevPanel.less';

const TilbakekrevingEditerVedtaksbrevPanel = ({
  vedtaksbrevAvsnitt,
  formName,
  readOnly,
  behandlingId,
  behandlingVersjon,
  perioderSomIkkeHarUtfyltObligatoriskVerdi,
  fritekstOppsummeringPakrevdMenIkkeUtfylt,
}) => (
  <div className={styles.container}>
    <VerticalSpacer twentyPx />
    <Undertittel>
      <FormattedMessage id="TilbakekrevingVedtak.Vedtaksbrev" />
    </Undertittel>
    <VerticalSpacer eightPx />
    {vedtaksbrevAvsnitt.map((avsnitt) => {
      const underavsnitter = avsnitt.underavsnittsliste;
      const periode = `${avsnitt.fom}_${avsnitt.tom}`;
      const harPeriodeSomManglerObligatoriskVerdi = perioderSomIkkeHarUtfyltObligatoriskVerdi.some((p) => p === periode);
      const visApen = avsnitt.avsnittstype === underavsnittType.OPPSUMMERING && fritekstOppsummeringPakrevdMenIkkeUtfylt;
      return (
        <React.Fragment key={avsnitt.avsnittstype + avsnitt.fom}>
          <Ekspanderbartpanel
            className={harPeriodeSomManglerObligatoriskVerdi ? styles.panelMedGulmarkering : styles.panel}
            tittel={avsnitt.overskrift ? avsnitt.overskrift : ''}
            tag="h2"
            apen={harPeriodeSomManglerObligatoriskVerdi || visApen}
          >
            {underavsnitter.map((underavsnitt) => (
              <React.Fragment key={underavsnitt.underavsnittstype + underavsnitt.overskrift + underavsnitt.brødtekst}>
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
                      type={underavsnitt.underavsnittstype ? `${periode}.${underavsnitt.underavsnittstype}` : avsnitt.avsnittstype}
                      formName={formName}
                      readOnly={readOnly}
                      behandlingId={behandlingId}
                      behandlingVersjon={behandlingVersjon}
                      fritekstPakrevet={underavsnitt.fritekstPåkrevet}
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
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  perioderSomIkkeHarUtfyltObligatoriskVerdi: PropTypes.arrayOf(PropTypes.string).isRequired,
  fritekstOppsummeringPakrevdMenIkkeUtfylt: PropTypes.bool,
};

TilbakekrevingEditerVedtaksbrevPanel.defaultProps = {
  fritekstOppsummeringPakrevdMenIkkeUtfylt: false,
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
