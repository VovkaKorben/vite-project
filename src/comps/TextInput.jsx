import React, { useEffect, useState } from "react";



const TextInput = ({
    label = "",

    changed = null,

    placeholder = "",
    initial = "",
    type = null,
    tag = null,
    error = ""
}) => {
    const [value, setValue] = useState("");
    useEffect(() => { setValue(initial ? initial : ""); }, [initial]);

    const onChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        if (changed)
            changed(tag, newValue);

    };

    // console.log(`[${caption}]init_value: ${initial}`);    console.log(`[${caption}]init_value: ${inputValue}`);
    // console.log(`[TextInput error] ${error}`);
    return (
        <div className="text-input">
            {/* [{tag}]&nbsp; */}
            {label.trim() !== "" && <label htmlFor="color-dropdown">{label}: </label>}
<br />
            <input type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}

            />
            {<span className="error">{error}</span>}
            {/* {error.trim() !== "" && <span className="error">{error}</span>} */}
        </div>


    );
};

export default TextInput;