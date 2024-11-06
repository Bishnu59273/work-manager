// RootLayout.js
import "bootstrap/dist/css/bootstrap.min.css";
import AddBootstrap from "./AddBootstrap";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { UserProvider } from "./UserContext"; // Adjust path as necessary

export const metadata = {
  title: "Work Manager",
  description: "Created by deep",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <NavBar />
          <AddBootstrap />
          {children}
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}