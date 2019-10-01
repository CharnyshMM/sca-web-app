import React, {Component} from 'react';

import Process, {ProcessTableHeader} from './Process';

const data = {
  "processes": [
    {
      "processID": "30",
      "processName": "filter",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "2",
      "threads": [
        {
          "threadName": "30-filter-thread-8839",
          "threadState": "RUNNABLE"
        },
        {
          "threadName": "30-filter-thread-8938",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "10",
      "processName": "storage-response",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "10-storage-response-thread-0898",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "20",
      "processName": "parser",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "20-parser-thread-1909",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "21",
      "processName": "parser-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "41",
      "processName": "storage-publication-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "11",
      "processName": "storage-response-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "31",
      "processName": "filter-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "40",
      "processName": "storage-publication",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "40-storage-publication-thread-6713",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "50",
      "processName": "graph",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "50-graph-thread-7447",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
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
    },
    {
      "processID": "10",
      "processName": "storage-response",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "10-storage-response-thread-0898",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "20",
      "processName": "parser",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "20-parser-thread-1909",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "21",
      "processName": "parser-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "41",
      "processName": "storage-publication-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "11",
      "processName": "storage-response-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "31",
      "processName": "filter-error",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "0",
      "threads": []
    },
    {
      "processID": "40",
      "processName": "storage-publication",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "40-storage-publication-thread-6713",
          "threadState": "RUNNABLE"
        }
      ]
    },
    {
      "processID": "50",
      "processName": "graph",
      "maxNumberOfThreads": "5",
      "currentNumberOfThreads": "1",
      "threads": [
        {
          "threadName": "50-graph-thread-7447",
          "threadState": "RUNNABLE"
        }
      ]
    }
  ]
}

class Threads extends Component {
  state = {}

  render() {
    return (
      <section>
        <h2>Control Component Processes</h2>
        <ProcessTableHeader />
        <div style={{height: "75vh",overflowY: "auto"}}>
          {data.processes.map(p => <Process processData={p} />)}
        </div>
      </section>
    );
  }
};

export default Threads;