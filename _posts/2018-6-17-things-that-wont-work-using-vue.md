---
title: Things that won't work using Vue
header:
  teaser: /assets/images/2018-6-21-things-that-wont-work-using-vue.jpeg
  author: Goh Rhy Yan
  src: https://unsplash.com/photos/FFgcWvplwsc
last_modified_at: 2018-6-27
---

After using Vue for a while, I have found some issues that later I learned are actually things they warned us in the documentation.

I made a list of these issues so you can know them as well. Let's describe each and see the options we have to solve them.

## Array Changes

Let's say we have this:

```javascript
const vm = new Vue({
  data: {
    titles: ['Ready Player One', 'The Power of Less', 'The 10x rule']
  }
})
```

We can get two different issues while trying to do changes to `titles`:
- Setting an item using the index: `vm.titles[index] = newTitle`
- Modifying the length: `vm.titles.length = length`

Instead of setting an item using the index directly you can use `Vue.set`:

```javascript
Vue.set(vm.titles, index, newTitle)
```

Another alternative is using `splice`:

```javascript
vm.titles.splice(index, 1, newTitle)
```

On the other hand, to modify the length you can use `splice` as well:

```javascript
vm.titles.splice(length)
```

## Adding properties to an object

Having the fowlloing object:

```javascript
const vm = new Vue({
  data: {
    top: {
      bestMovie: 'Avengers: Infinity War'
    }
  }
})
```

We could be tempted to add a new property doing the next:

```javascript
vm.top.bestShow = 'Breaking Bad'
```

but then `bestShow` won't be reactive because Vue adds the reactive functionality at the moment of the initialization. Which means that the property must be in the `data` object in order to be reactive.

We can use `Vue.set` again to accomplish this:

```javascript
Vue.set(vm.top, 'bestShow', 'Breaking Bad')
```

Although, if you need to add several properties, maybe would be better to create a fresh object combining them:

```javascript
vm.top = Object.assign({}, vm.top, { bestShow: 'Breaking Bad', bestBook: 'Ready Player One' })
```

## Using `$refs` before the component is mounted

Let's say we want to focus an input on our component. We could use the `ref` attribute for that:

```javascript
<input ref="input" />
```

and then:

```javascript
methods: {
  focusInput: function () {
    this.$refs.input.focus()
  }
}
```

What if we want to focus it as soon as the component is created? You would say that we could use the `created` hook:

```javascript
created() {
  this.$refs.input.focus()
}
```

but actually this produces an error because `$refs` is populated after the component has been mounted. So, we should use the `mounted` hook instead since it will be already populated:

```javascript
mounted() {
  this.$refs.input.focus()
}
```

## Toggling similar elements

Vue sometimes will reuse elements that have the same tag name when using `v-if` on them. As you can see in the next example, the input element is reused when the toggle button is pressed.

To notice this you can write something in the input and then press the button (the value won't change) or you can use the dev tools and see that the element is not replaced:

<script async src="//jsfiddle.net/wistcc/egod2nb5/2/embed/result,js,html/"></script>

<div style="text-align: center; margin-top: 10px;">
  <img src="{{'/assets/images/2018-6-21-things-that-wont-work-using-vue-1.gif'}}" />
  <div style="font-size: 0.5em; margin: 10px 0;">A sight of the dev tools</div>
</div>

To solve this we just need to add a key to each of them so Vue knows they are distinct elements:

<script async src="//jsfiddle.net/wistcc/gpLwdkj3/1/embed/result,js,html/"></script>

<div style="text-align: center; margin-top: 10px;">
  <img src="{{'/assets/images/2018-6-21-things-that-wont-work-using-vue-2.gif'}}" />
  <div style="font-size: 0.5em; margin: 10px 0;">A sight of the dev tools</div>
</div>

Now we can see that the element is replaced every time we click the button.

Have you noticed other things that won't work on Vue? Please share in the comments.