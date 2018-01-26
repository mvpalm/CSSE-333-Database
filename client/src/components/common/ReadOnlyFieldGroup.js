import React from 'react';
import classnames from 'classnames';

const ReadOnlyFieldGroup = ({ field, value, label, error, type }) => {
    return (
        <div className={classnames("form-group")}>
            <label className="control-label">{label}</label>
            <input
                value={value}
                readOnly={true}
                type={type}
                name={field}
                className="form-control"
            />
        </div>
    );
}


export default ReadOnlyFieldGroup;