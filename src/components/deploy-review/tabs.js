import React, { Fragment } from "react";
import { Box } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { Container, Row, Col } from "react-bootstrap";
import { BasicDetails } from "./basic-details";
import { MintingDetails } from "./minting-details";
import { OwnershipDetails } from "./owership";
import { RoyaltyDetails } from "./royalty-details";
import { AdditionalFeatureDetails } from "./additional";

export const DeployReviewTabs = () => {
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
                <Tabs value={value} onChange={handleChange}>
                  <Tab label={<span>Basic</span>} />
                  <Tab label={<span>Minting</span>} />
                  <Tab label={<span>Ownership</span>} />
                  <Tab label={<span>Royality</span>} />
                  <Tab label={<span>Additional Features</span>} />
                </Tabs>
              </Box>
            </Box>
          </Col>
        </Row>
      </Container>
      <TabPanel value={value} index={0}>
        <BasicDetails />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MintingDetails />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OwnershipDetails />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <RoyaltyDetails />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <AdditionalFeatureDetails />
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
