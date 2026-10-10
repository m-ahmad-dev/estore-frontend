import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Home, MapPin, ArrowRight } from "lucide-react";
import styles from "./NotFound.module.css";
import IsDark from "../../utils/themeUtilty/isDark.jsx";

const NotFound = () => {
  const navigate = useNavigate();
  const isDark = IsDark();

  return (
    <main
      className={`${styles.page} ${
        isDark ? styles.pageDark : styles.pageLight
      }`}
    >
      {/* Decorative background elements */}
      <div className={styles.bgShapeOne} aria-hidden="true" />
      <div className={styles.bgShapeTwo} aria-hidden="true" />

      <div className={styles.container}>
        {/* Large 404 mark */}
        <div className={styles.heroNumber} aria-hidden="true">
          <span className={styles.digit}>4</span>
          <span className={`${styles.digit} ${styles.digitCenter}`}>0</span>
          <span className={styles.digit}>4</span>
        </div>

        {/* Main content */}
        <div className={styles.content}>
          <div
            className={`${styles.status} ${
              isDark ? styles.statusDark : styles.statusLight
            }`}
          >
            <MapPin className={styles.statusIcon} strokeWidth={2} />
            <span>Location unavailable</span>
          </div>

          <h1 className={styles.heading}>We cannot find this destination.</h1>

          <p
            className={`${styles.lead} ${
              isDark ? styles.leadDark : styles.leadLight
            }`}
          >
            The page you requested does not exist or is no longer available.
            Please return to the previous page or continue from the homepage.
          </p>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`${styles.btnSecondary} ${
                isDark ? styles.btnSecondaryDark : styles.btnSecondaryLight
              }`}
            >
              <ArrowLeft className={styles.btnIcon} strokeWidth={2.25} />
              Previous page
            </button>

            <Link
              to="/"
              className={`${styles.btnPrimary} ${
                isDark ? styles.btnPrimaryDark : styles.btnPrimaryLight
              }`}
            >
              Homepage
              <ArrowRight className={styles.btnIcon} strokeWidth={2.25} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
