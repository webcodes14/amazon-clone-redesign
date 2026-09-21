# Amazon Clone Redesign

Moderní e-commerce rozhraní inspirované nákupním prostředím Amazonu, postavené na Next.js, React, TypeScript a Supabase. Projekt se zaměřuje na čistší redesign, nákupní flow a responzivní UX e-shopu, přičemž je stále aktivně ve vývoji.

## Přehled

Tento projekt je redesign a prototyp Amazon-like online obchodu. Slouží jako frontendově zaměřená aplikace pro prohlížení zboží, přihlašování, košík, seznam přání, podporu zákazníků a responzivní motivy světlý/tmavý.

V současné podobě projekt již obsahuje základy pro:

- rozhraní nákupního katalogu a navigaci
- uživatelské a autentizační stránky
- workflow košíku a seznamu přání
- přepínání motivů
- načítání produktových dat přes Supabase
- nastavení Redux pro správu stavu aplikace

## Stav projektu

Projekt je stále v rané fázi vývoje a měl by být považován za pracovní prototyp. Některé sekce jsou zatím jen základy nebo placeholdery, zatímco se rozšiřuje design a funkcionalita.

## Technologický stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Redux Toolkit
- Supabase
- GSAP
- React Icons

## Struktura projektu

```bash
.
├── app/
│   └── (shop)/
│       ├── auth/
│       ├── cart/
│       ├── contact/
│       ├── support/
│       ├── wishlist/
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   ├── navigation/
│   └── theme/
├── context/
├── lib/
│   ├── auth.ts
│   ├── products.ts
│   └── supabase.ts
├── providers/
├── public/
├── redux/
├── types/
├── .env.local
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── README.md
├── README_CZ.md
```

## Funkce

- responzivní nákupní rozhraní
- navigace a vyhledávání inspirované Amazonem
- přepínání světlého a tmavého motivu
- rozbalovací nabídky profilu a notifikací
- integrace dat o produktech přes Supabase
- stránky košíku, seznamu přání, podpory a kontaktu
- modulární frontend architektura pro budoucí rozšíření

## Přehled routování

Aplikace aktuálně obsahuje hlavní routy v rámci shop layoutu:

- `/` – domovská stránka
- `/auth` – autentizační sekce
- `/cart` – nákupní košík
- `/wishlist` – uložené produkty
- `/support` – zákaznická podpora
- `/contact` – kontaktní informace

## Začínáme

### Požadavky

- Node.js 20+
- npm

### Instalace závislostí

```bash
npm install
```

### Proměnné prostředí

Vytvořte soubor `.env.local` v kořenu projektu a přidejte své údaje pro Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Spuštění lokálně

```bash
npm run dev
```

Poté otevřete:

```text
http://localhost:3000
```

## Dostupné skripty

```bash
npm run dev     # spuštění vývojového serveru
npm run build   # build produkční verze aplikace
npm run start   # spuštění built aplikace
npm run lint    # spuštění ESLint kontrol
```

## Poznámky

Tento repozitář je záměrně v prototypové fázi. Architektura je již vytvořena, ale ne všechny obrazovky, obchodní logiky ani datové toky jsou plně dokončeny. Projekt je vhodné vnímat jako základ redesignu a pokračující frontendový build.

## Licence

Tento projekt je v současné době osobním prototypem a nebude mít formální produkční licenci, dokud nebude doplněna později.

## Stav vývoje

Stav: aktivní vývoj

Projekt se stále rozvíjí a struktura aplikace, design systém a integrace se mohou měnit podle přidávání nových funkcí.
