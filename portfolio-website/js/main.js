/* ============================        // 模態對話框
        this.projectModal = null;
        this.projectDetailModal = null;
        this.imageLightboxModal = null;
        this.deleteConfirmModal = null;
        this.lightboxCarousel = null;===========================================
   個人            // 搜尋功能
            searchInput: Utils.DOM.getElement('#searchInput'),
            clearSearch: Utils.DOM.getElement('#clearSearch'),
            filterType: Utils.DOM.getElement('#filterType'),網站 - 主要邏輯檔案
   ========================================================================== */

/**
 * 主要應用程式類別
 * 負責整體應用程式的初始化和管理
 */
class PortfolioApp {
    constructor() {
        this.isInitialized = false;
        this.currentFilters = {
            search: '',
            type: '',
            framework: '',
            status: ''
        };
        this.currentSort = {
            by: 'date',
            order: 'desc'
        };
        
        // DOM 元素
        this.elements = {};
        
        // Toast 實例
        this.toast = null;
        
        // 模態對話框實例
        this.projectModal = null;
        this.projectDetailModal = null;
        
        // 目前編輯的專案 ID
        this.editingProjectId = null;
        
        // 待刪除的專案 ID
        this.pendingDeleteProjectId = null;
        
        this.init();
    }
    
    /**
     * 初始化應用程式
     */
    async init() {
        try {
            console.log('開始初始化作品集應用程式...');
            
            // 等待 DOM 完全載入
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            
            // 綁定 DOM 元素
            this.bindElements();
            
            // 初始化 Bootstrap 組件
            this.initBootstrapComponents();
            
            // 綁定事件監聽器
            this.bindEvents();
            
            // 渲染初始專案
            this.renderProjects();
            
            // 初始化動畫
            this.initAnimations();
            
            this.isInitialized = true;
            console.log('作品集應用程式初始化完成');
            
            // 顯示歡迎訊息
            this.showToast('歡迎使用個人作品集系統！', 'success');
            
        } catch (error) {
            console.error('初始化應用程式時發生錯誤:', error);
            this.showToast('應用程式初始化失敗', 'error');
        }
    }
    
    /**
     * 綁定 DOM 元素
     */
    bindElements() {
        this.elements = {
            // 搜尋和篩選
            searchInput: Utils.DOM.getElement('#searchInput'),
            filterType: Utils.DOM.getElement('#filterType'),
            filterFramework: Utils.DOM.getElement('#filterFramework'),
            
            // 排序按鈕
            sortDate: Utils.DOM.getElement('#sortDate'),
            sortName: Utils.DOM.getElement('#sortName'),
            sortType: Utils.DOM.getElement('#sortType'),
            
            // 專案容器
            projectsContainer: Utils.DOM.getElement('#projectsContainer'),
            noProjectsMessage: Utils.DOM.getElement('#noProjectsMessage'),
            
            // 按鈕
            addProjectBtn: Utils.DOM.getElement('#addProjectBtn'),
            saveProjectBtn: Utils.DOM.getElement('#saveProjectBtn'),
            
            // 表單
            projectForm: Utils.DOM.getElement('#projectForm'),
            
            // 表單欄位
            projectId: Utils.DOM.getElement('#projectId'),
            projectName: Utils.DOM.getElement('#projectName'),
            projectDescription: Utils.DOM.getElement('#projectDescription'),
            projectType: Utils.DOM.getElement('#projectType'),
            projectStatus: Utils.DOM.getElement('#projectStatus'),
            projectFramework: Utils.DOM.getElement('#projectFramework'),
            projectTechnologies: Utils.DOM.getElement('#projectTechnologies'),
            projectRepositoryUrl: Utils.DOM.getElement('#projectRepositoryUrl'),
            projectWebsiteUrl: Utils.DOM.getElement('#projectWebsiteUrl'),
            projectDownloadUrl: Utils.DOM.getElement('#projectDownloadUrl'),
            projectScreenshots: Utils.DOM.getElement('#projectScreenshots'),
            projectDevelopmentLog: Utils.DOM.getElement('#projectDevelopmentLog'),
            projectStartDate: Utils.DOM.getElement('#projectStartDate'),
            projectEndDate: Utils.DOM.getElement('#projectEndDate'),
            
            // 模態對話框
            projectModal: Utils.DOM.getElement('#projectModal'),
            projectDetailModal: Utils.DOM.getElement('#projectDetailModal'),
            projectModalLabel: Utils.DOM.getElement('#projectModalLabel'),
            projectDetailContent: Utils.DOM.getElement('#projectDetailContent'),
            imageLightboxModal: Utils.DOM.getElement('#imageLightboxModal'),
            lightboxCarouselInner: Utils.DOM.getElement('#lightboxCarouselInner'),
            lightboxIndicators: Utils.DOM.getElement('#lightboxIndicators'),
            deleteConfirmModal: Utils.DOM.getElement('#deleteConfirmModal'),
            deleteProjectName: Utils.DOM.getElement('#deleteProjectName'),
            confirmDeleteBtn: Utils.DOM.getElement('#confirmDeleteBtn'),
            
            // Toast
            toastContainer: Utils.DOM.getElement('#toastContainer'),
            toastTemplate: Utils.DOM.getElement('#toastTemplate'),
            
            // 載入指示器
            globalLoader: Utils.DOM.getElement('#globalLoader'),
            loaderMessage: Utils.DOM.getElement('#loaderMessage'),
            pageLoadProgress: Utils.DOM.getElement('#pageLoadProgress'),
            
            // 導航
            navLinks: Utils.DOM.getElements('.nav-link')
        };
        
        console.log('DOM 元素綁定完成');
    }
    
