---
title: "¿Qué es camelCase, PascalCase, kebab-case y snake_case?"
header:
  teaser: /assets/images/2020-5-13-naming-conventions.jpg
  author: Patrick Perkins
  src: https://unsplash.com/photos/ETRPjvb0KM0
last_modified_at: 2020-5-13
lang: es
alt_url: /naming-conventions/
---

Como no podemos definir una variable como `fruits in basket` porque muchos (o quizás todos) los lenguajes de programación van a interpretar el espacio como el final del identificador y el comienzo de otra cosa, necesitamos hacer algo como `fruitsInBasket`.

Camel, pascal, kebab y snake case (y otros) son convenciones de nombres que usamos en programación para poder crear nombres compuestos para variables, tipos, funciones, clases y otras estructuras en el código fuente.

## camelCase
Las reglas son que ponemos en mayúscula todas las palabras después de la primera.

| Original         | camelCase      |
| ---------------- | -------------- |
| fruits in basket | fruitsInBasket |
| has error        | hasError       |
| is visible       | isVisible      |

Camel case se usa comúnmente para variables y funciones en JavaScript.

## PascalCase
Aquí necesitamos poner en mayúscula todas las palabras, incluyendo la primera.

| Original         | camelCase      | PascalCase      |
| ---------------- | -------------- | --------------- |
| fruits in basket | fruitsInBasket | FruitsInBasket  |
| has error        | hasError       | HasError        |
| is visible       | isVisible      | IsVisible       |

PascalCase suele ser preferido por los programadores de C.

## kebab-case
Para este, agregamos un guion entre cada palabra y todas van en minúscula.

| Original         | camelCase      | PascalCase      | kebab-case        |
| ---------------- | -------------- | --------------- | ----------------- |
| fruits in basket | fruitsInBasket | FruitsInBasket  | fruits-in-basket  |
| has error        | hasError       | HasError        | has-error         |
| is visible       | isVisible      | IsVisible       | is-visible        |

Los atributos de HTML5 pueden empezar con `data-` como `data-name`. También, CSS usa guiones en nombres de propiedades como background-color.

## snake_case
A diferencia del kebab case, para el snake case agregamos un guion bajo.

| Original         | camelCase      | PascalCase      | kebab-case        | snake_case        |
| ---------------- | -------------- | --------------- | ----------------- | ----------------- |
| fruits in basket | fruitsInBasket | FruitsInBasket  | fruits-in-basket  | fruits_in_basket  |
| has error        | hasError       | HasError        | has-error         | has_error         |
| is visible       | isVisible      | IsVisible       | is-visible        | is_visible        |

Muchos programadores usan guiones bajos, especialmente en bases de datos SQL, para cosas como `creation_date`, `company_name`, etc.

Algunos **beneficios** que traen las convenciones de nombres son:
  - **Consistencia.** Como ponerle nombre a las cosas es uno de los trabajos más difíciles de un programador, al menos podemos ponernos de acuerdo en una convención y ser consistentes con ella.
  - **Mejor comprensión.** Los nombres compuestos explican mucho mejor que una palabra o un solo carácter el propósito de la estructura.
  - **Legibilidad.** Mejora la capacidad de leer el código.
  - **Automatización.** Permite usar herramientas automáticas de refactoring y de buscar y reemplazar.
