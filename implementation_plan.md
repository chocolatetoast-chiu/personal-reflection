# Personal Reflection

## Goal / Scope
從 leon-portfolio 提取全部 reflection，建立繁體中文獨立互動靜態網站，同步 personal-reflection GitHub repository 與 Pages。原網站唯讀。

## Constraints
- 三篇正文、日期、圖說與圖片完整保留；中文標題與導覽，新增簡介僅依原站。
- 配色參考 Kiln & Ash；無 CDN、無後端，CSS/JS 編譯內嵌。
- 不複製原站 CNAME、履歷檔或無關研究內容；只發布本網站。

## Atomic Todo
- [x] 盤點三篇 reflection 與基本介绍來源。
- [x] 提取原文、圖片及來源清單。
- [x] 建立首頁、文章頁與互動元件。
- [x] 原文比對、連結檢查、750/1200px 與手機瀏覽器驗證；獨立 code review。
- [x] 同步 GitHub，啟用 Pages 並核對上線結果。

## Design
暖米 #e8e4d8、炭黑 #302d27、陶土橘 #a34825；中文襯線標題、等寬日期。以真實照片搭配北極星刻度圖，提供主題／年份篩選、摘要摺疊、文章目錄、閱讀進度與五秒倒數。

## Verification（2026-09-13）
- `python3 scripts/verify.py`：4 pages / 3 source-matched full texts / 9 original images PASS。
- HTML §F：四類互動 PASS；共用 variables／無 CDN PASS；穩定 ID PASS；最新摘要與文章目錄預設展開 PASS；750／1200px RWD PASS（另測 390px 手機）；footer derived_from PASS。
- Browser：主題＋年份篩選、零結果、摘要展開、北極星提醒、倒數完成／重設、字級與目錄跳轉 PASS。已修正 750px 標題不自然換行。
- 獨立 code-reviewer：無 blocking finding；三篇 generated 正文對 JSON 一致、內部連結及 anchors 完整。主代理另比對原站全文 SHA-256。
- 文章正文保留當年的敘述，不改成當前研究或健康建議。

## Publishing
已同步公開 repository [personal-reflection](https://github.com/chocolatetoast-chiu/personal-reflection)，網站版本 `e016419`。

公開網站：[Leon 的生活手記](https://chocolatetoast-chiu.github.io/personal-reflection/)。Pages 使用 `main` 根目錄，HTTPS 開啟。四頁皆 HTTP 200，逐頁 SHA-256 與本機完全一致。

## Gotchas
- 原始圖片共約 30 MB；預設 HTTP chunked push 曾回報 400。單次使用 `git -c http.postBuffer=52428800 push` 成功；未改全域 Git 設定。
- 無執行期依賴；離線開啟仍可閱讀與互動，外部研究網站／Email 連結需網路。
