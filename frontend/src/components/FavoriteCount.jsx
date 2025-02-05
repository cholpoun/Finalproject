import PropTypes from "prop-types";
import { Heart } from "lucide-react";

const FavoriteCount = ({ favoriteCount }) => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <Heart size={32} stroke="black" />
      {isLoggedIn && favoriteCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-5px",
            right: "-5px",
            background: "red",
            color: "white",
            borderRadius: "50%",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {favoriteCount}
        </span>
      )}
    </div>
  );
};

FavoriteCount.propTypes = {
  favoriteCount: PropTypes.number.isRequired,
};

export default FavoriteCount;
