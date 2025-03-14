import React, { useState } from 'react';
import PageHeader from "@/components/General/PageHeader";
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Users from '@/components/Users/Users';
import Fulltable from '@/components/FullStatistics/Fulltable';
import LineGraph from '@/components/Statistics/LineGraph';

const Root = styled('div')(({ theme }) => ({
  padding: "20px",
}));

const TabsContainer = styled(Box)(({ theme }) => ({
  marginTop: "20px",
  display: 'flex',
  justifyContent: 'center',
}));

const TabButton = styled(Tab)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  margin: theme.spacing(1),
  minWidth: "120px",
  fontWeight: "bold",
  color: theme.palette.text.primary,
  textTransform: "none",
  transition: "all 0.3s",
  '&.Mui-selected': {
    backgroundColor: "#ECEBF9",
    borderTop: "2px solid #D1B0DB",
    borderLeft: "2px solid #D1B0DB",
    borderRight: "2px solid #D1B0DB",
    fontWeight: "bold",
  },
}));

const TabPanel = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  marginTop: theme.spacing(2),
}));

const tabContents = [
  { label: "Full Graph", content: <LineGraph /> },
  { label: "Full Table", content: <Fulltable /> },

];

const FullStats = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Root>
      <PageHeader />
      <TabsContainer>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="FullStats tabs"
          TabIndicatorProps={{ style: { display: 'none' } }}
        >
          {tabContents.map((tab, index) => (
            <TabButton
              key={index}
              label={tab.label}
            />
          ))}
        </Tabs>
      </TabsContainer>
      {tabContents.map((tab, index) => (
        <TabPanel key={index} hidden={value !== index}>
          {tab.content}
        </TabPanel>
      ))}
    </Root>
  );
};

export default FullStats;