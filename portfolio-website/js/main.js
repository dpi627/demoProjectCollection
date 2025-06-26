/* ==========================================================================
   個人作品集網站 - 主要邏輯檔案
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
            
            // Toast
            toastNotification: Utils.DOM.getElement('#toastNotification'),
            toastBody: Utils.DOM.getElement('#toastBody'),
            
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
        
        // 初始化 Toast
        if (this.elements.toastNotification) {
            this.toast = new bootstrap.Toast(this.elements.toastNotification);
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
        
        // 表單提交
        if (this.elements.projectForm) {
            this.elements.projectForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSaveProject();
            });
        }
        
        // 平滑滾動導航
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    Utils.Animation.scrollTo(href);
                }
            });
        });
        
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
            if (this.projectModal && this.elements.projectModal.classList.contains('show')) {
                this.projectModal.hide();
            }
            if (this.projectDetailModal && this.elements.projectDetailModal.classList.contains('show')) {
                this.projectDetailModal.hide();
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
            className: 'col-12 col-md-6 col-lg-4 col-xl-3'
        });
        
        const image = project.screenshots && project.screenshots.length > 0 ? 
            project.screenshots[0] : 
            Utils.Project.getDefaultImage(project.projectType);
        
        const technologies = project.technologies.slice(0, 3).map(tech => 
            `<span class="badge bg-primary me-1 mb-1">${tech}</span>`
        ).join('');
        
        const moreCount = project.technologies.length > 3 ? 
            `<span class="badge bg-secondary">+${project.technologies.length - 3}</span>` : '';
        
        col.innerHTML = `
            <div class="card project-card h-100 shadow-sm">
                <img src="${image}" class="card-img-top" alt="${project.name}" 
                     onerror="this.src='${Utils.Project.getDefaultImage(project.projectType)}'">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${project.name}</h5>
                    <p class="card-subtitle text-muted mb-2">
                        <i class="${Utils.Project.getTypeIcon(project.projectType)} project-type-icon me-1"></i>
                        ${project.framework || project.projectType}
                        <span class="badge ${Utils.Project.getStatusBadgeClass(project.status)} ms-2">
                            ${project.status}
                        </span>
                    </p>
                    <p class="card-text text-truncate-2 flex-grow-1">
                        ${project.description || '暫無描述'}
                    </p>
                    <div class="project-technologies mb-3">
                        ${technologies}
                        ${moreCount}
                    </div>
                    <div class="project-actions mt-auto">
                        <div class="btn-group w-100" role="group">
                            <button type="button" class="btn btn-outline-primary btn-sm" 
                                    onclick="portfolioApp.showProjectDetail('${project.id}')" 
                                    title="檢視詳情">
                                <i class="fas fa-eye me-1"></i>檢視
                            </button>
                            ${project.repositoryUrl ? 
                                `<a href="${project.repositoryUrl}" target="_blank" 
                                    class="btn btn-outline-secondary btn-sm" title="查看程式碼">
                                    <i class="fab fa-github me-1"></i>程式碼
                                </a>` : ''
                            }
                            ${project.websiteUrl ? 
                                `<a href="${project.websiteUrl}" target="_blank" 
                                    class="btn btn-outline-success btn-sm" title="查看網站">
                                    <i class="fas fa-external-link-alt me-1"></i>網站
                                </a>` : ''
                            }
                        </div>
                        <div class="btn-group w-100 mt-2" role="group">
                            <button type="button" class="btn btn-outline-warning btn-sm" 
                                    onclick="portfolioApp.showEditProjectModal('${project.id}')" 
                                    title="編輯專案">
                                <i class="fas fa-edit me-1"></i>編輯
                            </button>
                            <button type="button" class="btn btn-outline-danger btn-sm" 
                                    onclick="portfolioApp.confirmDeleteProject('${project.id}')" 
                                    title="刪除專案">
                                <i class="fas fa-trash me-1"></i>刪除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return col;
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
     * 處理儲存專案
     */
    async handleSaveProject() {
        try {
            // 驗證表單
            if (!this.validateForm()) {
                return;
            }
            
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
        
        if (confirm(`確定要刪除專案「${project.name}」嗎？此操作無法復原。`)) {
            this.deleteProject(projectId);
        }
    }
    
    /**
     * 刪除專案
     * @param {string} projectId - 專案 ID
     */
    deleteProject(projectId) {
        const result = dataManager.deleteProject(projectId);
        
        if (result.success) {
            this.showToast(result.message, 'success');
            this.renderProjects();
        } else {
            this.showToast(result.message, 'error');
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
                    <img src="${image}" class="img-fluid rounded shadow" alt="${project.name}"
                         onerror="this.src='${Utils.Project.getDefaultImage(project.projectType)}'">
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
     * 顯示 Toast 通知
     * @param {string} message - 訊息內容
     * @param {string} type - 訊息類型 ('success', 'error', 'warning', 'info')
     */
    showToast(message, type = 'info') {
        if (!this.elements.toastBody || !this.toast) return;
        
        // 設定訊息內容
        this.elements.toastBody.textContent = message;
        
        // 設定樣式
        this.elements.toastNotification.className = `toast align-items-center toast-${type}`;
        
        // 顯示 Toast
        this.toast.show();
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
