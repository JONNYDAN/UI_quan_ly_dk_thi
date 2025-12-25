import React from 'react';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const SelectField: React.FC<{ label:string; value:string; onChange:(v:string)=>void; options:{value:string;label:string}[]; placeholder?:string }> = ({ label, value, onChange, options, placeholder='-- Chọn --' }) => {
  const labelId = `${label.replace(/\s+/g, '_')}-label`;
  return (
    <FormControl fullWidth variant="outlined" size="small">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={(e) => onChange(e.target.value as string)}
      >
        <MenuItem value="">{placeholder}</MenuItem>
        {options.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
      </Select>
    </FormControl>
  );
};

export default SelectField;
