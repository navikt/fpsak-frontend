interface Label {
  id: string;
  args: object;
}

type LabelType = React.ReactNode | Label;

export default LabelType;
