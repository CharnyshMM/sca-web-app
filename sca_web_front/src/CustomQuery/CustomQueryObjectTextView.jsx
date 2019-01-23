import React from 'react';

const CustomQueryObjectTextView = ({object}) => {
    function parseResultItem(item) {
        let viewContent = "";
        if (item instanceof (Object)) {
            viewContent = (<ul style={{ maxWidth: '70%' }}>
                {Object.keys(item).map((key, i) =>
                    <li>
                        <b>{key}:</b> {parseResultItem(item[key])}
                    </li>
                )}
            </ul>);
        } else {
            return item.toString()
        }
        return viewContent;
    };

    const representation = parseResultItem(object);
    return (<div >{representation}</div>);
};

export default CustomQueryObjectTextView;