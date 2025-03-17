import TextWrapper from '@components/text/TextWrapper';
import {ITabItem} from '@core/interfaces/tabs.interface';
import cn from '@core/utils/cn';
import {Box, styled, Tab, Tabs} from '@mui/material';
import React, {useState} from 'react';

interface ICustomTabsProps {
  tabs: ITabItem[];
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  onChange?: (value: string) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  className?: string;
}

interface ITabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  className?: string;
}

// Custom styled TabPanel
const TabPanel = styled(
  ({children, value, index, className, ...other}: ITabPanelProps) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      className={className}
      {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  ),
)(({theme}) => ({
  padding: theme.spacing(3),
}));

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  'aria-controls': `tabpanel-${index}`,
});

export default function CustomTabs({
  tabs,
  defaultValue = tabs[0]?.id,
  orientation = 'horizontal',
  onChange,
  variant = 'standard',
  className = '',
}: Readonly<ICustomTabsProps>) {
  const [value, setValue] = useState(
    tabs.findIndex(tab => tab.id === defaultValue),
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onChange) {
      onChange(tabs[newValue].id);
    }
  };
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Tabs
        value={value}
        onChange={handleChange}
        orientation={orientation}
        variant={variant}
        aria-label="custom tabs"
        sx={{
          display: 'inline-flex',
          alignSelf: 'flex-start',
          '& .MuiTab-root': {
            minWidth: 'auto',
            color: 'rgba(0, 0, 0, 0.6)',
            '&.Mui-selected': {
              fontSize: 12,
              color: '#212B36',
              fontWeight: 'bold',
            },
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#333333', // Active tab indicator color
          },
        }}>
        {tabs.map((tab, index) => (
          <Tab
            disableRipple
            disableTouchRipple
            disableFocusRipple
            key={tab.id}
            label={
              <div className="flex w-full items-center gap-[10px] text-base">
                {tab.icon}
                <TextWrapper
                  content={tab.label as string}
                  className="text-xs font-[590] whitespace-nowrap"
                />
              </div>
            }
            disabled={tab.disabled}
            className={cn('flex max-h-[18px] items-center')}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {tabs.map((tab, index) => (
        <TabPanel key={tab.id} value={value} index={index}>
          {tab.content}
        </TabPanel>
      ))}
    </div>
  );
}
