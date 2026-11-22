# Amazon Clone Redesign

Moderní e-commerce rozhraní inspirované nákupním prostředím Amazonu, postavené na Next.js, React, TypeScript a Supabase. Projekt se zaměřuje na čistší redesign, nákupní flow a responzivní UX e-shopu, přičemž je stále aktivně ve vývoji.

## Přehled

Tento projekt je redesign a prototyp Amazon-like online obchodu. Slouží jako frontendově zaměřená aplikace pro prohlížení zboží, přihlašování, košík, seznam přání, podporu zákazníků a responzivní motivy světlý/tmavý.

Projekt obsahuje:

- rozhraní nákupního katalogu a navigaci
- registraci, přihlášení, obnovu hesla a soukromý anonymní demo přístup přes Supabase Auth
- workflow košíku a seznamu přání
- přepínání motivů
- načítání produktových dat přes Supabase
- nastavení Redux pro správu stavu aplikace

## Stav projektu

Projekt je portfolio prototyp, nikoli produkční obchod. Platby, skutečné doručení a administrace nejsou zapojené; objednávky jsou pouze demo záznamy.

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
│   ├── (shop)/          # stránky a layout obchodu
│   ├── api/             # endpoint vyhledávání produktů
│   ├── global-error.tsx
│   └── not-found.tsx
├── components/          # komponenty podle funkcí
├── context/             # kontext motivu
├── lib/                 # přístup k datům a sdílená logika
├── providers/           # poskytovatelé aplikace a autentizace
├── public/              # statické soubory
├── redux/               # stav v prohlížeči
├── supabase/migrations/ # nastavení databáze
├── tests/               # jednotkové testy
├── types/               # sdílené TypeScript typy
├── package.json
├── next.config.ts
├── tsconfig.json
└── vitest.config.mts
```

## Funkce

- responzivní nákupní rozhraní
- navigace a vyhledávání inspirované Amazonem
- přepínání světlého a tmavého motivu
- rozbalovací nabídky profilu a notifikací
- integrace dat o produktech přes Supabase
- stránky košíku, seznamu přání, podpory a kontaktu
- souhrn košíku s dopravou za $4.99 (zdarma od $50), doporučeními podle kategorií a ukázkovou pokladnou
- Supabase Auth s potvrzením e-mailu, obnovou hesla a anonymním demo přístupem
- historie demo objednávek uložená v Supabase a dostupná pouze jejich vlastníkovi
- seskupená informační oznámení o aktuálních slevách, nízké dostupnosti (pět a méně kusů) a limitu pro dopravu zdarma; stav přečtení se ukládá v prohlížeči
- modulární frontend architektura pro budoucí rozšíření
- vlastní chybové stránky a stránka 404, v otevřené aplikaci také upozornění na ztrátu připojení

Upozornění vychází ze stavu připojení hlášeného prohlížečem a nezaručuje dostupnost serveru. Při novém načtení bez připojení se vlastní offline stránka nezobrazí, protože aplikace žádnou neukládá do cache.

## Přehled routování

Aplikace aktuálně obsahuje hlavní routy v rámci shop layoutu:

- `/` – domovská stránka
- `/all-products` – všechny produkty
- `/<kategorie>` – produkty ve vybrané kategorii
- `/auth` – přihlášení, registrace, anonymní demo přístup a obnova hesla
- `/account` – účet aktuálního uživatele
- `/orders` – vlastní demo objednávky a jejich ukázkový stav
- `/cart` – nákupní košík
- `/checkout` – vytvoří demo objednávku pro přihlášeného uživatele; platba ani skutečné doručení nejsou zapojené
- `/wishlist` – uložené produkty
- `/support` – zákaznická podpora
- `/faq` – často kladené otázky
- `/contact` – ukázkový kontaktní formulář; zprávy se neodesílají

Kontaktní formulář funguje pouze v prohlížeči a zadaná data neodesílá ani neukládá. Délkové limity polí a honeypot odfiltrují jednoduché automatické pokusy; při přidání skutečného endpointu budou nutné také serverová validace a omezení četnosti požadavků.

Demo přístup vytvoří samostatného anonymního Supabase uživatele pro každého návštěvníka. Může prohlížet produkty, vytvářet demo objednávky a zrušit vlastní objednávku ve stavu Received. Zrušená objednávka zůstane v historii se stavem Cancelled; katalog ani ostatní údaje objednávek uživatel měnit nemůže. Demo objednávky obsahují pouze položky a cenu vypočtenou v databázi, nejsou skutečnými nákupy a zůstávají dostupné jen pod stejnou relací. Anonymní relaci lze převést na účet s potvrzeným e-mailem a zachovat její historii.

Odhlášení anonymní relaci ukončí v prohlížeči, ale neodstraní záznam uživatele ze Supabase Auth. Před veřejným nasazením s větší návštěvností je potřeba doplnit monitoring a bezpečný úklid starých anonymních účtů.

## Začínáme

### Požadavky

- Node.js 22.12+ (řada 22), řada 24 nebo 26+
- npm

### Instalace závislostí

```bash
npm install
```

### Proměnné prostředí

Vytvořte soubor `.env.local` v kořenu projektu a přidejte své údaje pro Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
# Volitelné; potřebné před zapnutím CAPTCHA v Supabase
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

### Podrobné nastavení Supabase Auth a databáze

Následující kroky proveďte v [Supabase Dashboardu](https://supabase.com/dashboard). Názvy některých položek se mohou mírně lišit podle verze dashboardu.

#### 1. Vytvoření projektu a nastavení klíčů

1. Vytvořte Supabase organizaci/projekt a uložte si databázové heslo bezpečně mimo repozitář.
2. Otevřete projekt a v **Project Settings → API** zkopírujte **Project URL**.
3. V **Project Settings → API Keys** (případně v části **API**) zkopírujte veřejný klíč: nový **Publishable key** začínající `sb_publishable_...` nebo starší veřejný klíč **anon**.
4. V kořenu aplikace vytvořte `.env.local` a vložte URL a právě jeden z veřejných klíčů:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_public_key
   ```

   Projekt podporuje také původní proměnnou `NEXT_PUBLIC_SUPABASE_ANON_KEY`; pokud ji už máte nastavenou, není nutné ji měnit. Po úpravě `.env.local` restartujte `npm run dev`. `.env.local` necommitujte.

