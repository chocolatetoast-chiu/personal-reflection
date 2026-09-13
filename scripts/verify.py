"""Verify preserved text, images, internal links and HTML contracts."""
from pathlib import Path
from html import unescape
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import hashlib
import json
import re

ROOT = Path(__file__).resolve().parents[1]

def normalized(text):
    text = text.replace('為什麼是這句話？', 'Why this sentence?')
    return re.sub(r'\s+', '', unescape(re.sub(r'<[^>]*>', '', text)))

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links = [], []
        self.feed(text)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for attr in ('href', 'src'):
            if attr in attrs:
                self.links.append(attrs[attr])

if __name__ == '__main__':
    articles = json.loads((ROOT / 'content/articles.json').read_text())
    provenance = json.loads((ROOT / 'content/provenance.json').read_text())
    pages = {p.name: (p.read_text(), Page(p.read_text())) for p in ROOT.glob('*.html')}
    for name, (text, page) in pages.items():
        assert len(page.ids) == len(set(page.ids)), f'Duplicate ID: {name}'
        assert 'lang="zh-Hant"' in text
        assert 'derived_from:' in text and 'prefers-reduced-motion' in text
        assert '<details' in text and '<nav' in text and 'class="pill' in text
        assert '<script src=' not in text and 'rel="stylesheet"' not in text
        for key in ('bg', 'surface', 'border', 'text', 'muted', 'accent', 'good', 'warn', 'bad'):
            assert f'--{key}:' in text
        for href in page.links:
            parsed = urlsplit(href)
            if parsed.scheme or parsed.netloc:
                continue
            target = ROOT / unquote(parsed.path) if parsed.path else ROOT / name
            assert target.exists(), f'Missing target: {name} -> {href}'
            if parsed.fragment and target.suffix == '.html':
                assert unquote(parsed.fragment) in pages[target.name][1].ids, f'Missing anchor: {href}'
    home = pages['index.html'][0]
    assert "LEON'S NOTES" in home and "FIELD NOTES" not in home
    assert '倒數五秒' not in home and '五秒練習' not in home
    assert '讀一小段' not in home
    assert {tag for a in articles for tag in a['tags']} == {'回顧', '自我探索', '拖延與行動'}
    for name, (text, page) in pages.items():
        assert 'neoleon.in' not in text and 'https://neoleon.dev/' in text
        assert '<p class="original-title">' not in text
    quotes = json.loads((ROOT / 'content/quotes.json').read_text())
    assert len(quotes) >= 3
    for quote in quotes:
        assert quote['text'] in home and quote['author'] in home
        assert quote['url'].startswith('https://')
    assert articles[0]['title'] == '那是他們在乎的事情'
    for a, source in zip(articles, provenance['articles']):
        body = re.search(r'<article class="article-body">(.*?)</article>', pages[a['slug'] + '.html'][0], re.S).group(1)
        assert normalized(body) == normalized(a['body']), a['slug']
        assert hashlib.sha256(normalized(body).encode()).hexdigest() == source['body_text_sha256'], a['slug']
    for image in provenance['images']:
        assert hashlib.sha256((ROOT / image['path']).read_bytes()).hexdigest() == image['sha256'], image['path']
    print(f'PASS: {len(pages)} pages; {len(articles)} source-matched full texts; {len(provenance["images"])} original images.')
    print('PASS: internal links/anchors, unique IDs, Chinese metadata, inline CSS/JS, interaction hooks.')
