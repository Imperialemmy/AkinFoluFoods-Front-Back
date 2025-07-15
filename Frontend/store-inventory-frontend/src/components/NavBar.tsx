import NavLinkItem from "./NavLinkItem";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/brands", label: "Brands" },
  { to: "/categories", label: "Categories" },
  { to: "/wares", label: "Products" },
];

const Navbar = () => {
  return (
    <nav className="bg-white px-4 py-3 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex justify-center">
        <div className="flex space-x-20">
          {navLinks.map((link) => (
            <NavLinkItem key={link.to + link.label} to={link.to}>
              {link.label}
            </NavLinkItem>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
