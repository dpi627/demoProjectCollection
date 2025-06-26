/* ==========================================================================
   個人作品集網站 - 資料管理檔案
   ========================================================================== */

/**
 * 資料管理器
 * 負責專案資料的 CRUD 操作和本地存儲
 */
class DataManager {
    constructor() {
        this.storageKey = 'portfolioData';
        this.projects = [];
        this.init();
    }
    
    /**
     * 初始化資料管理器
     */
    init() {
        this.loadData();
        if (this.projects.length === 0) {
            this.loadSampleData();
        }
    }
    
    /**
     * 從本地存儲載入資料
     */
    loadData() {
        try {
            const data = Utils.Storage.get(this.storageKey, { projects: [] });
            this.projects = data.projects || [];
            console.log('資料載入成功:', this.projects.length, '個專案');
        } catch (error) {
            console.error('載入資料時發生錯誤:', error);
            this.projects = [];
        }
    }
    
    /**
     * 儲存資料到本地存儲
     */
    saveData() {
        try {
            const data = {
                projects: this.projects,
                lastUpdated: new Date().toISOString(),
                version: '1.0.0'
            };
            Utils.Storage.set(this.storageKey, data);
            console.log('資料儲存成功');
            return true;
        } catch (error) {
            console.error('儲存資料時發生錯誤:', error);
            return false;
        }
    }
    
    /**
     * 載入範例資料
     */
    loadSampleData() {
        const sampleProjects = [
            {
                id: Utils.Project.generateId(),
                name: 'ERP 企業資源規劃系統',
                description: '基於 .NET Core 開發的企業級 ERP 系統，包含庫存管理、財務管理、人事管理等模組。',
                framework: '.NET Core',
                projectType: 'WEB',
                repositoryUrl: 'https://github.com/example/erp-system',
                websiteUrl: 'https://demo-erp.example.com',
                downloadUrl: '',
                screenshots: ['https://via.placeholder.com/600x400/0d6efd/ffffff?text=ERP+系統+截圖'],
                technologies: ['C#', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'Bootstrap'],
                developmentLog: '專案歷時 6 個月開發，採用微服務架構，支援高併發處理。實現了完整的權限管理系統和報表功能。',
                startDate: '2023-01-15',
                endDate: '2023-07-20',
                status: '已完成',
                featured: true,
                createdAt: new Date('2023-01-15').toISOString(),
                updatedAt: new Date('2023-07-20').toISOString()
            },
            {
                id: Utils.Project.generateId(),
                name: '庫存管理桌面應用程式',
                description: '使用 WPF 開發的庫存管理系統，提供直觀的操作介面和即時庫存追蹤功能。',
                framework: 'WPF',
                projectType: 'DESKTOP',
                repositoryUrl: 'https://github.com/example/inventory-manager',
                websiteUrl: '',
                downloadUrl: 'https://releases.example.com/inventory-manager/latest',
                screenshots: ['https://via.placeholder.com/600x400/198754/ffffff?text=WPF+庫存+管理'],
                technologies: ['C#', 'WPF', 'MVVM', 'SQLite', 'Prism'],
                developmentLog: '採用 MVVM 設計模式，實現了資料繫結和命令模式。支援條碼掃描和報表匯出功能。',
                startDate: '2023-03-01',
                endDate: '2023-05-15',
                status: '已完成',
                featured: false,
                createdAt: new Date('2023-03-01').toISOString(),
                updatedAt: new Date('2023-05-15').toISOString()
            },
            {
                id: Utils.Project.generateId(),
                name: '資料處理工具',
                description: '命令列工具，用於批量處理 Excel 檔案和資料轉換，支援多種格式匯入匯出。',
                framework: '.NET Core',
                projectType: 'CONSOLE',
                repositoryUrl: 'https://github.com/example/data-processor',
                websiteUrl: '',
                downloadUrl: 'https://releases.example.com/data-processor/latest',
                screenshots: ['https://via.placeholder.com/600x400/6c757d/ffffff?text=控制台+工具'],
                technologies: ['C#', '.NET Core', 'EPPlus', 'CommandLineParser'],
                developmentLog: '支援多執行緒處理大型檔案，實現了進度顯示和錯誤記錄功能。可以處理 CSV、Excel、JSON 等格式。',
                startDate: '2023-06-01',
                endDate: '',
                status: '開發中',
                featured: false,
                createdAt: new Date('2023-06-01').toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: Utils.Project.generateId(),
                name: 'API 閘道服務',
                description: '基於 ASP.NET Core 的 API 閘道，提供統一的 API 入口點，包含認證、限流、監控等功能。',
                framework: 'ASP.NET Core',
                projectType: 'WEB',
                repositoryUrl: 'https://github.com/example/api-gateway',
                websiteUrl: 'https://api.example.com',
                downloadUrl: '',
                screenshots: ['https://via.placeholder.com/600x400/0dcaf0/ffffff?text=API+閘道'],
                technologies: ['C#', 'ASP.NET Core', 'JWT', 'Redis', 'Docker'],
                developmentLog: '實現了微服務架構下的 API 統一管理，支援 JWT 認證和 Redis 快取。',
                startDate: '2023-08-01',
                endDate: '',
                status: '開發中',
                featured: true,
                createdAt: new Date('2023-08-01').toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        this.projects = sampleProjects;
        this.saveData();
        console.log('載入範例資料完成');
    }
    
    /**
     * 取得所有專案
     * @returns {Array} 專案陣列
     */
    getAllProjects() {
        return [...this.projects];
    }
    
    /**
     * 根據 ID 取得專案
     * @param {string} id - 專案 ID
     * @returns {Object|null} 專案資料
     */
    getProjectById(id) {
        return this.projects.find(project => project.id === id) || null;
    }
    
    /**
     * 新增專案
     * @param {Object} projectData - 專案資料
     * @returns {Object} 新增結果
     */
    addProject(projectData) {
        try {
            // 驗證必填欄位
            const validation = Utils.Validation.validateRequired(projectData, ['name', 'projectType']);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', ')
                };
            }
            
            // 檢查專案名稱是否重複
            if (this.projects.some(p => p.name === projectData.name)) {
                return {
                    success: false,
                    message: '專案名稱已存在'
                };
            }
            
            // 建立新專案
            const newProject = {
                id: Utils.Project.generateId(),
                name: projectData.name,
                description: projectData.description || '',
                framework: projectData.framework || '',
                projectType: projectData.projectType,
                repositoryUrl: projectData.repositoryUrl || '',
                websiteUrl: projectData.websiteUrl || '',
                downloadUrl: projectData.downloadUrl || '',
                screenshots: projectData.screenshots ? [projectData.screenshots] : [],
                technologies: Utils.Format.stringToArray(projectData.technologies),
                developmentLog: projectData.developmentLog || '',
                startDate: projectData.startDate || '',
                endDate: projectData.endDate || '',
                status: projectData.status || '開發中',
                featured: projectData.featured || false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // 新增到陣列開頭
            this.projects.unshift(newProject);
            
            // 儲存資料
            if (this.saveData()) {
                return {
                    success: true,
                    message: '專案新增成功',
                    project: newProject
                };
            } else {
                return {
                    success: false,
                    message: '儲存專案時發生錯誤'
                };
            }
            
        } catch (error) {
            console.error('新增專案時發生錯誤:', error);
            return {
                success: false,
                message: '新增專案時發生未知錯誤'
            };
        }
    }
    
