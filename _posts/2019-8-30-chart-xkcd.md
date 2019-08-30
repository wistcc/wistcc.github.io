---
title: "Chart xkcd vue wrapper"
header:
  teaser: /assets/images/2019-8-30-chart-xkcd.gif
last_modified_at: 2019-8-30
---

A friend shared [this](https://github.com/timqian/chart.xkcd) great library the other day and I fell in love it automatically. It's very beautiful the way these charts look like they were hand-drawn.

It is also very easy to use, you only need to include the script on your page and have a `svg` element where the chart will be rendered. Ler more about it in the [documentation](https://timqian.com/chart.xkcd/).

I thought it would be cool to have a wrapper to use it very easy on my Vue projects but there were none at that moment so I decided to create my own [chart.xkcd-vue-wrapper](https://github.com/wistcc/chart.xkcd-vue-wrapper).

It's also pretty easy to use, you need to install it `yarn add chart.xkcd-vue-wrapper` or `npm i chart.xkcd-vue-wrapper` and then use the components like this:

```
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

I hope that you like using beautiful and funny charts on your projects and that the wrapper is useful for you.

Happy coding!