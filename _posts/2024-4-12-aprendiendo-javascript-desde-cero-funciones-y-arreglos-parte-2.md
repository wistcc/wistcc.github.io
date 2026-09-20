---
title: "Aprendiendo JavaScript desde cero: dominando funciones y arrays (Parte 2)"
last_modified_at: 2024-4-12
lang: es
alt_url: /js-part-2/
---

¡Hola! Bienvenido de vuelta a nuestro viaje por el maravilloso mundo de la programación. En el primer post pusimos las bases viendo lo básico de la sintaxis y la estructura de JavaScript. Hoy vamos más a fondo en las características principales del lenguaje, enfocándonos en funciones, arrays y más.

### Funciones: los bloques de construcción de JavaScript

Las funciones son como pequeños paquetes de código que hacen tareas específicas. Son increíblemente versátiles y se pueden usar para encapsular lógica, promover la reutilización de código y mantener una base de código modular.

#### Declarando funciones

En JavaScript, puedes declarar funciones con la palabra clave `function`. Aquí hay un ejemplo sencillo:

```javascript
function greet(name) {
  return 'Hello, ' + name + '!'
}
```

#### Llamando funciones

Una vez que declaras una función, puedes llamarla cuando necesites ejecutar su código. Así llamarías a nuestra función `greet` de antes:

```javascript
let message = greet('Alice')
console.log(message) // Output: Hello, Alice!
```

#### Function expressions

Aparte de las declaraciones de función, JavaScript también soporta function expressions, que te permiten definir funciones anónimas al vuelo. Aquí hay un ejemplo:

```javascript
let add = function (x, y) {
  return x + y
}
```

### Arrays: manejando colecciones de datos

Los arrays son una estructura de datos fundamental en JavaScript, que te permite guardar colecciones de elementos. Son increíblemente versátiles y se pueden usar para todo, desde listas simples hasta estructuras de datos más complejas.

#### Creando arrays

Puedes crear un array en JavaScript poniendo una lista de valores entre corchetes. Aquí hay un ejemplo:

```javascript
let fruits = ['apple', 'banana', 'orange']
```

#### Accediendo a los elementos de un array

Puedes acceder a cada elemento de un array usando corchetes. Recuerda, los índices de un array empiezan en cero, o sea, el primer elemento está en el índice 0. Así accederías al segundo elemento de nuestro array `fruits`:

```javascript
console.log(fruits[1]) // Output: banana
```

#### Métodos de array

JavaScript trae una variedad de métodos incluidos para trabajar con arrays. Desde agregar y quitar elementos hasta ordenar y buscar, estos métodos hacen que manipular arrays sea pan comido. Aquí hay algunos ejemplos:

- **`push()` y `pop()`:** Agregan y quitan elementos al final de un array.
- **`shift()` y `unshift()`:** Quitan y agregan elementos al principio de un array.
- **`splice()`:** Agrega, quita o reemplaza elementos en posiciones específicas de un array.
- **`concat()`:** Concatena dos o más arrays.
- **`indexOf()` y `lastIndexOf()`:** Encuentran el índice de un elemento específico dentro de un array.

### Juntando todo: ejemplos prácticos

Ahora que vimos funciones y arrays, vamos a poner a prueba lo que acabamos de aprender con unos ejemplos prácticos. ¿Qué tal si escribimos una función que calcule el promedio de un array de números?

```javascript
function calculateAverage(numbers) {
  let sum = 0
  for (let number of numbers) {
    sum += number
  }
  return sum / numbers.length
}

let scores = [85, 90, 75, 95, 80]
console.log('Average score:', calculateAverage(scores))
```

### Próximos pasos: hacia dónde ir desde aquí

¡Felicidades! Has avanzado bastante en tu camino para dominar JavaScript. Pero nuestra aventura está lejos de terminar. En el próximo post de la serie vamos a ver conceptos más avanzados de JavaScript, incluyendo objetos, loops y más.

Hasta entonces, sigue programando, mantente curioso y nunca dejes de explorar el maravilloso mundo de JavaScript.

¡Feliz programación!

Mantente atento a la Parte 3 de nuestra serie "Aprendiendo JavaScript desde cero", muy pronto en un navegador cerca de ti.
