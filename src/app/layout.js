import "bootstrap/dist/css/bootstrap.min.css";
import AddBootstrap from "./AddBootstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Work Manager",
  description: "Create by deep",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <AddBootstrap />
        {children}
        <Footer />
      </body>
    </html>
  );
}
