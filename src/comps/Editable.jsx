import React, { useEffect, useState } from "react";



const Editable = ({
    label = "",
    onchange = null,
    initial = "",
    

}) => {
    const [value, setValue] = useState("");
    const [mode, setMode] = useState(0);
    useEffect(() => { setValue(initial ? initial : ""); }, [initial]);

    const onChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        if (onchange)
            onchange(newValue);

    };

    return (
        <div className="editable">
            {label && `${label}`}
            {!mode && `mode0: ${value}`}
            {mode && `mode1: ${value}`}

        </div>


    );
};

export default Editable;