    /**
     * 初始化 Bootstrap 組件
     */
    initBootstrapComponents() {
        // 初始化模態對話框
        if (this.elements.projectModal) {
            this.projectModal = new bootstrap.Modal(this.elements.projectModal);
        }
        
        if (this.elements.projectDetailModal) {
            this.projectDetailModal = new bootstrap.Modal(this.elements.projectDetailModal);
        }
        
        if (this.elements.imageLightboxModal) {
            this.imageLightboxModal = new bootstrap.Modal(this.elements.imageLightboxModal);
            this.lightboxCarousel = new bootstrap.Carousel(Utils.DOM.getElement('#lightboxCarousel'));
        }
        
        if (this.elements.deleteConfirmModal) {
            this.deleteConfirmModal = new bootstrap.Modal(this.elements.deleteConfirmModal);
        }
        
        // 初始化 Toast
        if (this.elements.toastTemplate) {
            // Toast 已透過模板方式處理，不需要單獨初始化
        }
        
        console.log('Bootstrap 組件初始化完成');
    }
    
    /**
     * 綁定事件監聽器
     */
    bindEvents() {
        // 搜尋功能
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('input', 
                Utils.debounce(() => this.handleSearch(), 300)
            );
        }
        
        // 清除搜尋
        if (this.elements.clearSearch) {
            this.elements.clearSearch.addEventListener('click', () => {
                this.elements.searchInput.value = '';
                this.handleSearch();
            });
        }
        
        // 篩選功能
        if (this.elements.filterType) {
            this.elements.filterType.addEventListener('change', () => this.handleFilter());
        }
        
        if (this.elements.filterFramework) {
            this.elements.filterFramework.addEventListener('change', () => this.handleFilter());
        }
        
        // 排序功能
        if (this.elements.sortDate) {
            this.elements.sortDate.addEventListener('click', () => this.handleSort('date'));
        }
        
        if (this.elements.sortName) {
            this.elements.sortName.addEventListener('click', () => this.handleSort('name'));
        }
        
        if (this.elements.sortType) {
            this.elements.sortType.addEventListener('click', () => this.handleSort('type'));
        }
        
        // 新增專案按鈕
        if (this.elements.addProjectBtn) {
            this.elements.addProjectBtn.addEventListener('click', () => this.showAddProjectModal());
        }
        
        // 儲存專案按鈕
        if (this.elements.saveProjectBtn) {
            this.elements.saveProjectBtn.addEventListener('click', () => this.handleSaveProject());
        }
        
        // 確認刪除按鈕
        if (this.elements.confirmDeleteBtn) {
            this.elements.confirmDeleteBtn.addEventListener('click', () => this.executeDelete());
        }
        
