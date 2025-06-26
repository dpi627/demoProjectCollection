# 個人作品集網站 - 軟體開發規格書

## 1. 專案概述

### 1.1 專案名稱
個人作品集網站 (Personal Portfolio Website)

### 1.2 專案目標
開發一個單頁HTML的個人作品集網站，用於展示和管理個人專案，主要聚焦於C#開發專案的展示。

### 1.3 專案類型
MVP (Minimum Viable Product) 雛形網站

## 2. 技術規格

### 2.1 前端技術棧
- **HTML5**: 單頁應用架構，語意化標籤
- **CSS3**: 響應式設計，現代化UI，Flexbox/Grid 布局
- **JavaScript (ES6+)**: 互動功能與資料管理
- **Bootstrap 5**: 主要UI框架，提供完整的響應式組件系統
- **Font Awesome Free**: 圖示庫，提供豐富的免費圖示資源

### 2.1.1 設計原則
- **現代化設計**: 採用簡潔、扁平化設計風格
- **響應式網頁設計 (RWD)**: 支援桌面、平板、手機等各種裝置
- **Mobile-First**: 優先考慮行動裝置體驗
- **無障礙設計**: 符合 WCAG 2.1 AA 標準
- **載入效能**: 優化首屏載入時間 < 3秒

### 2.1.2 Bootstrap 5 實作規格
- **版本**: Bootstrap 5.3.x (最新穩定版)
- **引入方式**: CDN 或本地檔案
- **組件使用**:
  - Navigation Bar: 響應式導航選單
  - Card Components: 專案展示卡片
  - Modal: 新增/編輯專案對話框
  - Form Controls: 表單輸入元件
  - Button Groups: 操作按鈕群組
  - Grid System: 12欄響應式網格系統
  - Utilities: 間距、顏色、文字等工具類別

### 2.1.3 Font Awesome Free 實作規格
- **版本**: Font Awesome 6.x Free
- **引入方式**: CDN (推薦) 或本地檔案
- **使用圖示**:
  - `fas fa-code`: 程式開發
  - `fas fa-desktop`: 桌面應用程式
  - `fas fa-globe`: 網頁應用程式
  - `fas fa-terminal`: 控制台應用程式
  - `fas fa-github`: GitHub 連結
  - `fas fa-download`: 下載連結
  - `fas fa-external-link-alt`: 外部連結
  - `fas fa-edit`: 編輯功能
  - `fas fa-trash`: 刪除功能
  - `fas fa-plus`: 新增功能
  - `fas fa-search`: 搜尋功能
  - `fas fa-filter`: 篩選功能

### 2.1.4 響應式設計規格
- **斷點設定** (Bootstrap 5 標準):
  - Extra small (xs): < 576px (手機直向)
  - Small (sm): ≥ 576px (手機橫向)
  - Medium (md): ≥ 768px (平板)
  - Large (lg): ≥ 992px (小型桌面)
  - Extra large (xl): ≥ 1200px (大型桌面)
  - Extra extra large (xxl): ≥ 1400px (超大桌面)

- **專案卡片響應式布局**:
  - xs: 1 欄 (col-12)
  - sm: 1 欄 (col-sm-12)
  - md: 2 欄 (col-md-6)
  - lg: 3 欄 (col-lg-4)
  - xl: 4 欄 (col-xl-3)

### 2.2 資料存儲
- **初期**: 前端本地存儲 (localStorage/sessionStorage)
- **未來擴展**: RESTful API 後端整合

### 2.3 瀏覽器相容性
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 3. 功能需求

### 3.1 核心功能

#### 3.1.1 專案展示區
- 網格式或卡片式專案列表
- 專案縮圖/截圖展示
- 專案基本資訊預覽
- 快速篩選與搜尋功能

