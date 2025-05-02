import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";

import avatarImg from "../assets/avatar.png";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";
import CartModal from "../pages/shop/CartModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//import logo from " /assets/StepUP_Logo";
import logo from "./../assets/StepUP_Logo.png";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  faBagShopping,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const Navbar = () => {
  const products = useSelector((state) => state.cart.products);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle cart toggle
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  // dropdown navigation
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const handleDropDownToogle = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };
  const userDropdownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Payments", path: "/dashboard/payments" },
    { label: "Orders", path: "/dashboard/orders" },
  ];

  const adminDropdownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add Product", path: "/dashboard/add-product" },
  ];

  // role based dropdown show
  const dropDownMenues =
    user?.role === "admin" ? [...adminDropdownMenus] : [...userDropdownMenus];

  const [logoutUser] = useLogoutUserMutation();
  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toast.success("Logout successful!");
      navigate("/");
    } catch (error) {
      console.error("Error logging out", error);
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropDownOpens, setIsDropDownOpens] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropDownToggle = () => {
    setIsDropDownOpens(!isDropDownOpens);
  };


  return (
    <header className="fixed-nav-bar w-nav ">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center py-2">
        {/* Mobile Menu Button */}
        <div className="nav__linkss">
        <button className="md:hidden text-black" onClick={handleMobileMenuToggle}>
            <FontAwesomeIcon icon={isMobileMenuOpen ?  faXmark : faBars} size="lg" />
          </button>
        </div>
        <div className="nav__logo">
          <Link to="/">
            <img className="w-40" src={logo} />
          </Link>
        </div>
        <div className="nav__icons relative item-center lg:flex-1">
          <span>
            <Link to="/shop">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Link>
          </span>
          <span>
            <button onClick={handleCartToggle} className="relative">
              <FontAwesomeIcon
                icon={faBagShopping}
                size="lg"
                className="text-black"
              />
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {products.length}
              </span>
            </button>
          </span>
          <span>
            {user ? (
              <>
                <img
                  onClick={handleDropDownToogle}
                  src={user?.profileImage || avatarImg}
                  alt=""
                  className="size-6 rounded-full cursor-pointer"
                />
                {isDropDownOpen && (
                  <div className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <ul className="font-medium space-y-4 p-2">
                      {dropDownMenues.map((menu, index) => (
                        <li key={index}>
                          <Link
                            className="dropdown-items"
                            onClick={() => handleDropDownToogle(false)}
                            to={menu.path}
                          >
                            {menu.label}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link className="dropdown-items" onClick={handleLogout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <FontAwesomeIcon icon={faUser} />
              </Link>
            )}
          </span>
        </div>
      </nav>

      <div className="bg-black text-white py-2 hidden lg:block ">
        <ul className="nav__links flex justify-center">
          <li className="link text-white">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/"
            >
              Home
            </NavLink>
          </li>
          <li className="link">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/shop"
            >
              Shop
            </NavLink>
          </li>
          {/* <li className="link">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/pages"
            >
              Pages
            </NavLink>
          </li> */}
          <li className="link">
            <NavLink
              className={({ isActive }) => (isActive ? "active" : "")}
              to="/contact"
            >
              Contact
            </NavLink>
          </li>
        </ul>
      </div>
      {/* cart model */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-16 left-0 w-full z-40 p-4">
          <ul className="flex flex-col space-y-4 text-left text-black font-semibold">
            <li><Link to="/" className="hover:text-red-600" onClick={handleMobileMenuToggle}>Home</Link></li>
            <li><Link to="/shop" className="hover:text-red-600" onClick={handleMobileMenuToggle}>Shop</Link></li>
            <li><Link to="/pages" className="hover:text-red-600" onClick={handleMobileMenuToggle}>Pages</Link></li>
            <li><Link to="/contact" className="hover:text-red-600" onClick={handleMobileMenuToggle}>Contact</Link></li>
          </ul>
        </div>
      )}
      <CartModal
        products={products}
        isOpen={isCartOpen}
        onClose={handleCartToggle}
      />
    </header>
  );
};

export default Navbar;