#### 2. E-mailová registrace a anonymní demo

V levém menu projektu otevřete **Authentication → Sign In / Providers**:

1. V části **User Signups** ponechte povolené registrace nových uživatelů.
2. Otevřete poskytovatele **Email** a povolte e-mail/heslo. Pro běžnou registraci ponechte zapnuté **Confirm email**, aby uživatel musel potvrdit vlastnictví e-mailu.
3. Na stejné stránce povolte **Allow anonymous sign-ins**. Každé kliknutí na **Try demo** tak vytvoří odděleného anonymního uživatele. Uživatel o své anonymní relaci přijde po odhlášení, vymazání dat webu nebo přechodu na jiné zařízení.
4. Povolte také **Allow manual linking**, pokud je tato volba v projektu zobrazena. Aplikace umožňuje přejít z anonymní relace k registraci s e-mailem a zachovat demo historii.

Po přihlášení nebo vstupu do dema se uživatel vrátí na požadovanou stránku, případně na domovskou stránku. Pokud registrace vyžaduje potvrzení e-mailu, zobrazí se samostatné potvrzení bez vyplněného formuláře; odkaz v e-mailu vede na požadovanou stránku.

#### 3. Hesla, návratové adresy a e-maily

1. V **Authentication → Sign In / Providers → Email** najděte pole **Minimum password length** a nastavte alespoň **12 znaků**. Ano, našel jste správné místo; aplikace tuto hranici kontroluje také ve formuláři.
2. V **Authentication → URL Configuration** nastavte:
   - **Site URL** na `http://localhost:3000` při lokálním vývoji.
   - V **Redirect URLs** přidejte `http://localhost:3000/auth/callback`.
   - Po nasazení změňte **Site URL** na produkční doménu a přidejte přesnou callback adresu, například `https://shop.example.com/auth/callback`.

   Callback zpracovává potvrzení e-mailu i obnovu hesla. Produkční adresu nahraďte skutečnou doménou; nepovolujte zbytečně široké wildcardy.
   Odkaz pro obnovu hesla otevřete ve stejném prohlížeči a zařízení, kde jste o něj požádali: tam je uložen ověřovací údaj PKCE.
3. Pro první testy může Supabase použít výchozí e-mailovou službu. Ta je omezená a běžně neposílá e-maily libovolným návštěvníkům. Vlastní SMTP se nastavuje v **Authentication → Emails → SMTP Settings** (v některých verzích dashboardu je položka přímo **Authentication → SMTP Settings**).
4. V **Authentication → Rate Limits** jsou limity požadavků, včetně anonymního přihlášení. Ponechte je zapnuté; případné snížení anonymního limitu počítejte podle IP adresy.

#### CAPTCHA pomocí Cloudflare Turnstile