#### 3.1.2 專案詳細資訊
每個專案包含以下資訊：
- **專案名稱** (必填)
- **開發框架** (如 .NET Framework, .NET Core, WPF, WinForms, ASP.NET Core)
- **專案類型** (WEB, DESKTOP, CONSOLE)
- **Repository URL** (GitHub/GitLab 連結)
- **線上網址** 或 **下載連結**
- **專案截圖** (支援多張圖片)
- **開發紀錄/說明**
- **技術標籤** (C#, SQL Server, Entity Framework 等)
- **開發時間**
- **專案狀態** (開發中, 已完成, 維護中)

#### 3.1.3 專案管理功能
- **新增專案**: 表單式資料輸入
- **編輯專案**: 修改現有專案資訊
- **刪除專案**: 移除專案記錄
- **專案排序**: 依日期、名稱、類型排序
- **專案篩選**: 依框架、類型、狀態篩選

### 3.2 輔助功能

#### 3.2.1 個人資訊區
- 個人簡介
- 技能清單
- 聯絡資訊
- 社群媒體連結

#### 3.2.2 互動功能
- 響應式導航選單
- 平滑滾動效果
- 圖片燈箱展示
- 表單驗證
- 成功/錯誤訊息提示

#### 3.2.3 現代化UI/UX 功能
- **深色/淺色主題切換**: 使用 Bootstrap 的主題系統
- **平滑滾動**: CSS scroll-behavior 與 JavaScript 增強
- **載入動畫**: Spinner 與 Skeleton Screen
- **懸停效果**: Card hover 動畫與按鈕互動效果
- **Toast 通知**: 操作成功/失敗的即時回饋
- **Progress Bar**: 表單送出與資料載入進度顯示
- **Tooltip**: 按鈕與連結的說明提示
- **Badge**: 專案狀態與技術標籤顯示

## 4. 使用者介面設計

### 4.0 現代化設計風格指南

#### 4.0.1 色彩配置
- **主色調**: Bootstrap Primary (#0d6efd) 
- **次要色調**: Bootstrap Secondary (#6c757d)
- **成功色**: Bootstrap Success (#198754)
- **警告色**: Bootstrap Warning (#ffc107)
- **危險色**: Bootstrap Danger (#dc3545)
- **背景色**: 淺色模式 (#ffffff), 深色模式 (#212529)

#### 4.0.2 字體系統
- **主要字體**: Bootstrap 預設字體堆疊
- **程式碼字體**: 'Courier New', monospace
- **標題**: 使用 Bootstrap Typography 類別 (h1-h6)
- **內文**: 使用 Bootstrap 的 .lead, .text-muted 等工具類別

#### 4.0.3 圓角與陰影
- **按鈕圓角**: Bootstrap 預設 (0.375rem)
- **卡片圓角**: Bootstrap 預設 (0.5rem)
- **陰影效果**: 使用 Bootstrap Shadow utilities (.shadow, .shadow-sm, .shadow-lg)

#### 4.0.4 動畫效果
- **過渡時間**: 0.3s 標準，0.15s 快速
- **緩動函數**: ease-in-out
- **懸停變換**: transform: translateY(-5px)
- **按鈕按下**: transform: scale(0.98)

### 4.1 頁面結構
```
┌─────────────────────────────────────┐
│           Header (導航列)            │
├─────────────────────────────────────┤
│         Hero Section (個人介紹)       │
├─────────────────────────────────────┤
│        Projects Section (專案展示)    │
├─────────────────────────────────────┤
│         Skills Section (技能)        │
├─────────────────────────────────────┤
│        Contact Section (聯絡)        │
├─────────────────────────────────────┤
│           Footer (頁尾)             │
└─────────────────────────────────────┘
```

### 4.2 專案卡片設計 (Bootstrap Card Component)
```
┌─────────────────────────────┐
│       專案截圖縮圖           │ ← .card-img-top
├─────────────────────────────┤
│   專案名稱                   │ ← .card-title
│   開發框架 | 專案類型         │ ← .card-subtitle
│   [技能標籤1] [技能標籤2]     │ ← .badge 組件
│   ┌─────┐ ┌─────┐ ┌─────┐   │
│   │檢視 │ │下載 │ │編輯 │   │ ← .btn-group
│   └─────┘ └─────┘ └─────┘   │
└─────────────────────────────┘
```

**Bootstrap 類別應用**:
- 卡片容器: `.card .h-100 .shadow-sm`
- 圖片: `.card-img-top .object-fit-cover`
- 內容區: `.card-body .d-flex .flex-column`
- 標題: `.card-title .h5 .mb-2`
- 副標題: `.card-subtitle .text-muted .small`
- 技能標籤: `.badge .bg-primary .me-1`
- 按鈕群組: `.btn-group .mt-auto`
- 按鈕: `.btn .btn-sm .btn-outline-primary`

### 4.3 新增/編輯專案表單
- 模態對話框 (Modal) 設計
- 表單分組：基本資訊、技術資訊、連結資訊、媒體資訊
- 即時表單驗證
- 圖片上傳預覽功能

### 4.4 響應式導航列設計
- **Bootstrap Navbar Component**: `.navbar .navbar-expand-lg .navbar-light .bg-light`
- **品牌標誌**: `.navbar-brand` 含個人Logo或名稱
- **漢堡選單**: `.navbar-toggler` 在小螢幕顯示
- **導航連結**: `.nav-link` 平滑滾動到對應區塊
- **主題切換**: 導航列右側的深色/淺色切換按鈕

### 4.5 Hero Section 設計
- **全寬橫幅**: `.container-fluid` 或 `.hero-section`
- **垂直置中**: `.d-flex .align-items-center .min-vh-100`
- **背景**: 漸層背景或Hero圖片
- **內容**: 個人照片 + 標題 + 描述 + CTA按鈕
- **動畫**: Fade in 進場效果

### 4.6 響應式網格系統
- **Container**: `.container-xxl` 提供最大寬度限制
- **Row**: `.row .g-4` 設定卡片間距
- **Columns**: 使用 Bootstrap Grid 響應式欄位
  ```html
  <div class="col-12 col-md-6 col-lg-4 col-xl-3">
    <!-- 專案卡片 -->
  </div>
  ```

## 5. 資料結構

### 5.1 專案資料模型
```javascript
const ProjectModel = {
  id: String,              // 唯一識別碼
  name: String,            // 專案名稱 (必填)
  description: String,     // 專案描述
  framework: String,       // 開發框架
  projectType: String,     // 專案類型 (WEB/DESKTOP/CONSOLE)
  repositoryUrl: String,   // Repository URL
  websiteUrl: String,      // 網站URL (可選)
  downloadUrl: String,     // 下載URL (可選)
  screenshots: Array,      // 截圖URLs
  technologies: Array,     // 技術標籤
  developmentLog: String,  // 開發紀錄
  startDate: Date,         // 開始日期
  endDate: Date,           // 結束日期 (可選)
  status: String,          // 狀態 (開發中/已完成/維護中)
  featured: Boolean,       // 是否為精選專案
  createdAt: Date,         // 建立時間
  updatedAt: Date          // 更新時間
}
```

### 5.2 資料存儲方案

#### 5.2.1 初期方案 (localStorage)
```javascript
// 存儲格式
{
  "portfolioData": {
    "projects": [ProjectModel, ...],
    "profile": {
      "name": String,
      "title": String,
      "bio": String,
      "skills": Array,
      "contact": Object
    }
  }
}
```

#### 5.2.2 未來擴展 (API 整合)
- RESTful API 端點規劃
- 認證機制 (JWT)
- 檔案上傳服務整合

## 6. 開發階段

### 6.1 Phase 1: 基礎建設 (第1-2週)
- [ ] HTML5 語意化標籤骨架建構
- [ ] Bootstrap 5 CDN 整合與基礎設定
- [ ] Font Awesome Free CDN 整合
- [ ] 響應式網格系統實作
- [ ] 現代化 CSS 變數與主題色彩定義
- [ ] 基本 JavaScript ES6+ 架構建立
- [ ] 深色/淺色主題切換功能

### 6.2 Phase 2: 資料展示 (第3-4週)
- [ ] Bootstrap Card 組件專案卡片實作
- [ ] 響應式導航列 (Navbar) 實作
- [ ] Hero Section 設計與動畫效果
- [ ] 靜態專案資料展示
- [ ] Font Awesome 圖示整合
- [ ] 篩選與搜尋功能 (Bootstrap Form Controls)
- [ ] 圖片燈箱功能 (Bootstrap Modal)

### 6.3 Phase 3: 資料管理 (第5-6週)
- [ ] Bootstrap Modal 新增專案表單
- [ ] 表單驗證 (Bootstrap Validation)
- [ ] 編輯專案功能
- [ ] 刪除確認對話框
- [ ] localStorage 資料持久化
- [ ] Toast 通知系統實作

### 6.4 Phase 4: 優化與測試 (第7-8週)
- [ ] RWD 各裝置斷點測試
- [ ] Bootstrap 組件無障礙性檢查
- [ ] 現代化動畫效果優化
- [ ] 跨瀏覽器兼容性測試
- [ ] 行動裝置使用者體驗測試
- [ ] 載入效能與圖片最佳化

## 7. 檔案結構

```
portfolio-website/
├── index.html              # 主頁面 (包含所有 Bootstrap 與 FontAwesome CDN)
├── css/
│   ├── style.css          # 主要自訂樣式
│   ├── theme.css          # 深色/淺色主題樣式
│   └── animations.css     # 現代化動畫效果
├── js/
│   ├── main.js           # 主要邏輯與 Bootstrap 初始化
│   ├── data-manager.js   # 資料管理 (localStorage)
│   ├── theme-switcher.js # 主題切換功能
│   └── utils.js          # 工具函數
├── assets/
│   ├── images/           # 個人照片與網站圖片
│   ├── screenshots/      # 專案截圖
│   └── icons/            # 自訂圖示 (補充 FontAwesome)
├── lib/                  # 備用本地檔案 (離線使用)
│   ├── bootstrap/        # Bootstrap 5 本地檔案
│   └── fontawesome/      # Font Awesome 本地檔案
└── README.md            # 專案說明與部署指南
```

## 8. 測試計畫

### 8.1 功能測試
- 專案 CRUD 操作測試
- 表單驗證測試
- 搜尋篩選功能測試
- 資料持久化測試

### 8.2 使用者介面測試
- 響應式設計測試
- 跨瀏覽器兼容性測試
- 使用者互動測試
- 無障礙設計測試

### 8.3 效能測試
- 頁面載入速度測試
- 圖片最佳化測試
- JavaScript 效能測試

## 9. 部署與維護

### 9.1 部署方案
- **靜態網站託管**: GitHub Pages, Netlify, Vercel
- **CDN 整合**: 圖片與資源最佳化
- **域名設定**: 自訂域名配置

### 9.2 維護計畫
- 定期資料備份
- 功能更新與擴展
- 效能監控與優化
- 安全性檢查

## 10. 風險評估與對策

### 10.1 技術風險
- **瀏覽器兼容性問題**
  - 對策: 使用 Polyfill 與漸進增強
- **資料遺失風險**
  - 對策: 定期匯出備份功能

### 10.2 使用者體驗風險
- **響應式設計問題**
  - 對策: 多裝置測試
- **載入速度過慢**
  - 對策: 圖片最佳化與延遲載入

## 11. 未來擴展計畫

### 11.1 短期目標 (3-6個月)
- 整合後端 API
- 使用者認證系統
- 多媒體支援 (影片、音檔)
- SEO 最佳化

### 11.2 長期目標 (6-12個月)
- 多語言支援
- 主題切換功能
- 進階統計分析
- 社群分享功能

## 12. 結論

本規格書定義了一個現代化的個人作品集網站開發計畫，專注於展示 C# 開發專案。透過分階段開發，從 MVP 雛形開始，逐步擴展功能，最終建立一個功能完整的專案展示平台。

此規格書將作為開發團隊的指導文件，確保專案按時按質完成，並為未來的功能擴展提供清晰的路徑。
