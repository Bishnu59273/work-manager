// RootLayout.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AddBootstrap from "./AddBootstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { UserProvider } from "./UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PreLoader from "./components/Preloader";
import "@/plugins/custom_css/main.css";

export const metadata = {
  title: "Work Manager",
  description: "Created by deep",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <PreLoader />
          <NavBar />
          <ToastContainer />
          <AddBootstrap />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
