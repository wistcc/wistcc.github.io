---
title: Aprendiendo la propiedad position de CSS de una vez por todas
header:
  teaser: /assets/images/2018-6-27-learning-the-position-css-property-for-good.jpeg
  author: Caspar Rubin
  src: https://unsplash.com/photos/fPkvU7RDmCo
last_modified_at: 2018-6-28
lang: es
alt_url: /learning-the-position-css-property-for-good/
---
Cuando creo un layout desde cero, me encuentro agregando diferentes valores a la propiedad CSS `position` y a las propiedades DPP (direction position properties, me inventé ese acrónimo) top, right, bottom y left, esperando que por arte de magia se vean como espero. Tal vez tú también lo haces.

Probablemente sería mejor aprender de una vez qué hacen, para saber cómo usarlas.

Primero que nada, un elemento posicionado es uno que tiene un valor diferente a `position: static`, que es el valor por defecto. En otras palabras, un elemento que tiene `position` con el valor `relative`, `absolute`, `fixed` o `sticky`.

Dicho esto, podemos decir que `position` define cómo se posiciona un elemento en la página. Por otro lado, las DPP agregan un desplazamiento en la dirección que especifican.

Veamos cómo funciona cada uno.

## `static`
Este es el valor por defecto y significa que el elemento se va a colocar según el flujo de la página. Por eso, las DPP no lo afectan.

## `relative`
El elemento también se coloca según el flujo de la página pero ahora puedes usar las DPP para agregar un desplazamiento relativo a sí mismo. Como podemos ver en la animación de abajo, el espacio que este elemento debería usar queda reservado y los otros elementos no se ven afectados aun después de agregar un desplazamiento.

<script async src="//jsfiddle.net/wistcc/3wk9erbq/4/embed/result,html,css/"></script>

## `absolute`
Puedes usar este valor para colocar un elemento exactamente donde quieres, también, el elemento se saca del flujo de la página. Esta posición va a ser relativa al siguiente elemento padre con posicionamiento `relative` o `absolute`. Si no hay un padre así, se va a colocar relativo a la página misma, como en el próximo ejemplo.

<script async src="//jsfiddle.net/wistcc/57qc31mb/1/embed/result,html,css/"></script>

## `fixed`
El elemento se posiciona relativo al viewport, y como el viewport no cambia al hacer scroll, el elemento va a quedar fijo exactamente donde lo colocaste. También, igual que `absolute`, el elemento se saca del flujo de la página y va a ser relativo al siguiente elemento padre con posicionamiento `relative` o `absolute`.

<script async src="//jsfiddle.net/wistcc/vnL23mtu/15/embed/result,html,css/"></script>

## `sticky`
Se comporta como el valor `fixed` pero relativo a sí mismo, ya que el elemento se coloca según el flujo de la página. En el ejemplo podemos notar que una vez que podemos ver el elemento y seguimos haciendo scroll, se queda fijo.

<script async src="//jsfiddle.net/wistcc/facwkq6n/10/embed/result,html,css/"></script>

Espero que ahora puedas usar esas propiedades sabiendo exactamente qué hacen.

Happy coding.

<style>
iframe {
  height: 250px;
}
</style>
