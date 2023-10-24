import React from "react";
import {  Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Button, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LayersIcon from '@mui/icons-material/Layers';
import { useNavigate } from "react-router-dom";
const Name = styled.span`
    font-size: 22px;
    font-weight: 700;
`
export const ProfileHeader = () => {
    const [anchorElCreate, setAnchorElCreate] = React.useState(null);
    const navigate = useNavigate();
  const openCreate = Boolean(anchorElCreate);

  const handleClickCreate = (event) => {
    setAnchorElCreate(event.currentTarget);
  };
  const handleCloseCreate = () => {
    setAnchorElCreate(null);
    navigate("/new-collection")
  };


  const { address} = useSelector((state) => state.account);
  return (
    <Container className="profile-header">
      <Row>
        <Col>
          <div className="prof-avatar"
            dangerouslySetInnerHTML={{
              __html: nodeToString(
                Jazzicon(180, parseInt(address.slice(2, 10), 180))
              ),
            }}
          ></div>
        </Col>
      </Row>
      <Row>
        <Col lg={6} md={12} sm={12}>
            <Name>{address}</Name><IconButton><ContentCopyIcon/></IconButton>
        </Col>
        <Col lg={6} md={12} sm={12}>
            <div className="menu-container">
                <Button onClick={handleClickCreate} className="prof-head-btn" variant="contained" endIcon={<KeyboardArrowDownIcon />}> Create</Button>
                <Button className="prof-head-btn" variant="contained" endIcon={<MoreHorizIcon />}> More</Button>
            </div>
        </Col>
      </Row>
      <Menu
        id="basic-menu"
        anchorEl={anchorElCreate}
        open={openCreate}
        onClose={() => setAnchorElCreate(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem  onClick={handleCloseCreate}><LayersIcon />&nbsp; NFT Collection</MenuItem>
      </Menu>
    </Container>
  );
};

function nodeToString(node) {
  var tmpNode = document.createElement("div");
  tmpNode.appendChild(node.cloneNode(true));
  var str = tmpNode.innerHTML;
  tmpNode = node = null; // prevent memory leaks in IE
  return str;
}