    /**
     * 更新專案
     * @param {string} id - 專案 ID
     * @param {Object} projectData - 更新的專案資料
     * @returns {Object} 更新結果
     */
    updateProject(id, projectData) {
        try {
            const projectIndex = this.projects.findIndex(project => project.id === id);
            
            if (projectIndex === -1) {
                return {
                    success: false,
                    message: '找不到指定的專案'
                };
            }
            
            // 驗證必填欄位
            const validation = Utils.Validation.validateRequired(projectData, ['name', 'projectType']);
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.errors.join(', ')
                };
            }
            
            // 檢查專案名稱是否與其他專案重複
            const existingProject = this.projects.find(p => p.name === projectData.name && p.id !== id);
            if (existingProject) {
                return {
                    success: false,
                    message: '專案名稱已存在'
                };
            }
            
            // 更新專案資料
            const updatedProject = {
                ...this.projects[projectIndex],
                name: projectData.name,
                description: projectData.description || '',
                framework: projectData.framework || '',
                projectType: projectData.projectType,
                repositoryUrl: projectData.repositoryUrl || '',
                websiteUrl: projectData.websiteUrl || '',
                downloadUrl: projectData.downloadUrl || '',
                screenshots: projectData.screenshots ? [projectData.screenshots] : this.projects[projectIndex].screenshots,
                technologies: Utils.Format.stringToArray(projectData.technologies),
                developmentLog: projectData.developmentLog || '',
                startDate: projectData.startDate || '',
                endDate: projectData.endDate || '',
                status: projectData.status || '開發中',
                updatedAt: new Date().toISOString()
            };
            
            this.projects[projectIndex] = updatedProject;
            
