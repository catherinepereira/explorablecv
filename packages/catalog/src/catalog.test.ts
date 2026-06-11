import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCatalog, type Demo } from "./catalog.ts";

test("the shipped catalog is valid", () => {
  validateCatalog();
});

test("validateCatalog rejects a slug that escapes the path", () => {
  const bad: Demo[] = [
    { slug: "//evil.com", title: "x", emoji: "x", blurb: "x" },
  ];
  assert.throws(() => validateCatalog(bad), /Invalid demo slug/);
});

test("validateCatalog rejects a path-traversal slug", () => {
  const bad: Demo[] = [{ slug: "../secret", title: "x", emoji: "x", blurb: "x" }];
  assert.throws(() => validateCatalog(bad), /Invalid demo slug/);
});

test("validateCatalog rejects duplicate slugs", () => {
  const dup: Demo = { slug: "dup", title: "x", emoji: "x", blurb: "x" };
  assert.throws(() => validateCatalog([dup, dup]), /Duplicate demo slug/);
});
