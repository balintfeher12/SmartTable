import "../styles/about.css";

export default function Rolunk() {
  return (
    <div className="rolunk-page">
      <div className="rolunk-card">

        <h1>🍽 Rólunk</h1>

        <p>
          A SmartTable modern megoldást kínál az éttermi asztalfoglalások kezelésére.
        </p>

        <div className="rolunk-list">

          <div className="rolunk-item">
            <strong>⚡ Gyors foglalás</strong>
            Vendégeink néhány kattintással foglalhatnak asztalt online.
          </div>

          <div className="rolunk-item">
            <strong>📅 Valós idejű rendszer</strong>
            Azonnal látod a szabad asztalokat, nincs dupla foglalás.
          </div>

          <div className="rolunk-item">
            <strong>🍴 Éttermeknek készült</strong>
            Hatékonyabb vendégkezelés és jobb élmény.
          </div>

        </div>

      </div>
    </div>
  );
}