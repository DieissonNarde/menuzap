import React, { Component } from "react"
// import logo from '../../components/Logo/logo.svg';

import Header from '../../components/Header';
import Content from './Content';
import Planos from '../../components/Planos';
import Footer from '../../components/Footer';

class Home extends Component {
    render() {
        return (
            <div class="main-container">
                <Header />
                <Content />
                <Planos />
                <Footer />
            </div>
        )
    }
}

export default Home;