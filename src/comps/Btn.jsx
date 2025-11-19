import React from "react";



const Btn = ({
    clicked = null,
    caption = "Default",
    icon = ""
}) => {



    const onClick = () => {
        if (clicked)
            clicked();

    };

    return (
        <button
            className="flex_row_center_center"
            onClick={onClick}

        >
            {icon && <img className="mr_small" alt="" src={`/icons/${icon}.svg`} />}
            
            {caption}
        </button>

    );
};

export default Btn;