import Logo from "../../assets/images/logo.svg";

const Nav = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light static-top header-a">
    <div className="container nav-container">
      <a href="/" aria-label="Menu Zap - início">
        <img src={Logo} width="60" alt="Menu Zap" />
      </a>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Alternar navegação"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse alink" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item active">
            <a className="nav-link" href="#como-funciona">
              Como Funciona <span className="sr-only">(atual)</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#beneficios">Benefícios</a>
          </li>
          <li className="nav-item">
            <a className="btn start" href="/login">Login</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default Nav;