1. V [Cloudflare Turnstile](https://dash.cloudflare.com/) vytvořte widget typu **Managed**. Pro lokální test přidejte hostname `localhost`, pro veřejnou aplikaci přidejte také její skutečnou doménu. Pro produkci Cloudflare doporučuje samostatný widget bez lokálních hostname.
2. Veřejný **Site key** vložte do `.env.local` jako `NEXT_PUBLIC_TURNSTILE_SITE_KEY`. Tajný **Secret key** do aplikace ani repozitáře nevkládejte. Restartujte vývojový server; při nasazení nastavte veřejnou proměnnou také v hostingu a aplikaci znovu sestavte.
3. Na `/auth` ověřte, že se zobrazují bezpečnostní kontroly u přihlášení a **Try demo** a také po přepnutí na registraci či obnovu hesla. Po selhání nebo vypršení tokenu se kontrola musí provést znovu.
4. Teprve poté otevřete Supabase **Authentication → Bot and Abuse Protection**, zapněte **Enable CAPTCHA protection**, vyberte **Turnstile**, vložte Cloudflare **Secret key** a uložte nastavení. Názvy sekcí se mohou podle verze dashboardu lišit.
5. Otestujte Try demo, přihlášení, registraci i žádost o obnovu hesla. Pokud widget nefunguje, zkontrolujte hostname, oba klíče a restart/sestavení aplikace. Zapnutá ochrana Supabase odmítne požadavky bez platného tokenu; pouhé nastavení veřejného klíče bez zapnutí ochrany v Supabase ochranu serveru nezapne.

Supabase CAPTCHA ověřuje při anonymním přihlášení, běžné registraci, přihlášení a žádosti o obnovu hesla. Převod již přihlášeného anonymního účtu používá `updateUser`, který podle současného SDK CAPTCHA token nepřijímá; omezení Auth požadavků proto ponechte zapnuté. Turnstile nenahrazuje RLS ani monitoring a úklid anonymních účtů. Požadavky s jedním tokenem lze použít jen jednou.

#### 4. Databázové tabulky, RLS a produkty

Před migrací musí v databázi existovat tabulka `public.products` s produktovými daty a sloupci `id`, `title`, `thumbnail`, `price`, `discount_percentage` a `stock`. Objednávková funkce z ní ověřuje dostupnost a počítá cenu na serveru.

1. Otevřete **SQL Editor → New query**.
2. Zkopírujte celý obsah souboru [`supabase/migrations/20261122150000_demo_orders.sql`](./supabase/migrations/20261122150000_demo_orders.sql) do dotazu a spusťte jej tlačítkem **Run**.
3. Stejným způsobem spusťte i následnou migraci [`supabase/migrations/20261122160500_cancel_demo_order.sql`](./supabase/migrations/20261122160500_cancel_demo_order.sql). Pokud jste první migraci již spustili, stačí nyní spustit tuto novou.
4. Pro smazání vlastního účtu spusťte také migraci [`supabase/migrations/20261122190000_delete_own_account.sql`](./supabase/migrations/20261122190000_delete_own_account.sql). Funkce kontroluje aktivní relaci a smaže pouze vlastní účet; jeho demo objednávky a položky se nevratně odstraní kaskádou. Košík a wishlist uložené v prohlížeči zůstanou.
5. V **Table Editor** ověřte tabulky `demo_orders` a `demo_order_items`; v **Database → Functions** ověřte funkce `place_demo_order`, `cancel_demo_order` a `delete_own_account`.
6. Migrace povolí anonymnímu i přihlášenému návštěvníkovi veřejné čtení produktů, zapne RLS a povolí každému přihlášenému uživateli pouze čtení jeho vlastních demo objednávek. Novou objednávku lze vložit jen přes funkci, která cenu znovu vypočítá z databáze. Funkce pro zrušení povolí změnu stavu jen u vlastní objednávky ve stavu Received. Přímá změna ani mazání objednávek nejsou povoleny.

Smazáním účtu zaniknou také jeho Auth relace a obnovovací tokeny. Již vydaný přístupový token může zůstat platný do vypršení; funkce smazání proto kontroluje relaci proti `auth.sessions`. Supabase nedovolí smazat uživatele, který vlastní objekty ve Storage, dokud nejsou odstraněny nebo převedeny.

Po těchto krocích restartujte aplikaci, otevřete `/auth` a otestujte nejprve **Try demo**, potom vytvoření demo objednávky a její zobrazení na `/orders`. Registraci s e-mailem lze ověřit až po doručení a otevření potvrzovacího odkazu.

Veřejný **Publishable/anon** klíč patří do klientské aplikace; bezpečnost dat musí zajišťovat správná oprávnění a RLS. Tajný **Secret/service_role** klíč nikdy nevkládejte do `NEXT_PUBLIC_*`, prohlížeče ani repozitáře. Migrace předpokládá existující tabulku produktů a nepřidává skutečné platby ani administraci.

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
npm test        # spuštění jednotkových testů
```

Jednotkové testy běží lokálně bez přihlašovacích údajů Supabase. Ověřují výpočet cen, stav košíku a wishlistu, přesměrování, hlášky při omezení požadavků a validaci vyhledávání. Nenahrazují end-to-end testování nasazené aplikace a propojení se Supabase.

## Poznámky

Tento repozitář je záměrně v prototypové fázi. Architektura je již vytvořena, ale ne všechny obrazovky, obchodní logiky ani datové toky jsou plně dokončeny. Projekt je vhodné vnímat jako základ redesignu a pokračující frontendový build.

## Licence

Tento projekt je v současné době osobním prototypem a nebude mít formální produkční licenci, dokud nebude doplněna později.

## Stav vývoje

Stav: aktivní vývoj

Projekt se stále rozvíjí a struktura aplikace, design systém a integrace se mohou měnit podle přidávání nových funkcí.
