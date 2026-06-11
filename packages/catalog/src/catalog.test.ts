import { test } from "node:test";
import assert from "node:assert/strict";
import { pathFor, validateCatalog, type Demo } from "./catalog.ts";

test("the shipped catalog is valid", () => {
  validateCatalog();
});

test("pathFor builds a root-relative path", () => {
  assert.equal(pathFor("cnn-playground"), "/cnn-playground");
});

test("validateCatalog rejects a slug that escapes the path", () => {
  const bad: Demo[] = [
    { slug: "//evil.com", title: "x", blurb: "x", legacyUrl: "https://x/" },
  ];
  assert.throws(() => validateCatalog(bad), /Invalid demo slug/);
});

test("validateCatalog rejects a path-traversal slug", () => {
  const bad: Demo[] = [
    { slug: "../secret", title: "x", blurb: "x", legacyUrl: "https://x/" },
  ];
  assert.throws(() => validateCatalog(bad), /Invalid demo slug/);
});

test("validateCatalog rejects a non-https legacyUrl", () => {
  const bad: Demo[] = [
    { slug: "ok", title: "x", blurb: "x", legacyUrl: "javascript:alert(1)" },
  ];
  assert.throws(() => validateCatalog(bad), /must be https/);
});

test("validateCatalog rejects duplicate slugs", () => {
  const dup: Demo = {
    slug: "dup",
    title: "x",
    blurb: "x",
    legacyUrl: "https://x/",
  };
  assert.throws(() => validateCatalog([dup, dup]), /Duplicate demo slug/);
});
