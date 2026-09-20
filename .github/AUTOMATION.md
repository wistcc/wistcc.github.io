# Automatización del reto

Una Action diaria (`.github/workflows/sync-challenge.yml`) mantiene `/challenge/` al día **sin IA y sin tocar código**.

| Qué | Cómo | Necesita |
|---|---|---|
| Día actual | Se calcula al compilar (hora de RD) desde `start_date`. La Action fuerza un rebuild a las 00:05 RD. | nada |
| Reels nuevos → episodios | API oficial de Instagram. Día = "Día N" del caption (o la fecha). Título/resumen = tu caption. Baja la portada. | secret `IG_TOKEN` |
| Números y gráfico | Lee 2 celdas de un Google Sheet publicado. Si el ingreso mensual cambia, agrega un punto al gráfico. | variable `NUMBERS_CSV_URL` |
| Renovar el token de IG | Cada noche, antes de que venza (60 días). | secret `GH_PAT` |

Corre a las 00:05 y a las 16:00 (RD), y a mano desde *Actions → Sync challenge → Run workflow*. Sin secrets, cada paso se salta solo.
Si el token vence o el Sheet deja de estar publicado, el paso falla y GitHub te manda un correo.

Lo manual que queda: hitos (`milestones` en `_data/challenge.yml`), posts del blog, y corregir el `type` de un episodio si la regla de palabras clave se equivoca.

## 1. Google Sheet (números)
1. Crea una hoja con 2 filas, así (columna A = nombre, B = valor):

   | total_generated | 0 |
   |---|---|
   | monthly_income | 0 |

   (También acepta "Total generado" / "Ingreso mensual", y valores como `RD$1,500`.)
2. **Archivo → Compartir → Publicar en la web** → elige esa hoja y formato **CSV** → Publicar. Copia el enlace.
3. En GitHub: *Settings → Secrets and variables → Actions → Variables → New repository variable*: nombre `NUMBERS_CSV_URL`, valor = el enlace. O por terminal:
   ```bash
   gh variable set NUMBERS_CSV_URL --body "https://docs.google.com/spreadsheets/d/e/....../pub?output=csv"
   ```
Solo son dos cifras, así que publicarlas no expone nada más.

## 2. Token de Instagram
Tu cuenta ya es profesional, no hay que convertir nada.
1. Entra a <https://developers.facebook.com/apps> → **Create app** → tipo **Business** (o "Other → Business").
2. En el panel de la app: **Add product → Instagram** → **API setup with Instagram login**.
3. En "Generate access tokens" agrega tu cuenta `@winnercrespo` (inicia sesión con Instagram, con tu 2FA) y pulsa **Generate token**. Es un token de larga duración (60 días).
4. Guárdalo como secret (la terminal te lo pide sin mostrarlo en pantalla):
   ```bash
   gh secret set IG_TOKEN --repo wistcc/wistcc.github.io
   ```
   Pega el token y Enter.
5. Prueba: *Actions → Sync challenge → Run workflow*. Debe decir "No new Reels" o agregar los que falten.

## 3. Renovación automática del token (opcional, recomendado)
Sin esto tendrías que repetir el paso 2 cada ~55 días.
1. GitHub → *Settings → Developer settings → Fine-grained tokens → Generate new token*: repositorio `wistcc/wistcc.github.io`, permiso **Secrets: Read and write**, vencimiento 1 año.
2. `gh secret set GH_PAT --repo wistcc/wistcc.github.io` y pega ese token.

## Pruebas locales
```bash
node --test .github/scripts/test/sync.test.mjs                 # pruebas
IG_FIXTURE=.github/scripts/test/fixtures/ig-new.json IG_SKIP_THUMBS=1 node .github/scripts/sync-instagram.mjs   # simula la API
```
Si simulas, revierte con `git checkout _data/challenge.yml`.

## Convenciones
- Termina cada caption con `Día N.` (ej. "Día 21. Seguimos."): así el episodio queda en su día. Sin eso se usa la fecha de publicación.
- Los episodios automáticos quedan en español también en la página en inglés (decisión de Winner).
