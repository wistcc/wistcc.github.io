---
title: Why does the data property on a Vue component must be a function?
header:
  teaser: /assets/images/2018-6-13-why-does-the-data-property-on-a-vue-component-must-be-a-function.jpeg
  author: rawpixel
  src: https://unsplash.com/photos/a_L_fVDQQXI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
last_modified_at: 2018-6-13
---

If you don't get familiar with the basic rules of a framework (programming language, tool, etc) when starting to use it, things won't work as expected, since it wasn't conceived that way.

While using Vue for the first time, I made this by mistake:

```javascript
data: {
  message: 'Some Message'
}
```

then, I got the following warning message:

<span style="color: #ed4e4e;">[Vue warn]: The "data" option should be a function that returns a per-instance value in component definitions.</span>

What you should do instead is:

```javascript
data: function() {
  return {
    message: 'Some Message'
  };
}
```

So, the reason why Vue forces the data property to be a function is that each instance of a component should have its own data object. If we don't do that, all instances will be sharing the same object and every time we change something, it will be reflected in all instances.

Check out what the <a href="https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function">Vue's documentation</a> says about it and a quick live example.

I hope this helps.