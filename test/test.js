import test from 'ava';
import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../';

function readFile(file) {
  return new Promise((resolve) => {
    fs.readFile(file, (err, buffer) => {
      resolve(buffer.toString('utf-8'));
    });
  });
}

async function loadFiles(name) {
  return {
    before: await readFile(path.resolve(__dirname, 'fixtures', `${name}.css`)),
    after: await readFile(path.resolve(__dirname, 'fixtures', `${name}.out.css`))
  }
}

async function testFile(t, name, opts) {
  let files = await loadFiles(name);

  const res = await postcss(plugin(opts)).process(files.before);

  t.is(res.css, files.after);
}

test('prefix as string', (t) => {
  return testFile(t, 'simple', {
    prefix: 'https://img1.example.com'
  });
});

test('prefix as array', (t) => {
  return testFile(t, 'simple', {
    prefix: ['https://img1.example.com']
  });
});

test('multiple prefix urls', (t) => {
  return testFile(t, 'multiple', {
    prefix: ['https://img1.example.com', 'https://img2.example.com', 'https://img3.example.com']
  });
});

test('using url', (t) => {
  return testFile(t, 'url', {
    prefix: ['https://img1.example.com', 'https://img2.example.com', 'https://img3.example.com'],
    useUrl: true
  });
});

test('exclude absolute urls', (t) => {
  return testFile(t, 'absolute', {
    prefix: ['https://img1.example.com', 'https://img2.example.com']
  });
});

test('exclude pattern', (t) => {
  return testFile(t, 'exclude', {
    prefix: ['https://img1.example.com', 'https://img2.example.com'],
    exclude: /\/exclude-this\//
  });
});

test('the mother load', (t) => {
  return testFile(t, 'full', {
    prefix: ['https://img1.example.com', 'https://img2.example.com'],
    exclude: /\/exclude-this\//,
    useUrl: true
  });
});

test('no options', (t) => {
  return testFile(t, 'nada');
});