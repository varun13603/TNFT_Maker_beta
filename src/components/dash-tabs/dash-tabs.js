import React, { Fragment } from "react";
import {Box} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container, Row, Col } from "react-bootstrap";
import LayersIcon from '@mui/icons-material/Layers';
import { NFTCollections } from "../nft-collections/nft-collections";

export const DashboardTabs = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
   <Fragment>
     <Container>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
              >
                <Tab label={
                    <span>
                        <LayersIcon /> NFT Collections
                    </span>
                }  />
              </Tabs>
            </Box>
            
          </Box>
        </Col>
      </Row>
    </Container>
    <TabPanel value={value} index={0}>
    <NFTCollections />
  </TabPanel>
   </Fragment>
  );
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


