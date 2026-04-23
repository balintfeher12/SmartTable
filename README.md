# 🍽️ SmartTables – Éttermi Asztalfoglaló Rendszer

> Prémium éttermi asztalfoglaló webalkalmazás interaktív alaprajzzal, JWT autentikációval és valós idejű foglaláskezeléssel.

🌐 **Éles oldal:** [smarttables.hu](https://smarttables.hu)

---

## 👥 Csapat

| Név | Szerepkör | Felelősség |
|-----|-----------|------------|
| Fehér Bálint | Backend fejlesztő | PHP REST API, JWT, email, deployment |
| Ignácz Dávid | Frontend fejlesztő | React UI, alaprajz, admin panel, CSS |
| Balikó Benjámin | Adatbázis mérnök | ER diagram, táblák, tárolt eljárások |

---

## 📋 A projektről

A SmartTables célja, hogy kiváltsa a hagyományos telefonos foglalásokat. A vendégek egy interaktív étterem-alaprajzon keresztül valós időben láthatják a szabad és foglalt asztalokat, és percek alatt lefoglalhatják a kívánt asztalt.

### Fő funkciók

**Vendég:**
- Regisztráció és JWT alapú bejelentkezés
- Interaktív étterem-alaprajz (szabad/foglalt asztalok valós időben)
- Foglalás létrehozása (dátum, időpont, létszám, megjegyzés)
- Foglalás törlése
- Profil adatok és jelszó módosítása
- Email értesítők (üdvözlő, visszaigazolás, törlés, tiltás/feloldás)

**Admin:**
- JWT védett admin bejelentkezés
- Foglalások áttekintése és szűrése (dátum, vendégnév)
- Vendégek listázása, tiltása és feloldása
- Drag-and-drop asztal pozicionáló alaprajz szerkesztő
- Új asztal hozzáadása és törlése
- Statisztika kártyák (összes foglalás, mai aktív, vendégek, tiltottak)

---

## 🛠️ Technológiai stack

### Frontend
- **React 19.2** + Vite 7.2
- **React Router DOM 7.12**
- Egyedi CSS (navy/arany design)

### Backend
- **PHP 8.3** – REST API (MVC architektúra)
- **Composer** függőségkezelő
- **firebase/php-jwt ^7.0** – JWT autentikáció
- **vlucas/phpdotenv ^5.6** – környezeti változók

### Adatbázis
- **MySQL 8.0**
- 5 tábla: `admin`, `asztal`, `vendeg`, `foglalas`, `bejelentkezes_naplo`
- 7 tárolt eljárás

### Email
- PHP natív `mail()` funkció
- Feladó: `info@smarttables.hu`

### Deployment
- **mhosting.hu** cPanel, Apache
- **smarttables.hu** domain, HTTPS

---

## 🗂️ Projekt struktúra

```
SmartTable/
├── main branch          # PHP Backend
│   ├── app/
│   │   ├── Controllers/ # AdminController, AsztalController, FoglalasController, VendegController
│   │   └── Core/        # Database.php, Mailer.php, Response.php
│   ├── index.php        # REST API routing
│   ├── config.php       # JWT konfiguráció
│   └── vendor/          # Composer függőségek
│
└── frontend branch      # React Frontend
    ├── src/
    │   ├── components/  # Navbar, Footer, CookieBanner
    │   ├── pages/       # Home, Login, Register, Foglalas, Profile, AdminPanel, ...
    │   └── styles/      # CSS fájlok
    └── Dokumentumok/    # Word, Excel, SQL dump
```

---

## 🔌 API végpontok

| Metódus | Végpont | Leírás |
|---------|---------|--------|
| POST | `/vendeg/register` | Vendég regisztráció |
| POST | `/vendeg/login` | Vendég bejelentkezés |
| GET | `/vendeg/profil` | Profil adatok |
| PUT | `/vendeg/update` | Profil módosítás |
| PUT | `/vendeg/jelszo` | Jelszó módosítás |
| GET | `/asztalok` | Összes asztal |
| GET | `/asztalok/szabad` | Szabad asztalok |
| POST | `/foglalas` | Foglalás létrehozása |
| GET | `/foglalas/sajat` | Saját foglalások |
| DELETE | `/foglalas/{id}` | Foglalás törlése |
| POST | `/admin/login` | Admin bejelentkezés |
| GET | `/admin/foglalasok` | Összes foglalás |
| GET | `/admin/vendegek` | Összes vendég |
| PATCH | `/admin/vendeg/{id}/tiltas` | Vendég tiltás/feloldás |
| POST | `/admin/asztal` | Asztal hozzáadása |
| DELETE | `/admin/asztal/{id}` | Asztal törlése |
| PATCH | `/admin/asztal/{id}/pozicio` | Asztal pozíció mentése |
| POST | `/kapcsolat` | Kapcsolatfelvételi üzenet |

---

## 🔒 GDPR megfelelés

- ✅ Adatvédelmi nyilatkozat oldal (`/adatvedelem`)
- ✅ Cookie banner (első látogatáskor)
- ✅ Regisztrációs GDPR checkbox (kötelező)
- ✅ Footer link az adatvédelmi nyilatkozathoz
- ✅ Jelszavak bcrypt titkosítással
- ✅ HTTPS kapcsolat
- ✅ JWT token 1 órás lejárat

---

## 📁 Branches

| Branch | Tartalom |
|--------|----------|
| `main` | PHP backend forráskód |
| `frontend` | React frontend forráskód + dokumentumok |

---

## 📄 Dokumentumok

A `frontend` branch `Dokumentumok/` mappájában:
- `Fejlesztési_Terv.docx`
- `Funkcionalis_terv.docx`
- `projektleiras_smarttable.docx`
- `SmartTables_Tesztjegyzokonyv.xlsx`
- `smarttable.sql` – adatbázis dump

---

*SmartTables – Szakmai vizsgaremek | 2026*