import { NavLink } from 'react-router-dom';

const navClassName = ({ isActive }) =>
  `nav-link${isActive ? ' active' : ''}`;

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-badge" aria-hidden="true" />
          <span>DK's Blog</span>
        </NavLink>

        <nav className="site-nav" aria-label="주요 메뉴">
          <NavLink to="/" end className={navClassName}>
            Home
          </NavLink>
          <NavLink to="/library" className={navClassName}>
            Library
          </NavLink>
          <NavLink to="/about" className={navClassName}>
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
