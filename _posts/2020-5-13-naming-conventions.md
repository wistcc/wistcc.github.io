---
title: "What is camelCase, PascalCase, kebab-case and snake_case?"
header:
  teaser: /assets/images/2020-5-13-naming-conventions.jpg
  author: Patrick Perkins
  src: https://unsplash.com/photos/ETRPjvb0KM0
last_modified_at: 2020-5-13
---

Since we cannot define a variable like `fruits in basket` because many (or maybe all) programming languages will interpret the space character as the end of the identifier and the beginning of something else, we need to do something like `fruitsInBasket`.

Camel, pascal, kebab and snake case (and others) are all naming conventions that we use in computer programming to be able to create compound names for variables, types, functions, clases and other structures in source code.

## camelCase
The rules are that we capitalize all the words after the first one.

| Raw              | camelCase      |
| ---------------- | -------------- |
| fruits in basket | fruitsInBasket |
| has error        | hasError       |
| is visible       | isVisible      |

Camel case is commonly used for variables and functions in JavaScript.

## PascalCase
Here we need to capitalize all the words including the first one.

| Raw              | camelCase      | PascalCase      |
| ---------------- | -------------- | --------------- |
| fruits in basket | fruitsInBasket | FruitsInBasket  |
| has error        | hasError       | HasError        |
| is visible       | isVisible      | IsVisible       |

PascalCase is often preferred by C programmers.

## kebab-case
For this one, we add a dash between each word and all of them are lowercase.

| Raw              | camelCase      | PascalCase      | kebab-case        |
| ---------------- | -------------- | --------------- | ----------------- |
| fruits in basket | fruitsInBasket | FruitsInBasket  | fruits-in-basket  |
| has error        | hasError       | HasError        | has-error         |
| is visible       | isVisible      | IsVisible       | is-visible        |

HTML5 attributes can start with `data-` like `data-name`. Also, CSS uses dashes in property-names like background-color.

## snake_case
In contrast to the kebab case, for the snake case we add an underscore instead.

| Raw              | camelCase      | PascalCase      | kebab-case        | snake_case        |
| ---------------- | -------------- | --------------- | ----------------- | ----------------- |
| fruits in basket | fruitsInBasket | FruitsInBasket  | fruits-in-basket  | fruits_in_basket  |
| has error        | hasError       | HasError        | has-error         | has_error         |
| is visible       | isVisible      | IsVisible       | is-visible        | is_visible        |

Many programmers use underscores especially in SQL databases for things like `creation_date`, `company_name`, etc.

Some **benefits** that naming conventions bring are:
  - **Consistency.** Since naming something is one of the hardest jobs of a programmer, at least we can agree on a convention and be consistent about it.
  - **Better understanding.** Compound names explain a lot better than one word or one character the purpose of the structure.
  - **Readability.** Enhances the ability to read the code.
  - **Automation.** Enables the use of automated refactoring and search and replace tools.