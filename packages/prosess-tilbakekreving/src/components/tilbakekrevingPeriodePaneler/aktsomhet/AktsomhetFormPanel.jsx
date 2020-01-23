import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { FormSection } from 'redux-form';
import { Undertekst } from 'nav-frontend-typografi';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { removeSpacesFromNumber, required } from '@fpsak-frontend/utils';
import { RadioGroupField, RadioOption } from '@fpsak-frontend/form';

import Aktsomhet from '../../../kodeverk/aktsomhet';
import AktsomhetGradFormPanel from './AktsomhetGradFormPanel';
import { ANDELER, EGENDEFINERT } from './AktsomhetReduksjonAvBelopFormPanel';

const uaktsomhetCodes = [
  Aktsomhet.GROVT_UAKTSOM,
  Aktsomhet.SIMPEL_UAKTSOM,
  Aktsomhet.FORSETT,
];

const forstoBurdeForstattTekster = {
  [Aktsomhet.FORSETT]: 'AktsomhetFormPanel.AktsomhetTyperLabel.Forsett',
  [Aktsomhet.GROVT_UAKTSOM]: 'AktsomhetFormPanel.AktsomhetTyperLabel.GrovtUaktsomt',
  [Aktsomhet.SIMPEL_UAKTSOM]: 'AktsomhetFormPanel.AktsomhetTyperLabel.SimpelUaktsom',
};

const AktsomhetFormPanel = ({
  readOnly,
  resetFields,
  resetAnnetTextField,
  handletUaktsomhetGrad,
  harGrunnerTilReduksjon,
  erSerligGrunnAnnetValgt,
  erValgtResultatTypeForstoBurdeForstaatt,
  aktsomhetTyper,
  sarligGrunnTyper,
  antallYtelser,
  feilutbetalingBelop,
  erTotalBelopUnder4Rettsgebyr,
  andelSomTilbakekreves,
}) => (
  <>
    <Undertekst>
      <FormattedMessage id="AktsomhetFormPanel.HandletUaktsomhetGrad" />
    </Undertekst>
    <VerticalSpacer eightPx />
    <RadioGroupField
      validate={[required]}
      name="handletUaktsomhetGrad"
      readOnly={readOnly}
      onChange={resetFields}
    >
      {aktsomhetTyper.map((vrt) => (
        <RadioOption
          key={vrt.kode}
          label={erValgtResultatTypeForstoBurdeForstaatt ? <FormattedMessage id={forstoBurdeForstattTekster[vrt.kode]} /> : vrt.navn}
          value={vrt.kode}
        />
      ))}
    </RadioGroupField>
    { uaktsomhetCodes.includes(handletUaktsomhetGrad) && (
      <FormSection name={handletUaktsomhetGrad} key={handletUaktsomhetGrad}>
        <AktsomhetGradFormPanel
          harGrunnerTilReduksjon={harGrunnerTilReduksjon}
          readOnly={readOnly}
          handletUaktsomhetGrad={handletUaktsomhetGrad}
          erSerligGrunnAnnetValgt={erSerligGrunnAnnetValgt}
          erValgtResultatTypeForstoBurdeForstaatt={erValgtResultatTypeForstoBurdeForstaatt}
          resetAnnetTextField={resetAnnetTextField}
          sarligGrunnTyper={sarligGrunnTyper}
          harMerEnnEnYtelse={antallYtelser > 1}
          feilutbetalingBelop={feilutbetalingBelop}
          erTotalBelopUnder4Rettsgebyr={erTotalBelopUnder4Rettsgebyr}
          andelSomTilbakekreves={andelSomTilbakekreves}
        />
      </FormSection>
    )}
  </>
);

AktsomhetFormPanel.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  resetFields: PropTypes.func.isRequired,
  resetAnnetTextField: PropTypes.func.isRequired,
  harGrunnerTilReduksjon: PropTypes.bool,
  erSerligGrunnAnnetValgt: PropTypes.bool,
  erValgtResultatTypeForstoBurdeForstaatt: PropTypes.bool,
  handletUaktsomhetGrad: PropTypes.string,
  antallYtelser: PropTypes.number.isRequired,
  feilutbetalingBelop: PropTypes.number.isRequired,
  erTotalBelopUnder4Rettsgebyr: PropTypes.bool.isRequired,
  aktsomhetTyper: PropTypes.arrayOf(PropTypes.shape()),
  sarligGrunnTyper: PropTypes.arrayOf(PropTypes.shape()),
  andelSomTilbakekreves: PropTypes.string,
};

