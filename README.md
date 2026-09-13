# Leon 的生活手記

繁體中文的個人 reflection 網站。暖米色、陶土橘與紙張質感，收錄三篇完整文章、九張原始配圖及簡短個人介紹。

## 閱讀

首頁為 `index.html`，可直接開啟，或在此目錄執行 `python3 -m http.server 8765`。所有頁面的 CSS 與 JavaScript 均內嵌，圖片存於本地，無 CDN／分析追蹤／外部執行依賴。

## 內容與重建

- `content/articles.json`：全文、標題、日期與分類的內容來源。
- `content/provenance.json`：原網站來源位置、SHA-256 與配圖清單。
- `src/`：首頁模板、樣式、互動與 SecondBrain motion primitives 快照。
- `scripts/build.py`：以 Python 標準函式庫生成四個靜態頁面。執行 `python3 scripts/build.py`，將生成結果一同提交。
- `scripts/verify.py`：完整性及內部連結檢查，執行 `python3 scripts/verify.py`。

新增文章時維護 `content/articles.json`，並更新首頁的分類、年份與最新文章區塊，再執行重建與驗證。

## 提取範圍

| 原文章 | 中文顯示標題 | 日期 |
| --- | --- | --- |
| Countdown from Five | 倒數五秒 | 2026-08-16 |
| Finding My North Star | 找到我的北極星 | 2025-01-04 |
| The Year I Learned to Let Go | 學會放下的那一年 | 2024-12-29 |

全文、原有圖說及圖片完整保留；英文導覽改為中文，新增原文沒有的章節錨點。原文中的人類圖、情緒與生活經驗依作者當時的敘述保留。基本介紹依原站 `about.html` 與 `assets/js/about-page.js` 翻譯節錄。原網站不刪改，不複製原有網域 CNAME。

來源：[leon-portfolio](https://github.com/chocolatetoast-chiu/leon-portfolio)。視覺參考：[Kiln & Ash](https://langalu.github.io/creative-web-showcase/04-kiln-ash/)。

## GitHub Pages

使用獨立的 `personal-reflection` repository，Pages 設定為從 `main` 分支的根目錄發布。`.nojekyll` 保持純靜態檔案部署。

文章與個人照片歸原作者所有，照片原有署名保留；本次未新增開源授權。
