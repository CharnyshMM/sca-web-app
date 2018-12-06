import React from 'react';

const Docs = () => {

    let rows = [];
    let i = 0;
    console.log(DOCS_URLS_DICT);
    for(var item in DOCS_URLS_DICT) {
        console.log(item);
        rows.push(<tr key={i++}>
                    <td>
                        <a href={DOCS_URLS_DICT[item].url} target="_blank">{DOCS_URLS_DICT[item].name}</a>
                    </td>
                </tr>
        );
    }
    return (
        <div className='container'>
            <h1>Documentation pages</h1>
            <table className="table">

            <tbody>
                {rows}
            </tbody>
            </table>
        </div>
    );
};

export default Docs;
