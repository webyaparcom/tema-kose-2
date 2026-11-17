/* kose-yazisi-arsiv — Köşe Yazısı Arşiv — yapışkan yazar kartı, ay gruplu yazılar, kenarda dev gün rakamı (16 Kas 2026 · mcp:webmaker/20261116-181132-t332 · D17).
   Solda yapışkan yazar kartı (yuvarlak portre `img`, ad `imza`, unvan, giriş metni ve etiket çipleri); sağda ay-yıl başlıklarıyla gruplanmış yazılar: kenar boşluğunda dev gün rakamı + hafta günü, etiket, başlık bağlantısı, iki satıra kesilen spot ve «Devamı» ile açılım, okuma süresi çubuğu. Etiket çipleri süzer, boşalan ay grubu gizlenir. Kayıt alanları: `tarih` (YYYY-AA-GG) · `etiket` · `sure` (dk). JS yokken spotlar tam ve süzgeç gizli.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-kose-yazisi-arsiv";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: kose-yazisi-arsiv --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const DK = metinAl(des, ["dkAd"]) || "@booking-minutes@";
    const YA = metinAl(des, ["yazarAd", "imza"]);
    const YU = metinAl(des, ["yazarUnvan", "imza_unvan"]);
    const ET = [];
    const T = A.map((k, i) => {
      const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(x(i, ["tarih", "date"]));
      const d = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12)) : null;
      const et = x(i, ["etiket", "tag", "kategori"]);
      if (et && !ET.includes(et)) ET.push(et);
      const su = Number(x(i, ["sure", "okuma"]));
      return { k, i, d: d && !isNaN(d.getTime()) ? d : null, iso: m ? m[0] : "", et, ei: et ? ET.indexOf(et) : -1, su: Number.isFinite(su) && su > 0 ? su : 0 };
    });
    const tf = (d, o2) => { try { return new Intl.DateTimeFormat(dil || undefined, Object.assign({ timeZone: "UTC" }, o2)).format(d); } catch (e) { return ""; } };
    const S = T.slice().sort((a, b) => (b.d ? b.d.getTime() : -Infinity) - (a.d ? a.d.getTime() : -Infinity) || a.i - b.i);
    const GR = [];
    S.forEach((t) => { const key = t.d ? t.iso.slice(0, 7) : ""; let g = GR.find((z) => z.key === key); if (!g) { g = { key, ad: t.d ? tf(t.d, { month: "long", year: "numeric" }) : "", L: [] }; GR.push(g); } g.L.push(t); });
    const yazi = (t) => `<article class="${P}-yazi" data-yazi data-et="${t.ei}">${t.d ? `<time class="${P}-gun" datetime="${t.iso}"><span class="${P}-gno"><bdi>${esc(tf(t.d, { day: "numeric" }))}</bdi></span><span class="${P}-gad">${esc(tf(t.d, { weekday: "short" }))}</span></time>` : `<span class="${P}-gun" aria-hidden="true"></span>`}<div class="${P}-ygov">${t.et ? `<span class="${P}-yet">${esc(t.et)}</span>` : ""}<h4 class="${P}-ybas">${t.k.url ? `<a class="${P}-bag" href="${esc(t.k.url)}">${esc(t.k.baslik)}</a>` : esc(t.k.baslik)}</h4>${t.k.metin ? `<p class="${P}-spot" data-spot id="${P}-{{id}}-s${t.i}">${satirlar(t.k.metin)}</p><button type="button" class="${P}-devam" data-ac aria-expanded="false" aria-controls="${P}-{{id}}-s${t.i}" hidden>@read-more@<span class="material-symbols-outlined" aria-hidden="true">expand_more</span></button>` : ""}${t.su ? `<p class="${P}-sure"><span class="${P}-sbar" style="--fb-s: ${Math.min(100, (t.su / 15) * 100).toFixed(0)}%" aria-hidden="true"></span><bdi>${sayiBicim(t.su, 0)}</bdi> ${esc(DK)}</p>` : ""}</div></article>`;
    const suz = ET.length > 1 ? `<div class="${P}-suz" role="group" aria-label="@category@" data-fgrup hidden><button type="button" class="${P}-fcip" data-fet="" aria-pressed="true">@all@</button>${ET.map((e, j) => `<button type="button" class="${P}-fcip" data-fet="${j}" aria-pressed="false">${esc(e)}</button>`).join("")}</div>` : "";
    const yazar = `<aside class="${P}-yazar">${G1 ? `<img class="${P}-portre" src="${esc(G1)}" alt="" width="240" height="240" loading="lazy" decoding="async" />` : ""}${YA ? `<p class="${P}-yad">${esc(YA)}</p>` : ""}${YU ? `<p class="${P}-yunvan">${esc(YU)}</p>` : ""}<div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div>${suz}${ctaHtml()}</aside>`;
    return `<div class="${P}-duzen">${yazar}<div class="${P}-arsiv">${GR.map((g) => `<div class="${P}-ayg" data-ayg>${g.ad ? `<h3 class="${P}-aybas">${esc(g.ad)}</h3>` : ""}${g.L.map(yazi).join("")}</div>`).join("")}</div></div>`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