        // 表單提交
        if (this.elements.projectForm) {
            this.elements.projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveProject();
            });
            
            // 即時表單驗證
            this.setupFormValidation();
        }
        
        // 平滑滾動導航
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    Utils.Animation.scrollTo(href);
                    
                    // 更新活動連結
                    this.updateActiveNavLink(href);
                    
                    // 在行動裝置上關閉導航選單
                    const navbarCollapse = Utils.DOM.getElement('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });
        
        // 滾動時更新活動連結
        window.addEventListener('scroll', Utils.throttle(() => {
            this.updateActiveNavLinkOnScroll();
        }, 100));
        
        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        console.log('事件監聽器綁定完成');
    }
    
    /**
     * 處理鍵盤快捷鍵
     * @param {KeyboardEvent} e - 鍵盤事件
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + N: 新增專案
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            this.showAddProjectModal();
        }
        
        // Ctrl/Cmd + F: 聚焦搜尋框
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            if (this.elements.searchInput) {
                this.elements.searchInput.focus();
            }
        }
        
        // ESC: 關閉模態對話框
        if (e.key === 'Escape') {
            if (this.imageLightboxModal && this.elements.imageLightboxModal.classList.contains('show')) {
                this.imageLightboxModal.hide();
            } else if (this.deleteConfirmModal && this.elements.deleteConfirmModal.classList.contains('show')) {
                this.deleteConfirmModal.hide();
            } else if (this.projectDetailModal && this.elements.projectDetailModal.classList.contains('show')) {
                this.projectDetailModal.hide();
            } else if (this.projectModal && this.elements.projectModal.classList.contains('show')) {
                this.projectModal.hide();
            }
        }
        
        // 圖片燈箱導航 (當燈箱開啟時)
        if (this.imageLightboxModal && this.elements.imageLightboxModal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.lightboxCarousel?.prev();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.lightboxCarousel?.next();
            }
        }
    }
    
    /**
     * 處理搜尋
     */
    handleSearch() {
        this.currentFilters.search = this.elements.searchInput.value;
        this.renderProjects();
    }
    
    /**
     * 處理篩選
     */
    handleFilter() {
        this.currentFilters.type = this.elements.filterType.value;
        this.currentFilters.framework = this.elements.filterFramework.value;
        this.renderProjects();
    }
    
    /**
     * 處理排序
     * @param {string} sortBy - 排序依據
     */
    handleSort(sortBy) {
        if (this.currentSort.by === sortBy) {
            // 切換排序順序
            this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            // 設定新的排序依據
            this.currentSort.by = sortBy;
            this.currentSort.order = 'desc';
        }
        
        // 更新排序按鈕樣式
        this.updateSortButtons();
        
        // 重新渲染專案
        this.renderProjects();
    }
    
    /**
     * 更新排序按鈕樣式
     */
    updateSortButtons() {
        // 移除所有按鈕的 active 類別
        [this.elements.sortDate, this.elements.sortName, this.elements.sortType].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        
        // 為當前排序按鈕添加 active 類別
        const activeButton = this.elements[`sort${Utils.Format.capitalize(this.currentSort.by)}`];
        if (activeButton) {
            activeButton.classList.add('active');
            
            // 更新圖示以顯示排序方向
            const icon = activeButton.querySelector('i');
            if (icon) {
                icon.className = this.currentSort.order === 'asc' ? 
                    icon.className.replace('-down', '-up') : 
                    icon.className.replace('-up', '-down');
            }
        }
    }
    
    /**
     * 渲染專案列表
     */
    renderProjects() {
        try {
            // 取得篩選後的專案
            const filteredProjects = dataManager.filterProjects(this.currentFilters);
            
            // 排序專案
            const sortedProjects = dataManager.sortProjects(
                filteredProjects, 
                this.currentSort.by, 
                this.currentSort.order
            );
            
            // 清空容器
            if (this.elements.projectsContainer) {
                this.elements.projectsContainer.innerHTML = '';
            }
            
            // 檢查是否有專案
            if (sortedProjects.length === 0) {
                this.showNoProjectsMessage();
                return;
            }
            
            // 隱藏無專案訊息
            this.hideNoProjectsMessage();
            
            // 渲染專案卡片
            sortedProjects.forEach((project, index) => {
                const card = this.createProjectCard(project);
                if (card) {
                    // 添加進場動畫延遲
                    card.style.animationDelay = `${index * 0.1}s`;
                    this.elements.projectsContainer.appendChild(card);
                }
            });
            
            console.log(`渲染 ${sortedProjects.length} 個專案`);
            
        } catch (error) {
            console.error('渲染專案時發生錯誤:', error);
            this.showToast('載入專案時發生錯誤', 'error');
        }
    }
    
    /**
     * 建立專案卡片
     * @param {Object} project - 專案資料
     * @returns {Element} 專案卡片元素
     */
    createProjectCard(project) {
        const col = Utils.DOM.createElement('div', {
            className: 'col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3'
        });
        
        const image = project.screenshots && project.screenshots.length > 0 ? 
            project.screenshots[0] : 
            Utils.Project.getDefaultImage(project.projectType);
        
        const technologies = project.technologies.slice(0, 3).map(tech => 
            `<span class="badge bg-primary me-1 mb-1">${tech}</span>`
        ).join('');
        
        const moreCount = project.technologies.length > 3 ? 
            `<span class="badge bg-secondary">+${project.technologies.length - 3}</span>` : '';
        
        // 計算專案時長
        const duration = this.calculateProjectDuration(project.startDate, project.endDate);
        
        col.innerHTML = `
            <div class="card project-card h-100 shadow-sm">
                <div class="card-header-custom">
                    <span class="badge ${Utils.Project.getStatusBadgeClass(project.status)} position-absolute top-0 end-0 m-2">
                        ${project.status}
                    </span>
                </div>
                <img src="${image}" class="card-img-top" alt="${project.name}" 
                     loading="lazy"
                     onerror="this.src='${Utils.Project.getDefaultImage(project.projectType)}'">
                <div class="card-body d-flex flex-column">
                    <div class="d-flex align-items-start justify-content-between mb-2">
                        <h5 class="card-title mb-0">${project.name}</h5>
                        <i class="${Utils.Project.getTypeIcon(project.projectType)} project-type-icon text-primary ms-2"></i>
                    </div>
                    <p class="card-subtitle text-muted mb-2 small">
                        <i class="fas fa-tools me-1"></i>
                        ${project.framework || project.projectType}
                        ${duration ? `<span class="text-muted ms-2">• ${duration}</span>` : ''}
                    </p>
                    <p class="card-text text-truncate-2 flex-grow-1 mb-3">
                        ${project.description || '暫無描述'}
                    </p>
                    <div class="project-technologies mb-3">
                        ${technologies}
                        ${moreCount}
                    </div>
                    <div class="project-stats mb-3">
                        <div class="row text-center small text-muted">
                            ${project.startDate ? `
                                <div class="col-6">
                                    <i class="fas fa-calendar-alt me-1"></i>
                                    ${Utils.Format.date(project.startDate, 'YYYY/MM')}
                                </div>
                            ` : ''}
                            <div class="col-${project.startDate ? '6' : '12'}">
                                <i class="fas fa-tags me-1"></i>
                                ${project.technologies.length} 項技術
                            </div>
                        </div>
                    </div>
                    <div class="project-actions mt-auto">
                        <div class="d-grid gap-2 mb-2">
                            <button type="button" class="btn btn-primary btn-sm" 
                                    onclick="portfolioApp.showProjectDetail('${project.id}')" 
                                    title="檢視詳情">
                                <i class="fas fa-eye me-1"></i>檢視詳情
                            </button>
                        </div>
                        <div class="row g-1">
                            ${project.repositoryUrl ? 
                                `<div class="col-4">
                                    <a href="${project.repositoryUrl}" target="_blank" 
                                       class="btn btn-outline-secondary btn-sm w-100" title="查看程式碼">
                                        <i class="fab fa-github"></i>
                                    </a>
                                </div>` : '<div class="col-4"></div>'
                            }
                            ${project.websiteUrl ? 
                                `<div class="col-4">
                                    <a href="${project.websiteUrl}" target="_blank" 
                                       class="btn btn-outline-success btn-sm w-100" title="查看網站">
                                        <i class="fas fa-external-link-alt"></i>
                                    </a>
                                </div>` : '<div class="col-4"></div>'
                            }
                            <div class="col-4">
                                <div class="dropdown">
                                    <button class="btn btn-outline-warning btn-sm dropdown-toggle w-100" 
                                            type="button" data-bs-toggle="dropdown" title="更多操作">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" href="#" 
                                               onclick="portfolioApp.showEditProjectModal('${project.id}')">
                                                <i class="fas fa-edit me-2"></i>編輯
                                            </a>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                            <a class="dropdown-item text-danger" href="#" 
                                               onclick="portfolioApp.confirmDeleteProject('${project.id}')">
                                                <i class="fas fa-trash me-2"></i>刪除
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return col;
    }
    
    /**
     * 計算專案時長
     * @param {string} startDate - 開始日期
     * @param {string} endDate - 結束日期
     * @returns {string} 時長描述
     */
    calculateProjectDuration(startDate, endDate) {
        if (!startDate) return '';
        
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : new Date();
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        
        if (diffMonths >= 1) {
            return `${diffMonths} 個月`;
        } else if (diffDays >= 7) {
            const weeks = Math.floor(diffDays / 7);
            return `${weeks} 週`;
        } else {
            return `${diffDays} 天`;
        }
    }
    
    /**
     * 顯示無專案訊息
     */
    showNoProjectsMessage() {
        Utils.DOM.show(this.elements.noProjectsMessage);
        Utils.DOM.hide(this.elements.projectsContainer);
    }
    
    /**
     * 隱藏無專案訊息
     */
    hideNoProjectsMessage() {
        Utils.DOM.hide(this.elements.noProjectsMessage);
        Utils.DOM.show(this.elements.projectsContainer);
    }
    
    /**
     * 顯示新增專案模態對話框
     */
    showAddProjectModal() {
        this.editingProjectId = null;
        this.elements.projectModalLabel.textContent = '新增專案';
        this.elements.saveProjectBtn.textContent = '新增專案';
        this.clearForm();
        
        if (this.projectModal) {
            this.projectModal.show();
        }
    }
    
    /**
     * 顯示編輯專案模態對話框
     * @param {string} projectId - 專案 ID
     */
    showEditProjectModal(projectId) {
        const project = dataManager.getProjectById(projectId);
        if (!project) {
            this.showToast('找不到指定的專案', 'error');
            return;
        }
        
        this.editingProjectId = projectId;
        this.elements.projectModalLabel.textContent = '編輯專案';
        this.elements.saveProjectBtn.textContent = '更新專案';
        this.fillForm(project);
        
        if (this.projectModal) {
            this.projectModal.show();
        }
    }
    
    /**
     * 清空表單
     */
    clearForm() {
        if (this.elements.projectForm) {
            this.elements.projectForm.reset();
            this.elements.projectForm.classList.remove('was-validated');
        }
        
        // 重設特定欄位
        if (this.elements.projectStatus) {
            this.elements.projectStatus.value = '開發中';
        }
    }
    
    /**
     * 填充表單
     * @param {Object} project - 專案資料
     */
    fillForm(project) {
        if (!project) return;
        
        this.elements.projectId.value = project.id || '';
        this.elements.projectName.value = project.name || '';
        this.elements.projectDescription.value = project.description || '';
        this.elements.projectType.value = project.projectType || '';
        this.elements.projectStatus.value = project.status || '開發中';
        this.elements.projectFramework.value = project.framework || '';
        this.elements.projectTechnologies.value = Utils.Format.arrayToString(project.technologies);
        this.elements.projectRepositoryUrl.value = project.repositoryUrl || '';
        this.elements.projectWebsiteUrl.value = project.websiteUrl || '';
        this.elements.projectDownloadUrl.value = project.downloadUrl || '';
        this.elements.projectScreenshots.value = project.screenshots && project.screenshots.length > 0 ? 
            project.screenshots[0] : '';
        this.elements.projectDevelopmentLog.value = project.developmentLog || '';
        this.elements.projectStartDate.value = project.startDate || '';
        this.elements.projectEndDate.value = project.endDate || '';
        
        // 移除驗證樣式
        this.elements.projectForm.classList.remove('was-validated');
    }
    
    /**
     * 設定表單即時驗證
     */
    setupFormValidation() {
        const formFields = [
            { element: this.elements.projectName, validator: this.validateProjectName },
            { element: this.elements.projectType, validator: this.validateRequired },
            { element: this.elements.projectRepositoryUrl, validator: this.validateUrl },
            { element: this.elements.projectWebsiteUrl, validator: this.validateUrl },
            { element: this.elements.projectDownloadUrl, validator: this.validateUrl },
            { element: this.elements.projectScreenshots, validator: this.validateUrl },
            { element: this.elements.projectEndDate, validator: this.validateEndDate }
        ];
        
        formFields.forEach(({ element, validator }) => {
            if (element) {
                element.addEventListener('blur', () => {
                    this.validateField(element, validator);
                });
                
                element.addEventListener('input', () => {
                    // 清除之前的錯誤狀態
                    element.classList.remove('is-invalid', 'is-valid');
                });
            }
        });
    }
    
    /**
     * 驗證單一欄位
     * @param {HTMLElement} element - 表單元素
     * @param {Function} validator - 驗證函數
     */
    validateField(element, validator) {
        const isValid = validator.call(this, element.value);
        
        if (isValid) {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
        } else {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
        }
        
        return isValid;
    }
    
    /**
     * 驗證專案名稱
     * @param {string} value - 值
     * @returns {boolean} 是否有效
     */
    validateProjectName(value) {
        return value && value.trim().length >= 2;
    }
    
    /**
     * 驗證必填欄位
     * @param {string} value - 值
     * @returns {boolean} 是否有效
     */
    validateRequired(value) {
        return value && value.trim().length > 0;
    }
    
    /**
     * 驗證 URL 格式
     * @param {string} value - 值
     * @returns {boolean} 是否有效
     */
    validateUrl(value) {
        if (!value || value.trim() === '') return true; // 可選欄位
        
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }
    
    /**
     * 驗證結束日期
     * @param {string} value - 值
     * @returns {boolean} 是否有效
     */
    validateEndDate(value) {
        if (!value || value.trim() === '') return true; // 可選欄位
        
        const startDate = this.elements.projectStartDate?.value;
        if (!startDate) return true;
        
        return new Date(value) >= new Date(startDate);
    }
    
    /**
     * 處理儲存專案
     */
    async handleSaveProject() {
        const saveBtn = this.elements.saveProjectBtn;
        
        try {
            // 顯示載入狀態
            this.setButtonLoading(saveBtn, true, '儲存中...');
            
            // 驗證表單
            if (!this.validateForm()) {
                return;
            }
            
            // 模擬載入延遲 (實際專案中可能是 API 呼叫)
            await new Promise(resolve => setTimeout(resolve, 800));
            
            // 收集表單資料
            const projectData = this.collectFormData();
            
            let result;
            if (this.editingProjectId) {
                // 更新專案
                result = dataManager.updateProject(this.editingProjectId, projectData);
            } else {
                // 新增專案
                result = dataManager.addProject(projectData);
            }
            
            if (result.success) {
                this.showToast(result.message, 'success');
                this.projectModal.hide();
                this.renderProjects();
            } else {
                this.showToast(result.message, 'error');
            }
            
        } catch (error) {
            console.error('儲存專案時發生錯誤:', error);
            this.showToast('儲存專案時發生未知錯誤', 'error');
        } finally {
            // 恢復按鈕狀態
            this.setButtonLoading(saveBtn, false);
        }
    }
    
    /**
     * 驗證表單
     * @returns {boolean} 是否通過驗證
     */
    validateForm() {
        if (!this.elements.projectForm) return false;
        
        this.elements.projectForm.classList.add('was-validated');
        return this.elements.projectForm.checkValidity();
    }
    
    /**
     * 收集表單資料
     * @returns {Object} 表單資料
     */
    collectFormData() {
        return {
            name: this.elements.projectName.value.trim(),
            description: this.elements.projectDescription.value.trim(),
            projectType: this.elements.projectType.value,
            status: this.elements.projectStatus.value,
            framework: this.elements.projectFramework.value,
            technologies: this.elements.projectTechnologies.value.trim(),
            repositoryUrl: this.elements.projectRepositoryUrl.value.trim(),
            websiteUrl: this.elements.projectWebsiteUrl.value.trim(),
            downloadUrl: this.elements.projectDownloadUrl.value.trim(),
            screenshots: this.elements.projectScreenshots.value.trim(),
            developmentLog: this.elements.projectDevelopmentLog.value.trim(),
            startDate: this.elements.projectStartDate.value,
            endDate: this.elements.projectEndDate.value
        };
    }
    
    /**
     * 確認刪除專案
     * @param {string} projectId - 專案 ID
     */
    confirmDeleteProject(projectId) {
        const project = dataManager.getProjectById(projectId);
        if (!project) {
            this.showToast('找不到指定的專案', 'error');
            return;
        }
        
        // 儲存要刪除的專案 ID
        this.pendingDeleteProjectId = projectId;
        
        // 更新確認對話框內容
        if (this.elements.deleteProjectName) {
            this.elements.deleteProjectName.textContent = project.name;
        }
        
        // 顯示確認對話框
        if (this.deleteConfirmModal) {
            this.deleteConfirmModal.show();
        }
    }
    
    /**
     * 執行刪除操作
     */
    executeDelete() {
        if (!this.pendingDeleteProjectId) return;
        
        const result = dataManager.deleteProject(this.pendingDeleteProjectId);
        
        if (result.success) {
            this.showToast(result.message, 'success');
            this.renderProjects();
        } else {
            this.showToast(result.message, 'error');
        }
        
        // 清理並關閉對話框
        this.pendingDeleteProjectId = null;
        if (this.deleteConfirmModal) {
            this.deleteConfirmModal.hide();
        }
    }
    
    /**
     * 顯示專案詳情
     * @param {string} projectId - 專案 ID
     */
    showProjectDetail(projectId) {
        const project = dataManager.getProjectById(projectId);
        if (!project) {
            this.showToast('找不到指定的專案', 'error');
            return;
        }
        
        this.renderProjectDetail(project);
        
        if (this.projectDetailModal) {
            this.projectDetailModal.show();
        }
    }
    
    /**
     * 渲染專案詳情
     * @param {Object} project - 專案資料
     */
    renderProjectDetail(project) {
        const image = project.screenshots && project.screenshots.length > 0 ? 
            project.screenshots[0] : 
            Utils.Project.getDefaultImage(project.projectType);
        
        const technologies = project.technologies.map(tech => 
            `<span class="badge bg-primary me-1 mb-1">${tech}</span>`
        ).join('');
        
        const links = [];
        if (project.repositoryUrl) {
            links.push(`<a href="${project.repositoryUrl}" target="_blank" class="btn btn-outline-secondary me-2 mb-2">
                <i class="fab fa-github me-1"></i>程式碼
            </a>`);
        }
        if (project.websiteUrl) {
            links.push(`<a href="${project.websiteUrl}" target="_blank" class="btn btn-outline-primary me-2 mb-2">
                <i class="fas fa-external-link-alt me-1"></i>網站
            </a>`);
        }
        if (project.downloadUrl) {
            links.push(`<a href="${project.downloadUrl}" target="_blank" class="btn btn-outline-success me-2 mb-2">
                <i class="fas fa-download me-1"></i>下載
            </a>`);
        }
        
        this.elements.projectDetailContent.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-4">
                    <img src="${image}" class="img-fluid rounded shadow project-detail-image" 
                         alt="${project.name}"
                         style="cursor: pointer;"
                         onclick="portfolioApp.showImageLightbox(['${image}'], 0, '${project.name}')"
                         onerror="this.src='${Utils.Project.getDefaultImage(project.projectType)}'">
                    ${project.screenshots && project.screenshots.length > 1 ? `
                        <div class="mt-3">
                            <h6 class="fw-bold mb-2">更多截圖</h6>
                            <div class="row g-2">
                                ${project.screenshots.slice(1).map((screenshot, index) => `
                                    <div class="col-4">
                                        <img src="${screenshot}" 
                                             class="img-fluid rounded thumbnail-image"
                                             style="cursor: pointer; height: 80px; object-fit: cover;"
                                             onclick="portfolioApp.showImageLightbox(${JSON.stringify(project.screenshots)}, ${index + 1}, '${project.name}')"
                                             onerror="this.src='${Utils.Project.getDefaultImage(project.projectType)}'">
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="col-md-6 mb-4">
                    <h3>${project.name}</h3>
                    <p class="text-muted mb-3">
                        <i class="${Utils.Project.getTypeIcon(project.projectType)} me-1"></i>
                        ${project.framework || project.projectType}
                        <span class="badge ${Utils.Project.getStatusBadgeClass(project.status)} ms-2">
                            ${project.status}
                        </span>
                    </p>
                    <p class="lead">${project.description || '暫無描述'}</p>
                    
                    <h6 class="fw-bold mt-4 mb-2">技術標籤</h6>
                    <div class="mb-3">${technologies || '<span class="text-muted">無</span>'}</div>
                    
                    <h6 class="fw-bold mt-4 mb-2">專案資訊</h6>
                    <ul class="list-unstyled">
                        ${project.startDate ? `<li><strong>開始日期:</strong> ${Utils.Format.date(project.startDate, 'full')}</li>` : ''}
                        ${project.endDate ? `<li><strong>結束日期:</strong> ${Utils.Format.date(project.endDate, 'full')}</li>` : ''}
                        <li><strong>建立時間:</strong> ${Utils.Format.date(project.createdAt, 'full')}</li>
                        <li><strong>更新時間:</strong> ${Utils.Format.date(project.updatedAt, 'full')}</li>
                    </ul>
                    
                    <h6 class="fw-bold mt-4 mb-2">相關連結</h6>
                    <div>
                        ${links.length > 0 ? links.join('') : '<span class="text-muted">無相關連結</span>'}
                    </div>
                </div>
            </div>
            
            ${project.developmentLog ? `
                <div class="row mt-4">
                    <div class="col-12">
                        <h6 class="fw-bold mb-3">開發紀錄</h6>
                        <div class="bg-light p-3 rounded">
                            <pre class="mb-0" style="white-space: pre-wrap;">${project.developmentLog}</pre>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }
    
    /**
     * 顯示圖片燈箱
     * @param {Array} images - 圖片陣列
     * @param {number} startIndex - 起始索引
     * @param {string} title - 標題
     */
    showImageLightbox(images, startIndex = 0, title = '') {
        if (!images || images.length === 0) return;
        
        // 更新標題
        if (this.elements.imageLightboxModal) {
            const modalTitle = this.elements.imageLightboxModal.querySelector('.modal-title');
            if (modalTitle) {
                modalTitle.textContent = title || '圖片檢視';
            }
        }
        
        // 生成輪播項目
        const carouselItems = images.map((image, index) => `
            <div class="carousel-item ${index === startIndex ? 'active' : ''} d-flex align-items-center justify-content-center">
                <img src="${image}" 
                     class="d-block" 
                     style="max-width: 90%; max-height: 90vh; object-fit: contain;"
                     alt="圖片 ${index + 1}">
            </div>
        `).join('');
        
        // 生成指示器
        const indicators = images.map((_, index) => `
            <button type="button" 
                    data-bs-target="#lightboxCarousel" 
                    data-bs-slide-to="${index}" 
                    ${index === startIndex ? 'class="active" aria-current="true"' : ''}
                    aria-label="圖片 ${index + 1}"></button>
        `).join('');
        
        // 更新內容
        if (this.elements.lightboxCarouselInner) {
            this.elements.lightboxCarouselInner.innerHTML = carouselItems;
        }
        
        if (this.elements.lightboxIndicators) {
            this.elements.lightboxIndicators.innerHTML = indicators;
        }
        
        // 顯示燈箱
        if (this.imageLightboxModal) {
            this.imageLightboxModal.show();
            
            // 確保輪播到正確的圖片
            setTimeout(() => {
                if (this.lightboxCarousel && startIndex > 0) {
                    this.lightboxCarousel.to(startIndex);
                }
            }, 150);
        }
    }
    
    /**
     * 顯示 Toast 通知
     * @param {string} message - 訊息內容
     * @param {string} type - 訊息類型 ('success', 'error', 'warning', 'info')
     * @param {number} duration - 顯示時間(毫秒)，0 表示不自動隱藏
     */
    showToast(message, type = 'info', duration = 5000) {
        if (!this.elements.toastTemplate || !this.elements.toastContainer) return;
        
        // 複製模板
        const toastElement = this.elements.toastTemplate.cloneNode(true);
        toastElement.id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        toastElement.classList.remove('d-none');
        
        // 設定類型樣式
        const typeConfig = {
            success: {
                class: 'text-bg-success',
                icon: 'fas fa-check-circle'
            },
            error: {
                class: 'text-bg-danger',
                icon: 'fas fa-exclamation-circle'
            },
            warning: {
                class: 'text-bg-warning',
                icon: 'fas fa-exclamation-triangle'
            },
            info: {
                class: 'text-bg-info',
                icon: 'fas fa-info-circle'
            }
        };
        
        const config = typeConfig[type] || typeConfig.info;
        toastElement.classList.add(config.class);
        
        // 設定內容
        const iconElement = toastElement.querySelector('.toast-icon');
        const messageElement = toastElement.querySelector('.toast-message');
        
        if (iconElement) {
            iconElement.className = `toast-icon me-2 ${config.icon}`;
        }
        
        if (messageElement) {
            messageElement.textContent = message;
        }
        
        // 設定自動隱藏時間
        if (duration > 0) {
            toastElement.setAttribute('data-bs-delay', duration);
        } else {
            toastElement.setAttribute('data-bs-autohide', 'false');
        }
        
        // 添加到容器
        this.elements.toastContainer.appendChild(toastElement);
        
        // 初始化並顯示 Toast
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // 當 Toast 隱藏後移除元素
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
    
    /**
     * 初始化動畫
     */
    initAnimations() {
        // 滾動觸發動畫
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // 觀察需要動畫的元素
        const animatedElements = Utils.DOM.getElements('.animate-on-scroll');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    /**
     * 更新活動導航連結
     * @param {string} targetId - 目標區塊 ID
     */
    updateActiveNavLink(targetId) {
        this.elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    /**
     * 根據滾動位置更新活動導航連結
     */
    updateActiveNavLinkOnScroll() {
        const sections = ['#hero', '#projects', '#skills', '#contact'];
        let currentSection = '';
        
        for (let section of sections) {
            const element = Utils.DOM.getElement(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                // 考慮導航列高度
                if (rect.top <= 100 && rect.bottom >= 100) {
                    currentSection = section;
                    break;
                }
            }
        }
        
        if (currentSection) {
            this.updateActiveNavLink(currentSection);
        }
    }
    
    /**
     * 取得應用程式狀態
     * @returns {Object} 應用程式狀態
     */
    getAppState() {
        return {
            isInitialized: this.isInitialized,
            currentFilters: this.currentFilters,
            currentSort: this.currentSort,
            editingProjectId: this.editingProjectId,
            projectCount: dataManager.getAllProjects().length
        };
    }
    
    /**
     * 顯示全域載入指示器
     * @param {string} message - 載入訊息
     */
    showLoader(message = '載入中，請稍候...') {
        if (this.elements.globalLoader) {
            if (this.elements.loaderMessage) {
                this.elements.loaderMessage.textContent = message;
            }
            this.elements.globalLoader.classList.remove('d-none');
        }
    }
    
    /**
     * 隱藏全域載入指示器
     */
    hideLoader() {
        if (this.elements.globalLoader) {
            this.elements.globalLoader.classList.add('d-none');
        }
    }
    
    /**
     * 設定頁面載入進度
     * @param {number} progress - 進度百分比 (0-100)
     */
    setLoadProgress(progress) {
        if (this.elements.pageLoadProgress) {
            const progressBar = this.elements.pageLoadProgress.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
                
                if (progress >= 100) {
                    setTimeout(() => {
                        this.elements.pageLoadProgress.style.opacity = '0';
                        setTimeout(() => {
                            this.elements.pageLoadProgress.style.display = 'none';
                        }, 300);
                    }, 200);
                }
            }
        }
    }
    
    /**
     * 顯示 Skeleton 載入效果
     * @param {HTMLElement} container - 容器元素
     * @param {number} count - Skeleton 數量
     */
    showSkeleton(container, count = 3) {
        if (!container) return;
        
        const skeletonHtml = Array(count).fill(0).map(() => `
            <div class="col-lg-4 col-md-6 col-12 mb-4">
                <div class="card skeleton-project-card skeleton">
                    <div class="skeleton-image skeleton"></div>
                    <div class="card-body">
                        <div class="skeleton-text wide skeleton"></div>
                        <div class="skeleton-text medium skeleton"></div>
                        <div class="skeleton-text narrow skeleton"></div>
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skeletonHtml;
    }
    
    /**
     * 設定按鈕載入狀態
     * @param {HTMLElement} button - 按鈕元素
     * @param {boolean} loading - 是否載入中
     * @param {string} loadingText - 載入中的文字
     */
    setButtonLoading(button, loading, loadingText = '處理中...') {
        if (!button) return;
        
        if (loading) {
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.disabled = true;
            button.classList.add('btn-loading');
        } else {
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
            button.classList.remove('btn-loading');
            delete button.dataset.originalText;
        }
    }
}

// 當 DOM 完全載入後初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    // 建立全域應用程式實例
    window.portfolioApp = new PortfolioApp();
});

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('全域錯誤:', e.error);
    if (window.portfolioApp) {
        window.portfolioApp.showToast('發生意外錯誤，請重新整理頁面', 'error');
    }
});

// 未處理的 Promise 拒絕
window.addEventListener('unhandledrejection', (e) => {
    console.error('未處理的 Promise 拒絕:', e.reason);
    if (window.portfolioApp) {
        window.portfolioApp.showToast('系統發生錯誤', 'error');
    }
});
