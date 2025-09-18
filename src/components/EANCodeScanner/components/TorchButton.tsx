import Button from '../../Button/Button';

type TorchButtonProps = {
  torchOn: boolean;
  onToggle: () => void;
  className?: string;
};

const TorchButton = ({ torchOn, onToggle, className }: TorchButtonProps) => {
  return (
    <Button 
      className={className}
      onClick={onToggle}
      label={torchOn ? 'Torch: ON' : 'Torch: OFF'}
    />
  );
};

export default TorchButton;
