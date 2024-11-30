import { Outlet } from "react-router-dom";
import Nav from "../components/nav";
import Header from "../components/header";
import Footer from "../components/footer";

const Layout = () => {
    return (
        <div>
            <Header />
            <Nav />
            {/* Displaying a brief note about the project */}
            <main style={{ padding: "40px", textAlign: "center", backgroundColor: "#f9f9f9" }}>
                <h2 style={{ color: "#2c3e50" }}>Welcome to Share Me!</h2>
                <p style={{ fontSize: "18px", color: "#34495e" }}>
                    A simple and easy-to-use file-sharing platform that allows you to upload and share your files with others.
                    Whether you're collaborating on a project, sharing photos, or exchanging documents, this platform provides
                    a secure way to share your files effortlessly.
                </p>
                <p style={{ fontSize: "16px", color: "#7f8c8d" }}>
                    Log in or register to get started!
                </p>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
