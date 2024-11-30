import React from "react";
import { Link } from "react-router-dom";

function Nav() {
    return (
        <nav style={{ backgroundColor: "#4e54c8", padding: "10px 0", textAlign: "center", borderBottom: "2px solid #ddd" }}>
            <ul style={{ listStyleType: "none", padding: "0", margin: "0", display: "flex", justifyContent: "center" }}>

                <li style={{ margin: "0 15px" }}>
                    <Link to="/login" style={{ color: "#fff", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}>
                        Login
                    </Link>
                </li>
                <li style={{ margin: "0 15px" }}>
                    <Link to="/register" style={{ color: "#fff", textDecoration: "none", fontSize: "18px", fontWeight: "500" }}>
                        Register
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
