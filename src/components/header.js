import React from "react";

function Header() {
    return (
        <header style={headerStyles}>
            <h1 style={titleStyles}>Share Me!</h1>

        </header>
    );
}

// Inline styles for a better visual presentation
const headerStyles = {
    backgroundColor: "#f1f1f1", // Blue background color
    color: '#4e54c8',
    fontWeight: '700', padding: "20px 0", // Vertical padding
    textAlign: "center", // Center-align the text
};

const titleStyles = {
    fontSize: "2.5rem", // Bigger font size
    margin: "0", // Remove margin around the title
};

export default Header;
