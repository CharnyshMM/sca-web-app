import React, { useState, Fragment } from 'react';

import './Process.css'
import LinkLikeButton from '../../ReusableComponents/LinkLikeButton/LinkLikeButton';
import TextOnlyButton from '../../ReusableComponents/TextOnlyButton';
/*
  "processID": "30",
  "processName": "filter",
  "maxNumberOfThreads": "5",
  "currentNumberOfThreads": "1",
  "threads": [
    {
      "threadName": "30-filter-thread-8839",
      "threadState": "RUNNABLE"
    }
  ]
*/

const Process = ({processData, onAddProcessClick, onRemoveProcessClick}) => {
  const [threadsListIsVisible, setThreasListVisibility] = useState(false);
  const listButtonArrowClassName = threadsListIsVisible ? "oi oi-caret-top" : "oi oi-caret-bottom";

  return (
    <Fragment>
    <div className="process process_tablerow">
      <span>
        <b>{processData.processID}</b>
      </span>
      <span>
        {processData.processName}
      </span>
      <span>
        {processData.currentNumberOfThreads} (max {processData.maxNumberOfThreads})
        <LinkLikeButton onClick={() => setThreasListVisibility(!threadsListIsVisible)}>
          <span className={listButtonArrowClassName}> </span>
        </LinkLikeButton>
      </span>
      <div>
        <TextOnlyButton style={{marginRight: "2%"}} className="oi oi-plus" />
        
        <TextOnlyButton className="oi oi-media-stop" />
      </div>
    </div>
    {threadsListIsVisible && 
      <div className="threads_list">
        {processData.threads.map(t => 
          <div className="threads_list__item">
            <div>{t.threadName} - {t.threadState}</div>
            <TextOnlyButton className="oi oi-x" color="red" />
          </div>
        )}
      </div>
    }
    </Fragment>
  )
};

const ProcessTableHeader = () => (
  <div className="process process_tableheader">
      <span>
        PID
      </span>
      <span>
        Process Name
      </span>
      <span>
        Threads
      </span>
    </div>
)

export default Process;
export {
  ProcessTableHeader
};
