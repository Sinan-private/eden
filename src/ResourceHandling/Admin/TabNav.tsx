import React from 'react';
import {Box, Tab, Tabs} from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type TabNavProps = {
  label: string;
  Component: React.FC<any>
}

type Props = {
  tabs: TabNavProps[];
}

const TabNav: React.FC<Props> = ({tabs}) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <>
      <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {tabs.map(({label}) => (
            <Tab key={label} label={label} {...a11yProps(0)} />
          ))}
        </Tabs>
      </Box>
      {tabs.map(({label, Component}, i) => (
        <TabPanel key={label} value={value} index={i}>
          <Component/>
        </TabPanel>
      ))}
    </>

  );
}

export default TabNav;

function TabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{p: 3}}>
          <>{children}</>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
