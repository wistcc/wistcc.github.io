---
title: "Chart xkcd wrapper para Vue"
header:
  teaser: /assets/images/2019-8-30-chart-xkcd.gif
last_modified_at: 2019-8-30
lang: es
alt_url: /chart-xkcd/
---

Un amigo compartió [esta](https://github.com/timqian/chart.xkcd) gran librería el otro día y me enamoré de ella automáticamente. Es muy bonito cómo estos gráficos parecen dibujados a mano.

También es muy fácil de usar, solo necesitas incluir el tag script en tu página y agregar un elemento `svg` donde se va a renderizar el gráfico. Aprende más en la [documentación](https://timqian.com/chart.xkcd/).

Pensé que sería genial tener un wrapper para usarla muy fácil en mis proyectos de Vue pero en ese momento no había ninguno, así que decidí crear el mío, [chart.xkcd-vue-wrapper](https://github.com/wistcc/chart.xkcd-vue-wrapper).

También es bastante fácil de usar, solo necesitas instalarlo con `yarn add chart.xkcd-vue-wrapper` o `npm i chart.xkcd-vue-wrapper` y luego usar los componentes así:

```javascript
<template>
  <div id="app">
    <ChartLine :config="line" />
    <ChartBar :config="bar" />
    <ChartPie :config="pie" />
  </div>
</template>

<script>
import { ChartLine,  ChartBar, ChartPie } from 'chart.xkcd-vue-wrapper';

export default {
  name: 'App',
  components: {
    ChartLine,
    ChartBar,
    ChartPie,
  },
  data: function() {
    return {
      line: {
        title: 'Bugs to fix in a sprint',
        xLabel: 'Day',
        yLabel: 'Bugs',
        data: {
          labels:['1', '2', '3', '4', '5', '6','7'],
          datasets: [{
            label: 'Plan',
            data: [1, 2, 3, 4, 5, 6 ,7],
          }, {
            label: 'Reality',
            data: [0, 0, 0, 0, 0, 0, 7],
          }]
        },
      },
      bar: {
        title: 'Bugs your coworker fixes vs you',
        data: {
          labels:['your coworker', 'you'],
          datasets: [{
            data: [100, 2],
          }]
        },
      },
      pie: {
        title: 'Bugs you create vs your whole team',
        data: {
          labels:[ 'you', 'your team'],
          datasets: [{
            data: [100, 2],
          }]
        }
      }, 
    };
  },
}
</script>
```

Espero que te guste usar gráficos bonitos y divertidos en tus proyectos y que este wrapper te sea útil.

Happy coding!
