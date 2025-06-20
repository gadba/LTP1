document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN Y CONSTANTES ---
    const API_URL = "https://script.google.com/macros/s/AKfycbxOpc9kmJly3hzq_mJmMeQrpGIEoysWjIhuO1ju6ZjfDjvtWRerY5yCkf2M2ZnrEkxu/exec";
    const OFFER_PASSWORD = "314";
    const ABBREVIATIONS = {"1 Galón": "1g", "2 galones (medio cuñete)": "2g", "4 galones (cuñete)": "4g", "5 galones (cuñete)": "5g", ".¼ galón (cuarto)": "1/4g", ".½ galón (medio)": "1/2g", ".¾ galón (trilón)": "Tri.", "Unidad": "Un.", "(Parte A galón) base": "A", "(Parte B cuarto) catalizador aducto amina": "B", "(Parte B galón) catalizador": "B", "Juego": "Jg."};
    
    const STORE_DISPLAY_NAMES = { "Manongo": "Pinturas Mañongo", "Sureinca": "Pinturas Sureinca Aragua" };
    const STORE_PASSWORDS = { "Manongo": "314214772", "Sureinca": "314498711" };
    const BS_FORMATTER = new Intl.NumberFormat('es-ES', { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // --- ESTADO ---
    const state = { fullStoreData: [], storeData: {}, selectedStore: null, isOfferMode: false, activeMenu: null, activeTipo: null, searchTerm: '', bcvRate: 0 };

    // --- ELEMENTOS DEL DOM ---
    const elements = {
        body: document.body, initialWelcomeMessage: document.getElementById('initial-welcome-message'),
        logoSpan: document.querySelector('.logo span'), menuTabsContainer: document.getElementById('menu-tabs-container'),
        tipoTabsContainer: document.getElementById('tipo-tabs-container'), contentContainer: document.getElementById('catalog-content-container'),
        offerToggle: document.getElementById('offer-toggle'), loadingIndicator: document.getElementById('loading-indicator'),
        bcvRateDisplay: document.getElementById('bcv-rate-display'), storeModalOverlay: document.getElementById('store-modal-overlay'),
        storeButtonsContainer: document.getElementById('store-buttons-container'), rateModalOverlay: document.getElementById('rate-modal-overlay'),
        rateForm: document.getElementById('rate-form'), rateInput: document.getElementById('rate-input'),
        searchInput: document.getElementById('search-input'), clearSearchBtn: document.getElementById('clear-search-btn'),
        productDetailModalOverlay: document.getElementById('product-detail-modal-overlay'), detailModalProductName: document.getElementById('detail-modal-product-name'),
        productDetailContent: document.getElementById('product-detail-content'), closeDetailModalBtn: document.getElementById('close-detail-modal-btn'),
    };
    
    // --- RENDERIZADO ---
    function renderUI() { renderTabs(); renderProductTable(); }
    
    function renderTabs() {
        const createTab = (text, dataKey, isActive, className) => {
            const tab = document.createElement('button');
            tab.className = className;
            if (isActive && !state.searchTerm) tab.classList.add('active');
            tab.textContent = text;
            tab.dataset[dataKey] = text;
            return tab;
        };
        elements.menuTabsContainer.innerHTML = '';
        Object.keys(state.storeData).forEach(menuName => elements.menuTabsContainer.appendChild(createTab(menuName, 'menu', menuName === state.activeMenu, 'menu-button')));
        elements.tipoTabsContainer.innerHTML = '';
        if (state.activeMenu && state.storeData[state.activeMenu]) {
            Object.keys(state.storeData[state.activeMenu]).forEach(tipoName => elements.tipoTabsContainer.appendChild(createTab(tipoName, 'tipo', tipoName === state.activeTipo, 'tipo-button')));
        }
    }

    function renderProductTable() {
        let products = [];
        if (state.searchTerm) {
            products = state.fullStoreData.filter(p => p.tienda === state.selectedStore && p.name.toLowerCase().includes(state.searchTerm));
        } else if (state.activeMenu && state.activeTipo && state.storeData[state.activeMenu]?.[state.activeTipo]?.products) {
            products = [...state.storeData[state.activeMenu][state.activeTipo].products];
        }

        if (products.length === 0) {
            const message = state.searchTerm ? `No se encontraron productos que coincidan con "${state.searchTerm}".` : `Seleccione una categoría para ver los productos.`;
            elements.contentContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">${message}</p>`;
            return;
        }
        
        const sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name));
        const groupedProducts = sortedProducts.reduce((acc, p) => ({...acc, [p.name]: [...(acc[p.name] || []), p]}), {});
        
        let cardsHtml = '<div class="product-card-container">';
        Object.values(groupedProducts).forEach(productGroup => {
            const firstProduct = productGroup[0];
            
            // MODIFICADO: Añadido el div contenedor
            cardsHtml += `<div class="product-card">
                            <h3 class="product-card-title">${firstProduct.name}</h3>
                            <div class="table-responsive-wrapper">
                                <table class="presentations-table">
                                    <thead><tr><th></th>`;
            productGroup.forEach(p => {
                cardsHtml += `<th>${ABBREVIATIONS[p.pres] || p.pres}</th>`;
            });
            cardsHtml += `</tr></thead><tbody>`;

            cardsHtml += `<tr><td>Precio $</td>`;
            productGroup.forEach(p => cardsHtml += `<td class="price-cell" data-name="${p.name}" data-pres="${p.pres}" data-price-normal="${p.normalPrice}" data-price-special="${p.specialPrice}">${p.normalPrice.toFixed(2)}</td>`);
            cardsHtml += `</tr>`;

            cardsHtml += `<tr><td>Precio Bs.</td>`;
            productGroup.forEach(p => {
                const precioEnBs = p.normalPrice * state.bcvRate;
                cardsHtml += `<td class="price-cell" data-name="${p.name}" data-pres="${p.pres}" data-price-normal="${p.normalPrice}" data-price-special="${p.specialPrice}"><span class="price-bs">${BS_FORMATTER.format(precioEnBs)}</span></td>`;
            });
            cardsHtml += `</tr>`;

            cardsHtml += `<tr class="offer-row"><td>Pago en $</td>`;
            productGroup.forEach(p => cardsHtml += `<td class="price-cell" data-name="${p.name}" data-pres="${p.pres}" data-price-normal="${p.normalPrice}" data-price-special="${p.specialPrice}">${p.specialPrice.toFixed(2)}</td>`);
            cardsHtml += `</tr>`;
            
            cardsHtml += `</tbody></table></div></div>`;
        });
        cardsHtml += '</div>';
        elements.contentContainer.innerHTML = cardsHtml;
    }
    
    // ... (el resto del script.js no tiene cambios) ...
    function showLoading(isLoading, message = '') {
        elements.loadingIndicator.style.display = isLoading ? 'block' : 'none';
        if (isLoading) elements.loadingIndicator.textContent = message;
    }
    
    function updateBodyClasses() {
        elements.body.classList.toggle('offer-mode-on', state.isOfferMode);
    }

    // --- MANEJADORES DE EVENTOS ---
    function handleContentClick(event) {
        const cell = event.target.closest('td.price-cell');
        if (!cell || !cell.dataset.name) return;
        
        const data = cell.dataset;
        const normalPrice = parseFloat(data.priceNormal);
        const specialPrice = parseFloat(data.priceSpecial);
        const priceInBs = normalPrice * state.bcvRate;

        elements.detailModalProductName.textContent = data.name;
        let detailsHtml = '<ul>';
        detailsHtml += `<li>Presentación: <strong>${data.pres}</strong></li>`;
        detailsHtml += `<li>Precio $: <strong>${normalPrice.toFixed(2)}</strong></li>`;
        detailsHtml += `<li>Precio Bs: <strong class="price-bs">${BS_FORMATTER.format(priceInBs)}</strong></li>`;
        if (state.isOfferMode && specialPrice > 0) {
            detailsHtml += `<li>Pago en $: <strong>${specialPrice.toFixed(2)}</strong></li>`;
        }
        detailsHtml += '</ul>';
        elements.productDetailContent.innerHTML = detailsHtml;
        elements.productDetailModalOverlay.classList.add('visible');
    }

    function closeDetailModal() { elements.productDetailModalOverlay.classList.remove('visible'); }

    function handleStoreSelection(event) {
        if (!event.target.matches('.store-button')) return;
        const storeName = event.target.dataset.store;
        const expectedPassword = STORE_PASSWORDS[storeName];
        if (!expectedPassword || prompt(`Por favor, ingrese la contraseña para la tienda ${storeName}:`) === expectedPassword) {
            proceedToNextStep(storeName);
        } else {
            alert("Contraseña incorrecta.");
        }
    }

    function proceedToNextStep(storeName) {
        state.selectedStore = storeName;
        elements.logoSpan.textContent = STORE_DISPLAY_NAMES[storeName] || storeName;
        processDataForStore();
        elements.storeModalOverlay.classList.remove('visible');
        elements.rateModalOverlay.classList.add('visible');
        elements.rateInput.focus();
    }

    function handleInitialRateSubmit(event) {
        event.preventDefault();
        if (validateAndSetRate(elements.rateInput.value)) {
            elements.rateModalOverlay.classList.remove('visible');
            initializeAppUI();
        } else {
            elements.rateInput.select();
        }
    }

    function handleRateClick() {
        if (!state.selectedStore) return;
        const newRateInput = prompt("Modificar Tasa BCV:", state.bcvRate.toFixed(4));
        if (newRateInput !== null && validateAndSetRate(newRateInput)) renderProductTable();
    }

    function handleOfferToggle(event) {
        const checkbox = event.target;
        if (checkbox.checked) {
            const pwd = prompt("Ingrese la clave para ver los precios de pago en $: ");
            state.isOfferMode = pwd === OFFER_PASSWORD;
            if (!state.isOfferMode) { alert("Clave incorrecta."); checkbox.checked = false; }
        } else {
            state.isOfferMode = false;
        }
        updateBodyClasses();
        renderProductTable();
    }
    
    function handleSearchInput(event) {
        state.searchTerm = event.target.value.trim().toLowerCase();
        elements.clearSearchBtn.style.display = state.searchTerm ? 'block' : 'none';

        if (state.searchTerm) {
            document.querySelectorAll('.menu-button.active, .tipo-button.active').forEach(b => b.classList.remove('active'));
        }
        renderProductTable();
    }
    
    function handleClearSearch() {
        elements.searchInput.value = '';
        handleSearchInput({ target: { value: '' } });
        elements.searchInput.focus();
    }

    function validateAndSetRate(rawInput) {
        if (!rawInput || rawInput.trim() === "") { alert("Por favor, introduce un valor para la tasa."); return false; }
        const parsedRate = parseFloat(rawInput.replace(',', '.'));
        if (!isNaN(parsedRate) && parsedRate > 0) {
            state.bcvRate = parsedRate;
            elements.bcvRateDisplay.innerHTML = `<span class="rate-title">Tasa BCV</span><span class="rate-value">${state.bcvRate.toFixed(4)}</span>`;
            return true;
        }
        alert("El valor introducido no es un número válido."); return false;
    }

    function processDataForStore() {
        const storeProducts = state.fullStoreData.filter(item => item.tienda === state.selectedStore);
        const nestedData = storeProducts.reduce((acc, product) => {
            const { menu, tipo, ...restOfProduct } = product;
            if (!acc[menu]) acc[menu] = {};
            if (!acc[menu][tipo]) acc[menu][tipo] = { products: [] };
            acc[menu][tipo].products.push(restOfProduct);
            return acc;
        }, {});
        state.storeData = nestedData;
        const menus = Object.keys(state.storeData);
        if (menus.length > 0) {
            state.activeMenu = menus[0];
            const tipos = Object.keys(state.storeData[state.activeMenu] || {});
            state.activeTipo = tipos.length > 0 ? tipos[0] : null;
        }
    }
    
    function initializeAppUI() {
        elements.body.classList.remove('app-loading');
        renderUI();
    }
    
    async function initialFetchAndSetup() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`Error de red: ${response.status} ${response.statusText}`);
            const rawData = await response.json();
            if (!Array.isArray(rawData)) throw new Error("El formato de datos del servidor es incorrecto.");
            state.fullStoreData = rawData;
            const stores = [...new Set(state.fullStoreData.map(item => item.tienda).filter(Boolean))].sort();
            if (stores.length > 0) {
                elements.storeButtonsContainer.innerHTML = '';
                stores.forEach(storeName => {
                    const button = document.createElement('button');
                    button.className = 'store-button'; button.textContent = storeName; button.dataset.store = storeName;
                    elements.storeButtonsContainer.appendChild(button);
                });
                elements.initialWelcomeMessage.classList.add('hidden');
                setTimeout(() => elements.storeModalOverlay.classList.add('visible'), 500);
            } else { throw new Error("No se encontraron tiendas en los datos."); }
        } catch (error) {
            elements.initialWelcomeMessage.querySelector('span').textContent = `Error: ${error.message}. Recargue la página.`;
        }
    }

    function setupEventListeners() {
        elements.rateForm.addEventListener('submit', handleInitialRateSubmit);
        elements.storeButtonsContainer.addEventListener('click', handleStoreSelection);
        elements.bcvRateDisplay.addEventListener('click', handleRateClick);
        elements.offerToggle.addEventListener('change', handleOfferToggle);
        elements.searchInput.addEventListener('input', handleSearchInput);
        elements.clearSearchBtn.addEventListener('click', handleClearSearch);
        elements.menuTabsContainer.addEventListener('click', (e) => { if (e.target.matches('.menu-button')) { state.activeMenu = e.target.dataset.menu; state.activeTipo = Object.keys(state.storeData[state.activeMenu] || {})[0] || null; renderUI(); } });
        elements.tipoTabsContainer.addEventListener('click', (e) => { if (e.target.matches('.tipo-button')) { state.activeTipo = e.target.dataset.tipo; renderUI(); } });
        elements.contentContainer.addEventListener('click', handleContentClick);
        elements.closeDetailModalBtn.addEventListener('click', closeDetailModal);
        elements.productDetailModalOverlay.addEventListener('click', (e) => e.target === elements.productDetailModalOverlay && closeDetailModal());
    }

    setupEventListeners();
    initialFetchAndSetup();
});
