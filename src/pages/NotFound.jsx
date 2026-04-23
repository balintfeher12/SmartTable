import { Link } from "react-router-dom";
import "../styles/notfound.css";

export default function NotFound() {
  return (
    <div className="notfound-container">
      <h1>404</h1>
      <h2>Az oldal nem található</h2>
      <p>A keresett oldal nem létezik vagy áthelyezésre került.</p>
      <Link to="/">
        <button className="notfound-btn">Vissza a főoldalra</button>
      </Link>
    </div>
  );
}