type Rettigheter = Readonly<{
  settBehandlingPaVentAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  henleggBehandlingAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  byttBehandlendeEnhetAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  opprettRevurderingAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  opprettNyForstegangsBehandlingAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  gjenopptaBehandlingAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  opneBehandlingForEndringerAccess: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  ikkeVisOpprettNyBehandling: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
}>

export default Rettigheter;
