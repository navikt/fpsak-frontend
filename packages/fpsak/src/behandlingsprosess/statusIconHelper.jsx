import behandlingspunktCodes from 'behandlingsprosess/behandlingspunktCodes';
import beregningsgrunnlagImages from 'behandlingsprosess/statusIconsBeregningsgrunnlag';
import uttakImages from 'behandlingsprosess/statusIconsUttak';
import vedtakImages from 'behandlingsprosess/statusIconsVedtak';
import avregningImages from 'behandlingsprosess/statusIconsAvregning';

import innvilgetHoverIkonUrl from 'images/innvilget_hover.svg';
import avslattIkonUrl from 'images/avslaatt.svg';
import avslattValgtIkonUrl from 'images/avslaatt_valgt.svg';
import avslattHoverIkonUrl from 'images/avslaatt_hover.svg';
import behandleIkonUrl from 'images/behandle.svg';
import behandleValgtIkonUrl from 'images/behandle_valgt.svg';
import innvilgetIkonUrl from 'images/innvilget.svg';
import innvilgetValgtIkonUrl from 'images/innvilget_valgt.svg';
import ikkeVurdertIkonUrl from 'images/behandle_disable.svg';

import vilkarUtfallType from 'kodeverk/vilkarUtfallType';

const vilkarImages = {
  imageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleIkonUrl, false: innvilgetIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattIkonUrl,
  },
  selectImageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleValgtIkonUrl, false: innvilgetValgtIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattValgtIkonUrl,
  },
  hooverImageMap: {
    [vilkarUtfallType.OPPFYLT]: { true: behandleValgtIkonUrl, false: innvilgetHoverIkonUrl },
    [vilkarUtfallType.IKKE_VURDERT]: { true: behandleValgtIkonUrl, false: ikkeVurdertIkonUrl },
    [vilkarUtfallType.IKKE_OPPFYLT]: avslattHoverIkonUrl,
  },
};

const behandlingspunktImages = {
  [behandlingspunktCodes.VEDTAK]: vedtakImages,
  [behandlingspunktCodes.BEREGNINGSGRUNNLAG]: beregningsgrunnlagImages,
  [behandlingspunktCodes.UTTAK]: uttakImages,
  [behandlingspunktCodes.AVREGNING]: avregningImages,
};

const findStatusImageSrc = (isHovering, images, isSelected, isAksjonspunktOpen, status) => {
  const imageSrc = isSelected ? images.selectImageMap[status] : images.imageMap[status];
  const returnImage = isHovering && !isSelected ? images.hooverImageMap[status] : imageSrc;
  return returnImage[isAksjonspunktOpen] ? returnImage[isAksjonspunktOpen] : returnImage;
};

const findBehandlingsprosessIcon = (behandlingspunkt, status, isSelectedBehandlingspunkt, isSelectedBehandlingHenlagt, hasOpenAksjonspunkt) => (isHovering) => {
  const bpImages = behandlingspunktImages[behandlingspunkt];
  const newStatus = bpImages && isSelectedBehandlingHenlagt ? vilkarUtfallType.IKKE_VURDERT : status;
  const images = bpImages || vilkarImages;

  return findStatusImageSrc(isHovering, images, isSelectedBehandlingspunkt, hasOpenAksjonspunkt, newStatus);
};

export default findBehandlingsprosessIcon;
