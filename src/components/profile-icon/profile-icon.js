import React, { Fragment } from "react";
import Jazzicon from "@metamask/jazzicon";
import { IconButton, Menu, MenuItem } from "@mui/material";
import styled from "@emotion/styled";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
export const ProfileIcon = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { account, size } = props;
  const AccountIcon = styled.div`
    cursor: pointer;
    width: ${size}px !important;
    height: ${size}px !important;
  `;

  return (
    <Fragment>
      <IconButton sx={{ marginRight: `10px` }} onClick={handleClick}>
        <AccountIcon
          dangerouslySetInnerHTML={{
            __html: nodeToString(
              Jazzicon(size, parseInt(account.slice(2, 10), size))
            ),
          }}
        ></AccountIcon>
      </IconButton>
      ;
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem  onClick={handleClose}><PersonOutlineIcon />&nbsp; My Dashboard</MenuItem>
        <MenuItem onClick={handleClose}><SettingsOutlinedIcon />&nbsp; Account Settings</MenuItem>
        <MenuItem onClick={handleClose}><DescriptionOutlinedIcon />&nbsp; Docs</MenuItem>
        <MenuItem onClick={handleClose}><LogoutOutlinedIcon />&nbsp; Logout</MenuItem>
      </Menu>
    </Fragment>
  );
};

function nodeToString(node) {
  var tmpNode = document.createElement("div");
  tmpNode.appendChild(node.cloneNode(true));
  var str = tmpNode.innerHTML;
  tmpNode = node = null; // prevent memory leaks in IE
  return str;
}
