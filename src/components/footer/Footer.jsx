import {
  ArrowUp,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import IsDark from "../../utils/themeUtility/isDark";
import Logo from "../logo/Logo";

import styles from "./Footer.module.css";

const Footer = () => {
  const isDark = IsDark();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className={`${styles.footer} ${
        isDark ? styles.dark : styles.light
      }`}
    >
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brandColumn}>
            <button
              type="button"
              className={styles.logoButton}
              onClick={() => navigate("/")}
              aria-label="Go to homepage"
            >
              <Logo />
            </button>

            <p className={styles.brandDescription}>
              A modern e-commerce experience built around
              simple discovery, secure shopping, and reliable
              delivery.
            </p>

            <div className={styles.socials}>
              <a
                href="#"
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <Facebook />
              </a>

              <a
                href="#"
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <Instagram />
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Shop</h3>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              All Products
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products?category=electronics")
              }
            >
              Electronics
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products?category=fashion")
              }
            >
              Fashion
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products?category=men")
              }
            >
              Men
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products?category=women")
              }
            >
              Women
            </button>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Customer</h3>

            <button
              type="button"
              onClick={() => navigate("/account")}
            >
              My Account
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              Wishlist
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              Shopping Cart
            </button>

            <button
              type="button"
              onClick={() => navigate("/products")}
            >
              Track Order
            </button>
          </div>

          <div className={styles.column}>
            <h3 className={styles.heading}>Contact</h3>

            <div className={styles.contactItem}>
              <MapPin className={styles.contactIcon} />
              <span>Lahore, Pakistan</span>
            </div>

            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <span>+92 300 0000000</span>
            </div>

            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <span>support@estore.com</span>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>
            © {new Date().getFullYear()} E-Store. All rights
            reserved.
          </p>

          <div className={styles.bottomLinks}>
            <button type="button">Privacy Policy</button>
            <button type="button">Terms & Conditions</button>
          </div>

          <button
            type="button"
            className={styles.backToTop}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;