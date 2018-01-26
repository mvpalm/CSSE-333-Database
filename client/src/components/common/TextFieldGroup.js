import React from 'react';
import classnames from 'classnames';

const TextFieldGroup = ({ field, value, label, error, type, onChange, checkCompanyExists, maxLength }) => {
    if(!maxLength){
        maxLength = 45;
    }
    return (
        <div className={classnames("form-group", { 'has-error': error })}>
            <label className="control-label">{label}</label>
            <input
                value={value}
                onBlur={checkCompanyExists}
                onChange={onChange}
                type={type}
                name={field}
                maxLength={maxLength}
                className="form-control"
            />
            {error && <span className="help-block">{error}</span>}
        </div>
    );
}


export default TextFieldGroup;