            // 儲存資料
            if (this.saveData()) {
                return {
                    success: true,
                    message: '專案更新成功',
                    project: updatedProject
                };
            } else {
                return {
                    success: false,
                    message: '儲存專案時發生錯誤'
                };
            }
            
        } catch (error) {
            console.error('更新專案時發生錯誤:', error);
            return {
                success: false,
                message: '更新專案時發生未知錯誤'
            };
        }
    }
    
    /**
     * 刪除專案
     * @param {string} id - 專案 ID
     * @returns {Object} 刪除結果
     */
    deleteProject(id) {
        try {
            const projectIndex = this.projects.findIndex(project => project.id === id);
            
            if (projectIndex === -1) {
                return {
                    success: false,
                    message: '找不到指定的專案'
                };
            }
            
            const deletedProject = this.projects[projectIndex];
            this.projects.splice(projectIndex, 1);
            
            // 儲存資料
            if (this.saveData()) {
                return {
                    success: true,
                    message: '專案刪除成功',
                    project: deletedProject
                };
            } else {
                return {
                    success: false,
                    message: '儲存變更時發生錯誤'
                };
            }
            
        } catch (error) {
            console.error('刪除專案時發生錯誤:', error);
            return {
                success: false,
                message: '刪除專案時發生未知錯誤'
            };
        }
    }
    
    /**
     * 搜尋專案
     * @param {string} keyword - 搜尋關鍵字
     * @returns {Array} 符合條件的專案陣列
     */
    searchProjects(keyword) {
        if (!keyword || keyword.trim() === '') {
            return this.getAllProjects();
        }
        
        const searchTerm = keyword.toLowerCase().trim();
        
        return this.projects.filter(project => {
            return (
                project.name.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm) ||
                project.framework.toLowerCase().includes(searchTerm) ||
                project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
            );
        });
    }
    
    /**
     * 依條件篩選專案
     * @param {Object} filters - 篩選條件
     * @returns {Array} 符合條件的專案陣列
     */
    filterProjects(filters = {}) {
        let filteredProjects = [...this.projects];
        
        // 依專案類型篩選
        if (filters.type && filters.type !== '') {
            filteredProjects = filteredProjects.filter(project => 
                project.projectType === filters.type
            );
        }
        
        // 依開發框架篩選
        if (filters.framework && filters.framework !== '') {
            filteredProjects = filteredProjects.filter(project => 
                project.framework === filters.framework
            );
        }
        
        // 依專案狀態篩選
        if (filters.status && filters.status !== '') {
            filteredProjects = filteredProjects.filter(project => 
                project.status === filters.status
            );
        }
        
        // 依搜尋關鍵字篩選
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase().trim();
            filteredProjects = filteredProjects.filter(project => {
                return (
                    project.name.toLowerCase().includes(searchTerm) ||
                    project.description.toLowerCase().includes(searchTerm) ||
                    project.framework.toLowerCase().includes(searchTerm) ||
                    project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        return filteredProjects;
    }
    
    /**
     * 排序專案
     * @param {Array} projects - 專案陣列
     * @param {string} sortBy - 排序依據 ('date', 'name', 'type')
     * @param {string} order - 排序順序 ('asc', 'desc')
     * @returns {Array} 排序後的專案陣列
     */
    sortProjects(projects, sortBy = 'date', order = 'desc') {
        const sortedProjects = [...projects];
        
        sortedProjects.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'name':
                    valueA = a.name.toLowerCase();
                    valueB = b.name.toLowerCase();
                    break;
                case 'type':
                    valueA = a.projectType;
                    valueB = b.projectType;
                    break;
                case 'date':
                default:
                    valueA = new Date(a.createdAt);
                    valueB = new Date(b.createdAt);
                    break;
            }
            
            if (order === 'asc') {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            } else {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            }
        });
        
        return sortedProjects;
    }
    
    /**
     * 匯出資料
     * @returns {Object} 匯出的資料
     */
    exportData() {
        return {
            projects: this.projects,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    
    /**
     * 匯入資料
     * @param {Object} data - 要匯入的資料
     * @returns {Object} 匯入結果
     */
    importData(data) {
        try {
            if (!data || !data.projects || !Array.isArray(data.projects)) {
                return {
                    success: false,
                    message: '資料格式不正確'
                };
            }
            
            this.projects = data.projects;
            
            if (this.saveData()) {
                return {
                    success: true,
                    message: `成功匯入 ${data.projects.length} 個專案`
                };
            } else {
                return {
                    success: false,
                    message: '儲存匯入資料時發生錯誤'
                };
            }
            
        } catch (error) {
            console.error('匯入資料時發生錯誤:', error);
            return {
                success: false,
                message: '匯入資料時發生未知錯誤'
            };
        }
    }
    
    /**
     * 清空所有資料
     * @returns {Object} 清空結果
     */
    clearAllData() {
        try {
            this.projects = [];
            
            if (this.saveData()) {
                return {
                    success: true,
                    message: '所有資料已清空'
                };
            } else {
                return {
                    success: false,
                    message: '清空資料時發生錯誤'
                };
            }
            
        } catch (error) {
            console.error('清空資料時發生錯誤:', error);
            return {
                success: false,
                message: '清空資料時發生未知錯誤'
            };
        }
    }
    
    /**
     * 取得統計資訊
     * @returns {Object} 統計資訊
     */
    getStatistics() {
        const total = this.projects.length;
        const byType = {};
        const byStatus = {};
        const byFramework = {};
        
        this.projects.forEach(project => {
            // 依類型統計
            byType[project.projectType] = (byType[project.projectType] || 0) + 1;
            
            // 依狀態統計
            byStatus[project.status] = (byStatus[project.status] || 0) + 1;
            
            // 依框架統計
            if (project.framework) {
                byFramework[project.framework] = (byFramework[project.framework] || 0) + 1;
            }
        });
        
        return {
            total,
            byType,
            byStatus,
            byFramework,
            featured: this.projects.filter(p => p.featured).length
        };
    }
}

// 建立全域資料管理器實例
window.dataManager = new DataManager();
