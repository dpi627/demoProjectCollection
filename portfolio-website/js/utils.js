/* ==========================================================================
   個人作品集網站 - 工具函數檔案
   ========================================================================== */

/**
 * 工具函數集合
 * 提供專案中常用的輔助函數
 */
const Utils = {
    
    /**
     * DOM 操作工具
     */
    DOM: {
        /**
         * 安全地獲取 DOM 元素
         * @param {string} selector - CSS 選擇器
         * @param {Element} parent - 父元素 (可選)
         * @returns {Element|null} DOM 元素
         */
        getElement(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                console.warn(`無法找到元素: ${selector}`, error);
                return null;
            }
        },
        
        /**
         * 安全地獲取多個 DOM 元素
         * @param {string} selector - CSS 選擇器
         * @param {Element} parent - 父元素 (可選)
         * @returns {NodeList} DOM 元素列表
         */
        getElements(selector, parent = document) {
            try {
                return parent.querySelectorAll(selector);
            } catch (error) {
                console.warn(`無法找到元素: ${selector}`, error);
                return [];
            }
        },
        
        /**
         * 建立新的 DOM 元素
         * @param {string} tag - 標籤名稱
         * @param {Object} attributes - 屬性物件
         * @param {string} content - 內容
         * @returns {Element} 新建立的元素
         */
        createElement(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            // 設定屬性
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            
            // 設定內容
            if (content && !attributes.innerHTML) {
                element.textContent = content;
            }
            
            return element;
        },
        
        /**
         * 顯示元素
         * @param {Element} element - 要顯示的元素
         * @param {string} display - 顯示類型 (預設: 'block')
         */
        show(element, display = 'block') {
            if (element) {
                element.style.display = display;
            }
        },
        
        /**
         * 隱藏元素
         * @param {Element} element - 要隱藏的元素
         */
        hide(element) {
            if (element) {
                element.style.display = 'none';
            }
        },
        
        /**
         * 切換元素顯示狀態
         * @param {Element} element - 要切換的元素
         * @param {string} display - 顯示類型 (預設: 'block')
         */
        toggle(element, display = 'block') {
            if (element) {
                element.style.display = element.style.display === 'none' ? display : 'none';
            }
        }
    },
    
    /**
     * 資料驗證工具
     */
    Validation: {
        /**
         * 驗證是否為空值
         * @param {any} value - 要檢查的值
         * @returns {boolean} 是否為空
         */
        isEmpty(value) {
            return value === null || value === undefined || value === '' || 
                   (typeof value === 'string' && value.trim() === '');
        },
        
        /**
         * 驗證電子郵件格式
         * @param {string} email - 電子郵件地址
         * @returns {boolean} 是否為有效格式
         */
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        
        /**
         * 驗證 URL 格式
         * @param {string} url - URL 地址
         * @returns {boolean} 是否為有效格式
         */
        isValidUrl(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        },
        
        /**
         * 驗證日期格式
         * @param {string} date - 日期字串
         * @returns {boolean} 是否為有效日期
         */
        isValidDate(date) {
            const parsedDate = new Date(date);
            return !isNaN(parsedDate.getTime());
        },
        
        /**
         * 驗證必填欄位
         * @param {Object} data - 要驗證的資料物件
         * @param {Array} requiredFields - 必填欄位陣列
         * @returns {Object} 驗證結果
         */
        validateRequired(data, requiredFields) {
            const errors = [];
            
            requiredFields.forEach(field => {
                if (this.isEmpty(data[field])) {
                    errors.push(`${field} 為必填欄位`);
                }
            });
            
            return {
                isValid: errors.length === 0,
                errors: errors
            };
        }
    },
    
    /**
     * 格式化工具
     */
    Format: {
        /**
         * 格式化日期
         * @param {Date|string} date - 日期
         * @param {string} format - 格式 ('YYYY-MM-DD', 'YYYY/MM/DD', 'full')
         * @returns {string} 格式化後的日期字串
         */
        date(date, format = 'YYYY-MM-DD') {
            if (!date) return '';
            
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            
            switch (format) {
                case 'YYYY-MM-DD':
                    return `${year}-${month}-${day}`;
                case 'YYYY/MM/DD':
                    return `${year}/${month}/${day}`;
                case 'DD/MM/YYYY':
                    return `${day}/${month}/${year}`;
                case 'full':
                    return d.toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                default:
                    return `${year}-${month}-${day}`;
            }
        },
        
        /**
         * 截斷文字
         * @param {string} text - 原始文字
         * @param {number} maxLength - 最大長度
         * @param {string} suffix - 後綴 (預設: '...')
         * @returns {string} 截斷後的文字
         */
        truncateText(text, maxLength, suffix = '...') {
            if (!text || text.length <= maxLength) return text || '';
            return text.substring(0, maxLength - suffix.length) + suffix;
        },
        
        /**
         * 將陣列轉換為字串
         * @param {Array} array - 陣列
         * @param {string} separator - 分隔符號 (預設: ', ')
         * @returns {string} 字串
         */
        arrayToString(array, separator = ', ') {
            if (!Array.isArray(array)) return '';
            return array.filter(item => item).join(separator);
        },
        
        /**
         * 將字串轉換為陣列
         * @param {string} str - 字串
         * @param {string} separator - 分隔符號 (預設: ',')
         * @returns {Array} 陣列
         */
        stringToArray(str, separator = ',') {
            if (!str) return [];
            return str.split(separator)
                     .map(item => item.trim())
                     .filter(item => item !== '');
        },
        
        /**
         * 首字母大寫
         * @param {string} str - 字串
         * @returns {string} 首字母大寫的字串
         */
        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
    },
    
    /**
     * 專案工具
     */
    Project: {
        /**
         * 取得專案類型圖示
         * @param {string} type - 專案類型
         * @returns {string} Font Awesome 圖示類別
         */
        getTypeIcon(type) {
            const iconMap = {
                'WEB': 'fas fa-globe',
                'DESKTOP': 'fas fa-desktop',
                'CONSOLE': 'fas fa-terminal'
            };
            return iconMap[type] || 'fas fa-code';
        },
        
        /**
         * 取得專案狀態徽章類別
         * @param {string} status - 專案狀態
         * @returns {string} Bootstrap 徽章類別
         */
        getStatusBadgeClass(status) {
            const classMap = {
                '開發中': 'bg-warning text-dark',
                '已完成': 'bg-success',
                '維護中': 'bg-info'
            };
            return classMap[status] || 'bg-secondary';
        },
        
        /**
         * 生成專案 ID
         * @returns {string} 唯一 ID
         */
        generateId() {
            return 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        },
        
        /**
         * 取得預設專案圖片
         * @param {string} type - 專案類型
         * @returns {string} 圖片 URL
         */
        getDefaultImage(type) {
            const imageMap = {
                'WEB': 'https://via.placeholder.com/300x200/0d6efd/ffffff?text=WEB+專案',
                'DESKTOP': 'https://via.placeholder.com/300x200/198754/ffffff?text=桌面+應用程式',
                'CONSOLE': 'https://via.placeholder.com/300x200/6c757d/ffffff?text=控制台+應用程式'
            };
            return imageMap[type] || 'https://via.placeholder.com/300x200/6c757d/ffffff?text=專案+預覽';
        }
    },
    
    /**
     * 動畫工具
     */
    Animation: {
        /**
         * 平滑滾動到指定元素
         * @param {string|Element} target - 目標元素或選擇器
         * @param {number} offset - 偏移量 (預設: 80px，避開固定導航列)
         */
        scrollTo(target, offset = 80) {
            const element = typeof target === 'string' ? 
                Utils.DOM.getElement(target) : target;
            
            if (element) {
                const targetPosition = element.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        },
        
        /**
         * 添加進場動畫
         * @param {Element} element - 目標元素
         * @param {string} animationClass - 動畫類別 (預設: 'fadeInUp')
         * @param {number} delay - 延遲時間 (毫秒)
         */
        animateIn(element, animationClass = 'fadeInUp', delay = 0) {
            if (!element) return;
            
            setTimeout(() => {
                element.style.animation = `${animationClass} 0.6s ease-out both`;
            }, delay);
        },
        
        /**
         * 移除動畫類別
         * @param {Element} element - 目標元素
         */
        removeAnimation(element) {
            if (element) {
                element.style.animation = '';
                element.classList.remove('animate-on-scroll', 'animated');
            }
        }
    },
    
    /**
     * 本地存儲工具
     */
    Storage: {
        /**
         * 設定本地存儲
         * @param {string} key - 鍵名
         * @param {any} value - 值
         * @returns {boolean} 是否成功
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('存儲資料失敗:', error);
                return false;
            }
        },
        
        /**
         * 取得本地存儲
         * @param {string} key - 鍵名
         * @param {any} defaultValue - 預設值
         * @returns {any} 值
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('讀取資料失敗:', error);
                return defaultValue;
            }
        },
        
        /**
         * 移除本地存儲
         * @param {string} key - 鍵名
         * @returns {boolean} 是否成功
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('移除資料失敗:', error);
                return false;
            }
        },
        
        /**
         * 清空本地存儲
         * @returns {boolean} 是否成功
         */
        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (error) {
                console.error('清空資料失敗:', error);
                return false;
            }
        }
    },
    
    /**
     * 防抖函數
     * @param {Function} func - 要防抖的函數
     * @param {number} wait - 等待時間 (毫秒)
     * @returns {Function} 防抖後的函數
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    /**
     * 節流函數
     * @param {Function} func - 要節流的函數
     * @param {number} limit - 限制時間 (毫秒)
     * @returns {Function} 節流後的函數
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    /**
     * 深拷貝物件
     * @param {any} obj - 要拷貝的物件
     * @returns {any} 拷貝後的物件
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    },
    
    /**
     * 生成隨機字串
     * @param {number} length - 長度
     * @returns {string} 隨機字串
     */
    generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    /**
     * 取得當前時間戳
     * @returns {number} 時間戳
     */
    getCurrentTimestamp() {
        return Date.now();
    },
    
    /**
     * 延遲執行
     * @param {number} ms - 延遲時間 (毫秒)
     * @returns {Promise} Promise 物件
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
};

// 將 Utils 掛載到全域
window.Utils = Utils;
