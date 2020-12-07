
# Audrey: Contribution Guide

We welcome contributions to Audrey. This guide outlines what's expected of you when you contribute, and what you can expect from me.

## Table of Contents

  * [What I expect from you](#what-i-expect-from-you)
  * [What you can expect from me](#what-you-can-expect-from-me)
  * [Technical](#technical)
    * [Linting](#linting)
    * [Unit tests](#unit-tests)
    * [Integration tests](#integration-tests)
      * [Feed tests](#feed-tests)
    * [Manual testing](#integration-tests)


## What I expect from you

If you're going to contribute to Audrey, thanks! I have a few expectations of contributors:

  1. [Follow the code of conduct](code_of_conduct.md)
  2. [Follow the technical contribution guidelines](#technical)
  3. Be respectful of the time and energy that me and other contributors offer


## What you can expect from me

If you're a contributor to Audrey, you can expect the following from me:

  1. I will enforce [Audrey's code of conduct](code_of_conduct.md)
  2. If I decide not to implement a feature or accept a PR, I will explain why

Contributing to Audrey **does not**:

  1. Guarantee you my (or any other contributor's) attention or time – I work on this in my free time and I make no promises about how quickly somebody will get back to you on a PR, Issue, or general query
  2. Mean your contribution will be accepted


## Technical

To contribute to Audrey's code, clone this repo locally and commit your work on a separate branch. Open a pull-request to get your changes merged. If you're doing any large feature work, please make sure to have a discussion in an issue first – I'd rather not waste your time if it's not a feature I want to add to Audrey 🙂

I don't offer any guarantees on how long it will take me to review a PR or respond to an issue, [as outlined here](#what-you-can-expect-from-me).

### Linting

Audrey is linted using [ESLint](https://eslint.org/), configured in the way I normally write JavaScript. Please keep to the existing style.

ESLint errors will fail the build on any PRs. Most editors have an ESLint plugin which will pick up errors, but you can also run the linter manually with the following command:

```
make verify
```

### Unit tests

Most of Audrey's code is not unit-tested. Any code that looks like a library will probably eventually be transferred out into a separate module, or replaced with a preexisting one.

### Integration tests

Audrey has a suite of integration tests. The integration tests create a new Audrey app (including a database), and load each page in turn testing that core functionality still works. When the tests need to verify that an element exists on a page, always use a `data-test` attribute to do so.

Because of the integration tests, sometimes changes to Audrey's HTML can cause the tests to fail. This will normally happen when either:

  - You have changed an error message. If this is intentional then update the tests to use the new error message
  - You have removed or changed a `data-test` attribute. If this is unexpected then check through any changes you've made in the `server/view` directory. If it's intentional then please update the tests

Failing integration tests will fail the build on any PRs. You can run integration tests locally to check your work with the following command:

```
make test-integration
```

#### Feed tests

Audrey also tests against a real list of RSS and Atom feeds. It does this Monday–Friday at 08:00 UTC, testing against all of the feeds in [`test/feeds/feeds.json`](../test/feeds/feeds.json). Running this test suite is slow and a bit brittle as it tests against live URLs, so you're not expected to run it on your PRs.

If you've made extensive changes to feed subscription, you may want to run these tests locally for peace of mind. You can do so with:

```
make test-feeds
```

### Manual testing

If you make any changes to styling, please test your changes manually across a range of browsers. Audrey aims to support the following browsers:

  - [Apple Safari](https://www.apple.com/safari/) (latest stable)
  - [Google Chrome](https://www.google.co.uk/chrome/) (latest stable)
  - [Microsoft Edge](https://www.microsoft.com/edge) (latest stable)
  - [Mozilla Firefox](https://www.mozilla.org/firefox/) (latest stable)

Audrey also needs to work well on mobile devices. Please make sure that you test your styles on a range of screen sizes, in most case developer tools are enough.
