---
title: "What is CORS?"
header:
  teaser: /assets/images/2020-5-24-what-is-cors.jpg
  author: Michael Geiger
  src: https://unsplash.com/photos/JJPqavJBy_k
last_modified_at: 2020-5-24
---

Have you ever seen this error?
 
<div style="margin: 10px 50px; color: #e49199;">
Access to fetch at '<a>https://www.test1.com</a>' from origin '<a>https://www.test2.com</a>' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
</div>

If you have, it probably means that you have faced this problem before or that you are facing it right now. Either way, don't worry, we will learn what is this error about together.

First of all, CORS stands for Cross-Origin Resource Sharing and I think that with this alone we could already start to understand the idea behind CORS. It is a mechanism to allows (or not) different origins (different websites, domains) to have access to resources on a server.

Let's say that I have a service called `musicinfo.com`. Here I have 2 endpoints: one that is public, meaning anyone can do requests from any origin and get information about a song, and another one that is private, meaning that only requests made from `https://www.musicinfo.com`.

This is how those request would look like:

**Request Headers**
```
... Other headers
authority: www.musicinfo.com
method: GET
path: /song?name=one&artist=u2
origin: https://winnercrespo.com
```

**Response Headers**
```
... Other headers
Access-Control-Allow-Origin: *
```

As you can see, on the response we get `Access-Control-Allow-Origin: *` meaning that any origin is allowed to access this resource. Another way this could have worked is if we get `Access-Control-Allow-Origin: https://winnercrespo.com` meaning that this origin has access. What we get on the `Access-Control-Allow-Origin` is dictated by the server so it decides beforehand who has access to what resource.

On the other hand, if I try to do a request to the private endpoint from https://winnercrespo.com we would get a CORS error as we can see in the next example.

Using the Google Seach, I noticed that it does a `Get` request to this URL `https://www.google.com/complete/search?q=hola` in order to get the autocomplete options.

<div style="text-align: center; margin-top: 10px;">
  <img src="{{'/assets/images/google-search-request.png'}}" />
  <div style="font-size: 0.5em; margin: 10px 0;">Google search request.</div>
</div>

But if I try to do the same request from different website with a piece of code similar to this:

```javascript
fetch('https://www.google.com/complete/search?q=hola')
  .then(() => {
    // handle success
  })
  .catch(() => {
    // handle exception
  });
  ```

I get the same error we saw before:

<div style="margin: 10px 50px; color: #e49199;">
Access to fetch at '<a>https://www.google.com/complete/search?q=hola</a>' from origin '<a>https://www.winnercrespo.com</a>' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
</div>

To learn more about this topic I would recommend this great post <a>https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS</a> written by the MDN web docs.
