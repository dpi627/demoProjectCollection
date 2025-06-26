/* ==========================================================================
   個人作品集網站 - 主題切換檔案
   ========================================================================== */

/**
 * 主題切換管理器
 * 負責深色/淺色主題的切換和管理
 */
class ThemeSwitcher {
    constructor() {
        this.currentTheme = 'light';
        this.storageKey = 'portfolioTheme';
        this.themeToggleBtn = null;
        this.themeIcon = null;
        
        this.init();
    }
    
    /**
     * 初始化主題切換器
     */
    init() {
        this.bindElements();
        this.loadSavedTheme();
        this.detectSystemTheme();
        this.bindEvents();
        this.updateUI();
        
        console.log('主題切換器初始化完成，當前主題:', this.currentTheme);
    }
    
    /**
     * 綁定 DOM 元素
     */
    bindElements() {
        this.themeToggleBtn = Utils.DOM.getElement('#themeToggle');
        this.themeIcon = Utils.DOM.getElement('#themeIcon');
        
        if (!this.themeToggleBtn) {
            console.warn('找不到主題切換按鈕');
        }
        
        if (!this.themeIcon) {
            console.warn('找不到主題圖示');
        }
    }
    
    /**
     * 載入已儲存的主題偏好
     */
    loadSavedTheme() {
        const savedTheme = Utils.Storage.get(this.storageKey);
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
            this.currentTheme = savedTheme;
        }
    }
    
    /**
     * 偵測系統主題偏好
     */
    detectSystemTheme() {
        // 如果沒有儲存的主題偏好，則使用系統偏好
        if (!Utils.Storage.get(this.storageKey)) {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.currentTheme = 'dark';
            } else {
                this.currentTheme = 'light';
            }
        }
        
        // 監聽系統主題變更
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                // 只有在沒有手動設定主題時，才跟隨系統主題
                if (!Utils.Storage.get(this.storageKey)) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                    this.updateUI();
                }
            });
        }
    }
    
    /**
     * 綁定事件監聽器
     */
    bindEvents() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
            
            // 鍵盤支援
            this.themeToggleBtn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
        
        // 支援鍵盤快捷鍵 (Ctrl/Cmd + Shift + D)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    /**
     * 切換主題
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.saveTheme();
        this.updateUI();
        
        // 觸發主題切換事件
        this.dispatchThemeChangeEvent();
        
        console.log('主題已切換為:', this.currentTheme);
    }
    
    /**
     * 設定指定主題
     * @param {string} theme - 主題名稱 ('light' 或 'dark')
     */
    setTheme(theme) {
        if (theme !== 'light' && theme !== 'dark') {
            console.warn('無效的主題名稱:', theme);
            return;
        }
        
        if (this.currentTheme !== theme) {
            this.currentTheme = theme;
            this.applyTheme();
            this.saveTheme();
            this.updateUI();
            this.dispatchThemeChangeEvent();
        }
    }
    
    /**
     * 應用主題到頁面
     */
    applyTheme() {
        const html = document.documentElement;
        
        // 添加過渡類別以實現平滑切換
        document.body.classList.add('theme-transition');
        
        if (this.currentTheme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-theme');
        } else {
            html.removeAttribute('data-theme');
            document.body.classList.remove('dark-theme');
        }
        
        // 移除過渡類別
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 300);
        
        // 更新 meta 標籤以支援行動裝置狀態列
        this.updateMetaThemeColor();
    }
    
    /**
     * 更新 meta 主題色彩標籤
     */
    updateMetaThemeColor() {
        let metaThemeColor = Utils.DOM.getElement('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = Utils.DOM.createElement('meta', {
                name: 'theme-color'
            });
            document.head.appendChild(metaThemeColor);
        }
        
        const color = this.currentTheme === 'dark' ? '#212529' : '#ffffff';
        metaThemeColor.setAttribute('content', color);
    }
    
    /**
     * 儲存主題偏好
     */
    saveTheme() {
        Utils.Storage.set(this.storageKey, this.currentTheme);
    }
    
    /**
     * 更新 UI 元素
     */
    updateUI() {
        if (this.themeIcon) {
            // 更新圖示
            if (this.currentTheme === 'dark') {
                this.themeIcon.className = 'fas fa-sun';
                this.themeIcon.title = '切換到淺色主題';
            } else {
                this.themeIcon.className = 'fas fa-moon';
                this.themeIcon.title = '切換到深色主題';
            }
        }
        
        if (this.themeToggleBtn) {
            // 更新按鈕標題
            const title = this.currentTheme === 'dark' ? 
                '切換到淺色主題' : '切換到深色主題';
            this.themeToggleBtn.setAttribute('title', title);
            this.themeToggleBtn.setAttribute('aria-label', title);
        }
        
        // 更新其他可能需要主題感知的元素
        this.updateThemeAwareElements();
    }
    
    /**
     * 更新主題感知元素
     */
    updateThemeAwareElements() {
        // 更新導航列
        const navbar = Utils.DOM.getElement('.navbar');
        if (navbar) {
            if (this.currentTheme === 'dark') {
                navbar.classList.remove('navbar-light', 'bg-light');
                navbar.classList.add('navbar-dark');
            } else {
                navbar.classList.remove('navbar-dark');
                navbar.classList.add('navbar-light', 'bg-light');
            }
        }
        
        // 更新技能區背景
        const skillsSection = Utils.DOM.getElement('#skills');
        if (skillsSection) {
            if (this.currentTheme === 'dark') {
                skillsSection.classList.remove('bg-light');
            } else {
                skillsSection.classList.add('bg-light');
            }
        }
        
        // 更新頁尾
        const footer = Utils.DOM.getElement('footer');
        if (footer) {
            if (this.currentTheme === 'dark') {
                footer.classList.remove('bg-dark', 'text-light');
            } else {
                footer.classList.add('bg-dark', 'text-light');
            }
        }
    }
    
    /**
     * 觸發主題切換事件
     */
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                timestamp: new Date().toISOString()
            }
        });
        
        document.dispatchEvent(event);
    }
    
    /**
     * 取得當前主題
     * @returns {string} 當前主題名稱
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
    
    /**
     * 檢查是否為深色主題
     * @returns {boolean} 是否為深色主題
     */
    isDarkTheme() {
        return this.currentTheme === 'dark';
    }
    
    /**
     * 檢查是否為淺色主題
     * @returns {boolean} 是否為淺色主題
     */
    isLightTheme() {
        return this.currentTheme === 'light';
    }
    
    /**
     * 重設主題為系統預設
     */
    resetToSystemTheme() {
        Utils.Storage.remove(this.storageKey);
        
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.currentTheme = 'dark';
        } else {
            this.currentTheme = 'light';
        }
        
        this.applyTheme();
        this.updateUI();
        this.dispatchThemeChangeEvent();
    }
    
    /**
     * 取得主題統計資訊
     * @returns {Object} 主題使用統計
     */
    getThemeStats() {
        const stats = Utils.Storage.get('themeStats', {
            switches: 0,
            totalTime: 0,
            lastSwitch: null
        });
        
        return stats;
    }
    
    /**
     * 記錄主題切換統計
     */
    recordThemeSwitch() {
        const stats = this.getThemeStats();
        stats.switches += 1;
        stats.lastSwitch = new Date().toISOString();
        
        Utils.Storage.set('themeStats', stats);
    }
    
    /**
     * 銷毀主題切換器
     */
    destroy() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.removeEventListener('click', this.toggleTheme);
            this.themeToggleBtn.removeEventListener('keydown', this.toggleTheme);
        }
        
        document.removeEventListener('keydown', this.toggleTheme);
        
        // 移除主題相關的類別和屬性
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-theme', 'theme-transition');
        
        console.log('主題切換器已銷毀');
    }
}

/**
 * 主題切換器工具函數
 */
const ThemeUtils = {
    /**
     * 取得對比色彩
     * @param {string} theme - 主題名稱
     * @returns {Object} 色彩物件
     */
    getContrastColors(theme) {
        if (theme === 'dark') {
            return {
                background: '#212529',
                text: '#f8f9fa',
                secondary: '#adb5bd',
                border: '#495057'
            };
        } else {
            return {
                background: '#ffffff',
                text: '#212529',
                secondary: '#6c757d',
                border: '#dee2e6'
            };
        }
    },
    
    /**
     * 檢查是否支援深色主題
     * @returns {boolean} 是否支援
     */
    supportsDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches !== undefined;
    },
    
    /**
     * 取得系統主題偏好
     * @returns {string} 系統主題偏好
     */
    getSystemTheme() {
        if (this.supportsDarkMode()) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }
};

// 建立全域主題切換器實例
window.themeSwitcher = new ThemeSwitcher();
window.ThemeUtils = ThemeUtils;

// 監聽主題切換事件
document.addEventListener('themeChanged', (e) => {
    console.log('主題已切換:', e.detail);
});
