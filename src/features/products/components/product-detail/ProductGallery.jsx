import { useState } from "react";
import { ImageOff } from "lucide-react";

import styles from "./ProductGallery.module.css";

const ProductGallery = ({ images = [], productName }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = images[activeIndex] ?? images[0];

  if (!images.length) {
    return (
      <div className={styles.gallery}>
        <div className={styles.emptyImage}>
          <ImageOff size={42} aria-hidden="true" />
          <span>No image available</span>
        </div>
      </div>
    );
  }

  const safeActiveIndex = images[activeIndex] ? activeIndex : 0;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImageWrapper}>
        <img
          src={activeImage.url}
          alt={activeImage.alt_text || productName}
          className={styles.mainImage}
        />
      </div>

      {images.length > 1 && (
        <div className={styles.thumbnailList} aria-label="Product images">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={`${styles.thumbnail} ${
                index === safeActiveIndex ? styles.thumbnailActive : ""
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={index === safeActiveIndex}
            >
              <img src={image.url} alt="" className={styles.thumbnailImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
