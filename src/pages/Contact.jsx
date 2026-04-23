import "../styles/contact.css";

export default function Kapcsolat() {
  return (
    <div className="kapcsolat-page">
      <div className="kapcsolat-card">

        <h1>📞 Kapcsolat</h1>

        <p>Vegye fel velünk a kapcsolatot bármilyen kérdés esetén.</p>

        <div className="kapcsolat-item">
          <strong>📧 Email</strong>
          info@smarttable.hu
        </div>

        <div className="kapcsolat-item">
          <strong>📞 Telefon</strong>
          +36 30 123 4567
        </div>

        <div className="kapcsolat-item">
          <strong>📍 Cím</strong>
          7621 Pécs, Fő utca 1.
        </div>

      </div>
    </div>
  );
}// contact link
