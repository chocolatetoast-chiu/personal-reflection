"""Build self-contained static pages from preserved article content. No dependencies."""
from pathlib import Path
from html import escape
import json
import math
import re

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = json.loads((ROOT / 'content/articles.json').read_text())
CSS = (ROOT / 'src/motion.css').read_text() + '\n' + (ROOT / 'src/site.css').read_text()
JS = (ROOT / 'src/site.js').read_text()


def shell(title, description, main, article=False):
    home = 'index.html' if article else ''
    return f'''<!DOCTYPE html>
<html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}｜Leon 的生活手記</title><meta name="description" content="{escape(description, quote=True)}">
<meta name="theme-color" content="#e8e4d8"><link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23e8e4d8'/%3E%3Cpath d='M16 3L19 13L29 16L19 19L16 29L13 19L3 16L13 13Z' fill='%23a34825'/%3E%3C/svg%3E">
<style>{CSS}</style></head><body class="with-grain">
<a href="#main" class="skip">跳到主要內容</a>{'<div class="reading-progress" aria-hidden="true"></div>' if article else ''}
<header class="site-nav"><nav class="wrap nav-inner" aria-label="主要導覽"><a class="brand" href="index.html">LEON <em>／</em> 手記</a><div class="nav-links"><a href="{home}#notes">手記</a><a href="{home}#practice">五秒練習</a><a href="{home}#about">關於我</a><a class="external" href="https://neoleon.in/">研究與作品 ↗</a></div></nav></header>
{main}
<footer class="site-footer"><div class="wrap"><div class="footer-inner"><span>© 2026 邱聖傑 Leon Chiu</span><span>生活・研究・自己</span><a href="#main">回到頁首 ↑</a></div><p class="provenance">derived_from: <a href="content/articles.json">content/articles.json</a> · <a href="content/provenance.json">來源紀錄</a></p></div></footer>
<script>{JS}</script></body></html>'''


def home_page():
    home = (ROOT / 'src/home.html').read_text()
    ticks = []
    for i in range(60):
        angle = math.radians(i * 6)
        radius = 170 if i % 5 == 0 else 175
        ticks.append(f'<path d="M{240+radius*math.sin(angle):.2f} {230-radius*math.cos(angle):.2f}L{240+180*math.sin(angle):.2f} {230-180*math.cos(angle):.2f}"/>')
    filters = ''.join(f'<button class="pill{" active" if tag == "all" else ""}" data-filter="{tag}" aria-pressed="{str(tag == "all").lower()}">{"全部" if tag == "all" else tag}</button>' for tag in ['all', '界線與行動', '自我探索', '人類圖', '年度回顧'])
    rows = []
    for i, a in enumerate(ARTICLES):
        rows.append(f'''<article class="note-row" id="note-{a['slug']}" data-topics="{'|'.join(a['tags'])}" data-year="{a['date'][:4]}"><span class="note-year">{a['date'][:4]}</span><div class="note-copy"><time datetime="{a['date']}">{a['date']}</time><h3><a href="{a['slug']}.html">{a['title']} ↗</a></h3><span class="tag">{' ／ '.join(a['tags'])}</span><details {'open' if i == 0 else ''}><summary>讀一小段</summary><p>{a['excerpt']}</p><a class="text-link" href="{a['slug']}.html">閱讀全文 →</a></details></div><a href="{a['slug']}.html" aria-label="閱讀{a['title']}"><img src="assets/images/{a['cover']}" alt="{a['title']}的配圖" width="175" height="125" loading="lazy"></a></article>''')
    home = home.replace('{{TICKS}}', ''.join(ticks)).replace('{{FILTERS}}', filters).replace('{{ROWS}}', '\n'.join(rows))
    (ROOT / 'index.html').write_text(shell('一邊生活，一邊認識自己', 'Leon 的中文生活手記：關於放下、尋找方向，以及倒數五秒後的開始。', home))


def article_page(a):
    body = a['body']
    headings = []
    def heading(match):
        attrs, text = match.groups()
        found = re.search(r'id="([^"]+)"', attrs)
        anchor = found.group(1) if found else f'section-{len(headings) + 1}'
        headings.append((anchor, re.sub('<[^>]+>', '', text)))
        return f'<h2 id="{anchor}">{text}</h2>'
    body = re.sub(r'<h2([^>]*)>(.*?)</h2>', heading, body, flags=re.S)
    # The original disclosure is retained with a semantic, Chinese control.
    body = body.replace('id="compassToggle">Why this sentence?', 'id="compassToggle" data-disclosure aria-expanded="false" aria-controls="compass-note">為什麼是這句話？')
    body = body.replace('<p class="compass-widget__note">', '<p class="compass-widget__note" id="compass-note" hidden>')
    toc = ''.join(f'<a href="#{anchor}">{text}</a>' for anchor, text in headings)
    related = ''.join(f'<a href="{item["slug"]}.html">{item["title"]} ↗</a>' for item in ARTICLES if item['slug'] != a['slug'])
    main = f'''<main id="main" class="wrap"><header class="article-header fade-in"><a class="eyebrow" href="index.html#notes">← 回到手記收藏</a><h1>{a['title']}</h1><p class="original-title">{a['original_title']}</p><p class="eyebrow"><time datetime="{a['date']}">{a['date']}</time> ／ {'・'.join(a['tags'])}</p></header>
<div class="article-grid"><aside class="article-sidebar"><details open><summary>這篇的段落</summary><nav class="article-toc" aria-label="文章目錄">{toc}</nav></details><div class="reading-tools"><p class="eyebrow">閱讀字級</p><div class="pills" role="group" aria-label="閱讀字級"><button class="pill active" data-size="normal" aria-pressed="true">標準</button><button class="pill" data-size="large" aria-pressed="false">放大</button></div></div></aside><article class="article-body">{body}</article></div><nav class="article-bottom" aria-label="其他手記"><a href="index.html#notes">← 全部手記</a>{related}</nav></main>'''
    (ROOT / f'{a["slug"]}.html').write_text(shell(a['title'], a['excerpt'], main, article=True))


if __name__ == '__main__':
    home_page()
    for article in ARTICLES:
        article_page(article)
    print(f'Built {len(ARTICLES) + 1} static pages; CSS/JS inline; no runtime dependencies.')
