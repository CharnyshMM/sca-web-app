import React from 'react';
import LED from '../../ReusableComponents/LED';
import LinkLikeButton from '../../ReusableComponents/LinkLikeButton/LinkLikeButton';

const PING_STATUS_OBSOLETE = "gray";
const PING_STATUS_PINGING = "yellow";
const PING_STATUS_OK = "green";
const PING_STATUS_NO_SIGNAL = "red";

const PingBlock = ({status, onPingClick}) => {
  const pinging = (status == PING_STATUS_PINGING);
  let control = <LinkLikeButton onClick={onPingClick}>Ping</LinkLikeButton>;
  if (pinging) {
    control = " Pinging...";
  }
  return (
  <div>
    <LED color={status} blinking={pinging} />
    {control}
  </div>
  );
};

export default PingBlock;
export {
  PING_STATUS_OBSOLETE,
  PING_STATUS_PINGING,
  PING_STATUS_OK,
  PING_STATUS_NO_SIGNAL
};