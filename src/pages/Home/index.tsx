import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Planos from "../../components/Planos";
import Content from "./Content";

const Home = () => (
  <div className="main-container">
    <Header />
    <Content />
    <Planos />
    <Footer />
  </div>
);

export default Home;
