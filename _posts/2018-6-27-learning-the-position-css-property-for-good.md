---
title: Learning the position CSS property for good
header:
  teaser: /assets/images/2018-6-27-learning-the-position-css-property-for-good.jpeg
  author: Caspar Rubin
  src: https://unsplash.com/photos/fPkvU7RDmCo
last_modified_at: 2018-6-28
---
When I create a layout from scratch, I find myself adding different values to the `position` CSS property and to the DPP (direction position properties, I just made that acronym up) top, right, bottom and left properties, hoping that magically they will look as I expect. Maybe you do too.

It would probably be better to learn what they do for good, so we know how to use them.

First of all, a positioned element is one that has a different value than `position: static`, which is the default. In other words, an element that has `position` set as `relative`, `absolute`, `fixed` or `sticky`.

Having that said, we can state that `position` defines how an element is positioned on the page. On the other hand, the DPP add an offset on the direction they specify.

Let's see how each one works.

## `static`
This is the default value and means that the element will be placed according to the page flow. Because of that, the DPP don't affect it.

## `relative`
The element will also be placed according to the page flow but now you can use the DPP to add an offset relative to itself. As we can see in the animation below, the space this element is supposed to use is reserved and other elements are not affected even after adding an offset.

<script async src="//jsfiddle.net/wistcc/3wk9erbq/4/embed/result,html,css/"></script>

## `absolute`
You can use this value to place an element exactly where you want it, also, the element is removed from the page flow. This position will be relative to the next parent element with `relative` or `absolute` positioning. If there is no such parent, it will be placed relative to the page itself as the next example.

<script async src="//jsfiddle.net/wistcc/57qc31mb/1/embed/result,html,css/"></script>

## `fixed`
The element is positioned relative to the viewport since the viewport doesn't change when scrolling, the element will be fixed exactly where you placed it. Also, just like `absolute`, the element is removed from the page flow and it will be relative to the next parent element with `relative` or `absolute` positioning.

<script async src="//jsfiddle.net/wistcc/vnL23mtu/15/embed/result,html,css/"></script>

## `sticky`
It behaves like the `fixed` value but relative to itself since the element is placed according to the page flow. In the example, we can notice that once we are able to see the element and we keep scrolling it will be fixed.

<script async src="//jsfiddle.net/wistcc/facwkq6n/10/embed/result,html,css/"></script>

I hope that now you are able to use those properties knowing exactly what they do.

Happy coding.

<style>
iframe {
  height: 250px;
}
</style>
