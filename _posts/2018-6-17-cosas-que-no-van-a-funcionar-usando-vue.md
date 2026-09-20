---
title: Cosas que no van a funcionar usando Vue
header:
  teaser: /assets/images/2018-6-21-things-that-wont-work-using-vue.jpeg
  author: Goh Rhy Yan
  src: https://unsplash.com/photos/FFgcWvplwsc
last_modified_at: 2018-6-27
lang: es
alt_url: /things-that-wont-work-using-vue/
---

Después de usar Vue por un tiempo, me he encontrado con algunos problemas que luego aprendí que en realidad son cosas sobre las que nos advierten en la documentación.

Hice una lista de estos problemas para que tú también los conozcas. Vamos a describir cada uno y ver las opciones que tenemos para resolverlos.

## Cambios en arrays

Digamos que tenemos esto:

```javascript
const vm = new Vue({
  data: {
    titles: ['Ready Player One', 'The Power of Less', 'The 10x rule']
  }
})
```

Podemos tener dos problemas diferentes al intentar hacer cambios a `titles`:
- Asignar un elemento usando el índice: `vm.titles[index] = newTitle`
- Modificar la longitud: `vm.titles.length = length`

En lugar de asignar un elemento usando el índice directamente puedes usar `Vue.set`:

```javascript
Vue.set(vm.titles, index, newTitle)
```

Otra alternativa es usar `splice`:

```javascript
vm.titles.splice(index, 1, newTitle)
```

Por otro lado, para modificar la longitud también puedes usar `splice`:

```javascript
vm.titles.splice(length)
```

## Agregar propiedades a un objeto

Teniendo el siguiente objeto:

```javascript
const vm = new Vue({
  data: {
    top: {
      bestMovie: 'Avengers: Infinity War'
    }
  }
})
```

Podríamos sentirnos tentados a agregar una nueva propiedad haciendo lo siguiente:

```javascript
vm.top.bestShow = 'Breaking Bad'
```

pero entonces `bestShow` no va a ser reactivo porque Vue agrega la funcionalidad reactiva al momento de la inicialización. Lo que significa que la propiedad debe estar en el objeto `data` para ser reactiva.

Podemos usar `Vue.set` otra vez para lograr esto:

```javascript
Vue.set(vm.top, 'bestShow', 'Breaking Bad')
```

Aunque, si necesitas agregar varias propiedades, tal vez sería mejor crear un objeto nuevo combinándolas:

```javascript
vm.top = Object.assign({}, vm.top, { bestShow: 'Breaking Bad', bestBook: 'Ready Player One' })
```

## Usar `$refs` antes de que el componente esté montado

Digamos que queremos hacer focus en un input de nuestro componente. Podríamos usar el atributo `ref` para eso:

```javascript
<input ref="input" />
```

y luego:

```javascript
methods: {
  focusInput: function () {
    this.$refs.input.focus()
  }
}
```

¿Y si queremos hacer focus tan pronto como el componente se crea? Dirías que podemos usar el hook `created`:

```javascript
created() {
  this.$refs.input.focus()
}
```

pero en realidad esto produce un error porque `$refs` se llena después de que el componente ha sido montado. Entonces, deberíamos usar el hook `mounted`, ya que en ese momento ya estará poblado:

```javascript
mounted() {
  this.$refs.input.focus()
}
```

## Alternar elementos similares

Vue a veces reutiliza elementos que tienen el mismo nombre de tag cuando usamos `v-if` en ellos. Como puedes ver en el siguiente ejemplo, el elemento input se reutiliza cuando se presiona el botón de alternar.

Para notarlo puedes escribir algo en el input y luego presionar el botón (el valor no va a cambiar) o puedes usar las dev tools y ver que el elemento no se reemplaza:

<script async src="//jsfiddle.net/wistcc/egod2nb5/2/embed/result,js,html/"></script>

<div style="text-align: center; margin-top: 10px;">
  <img src="{{'/assets/images/2018-6-21-things-that-wont-work-using-vue-1.gif'}}" />
  <div style="font-size: 0.5em; margin: 10px 0;">Un vistazo a las dev tools</div>
</div>

Para resolver esto solo tenemos que agregarle un key a cada uno para que Vue sepa que son elementos distintos:

<script async src="//jsfiddle.net/wistcc/gpLwdkj3/1/embed/result,js,html/"></script>

<div style="text-align: center; margin-top: 10px;">
  <img src="{{'/assets/images/2018-6-21-things-that-wont-work-using-vue-2.gif'}}" />
  <div style="font-size: 0.5em; margin: 10px 0;">Un vistazo a las dev tools</div>
</div>

Ahora podemos ver que el elemento se reemplaza cada vez que hacemos click en el botón.

¿Has notado otras cosas que no funcionan en Vue? Por favor compártelas en los comentarios.
