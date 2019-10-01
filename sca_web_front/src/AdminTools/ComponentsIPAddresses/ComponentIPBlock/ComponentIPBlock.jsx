import React, { useState, Fragment } from 'react';

import './ComponentIPBlock.css';

import PingBlock, {PING_STATUS_PINGING, PING_STATUS_OK} from '../PingBlock';
import LinkLikeButton from '../../../ReusableComponents/LinkLikeButton/LinkLikeButton';
import { COMPONENT_NAMES } from '../component_ids';

const ComponentIPTableRow = ({ component, onAddressChanged }) => {
  const key = Object.keys(component)[0]; // maybe buggy
  const address = component[key];
  const name = COMPONENT_NAMES[key];

  const [ipInputIsReadOnly, setIpInputReadOnlyStatus] = useState(true);
  const [ipInputValue, setIpInputValue] = useState(address);

  const onSetAddressClick = () => {
    setIpInputReadOnlyStatus(true);
    onAddressChanged(ipInputValue);
  }

  const onUndoClick = () => {
    setIpInputReadOnlyStatus(true);
    setIpInputValue(address);
  }

  let controls = null;
  if (ipInputIsReadOnly) {
    controls = (
      <LinkLikeButton onClick={() => setIpInputReadOnlyStatus(!ipInputIsReadOnly)}>Edit</LinkLikeButton>
    );
  } else {
    controls = (
    <Fragment>
      <LinkLikeButton onClick={onSetAddressClick}>Save</LinkLikeButton>
      |
      <LinkLikeButton onClick={onUndoClick}>Undo</LinkLikeButton>
    </Fragment>
    );
  }

  return (
    <div className="component_ip_table component_ip_table_row">
      <span><b>{name}</b></span>
      <div>
        <input
          value={ipInputValue}
          readOnly={ipInputIsReadOnly}
          onChange={e => setIpInputValue(e.target.value)}
          placeholder={address} />
        {controls}
      </div>
      <PingBlock status={PING_STATUS_OK} />
    </div>
  );
};


const ComponentsIpsTableHeader = () => (
  <div className="component_ip_table component_ip_table_header">
      <span>Component</span>
      <span>Address</span>
      <span>Ping</span>
    </div>
)

export default ComponentIPTableRow;
export {
  ComponentsIpsTableHeader
};