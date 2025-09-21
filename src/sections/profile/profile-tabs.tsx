import { Box, Button } from '@mui/material';

type Tab = {
  value: string;
  label: string;
};

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
};

export function ProfileTabs({ activeTab, onTabChange, tabs }: Props) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? 'contained' : 'text'}
          onClick={() => onTabChange(tab.value)}
          sx={{ mr: 2, mb: -1 }}
        >
          {tab.label}
        </Button>
      ))}
    </Box>
  );
}