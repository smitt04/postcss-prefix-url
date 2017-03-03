# postcss-prefix-url

> [PostCSS](https://github.com/postcss/postcss) plugin to prefix your urls

## Installation

```
npm i postcss-prefix-url

or

yarn add postcss-prefix-url
```

### Options

| Option | Type | Description |
| ------ | ---- | ----------- |
| prefix | Array or String | The strings or string to prefix your url paths with |
| [useUrl = false] | Boolean | If set to TRUE then the `url()`'s will also be prefixed, otherwise ignores them |
| [exclude] | Regex | Exclude url paths matching this regex |

### Examples

Input
```css
body {
  background: cdn('/test.png');
}

.testAbsolute {
  background: cdn(http://absolute.com/test1.png); /* Ignore absolute urls */
}

.withUrl {
  background: url(/testUrl.png);
}

.testExclude {
  background: cdn(/exclude-this/test1.png); /* Exclude this url */
}
```

Output
```css
body {
  background: url(https://img1.example.com/test.png);
}

.testAbsolute {
  background: url(http://absolute.com/test1.png);
}

.withUrl {
  background: url(https://img1.example.com/testUrl.png);
}

.testExclude {
  background: url(/exclude-this/test1.png);
}
```