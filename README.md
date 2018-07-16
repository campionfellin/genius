<h1 align="center">
  <br>
  genius
  <br>
</h1>

<p align="center"><a href="https://travis-ci.org/campionfellin/genius"><img src="https://travis-ci.org/campionfellin/genius.svg?branch=master" alt="Build Status"></a>

# Install

```sh
    npm install @campionfellin/genius -g
```

# Commands

## Login 

Use this before any commands, putting in your Client Access Token from [here](https://genius.com/api-clients)

* `genius login`

## Search

Scroll down and find the song you want and hit enter to see the lyrics

* `genius search --name "hello world"`
* `genius search --artist "lil wayne"`
* `genius search --name "hello world" --artist "lil wayne"`

## Lyrics

Get lyrics directly if you know the ID of the song you want

* `genius lyrics --id 1234`
