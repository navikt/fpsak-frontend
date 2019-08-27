const aksjonspunktStatus = {
  OPPRETTET: 'OPPR',
  UTFORT: 'UTFO',
  AVBRUTT: 'AVBR',
};

export default aksjonspunktStatus;

export const isAksjonspunktOpen = (statusKode) => statusKode === aksjonspunktStatus.OPPRETTET;
