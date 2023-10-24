/* eslint-disable no-unused-vars */
import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Box, Tabs, Tab } from "@mui/material";
import { CollectionHeader } from "../../components/collection-header/collection-header";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import SettingsIcon from "@mui/icons-material/Settings";
import { CollectionOverview } from "../../components/collection-overview/collection-overview";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DeployContract } from "../../components/deploy-cotract/deploy-contract";
import { ManageCollection } from "../../components/manage-collection/manage-collection";
export const CollectionPage = () => {
  const [value, setValue] = React.useState(0);
  const { id } = useParams();
  const collection = useSelector(
    (state) => state.collection.selectedCollection
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Fragment>
      <CollectionHeader />
      <Container>
        <Row>
          <Col>
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                
                  {collection && collection.data.isDeployed && (
                    <Tabs value={value} onChange={handleChange}>
                      <Tab
                        label={
                          <span>
                            <LeaderboardIcon />
                            &nbsp;Collection Overview
                          </span>
                        }
                      />
                      <Tab
                        label={
                          <span>
                            <SettingsIcon />
                            &nbsp;Manage Collection
                          </span>
                        }
                      />
                    </Tabs>
                  )}

                  {collection && !collection.data.isDeployed && (
                    <Tabs value={value} onChange={handleChange}>
                    <Tab
                      label={
                        <span>
                          <SettingsIcon />
                          &nbsp;Deployment
                        </span>
                      }
                    />
                    </Tabs>
                  )}
              </Box>
            </Box>
          </Col>
        </Row>
      </Container>
      {collection && collection.data.isDeployed && (
        <Box>
        <TabPanel value={value} index={0}>
          <h1>
            <CollectionOverview />
          </h1>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ManageCollection />
        </TabPanel>
        </Box>
      )}
      {collection && !collection.data.isDeployed && (
        
        <TabPanel value={value} index={0}>
          <DeployContract />
        </TabPanel>
        
      )}
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
