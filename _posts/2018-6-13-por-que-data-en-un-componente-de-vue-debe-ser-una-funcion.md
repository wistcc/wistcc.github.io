---
title: ¿Por qué la propiedad data de un componente de Vue debe ser una función?
header:
  teaser: /assets/images/2018-6-13-why-does-the-data-property-on-a-vue-component-must-be-a-function.jpeg
  author: rawpixel
  src: https://unsplash.com/photos/a_L_fVDQQXI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
last_modified_at: 2018-6-13
lang: es
alt_url: /why-does-the-data-property-on-a-vue-component-must-be-a-function/
---

Si no te familiarizas con las reglas básicas de un framework (lenguaje de programación, herramienta, etc.) cuando empiezas a usarlo, las cosas no van a funcionar como esperas, ya que no fue concebido de esa manera.

Cuando usé Vue por primera vez, hice esto por error:

```javascript
data: {
  message: 'Some Message'
}
```

entonces, me salió el siguiente mensaje de advertencia:

<span style="color: #ed4e4e;">[Vue warn]: The "data" option should be a function that returns a per-instance value in component definitions.</span>

Lo que deberías hacer en su lugar es:

```javascript
data: function() {
  return {
    message: 'Some Message'
  };
}
```

Entonces, la razón por la que Vue obliga a que la propiedad data sea una función es que cada instancia de un componente debe tener su propio objeto de datos. Si no lo hacemos, todas las instancias van a compartir el mismo objeto y cada vez que cambiemos algo, se va a reflejar en todas las instancias.

Mira lo que dice la <a href="https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function">documentación de Vue</a> al respecto y un ejemplo rápido en vivo.

Espero que te sirva.
