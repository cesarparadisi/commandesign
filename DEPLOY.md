# Despliegue: GitHub → Netlify → commandesign.com

## A. Subir el proyecto a GitHub (una sola vez)

**Opción 1 · GitHub Desktop (sin terminal)**
1. Instala GitHub Desktop (desktop.github.com) e inicia sesión.
2. File › Add Local Repository › elige la carpeta `commandesign-web` › «create a repository».
3. Name: `commandesign-web` · Git ignore: None (ya trae uno) › Create Repository.
4. Publish repository › deja marcada la casilla «Keep this code private» › Publish.

**Opción 2 · Terminal**
```bash
brew install gh            # si no tienes la CLI de GitHub
gh auth login              # GitHub.com › HTTPS › login con el navegador
cd ~/Downloads/commandesign-web
git init -b main
git add .
git commit -m "commandesign.com: primera versión"
gh repo create commandesign-web --private --source=. --push
```

Cambios posteriores: editas, y `git add . && git commit -m "mensaje" && git push`. Netlify publica solo.

## B. Netlify (plan gratuito)
1. app.netlify.com › Sign up › con GitHub.
2. Add new project › Import an existing project › GitHub › autorizar › elegir `commandesign-web`.
3. La configuración sale de `netlify.toml` (build `npm run build`, carpeta `dist`, Node 22). Deploy.
4. Al minuto queda en `https://<nombre>.netlify.app`. Pruébalo.
5. Project configuration › General › Change project name › `commandesign` → `commandesign.netlify.app`.

## B2. Formulario de contacto (Netlify Forms)
1. En Netlify: **Forms › Enable form detection**. Después haz un nuevo deploy (Deploys › Trigger deploy) para que Netlify lea el formulario «contacto».
2. **Forms › Submission notifications › Add notification › Email notification** → `hello@commandesign.com`, formulario «contacto».
3. Pruébalo una vez desde el sitio publicado: el envío aparece en **Forms › contacto** y te llega el correo.
4. Los envíos marcados como spam quedan en **Forms › contacto › Spam**: revísalos de vez en cuando.

## C. Dominio de Squarespace → Netlify (sin tocar el correo)
**En Netlify**
1. Domain management › Add a domain › `commandesign.com` › Verify › Add domain.
2. No actives Netlify DNS: el DNS sigue en Squarespace y el correo no se mueve.

**En Squarespace** (account.squarespace.com/domains › commandesign.com › DNS)
1. Toma una captura de toda la página: es tu respaldo.
2. Borra solo los registros web de Squarespace:
   - `A` · `@` → 198.185.159.144 / 198.185.159.145 / 198.49.23.144 / 198.49.23.145
   - `CNAME` · `www` → ext-cust.squarespace.com
   - `AAAA` · `@`, si hubiera.
3. Agrega en Custom records:
   - `A` · Host `@` · Data `75.2.60.5`
   - `CNAME` · Host `www` · Data `commandesign.netlify.app`
4. **No toques**: `MX` (Google), `TXT` con `v=spf1`, `TXT` `google-site-verification`, `google._domainkey` (DKIM), `_dmarc`.

**Cierre**
1. Netlify › Domain management: esperar el check verde (minutos a 48 h).
2. HTTPS: el certificado se emite solo. Si tarda: Verify DNS configuration › Provision certificate.
3. En `commandesign.com` › Options › Set as primary domain (www redirige al dominio sin www).
4. Verificar: `dig +short commandesign.com` → 75.2.60.5 · `dig +short MX commandesign.com` → servidores de Google · envía un correo de prueba a hello@.
5. Solo cuando todo lleve unos días funcionando: en Squarespace cancela el plan del sitio web, **no** el dominio.
