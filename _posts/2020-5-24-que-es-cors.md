---
title: "¿Qué es CORS?"
header:
  teaser: /assets/images/2020-5-24-what-is-cors.jpg
  author: Michael Geiger
  src: https://unsplash.com/photos/JJPqavJBy_k
last_modified_at: 2020-5-24
lang: es
alt_url: /what-is-cors/
---

¿Alguna vez has visto este error?
 
<div style="margin: 10px 50px; color: #e49199;">
Access to fetch at '<a>https://www.test1.com</a>' from origin '<a>https://www.test2.com</a>' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
</div>

Si lo has visto, probablemente significa que ya te has enfrentado a este problema antes o que te estás enfrentando a él ahora mismo. De cualquier forma, no te preocupes, vamos a aprender juntos de qué trata este error.

Primero que nada, CORS significa Cross-Origin Resource Sharing y creo que solo con eso ya podríamos empezar a entender la idea detrás de CORS. Es un mecanismo para permitir (o no) que diferentes orígenes (diferentes sitios web, dominios) tengan acceso a recursos en un servidor.

Digamos que tengo un servicio llamado `musicinfo.com`. Aquí tengo 2 endpoints: uno que es público, lo que significa que cualquiera puede hacer requests desde cualquier origen y obtener información sobre una canción, y otro que es privado, lo que significa que solo requests hechos desde `https://www.musicinfo.com`.

Así se verían esos requests:

**Request Headers**
```
... Other headers
authority: www.musicinfo.com
method: GET
path: /song?name=one&artist=u2
origin: https://winnercrespo.com
```

**Response Headers**
```
... Other headers
Access-Control-Allow-Origin: *
```

Como puedes ver, en el response recibimos `Access-Control-Allow-Origin: *`, lo que significa que cualquier origen tiene permiso para acceder a este recurso. Otra forma en que esto pudo haber funcionado es si recibimos `Access-Control-Allow-Origin: https://winnercrespo.com`, lo que significa que ese origen tiene acceso. Lo que recibimos en `Access-Control-Allow-Origin` lo dicta el servidor, así que este decide de antemano quién tiene acceso a qué recurso.

Por otro lado, si trato de hacer un request al endpoint privado desde https://winnercrespo.com obtendríamos un error de CORS, como podemos ver en el siguiente ejemplo.

Usando el buscador de Google, noté que hace un request `Get` a esta URL `https://www.google.com/complete/search?q=hola` para obtener las opciones de autocompletado.

<div style="text-align: center; margin-top: 10px;">
  <img src="{{'/assets/images/google-search-request.png'}}" />
  <div style="font-size: 0.5em; margin: 10px 0;">Request de la búsqueda de Google.</div>
</div>

Pero si trato de hacer el mismo request desde otro sitio web con un pedazo de código parecido a este:

```javascript
fetch('https://www.google.com/complete/search?q=hola')
  .then(() => {
    // handle success
  })
  .catch(() => {
    // handle exception
  });
  ```

Obtengo el mismo error que vimos antes:

<div style="margin: 10px 50px; color: #e49199;">
Access to fetch at '<a>https://www.google.com/complete/search?q=hola</a>' from origin '<a>https://www.winnercrespo.com</a>' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
</div>

Para aprender más sobre este tema te recomiendo este gran post <a>https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS</a> escrito por MDN web docs.