AktsomhetFormPanel.defaultProps = {
  erSerligGrunnAnnetValgt: false,
  erValgtResultatTypeForstoBurdeForstaatt: false,
  harGrunnerTilReduksjon: undefined,
  handletUaktsomhetGrad: undefined,
  andelSomTilbakekreves: undefined,
};

const parseIntAndelSomTilbakekreves = (andelSomTilbakekreves, harGrunnerTilReduksjon) => {
  const parsedValue = parseInt(andelSomTilbakekreves, 10);
  return !harGrunnerTilReduksjon || Number.isNaN(parsedValue) ? {} : { andelTilbakekreves: parsedValue };
};

const parseFloatAndelSomTilbakekreves = (andelSomTilbakekreves, harGrunnerTilReduksjon) => {
  const parsedValue = parseFloat(andelSomTilbakekreves);
  return !harGrunnerTilReduksjon || Number.isNaN(parsedValue) ? {} : { andelTilbakekreves: parsedValue };
};

const formatAktsomhetData = (aktsomhet, sarligGrunnTyper) => {
  const sarligeGrunner = sarligGrunnTyper.reduce((acc, type) => (aktsomhet[type.kode] ? acc.concat(type.kode) : acc), []);

  const { harGrunnerTilReduksjon } = aktsomhet;
  const andelSomTilbakekreves = aktsomhet.andelSomTilbakekreves === EGENDEFINERT
    ? parseFloatAndelSomTilbakekreves(aktsomhet.andelSomTilbakekrevesManuell, harGrunnerTilReduksjon)
    : parseIntAndelSomTilbakekreves(aktsomhet.andelSomTilbakekreves, harGrunnerTilReduksjon);

  return {
    harGrunnerTilReduksjon,
    ileggRenter: harGrunnerTilReduksjon ? undefined : aktsomhet.skalDetTilleggesRenter,
    sarligGrunner: sarligeGrunner.length > 0 ? sarligeGrunner : undefined,
    tilbakekrevesBelop: aktsomhet.harGrunnerTilReduksjon ? removeSpacesFromNumber(aktsomhet.belopSomSkalTilbakekreves) : undefined,
    annetBegrunnelse: aktsomhet.annetBegrunnelse,
    sarligGrunnerBegrunnelse: aktsomhet.sarligGrunnerBegrunnelse,
    tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhet.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
    ...andelSomTilbakekreves,
  };
};

AktsomhetFormPanel.transformValues = (info, sarligGrunnTyper, vurderingBegrunnelse) => {
  const aktsomhet = info[info.handletUaktsomhetGrad];
  return {
    '@type': 'annet',
    aktsomhet: info.handletUaktsomhetGrad,
    begrunnelse: vurderingBegrunnelse,
    aktsomhetInfo: aktsomhet ? formatAktsomhetData(aktsomhet, sarligGrunnTyper) : null,
  };
};


AktsomhetFormPanel.buildInitalValues = (vilkarResultatInfo) => {
  const { aktsomhet, aktsomhetInfo } = vilkarResultatInfo;
  const andelSomTilbakekreves = aktsomhetInfo && aktsomhetInfo.andelTilbakekreves ? `${aktsomhetInfo.andelTilbakekreves}` : undefined;
  const aktsomhetData = aktsomhetInfo ? {
    [aktsomhet.kode ? aktsomhet.kode : aktsomhet]: {
      andelSomTilbakekreves: andelSomTilbakekreves === undefined || ANDELER.includes(andelSomTilbakekreves) ? andelSomTilbakekreves : EGENDEFINERT,
      andelSomTilbakekrevesManuell: !ANDELER.includes(andelSomTilbakekreves) ? aktsomhetInfo.andelTilbakekreves : undefined,
      harGrunnerTilReduksjon: aktsomhetInfo.harGrunnerTilReduksjon,
      skalDetTilleggesRenter: aktsomhetInfo.ileggRenter,
      belopSomSkalTilbakekreves: aktsomhetInfo.tilbakekrevesBelop,
      annetBegrunnelse: aktsomhetInfo.annetBegrunnelse,
      sarligGrunnerBegrunnelse: aktsomhetInfo.sarligGrunnerBegrunnelse,
      tilbakekrevSelvOmBeloepErUnder4Rettsgebyr: aktsomhetInfo.tilbakekrevSelvOmBeloepErUnder4Rettsgebyr,
      ...(aktsomhetInfo.sarligGrunner ? aktsomhetInfo.sarligGrunner.reduce((acc, sg) => ({ ...acc, [(sg.kode ? sg.kode : sg)]: true }), {}) : {}),
    },
  } : {};

  return {
    handletUaktsomhetGrad: aktsomhet && aktsomhet.kode ? aktsomhet.kode : aktsomhet,
    ...aktsomhetData,
  };
};

export default AktsomhetFormPanel;
