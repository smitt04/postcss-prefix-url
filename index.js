'use strict';

const postcss = require('postcss');
const functions = require('postcss-functions');
const consistent = require('consistent');
const url = require('url');

module.exports = postcss.plugin('prefix', (options) => {
  options = options || {};
  let prefix = options.prefix || '';
  const useUrl = options.useUrl || false;
  const exclude = options.exclude || null;

  if (Array.isArray(prefix)) {
    if (prefix.length === 1) {
      prefix = prefix[0];
    } else if (prefix.length === 0) {
      prefix = '';
    }
  }

  let ring;
  if (Array.isArray(prefix)) {
    ring = new consistent({
      members: prefix
    });
  }

  this.getPrefix = (path) => {
    if (typeof prefix === 'string') {
      return prefix;
    }

    return ring.get(path);
  }

  this.formatUrl = (path, includePrefix) => {
    const isDataUri = /^["']?data:/i.test(path);
    includePrefix = typeof includePrefix !== 'undefined' ? includePrefix : true;
    const sanitizedPath = path.replace(/['"]/g, '');

    if ((exclude && exclude.test(path)) || /^([a-z]+:\/\/|\/\/)/i.test(path)) {
      includePrefix = false;
    }

    const prefix = includePrefix ? this.getPrefix(sanitizedPath) : '';
    const formatted = isDataUri ? path : url.resolve(prefix, sanitizedPath);

    return `url(${formatted})`;
  };

  return postcss().use(functions({
    functions: {
      cdn: (path) => {
        return this.formatUrl(path);
      },

      url: (path) => {
        return this.formatUrl(path, useUrl);
      }
    }
  }));
});