import React from 'react';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { ToggleButtonGroupProps } from '@mui/material/ToggleButtonGroup';
import { AlertColor } from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

interface IYesNoProps extends ToggleButtonGroupProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label?: string;
  yesLabel?: string | React.ReactNode;
  noLabel?: string | React.ReactNode;
  yesColor?: AlertColor;
  noColor?: AlertColor;
}

const YesNoToggle = (props: IYesNoProps) => {
  const {
    value,
    onValueChange,
    label,
    yesLabel = 'Da',
    noLabel = 'Nu',
    yesColor = 'info',
    noColor = 'warning',
    ...rest
  } = props;

  const handleAlignment = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    onValueChange(newValue === 'yes');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {label && (
        <Typography variant="body2" sx={{ mr: 1, flexGrow: 1 }}>
          {label}
        </Typography>
      )}
      <ToggleButtonGroup
        value={value ? 'yes' : 'no'}
        color={value ? yesColor : noColor}
        exclusive
        onChange={handleAlignment}
        aria-label={label}
        {...rest}
      >
        <ToggleButton value="yes" aria-label="yes" sx={{ px: 1.5 }}>
          {yesLabel}
        </ToggleButton>
        <ToggleButton value="no" aria-label="no" sx={{ px: 1.5 }}>
          {noLabel}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default YesNoToggle;
