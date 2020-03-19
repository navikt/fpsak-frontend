type Rettigheter = Readonly<{
  writeAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
  kanOverstyreAccess: {
    isEnabled: boolean;
    employeeHasAccess: boolean;
  };
}>

export default Rettigheter;
