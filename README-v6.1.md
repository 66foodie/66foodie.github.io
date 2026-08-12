# 66-Planet v6.1 — 結構重整說明

視覺版型與 v6 完全一致，僅調整「字級」與「檔案結構」兩件事。

---

## 一、字級全面上調一級

全站字級收斂成一組 token，寫在 `style.css` 的 `:root`：

```css
--fs-4xs  0.55rem      --fs-base 0.86rem      --fs-2xl  1.04rem
--fs-3xs  0.63rem      --fs-md   0.90rem      --fs-3xl  1.10rem
--fs-2xs  0.68rem      --fs-lg   0.94rem      --fs-title 1.15rem ★ 料理標題（不變）
--fs-xs   0.76rem      --fs-xl   0.98rem
--fs-sm   0.82rem
```

- 每個 token 後面都註記 v6 原值，隨時可比對或回退。
- **料理標題 `.card-zh` 維持 1.15rem**，依指示不動。
- 品牌字（Pacifico 的 66-Planet）與章節大標維持原尺寸 —— 它們屬於「顯示字級」，放大會撐破 nowrap。
- **兩個例外**：手機（≤640px）的星球標籤 `.season-tag` 與星等 `.sf/.s` 維持 v6 尺寸。手機兩欄寬度吃緊，放大會讓星等被裁切。

> 想再整體放大或縮小？只改 `:root` 那 12 行，全站跟著走。

---

## 二、插圖抽離為 `illus.svg`

### 結構

```
index.html   1,792 行（原 3,203 行，−44%）
illus.svg    1,882 行  ← 116 則插圖全部住在這裡
style.css      889 行
main.js        233 行  ← 未修改
```

### 卡片端現在只有一行

```html
<div class="food-illus">
  <svg viewBox="0 0 120 90" aria-hidden="true"><use href="illus.svg#i042"></use></svg>
</div>
```

### 插圖端

```svg
<!-- No.042 · 味噌鮭魚 -->
<symbol id="i042" viewBox="0 0 120 90" fill="none">
  ...
</symbol>
```

**編號即 id**：No.042 → `id="i042"`。`illus.svg` 可直接用 VS Code 或 Illustrator 開啟預覽。

- 改插圖 → 搜 `id="i042"`
- 新增插圖 → 複製一段 `<symbol>`，改 id 與註解
- 找第 42 則卡片 → 在 `index.html` 搜 `No.042`（每張卡片上方都有註解標記）

---

## 三、行內色碼全部移除（附帶清掉的技術債）

v6 每張卡片帶著三組硬編碼色碼（`card-visual` 底色、`season-tag`、`ing-tag`）。
v6.1 改由 `data-planet` 驅動的星球色板：

```css
.recipe-card[data-planet="Mars"] { --p-rgb:170,122,106; --p-ink:#7a4030; --p-bg:#ede8e6; }

.card-visual { background: var(--p-bg); }
.season-tag,
.ing-tag     { color: var(--p-ink);
               background: rgba(var(--p-rgb), 0.1);
               border: 1px solid rgba(var(--p-rgb), 0.3); }
```

`index.html` 現在**一個色碼都沒有**。要調整火星的顏色 → 改一行，21 張卡片同時跟著換。
新增一顆星球 → 色板加一行即可。

順帶修掉：42 個 `<circle>` / `<ellipse>` 有重複的 `opacity` 屬性（HTML 容忍、XML 不容忍）。已保留第一個值，渲染結果與 v6 相同。

---

## 四、⚠️ 預覽方式（重要）

外部 SVG sprite 受同源政策限制，**直接雙擊 `index.html`（`file://`）插圖會是空白**。

**本機預覽：**

```bash
cd 66planet-v6.1
python3 -m http.server 8000
# 打開 http://localhost:8000
```

或 VS Code 的 Live Server。

**GitHub Pages 正常運作**，不需要任何額外設定。

---

## 五、驗證紀錄

以 Chromium headless 於 1440 / 390px 實測：

- 116 張卡片全部渲染，`<use>` 正常解析
- 星球篩選、節氣篩選、三種排序、View Recipe 展開、星球誌 popup 全數正常
- Console 零錯誤
- 插圖區像素比對：最大色差 ≤ 21/255，僅出現在圖形邊緣（抗鋸齒），肉眼無差異

---

*66-Planet · UX Cosmos: Vibe Lab*
