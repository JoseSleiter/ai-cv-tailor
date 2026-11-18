import { describe, expect, it } from "vitest";
import { htmlToText, looksLikeLoginWall } from "@/lib/apply/html-to-text";

const OFERTA_SIMPLE = `<html><head><title>x</title></head><body>
<h1>Senior Backend Engineer</h1>
<p>We need someone with <b>Node.js</b> &amp; PostgreSQL.</p>
<ul><li>5+ years</li><li>Remote</li></ul>
</body></html>`;

const CON_MUCHO_MARKUP = `<html><head><style>.a{color:red}</style>
<script>window.__DATA__={a:1}</script></head><body>
<nav><a href="/">Home</a><a href="/jobs">Jobs</a></nav>
<div class="x"><div class="y"><div class="z"><span>Staff Engineer</span></div></div></div>
<p>Trabajo <i>remoto</i> desde LATAM&nbsp;&mdash; stack TypeScript.</p>
<footer>© 2026</footer></body></html>`;

const MURO_DE_LOGIN = `<html><body><div><h1>Sign in to continue</h1>
<p>Please sign in to view this job.</p></div></body></html>`;

describe("htmlToText", () => {
  it("saca el texto de una oferta simple y decodifica las entidades", () => {
    const text = htmlToText(OFERTA_SIMPLE);
    expect(text).toContain("Senior Backend Engineer");
    expect(text).toContain("Node.js & PostgreSQL");
    expect(text).toContain("5+ years");
    expect(text).not.toContain("<");
  });

  it("tira script, style, nav y footer, y no colapsa el contenido", () => {
    const text = htmlToText(CON_MUCHO_MARKUP);
    expect(text).not.toContain("window.__DATA__");
    expect(text).not.toContain("color:red");
    expect(text).not.toContain("Home");
    expect(text).not.toContain("© 2026");
    expect(text).toContain("Staff Engineer");
    expect(text).toContain("remoto");
    expect(text).toContain("—");
  });

  it("no deja lineas en blanco de mas", () => {
    expect(htmlToText(CON_MUCHO_MARKUP)).not.toMatch(/\n{3,}/);
  });
});

describe("looksLikeLoginWall", () => {
  it("reconoce un muro de login", () => {
    expect(looksLikeLoginWall(htmlToText(MURO_DE_LOGIN))).toBe(true);
  });

  it("reconoce que una pagina corta no sirve, diga lo que diga", () => {
    expect(looksLikeLoginWall("Senior Backend Engineer")).toBe(true);
  });

  it("deja pasar una oferta larga de verdad", () => {
    const real = `${"Responsibilities: own the backend services. ".repeat(20)}`;
    expect(looksLikeLoginWall(real)).toBe(false);
  });

  /**
   * ⚠ El caso que separa este control de uno ingenuo: una oferta LARGA que
   * ademas dice "log in" en algun lado no es un muro.
   */
  it("no confunde una oferta larga que menciona 'log in' con un muro", () => {
    const real = `Sign in to our portal to apply. ${"We need Node.js, PostgreSQL and AWS experience. ".repeat(30)}`;
    expect(looksLikeLoginWall(real)).toBe(false);
  });
});
