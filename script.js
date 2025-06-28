// ======================================================
// === SECCIÓN DE CONFIGURACIÓN DE FIREBASE =============
// ======================================================

const firebaseConfig = {
    apiKey: "AIzaSyD4LPgjUDQ4ptHBR29UTtb22GVwfYfYupw",
    authDomain: "catalogo-pinturas.firebaseapp.com",
    projectId: "catalogo-pinturas",
    storageBucket: "catalogo-pinturas.firebasestorage.app",
    messagingSenderId: "855939553285",
    appId: "1:855939553285:web:8d7a9878fde8d385e0246c"
};

firebase.initializeApp(firebaseConfig);
const db_firestore = firebase.firestore();

console.log("Firebase conectado y listo para leer/escribir.");


// ======================================================
// === VARIABLES GLOBALES Y CONSTANTES ==================
// ======================================================

const OFFER_PASSWORD = "314";
const MAX_DISCOUNT_PERCENTAGE = 10;
const ABBREVIATIONS = { "1 Galón": "1g", "2 galones (medio cuñete)": "2g", "4 galones (cuñete)": "4g", "5 galones (cuñete)": "5g", ".¼ galón (cuarto)": "1/4g", ".½ galón (medio)": "1/2g", ".¾ galón (trilón)": "Tri.", "Unidad": "Un.", "(Parte A galón) base": "A", "(Parte B cuarto) catalizador aducto amina": "B", "(Parte B galón) catalizador": "B", "Juego": "Jg.", "Octavo de galón": "1/8g" };
const STORE_DISPLAY_NAMES = { "Manongo": "Pinturas Mañongo", "Sureinca": "Pinturas Sureinca Aragua" };
const STORE_PASSWORDS = { "Manongo": "314214772", "Sureinca": "314498711" };
const STORE_DETAILS = {
    "Manongo": { rif: "J-31421477-2", contact: "Tlf: 0414-9409606   pinturasmanongo@gmail.com" },
    "Sureinca": { rif: "J-31449871-1", contact: "Tlf: 0243-2367809   sureinca_aragua@hotmail.com" }
};
const BS_FORMATTER = new Intl.NumberFormat('es-ES', { useGrouping: true, minimumFractionDigits: 2, maximumFractionDigits: 2 });
const IVA_RATE = 1.16;

const state = {
    fullStoreData: [], storeData: {}, selectedStore: null, isOfferMode: false,
    activeMenu: null, activeTipo: null, searchTerm: '', bcvRate: 0,
    workArea: { items: [], discountPercentage: 0, editingId: null, editingType: null, client: null },
    clientInfoAction: null,
    modal: { currentRecordForPdf: null },
    activeView: 'precios',
    colorCharts: [],
    activeEmpresa: 'Todos',
    // **NUEVO** Estado para los reportes
    reporte: {
        datos: [],
        sortColumn: 'dinero',
        sortDirection: 'desc'
    }
};

let elements = {};


// ======================================================
// === DECLARACIÓN DE TODAS LAS FUNCIONES ===============
// ======================================================

function initializeElements() {
    elements = {
        body: document.body, initialWelcomeMessage: document.getElementById('initial-welcome-message'),
        hamburgerBtn: document.getElementById('hamburger-btn'),
        sidebarOverlay: document.getElementById('sidebar-overlay'),
        sidebarMenu: document.getElementById('sidebar-menu'),
        closeSidebarBtn: document.getElementById('close-sidebar-btn'),
        sidebarLinks: document.querySelectorAll('.sidebar-link'),
        catalogNavBars: document.getElementById('catalog-nav-bars'),
        catalogViewContainer: document.getElementById('catalog-view-container'),
        colorChartsViewContainer: document.getElementById('color-charts-view-container'),
        colorChartsContentContainer: document.getElementById('color-charts-content-container'),
        colorChartsFilters: document.getElementById('color-charts-filters'),
        empresaFilterSelect: document.getElementById('empresa-filter-select'),
        reportsViewContainer: document.getElementById('reports-view-container'),
        lastUpdateDisplay: document.getElementById('last-update-display'),
        searchContainer: document.getElementById('search-container'),
        logoSpan: document.querySelector('.logo span'),
        menuTabsContainer: document.getElementById('menu-tabs-container'),
        tipoTabsContainer: document.getElementById('tipo-tabs-container'),
        contentContainer: document.getElementById('catalog-content-container'),
        offerToggle: document.getElementById('offer-toggle'),
        loadingIndicator: document.getElementById('loading-indicator'),
        bcvRateDisplay: document.getElementById('bcv-rate-display'),
        storeModalOverlay: document.getElementById('store-modal-overlay'),
        storeButtonsContainer: document.getElementById('store-buttons-container'),
        rateModalOverlay: document.getElementById('rate-modal-overlay'),
        rateForm: document.getElementById('rate-form'),
        rateInput: document.getElementById('rate-input'),
        searchInput: document.getElementById('search-input'),
        clearSearchBtn: document.getElementById('clear-search-btn'),
        productDetailModalOverlay: document.getElementById('product-detail-modal-overlay'),
        productDetailModalProductName: document.getElementById('product-detail-modal-product-name'),
        productDetailContent: document.getElementById('product-detail-content'),
        closeProductDetailModalBtn: document.getElementById('close-product-detail-modal-btn'),
        addToWorkAreaBtn: document.getElementById('add-to-work-area-btn'),
        quantityInput: document.getElementById('quantity-input'),
        colorSelect: document.getElementById('color-select'),
        colorSelectionContainer: document.getElementById('color-selection-container'),
        workAreaFab: document.getElementById('work-area-fab'),
        workAreaItemCount: document.getElementById('work-area-item-count'),
        themeToggle: document.getElementById('theme-toggle'),
        workAreaModalOverlay: document.getElementById('work-area-modal-overlay'),
        closeWorkAreaModalBtn: document.getElementById('close-work-area-modal-btn'),
        workAreaTitle: document.getElementById('work-area-title'),
        workAreaContentContainer: document.getElementById('work-area-content-container'),
        workAreaFooter: document.getElementById('work-area-footer'),
        workAreaTotals: document.getElementById('work-area-totals'),
        discountInput: document.getElementById('discount-input'),
        applyDiscountBtn: document.getElementById('apply-discount-btn'),
        mainActions: document.getElementById('main-actions'),
        saveQuoteBtn: document.getElementById('save-quote-btn'),
        registerSaleBtn: document.getElementById('register-sale-btn'),
        clearWorkAreaBtn: document.getElementById('clear-work-area-btn'),
        saleOptions: document.getElementById('sale-options'),
        offerPricingOption: document.getElementById('offer-pricing-option'),
        offerPricingLabel: document.getElementById('offer-pricing-label'),
        confirmSaleBtn: document.getElementById('confirm-sale-btn'),
        clientInfoModalOverlay: document.getElementById('client-info-modal-overlay'),
        closeClientInfoBtn: document.getElementById('close-client-info-btn'),
        cancelClientInfoBtn: document.getElementById('cancel-client-info-btn'),
        clientInfoForm: document.getElementById('client-info-form'),
        clientNameInput: document.getElementById('client-name-input'),
        clientRifInput: document.getElementById('client-rif-input'),
        clientInfoTitle: document.getElementById('client-info-title'),
        clientInfoDescription: document.getElementById('client-info-description'),
        historyBtn: document.getElementById('history-btn'),
        historyChoiceModalOverlay: document.getElementById('history-choice-modal-overlay'),
        closeHistoryChoiceModalBtn: document.getElementById('close-history-choice-modal-btn'),
        viewQuotesHistoryBtn: document.getElementById('view-quotes-history-btn'),
        viewSalesHistoryBtn: document.getElementById('view-sales-history-btn'),
        historyListModalOverlay: document.getElementById('history-list-modal-overlay'),
        closeHistoryListModalBtn: document.getElementById('close-history-list-modal-btn'),
        historyListTitle: document.getElementById('history-list-title'),
        historyListContainer: document.getElementById('history-list-container'),
        historyTotalsSummary: document.getElementById('history-totals-summary'),
        historyDatePicker: document.getElementById('history-date-picker'),
        detailModalOverlay: document.getElementById('detail-modal-overlay'),
        closeDetailModalBtn: document.getElementById('close-detail-modal-btn'),
        detailTitle: document.getElementById('detail-title'),
        detailContent: document.getElementById('detail-content'),
        downloadPdfBtn: document.getElementById('download-pdf-btn'),
        notificationModal: document.getElementById('notification-modal-overlay'),
        notificationTitle: document.getElementById('notification-title'),
        notificationMessage: document.getElementById('notification-message'),
        notificationOkBtn: document.getElementById('notification-ok-btn'),
        notificationCancelBtn: document.getElementById('notification-cancel-btn'),
        promptModal: document.getElementById('prompt-modal-overlay'),
        promptTitle: document.getElementById('prompt-title'),
        promptMessage: document.getElementById('prompt-message'),
        promptForm: document.getElementById('prompt-form'),
        promptInput: document.getElementById('prompt-input'),
        promptOkBtn: document.querySelector('#prompt-form button[type="submit"]'),
        promptCancelBtn: document.getElementById('prompt-cancel-btn'),
        successModal: document.getElementById('success-modal-overlay'),
        successTitle: document.getElementById('success-title'),
        successMessage: document.getElementById('success-message'),
        successActionBtn: document.getElementById('success-action-btn'),
        successCloseBtn: document.getElementById('success-close-btn'),
        reportStartDate: document.getElementById('report-start-date'),
        reportEndDate: document.getElementById('report-end-date'),
        reportFilterMenu: document.getElementById('report-filter-menu'),
        reportFilterTipo: document.getElementById('report-filter-tipo'),
        reportFilterPres: document.getElementById('report-filter-pres'),
        reportFilterProducto: document.getElementById('report-filter-producto'),
        reportGroupBy: document.getElementById('report-group-by'),
        reportMetric: document.getElementById('report-metric'),
        generateReportBtn: document.getElementById('generate-report-btn'),
        reportResultsContainer: document.getElementById('report-results-container'),
    };
}

async function initialFetchAndSetup() {
    try {
        showLoading(true, "Conectando con la base de datos...");
        await db_firestore.enablePersistence({synchronizeTabs:true}).catch(err => {
            console.warn("No se pudo habilitar la persistencia multi-pestaña:", err.message);
        });

        showLoading(true, "Cargando datos de productos...");
        const productsSnapshot = await db_firestore.collection('productos').get();
        const firestoreData = [];
        productsSnapshot.forEach(doc => firestoreData.push(doc.data()));
        if (firestoreData.length === 0) {
            throw new Error("La base de datos de productos en Firestore está vacía o no se pudo cargar.");
        }
        state.fullStoreData = firestoreData;
        
        showLoading(true, "Cargando datos adicionales...");
        const optionalDataPromises = [
            db_firestore.collection('cartas_colores').get().catch(e => { console.warn("Fallo al cargar cartas_colores", e); return null; }),
            db_firestore.collection('metadata').doc('lastUpdate').get().catch(e => { console.warn("Fallo al cargar metadata", e); return null; })
        ];
        
        const [chartsSnapshot, metadataSnapshot] = await Promise.all(optionalDataPromises);

        if (chartsSnapshot) {
            const chartsData = [];
            chartsSnapshot.forEach(doc => chartsData.push(doc.data()));
            state.colorCharts = chartsData.sort((a,b) => a.empresa.localeCompare(b.empresa) || a.producto.localeCompare(b.producto));
        }
        
        if (metadataSnapshot && metadataSnapshot.exists) {
            const lastUpdateTimestamp = metadataSnapshot.data().timestamp;
            const updateDate = new Date(lastUpdateTimestamp);
            const formattedDate = updateDate.toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            if (elements.lastUpdateDisplay) {
                elements.lastUpdateDisplay.textContent = `Precios act. el ${formattedDate}`;
                elements.lastUpdateDisplay.style.display = 'block';
            }
        }

        const stores = [...new Set(state.fullStoreData.map(item => String(item.tienda || '').trim()).filter(Boolean))].sort();
        if (stores.length > 0) {
            elements.storeButtonsContainer.innerHTML = '';
            stores.forEach(storeKey => {
                const button = document.createElement('button');
                button.className = 'store-button';
                button.textContent = STORE_DISPLAY_NAMES[storeKey] || storeKey;
                button.dataset.store = storeKey;
                elements.storeButtonsContainer.appendChild(button);
            });
            setTimeout(() => { document.getElementById('store-modal-overlay').classList.add('visible'); }, 300);
        } else {
            throw new Error("No se encontraron tiendas en los datos de productos.");
        }
    } catch (error) {
        console.error("Error CRÍTICO en initialFetchAndSetup:", error);
        document.querySelector('#initial-welcome-message span').textContent = `Error: ${error.message}. Recargue la página.`;
    } finally {
        showLoading(false);
    }
}

function showNotification(message, title = "Notificación", okText = "Aceptar") { return new Promise(resolve => { elements.notificationTitle.textContent = title; elements.notificationMessage.textContent = message; elements.notificationOkBtn.textContent = okText; elements.notificationCancelBtn.style.display = 'none'; elements.notificationOkBtn.onclick = () => { elements.notificationModal.classList.remove('visible'); resolve(true); }; elements.notificationModal.classList.add('visible'); }); }
function showConfirmation(message, title = "Confirmación", okText = "Aceptar", cancelText = "Cancelar") { return new Promise(resolve => { elements.notificationTitle.textContent = title; elements.notificationMessage.textContent = message; elements.notificationOkBtn.textContent = okText; elements.notificationCancelBtn.textContent = cancelText; elements.notificationCancelBtn.style.display = 'inline-flex'; elements.notificationOkBtn.onclick = () => { elements.notificationModal.classList.remove('visible'); resolve(true); }; elements.notificationCancelBtn.onclick = () => { elements.notificationModal.classList.remove('visible'); resolve(false); }; elements.notificationModal.classList.add('visible'); }); }
function showPrompt(message, title = "Entrada Requerida", inputType = 'password') { return new Promise(resolve => { elements.promptTitle.textContent = title; elements.promptMessage.textContent = message; elements.promptInput.type = inputType; elements.promptInput.value = ''; const formSubmitHandler = (e) => { e.preventDefault(); elements.promptModal.classList.remove('visible'); elements.promptForm.removeEventListener('submit', formSubmitHandler); resolve(elements.promptInput.value); }; const cancelHandler = () => { elements.promptModal.classList.remove('visible'); elements.promptForm.removeEventListener('submit', formSubmitHandler); resolve(null); }; elements.promptForm.addEventListener('submit', formSubmitHandler); elements.promptCancelBtn.onclick = cancelHandler; elements.promptModal.classList.add('visible'); elements.promptInput.focus(); }); }
function showSuccessModal(title, message, actionText, recordData) { elements.successTitle.textContent = title; elements.successMessage.textContent = message; elements.successActionBtn.textContent = actionText; state.modal.currentRecordForPdf = recordData; elements.successModal.classList.add('visible'); feather.replace(); }
function processDataForStore() { const storeProducts = state.fullStoreData.filter(item => { const tiendaInData = item.tienda ? String(item.tienda).trim() : ''; return tiendaInData === state.selectedStore; }); const nestedData = storeProducts.reduce((acc, product) => { const menuKey = (product.menu || "").trim() || 'General'; const tipoKey = (product.tipo || "").trim() || 'General'; if (!acc[menuKey]) { acc[menuKey] = {}; } if (!acc[menuKey][tipoKey]) { acc[menuKey][tipoKey] = { products: [] }; } acc[menuKey][tipoKey].products.push(product); return acc; }, {}); state.storeData = nestedData; const menus = Object.keys(state.storeData).sort(); if (menus.length > 0) { state.activeMenu = menus[0]; const tipos = Object.keys(state.storeData[state.activeMenu] || {}).sort((a, b) => a.localeCompare(b)); state.activeTipo = tipos.length > 0 ? tipos[0] : null; } else { state.activeMenu = null; state.activeTipo = null; } }
async function finalizeQuote(clientName, clientRif) { const subTotal = state.workArea.items.reduce((sum, item) => sum + (item.quantity * item.product.normalPrice), 0); const discountValue = subTotal * (state.workArea.discountPercentage / 100); const grandTotal = subTotal - discountValue; let quoteObject = { timestamp: firebase.firestore.FieldValue.serverTimestamp(), client: { name: clientName, rif: clientRif }, items: state.workArea.items, totals: { subTotal, discountPercentage: state.workArea.discountPercentage, discountValue, grandTotal }, bcvRate: state.bcvRate, store: state.selectedStore }; try { const collectionRef = db_firestore.collection('cotizaciones'); let docId; if (state.workArea.editingId) { docId = state.workArea.editingId; await collectionRef.doc(docId).set(quoteObject, { merge: true }); quoteObject.id = docId; showSuccessModal('Cotización Actualizada', `La cotización #${docId} ha sido actualizada.`, 'Descargar PDF', quoteObject); } else { const docRef = await collectionRef.add(quoteObject); docId = docRef.id; quoteObject.id = docId; showSuccessModal('Cotización Guardada', `Se ha guardado la cotización para ${clientName}.`, 'Descargar PDF', quoteObject); } state.workArea = { items: [], discountPercentage: 0, editingId: null, editingType: null, client: null }; updateWorkAreaIndicator(); elements.workAreaModalOverlay.classList.remove('visible'); } catch (error) { console.error("Error al guardar cotización en Firestore:", error); showNotification("Error al guardar la cotización.", "Error"); } }
async function finalizeSale(clientName, clientRif) { const pricingMethod = document.querySelector('input[name="pricing-method"]:checked').value; let subTotal = state.workArea.items.reduce((sum, item) => sum + (item.quantity * item.product.normalPrice), 0); let grandTotal = 0; let discountValue = 0; let finalDiscountPercentage = state.workArea.discountPercentage; if (pricingMethod === 'Oferta en $') { grandTotal = state.workArea.items.reduce((sum, item) => { const price = item.product.specialPrice > 0 ? item.product.specialPrice : item.product.normalPrice; return sum + (item.quantity * price); }, 0); subTotal = state.workArea.items.reduce((sum, item) => sum + (item.quantity * item.product.normalPrice), 0); finalDiscountPercentage = 0; discountValue = 0; } else { discountValue = subTotal * (state.workArea.discountPercentage / 100); grandTotal = subTotal - discountValue; } const saleObject = { timestamp: firebase.firestore.FieldValue.serverTimestamp(), client: { name: clientName, rif: clientRif }, items: state.workArea.items, totals: { subTotal, discountPercentage: finalDiscountPercentage, discountValue, grandTotal }, pricingMethod: pricingMethod, bcvRate: state.bcvRate, store: state.selectedStore }; try { const collectionRef = db_firestore.collection('ventas'); let docId; if (state.workArea.editingId) { docId = state.workArea.editingId; await collectionRef.doc(docId).set(saleObject, { merge: true }); saleObject.id = docId; showSuccessModal('Venta Actualizada', `La venta #${docId} ha sido actualizada.`, 'Descargar PDF', saleObject); } else { const docRef = await collectionRef.add(saleObject); docId = docRef.id; saleObject.id = docId; showSuccessModal('Venta Registrada', `Se ha registrado la venta para ${clientName}.`, 'Descargar PDF', saleObject); } state.workArea = { items: [], discountPercentage: 0, editingId: null, editingType: null, client: null }; updateWorkAreaIndicator(); elements.workAreaModalOverlay.classList.remove('visible'); } catch (error) { console.error("Error al registrar venta en Firestore:", error); showNotification("Error al registrar la venta.", "Error"); } }
async function openHistory(type, date) { elements.historyChoiceModalOverlay.classList.remove('visible'); const collectionName = type; elements.historyListTitle.textContent = type === 'cotizaciones' ? 'Historial de Cotizaciones' : 'Historial de Ventas'; try { const start = new Date(date); start.setHours(0, 0, 0, 0); const end = new Date(date); end.setHours(23, 59, 59, 999); const querySnapshot = await db_firestore.collection(collectionName).where('store', '==', state.selectedStore).where('timestamp', '>=', start).where('timestamp', '<=', end).orderBy('timestamp', 'desc').get(); const records = []; querySnapshot.forEach(doc => { const data = doc.data(); const record = { id: doc.id, ...data, timestamp: data.timestamp ? data.timestamp.toMillis() : new Date().getTime() }; records.push(record); }); if (type === 'cotizaciones') { renderQuotesHistory(records); } else { renderSalesHistory(records); } elements.historyListModalOverlay.classList.add('visible'); feather.replace(); } catch (error) { console.error(`Error al obtener historial de ${type} desde Firestore:`, error); showNotification(`Error al obtener el historial: ${error.message}`, "Error"); } }
async function handleEditRecord(type, id) { try { const doc = await db_firestore.collection(type).doc(id).get(); if (!doc.exists) { showNotification("No se encontró el registro para editar.", "Error"); return; } const record = { id: doc.id, ...doc.data() }; state.workArea = { items: record.items, discountPercentage: record.totals.discountPercentage, editingId: id, editingType: type, client: record.client }; elements.historyListModalOverlay.classList.remove('visible'); elements.detailModalOverlay.classList.remove('visible'); renderWorkArea(); elements.workAreaModalOverlay.classList.add('visible'); feather.replace(); } catch (error) { console.error("Error al cargar para editar desde Firestore:", error); showNotification("Error al cargar el registro para editar.", "Error"); } }
async function handleDeleteRecord(type, id) { const typeText = type === 'cotizaciones' ? 'la cotización' : 'la venta'; const confirmed = await showConfirmation(`¿Estás seguro de que quieres eliminar ${typeText} #${id}? Esta acción no se puede deshacer.`); if (confirmed) { try { await db_firestore.collection(type).doc(id).delete(); showNotification("Registro eliminado.", "Éxito"); const currentDate = elements.historyDatePicker.value; openHistory(type, currentDate); } catch (error) { console.error("Error al eliminar en Firestore:", error); showNotification("No se pudo eliminar el registro.", "Error"); } } }
async function openDetail(type, id) { try { const doc = await db_firestore.collection(type).doc(id).get(); if (!doc.exists) { showNotification("No se encontró el registro.", "Error"); return; } const recordData = doc.data(); const record = { id: doc.id, ...recordData, timestamp: recordData.timestamp ? recordData.timestamp.toMillis() : new Date().getTime() }; elements.downloadPdfBtn.dataset.recordObject = JSON.stringify(record); elements.downloadPdfBtn.dataset.type = type; elements.detailTitle.textContent = type === 'cotizaciones' ? `Cotización para ${record.client.name}` : `Venta a ${record.client.name}`; let detailHtml = `<p><strong>RIF/C.I.:</strong> ${record.client.rif}</p><p><strong>Fecha:</strong> ${new Date(record.timestamp).toLocaleString('es-ES')}</p><hr>`; let tableHtml = `<table class="quote-table"><thead><tr><th class="col-product">Producto</th><th class="col-pres">Pres.</th><th class="col-qty">Cant.</th><th class="col-price">P. Unit.</th><th class="col-total">Total</th></tr></thead><tbody>`; record.items.forEach(item => { const price = (type === 'ventas' && record.pricingMethod === 'Oferta en $') ? (item.product.specialPrice || item.product.normalPrice) : item.product.normalPrice; const colorHtml = item.color ? `<span class="quote-product-color">(${item.color})</span>` : ''; tableHtml += `<tr><td class="col-product">${item.product.name} ${colorHtml}</td><td class="col-pres">${item.product.pres}</td><td class="col-qty" style="text-align:center;">${item.quantity}</td><td class="col-price">$${price.toFixed(2)}</td><td class="col-total"><strong>$${(item.quantity * price).toFixed(2)}</strong></td></tr>`; }); tableHtml += '</tbody></table>'; const totalBs = record.totals.grandTotal * record.bcvRate; let totalsHtml = `<div id="work-area-totals" style="margin-top: 1rem;">`; if (type === 'cotizaciones' || record.pricingMethod !== 'Oferta en $') { totalsHtml += `<div class="total-line"><span class="total-label">Subtotal $:</span><span class="total-value">${record.totals.subTotal.toFixed(2)}</span></div>`; } if (record.totals.discountValue > 0) { totalsHtml += `<div class="total-line"><span class="total-label">Descuento (${record.totals.discountPercentage}%):</span><span class="total-value">- ${record.totals.discountValue.toFixed(2)}</span></div>`; } totalsHtml += `<div class="total-line" style="font-weight: bold;"><span class="total-label">Total $:</span><span class="total-value">${record.totals.grandTotal.toFixed(2)}</span></div>`; if (type === 'cotizaciones') { totalsHtml += `<div class="total-line"><span class="total-label">Total Bs:</span><span class="total-value">${BS_FORMATTER.format(totalBs)}</span></div>`; } totalsHtml += `</div>`; let tagsHtml = ''; if (type === 'cotizaciones') { tagsHtml = '<span class="tag tag-quote">Cotización</span>'; } else { if (record.pricingMethod === 'Oferta en $') { tagsHtml = '<span class="tag tag-offer">Oferta en $</span>'; } else { tagsHtml = `<span class="tag ${record.pricingMethod === 'Pago $' ? 'tag-usd' : 'tag-bs'}">${record.pricingMethod}</span>`; } } const infoTags = `<div class="history-item-tags" style="justify-content: flex-end; margin-top: 1rem;">${tagsHtml}</div>`; elements.detailContent.innerHTML = detailHtml + tableHtml + totalsHtml + infoTags; elements.detailModalOverlay.classList.add('visible'); feather.replace(); } catch (error) { console.error("Error al abrir detalle desde Firestore:", error); showNotification("Error al abrir el detalle.", "Error"); } }
function applyTheme(theme) { document.body.classList.toggle('light-mode', theme === 'light'); if (elements.themeToggle) { elements.themeToggle.checked = (theme === 'light'); } }
function setupTheme() { const savedTheme = localStorage.getItem('theme') || 'dark'; applyTheme(savedTheme); }
function updateView() { elements.sidebarLinks.forEach(link => { link.classList.toggle('active', link.dataset.view === state.activeView); }); const isCatalogView = state.activeView === 'precios'; const isChartsView = state.activeView === 'cartas'; const isReportsView = state.activeView === 'reportes'; elements.catalogViewContainer.classList.toggle('hidden', !isCatalogView); elements.colorChartsViewContainer.classList.toggle('hidden', !isChartsView); elements.reportsViewContainer.classList.toggle('hidden', !isReportsView); elements.catalogNavBars.style.display = isCatalogView ? 'flex' : 'none'; elements.colorChartsFilters.style.display = isChartsView ? 'flex' : 'none'; elements.searchContainer.style.visibility = isCatalogView ? 'visible' : 'hidden'; elements.workAreaFab.style.display = isCatalogView ? 'flex' : 'none'; if (isCatalogView) { renderCatalogUI(); } else if (isChartsView) { renderEmpresaFilter(); renderColorCharts(); } else if (isReportsView) { setupReportFilters(); } feather.replace(); }
function renderCatalogUI() { renderTabs(); renderProductTable(); }
function renderTabs() { if (!elements.menuTabsContainer || !elements.tipoTabsContainer) return; const createTab = (text, dataKey, isActive, className) => { const tab = document.createElement('button'); tab.className = className; if (isActive && !state.searchTerm) tab.classList.add('active'); tab.textContent = text; tab.dataset[dataKey] = text; return tab; }; elements.menuTabsContainer.innerHTML = ''; Object.keys(state.storeData).forEach(menuName => { if(menuName && menuName !== 'General') elements.menuTabsContainer.appendChild(createTab(menuName, 'menu', menuName === state.activeMenu, 'menu-button')) }); elements.tipoTabsContainer.innerHTML = ''; if (state.activeMenu && state.storeData[state.activeMenu]) { Object.keys(state.storeData[state.activeMenu]).sort((a,b) => a.localeCompare(b)).forEach(tipoName => { if(tipoName && tipoName !== 'General') elements.tipoTabsContainer.appendChild(createTab(tipoName, 'tipo', tipoName === state.activeTipo, 'tipo-button')); }); } }
function renderProductTable() { if(!elements.contentContainer) return; let products = []; if (state.searchTerm) { products = state.fullStoreData.filter(p => p.tienda === state.selectedStore && p.name.toLowerCase().includes(state.searchTerm)); } else if (state.activeMenu && state.activeTipo && state.storeData[state.activeMenu]?.[state.activeTipo]?.products) { products = [...state.storeData[state.activeMenu][state.activeTipo].products]; } const sortedProducts = products.sort((a, b) => a.name.localeCompare(b.name)); const groupedProducts = sortedProducts.reduce((acc, p) => ({...acc, [p.name]: [...(acc[p.name] || []), p]}), {}); let cardsHtml = '<div class="product-card-container">'; let productsFound = false; Object.values(groupedProducts).forEach(productGroup => { const hasValidPrice = productGroup.some(p => p.normalPrice > 0); if (hasValidPrice) { productsFound = true; const firstProduct = productGroup[0]; cardsHtml += `<div class="product-card"><h3 class="product-card-title">${firstProduct.name}</h3><div class="table-responsive-wrapper"><table class="presentations-table"><thead><tr><th></th>`; productGroup.forEach(p => { cardsHtml += `<th>${ABBREVIATIONS[p.pres] || p.pres}</th>`; }); cardsHtml += `</tr></thead><tbody>`; cardsHtml += `<tr class="price-row"><td>Precio $</td>`; productGroup.forEach(p => { cardsHtml += `<td class="price-cell" data-name="${p.name}" data-pres="${p.pres}" data-price-normal="${p.normalPrice}" data-price-special="${p.specialPrice}">${p.normalPrice.toFixed(2)}</td>`; }); cardsHtml += `</tr>`; cardsHtml += `<tr class="price-row"><td>Precio Bs.</td>`; productGroup.forEach(p => { const precioEnBs = p.normalPrice * state.bcvRate; const bsPriceString = BS_FORMATTER.format(precioEnBs); const priceParts = bsPriceString.split(','); const priceHtml = `<span class="price-bs"><span class="price-integer">${priceParts[0]}</span><span class="price-decimal">,${priceParts[1] || '00'}</span></span>`; cardsHtml += `<td class="price-cell" data-name="${p.name}" data-pres="${p.pres}" data-price-normal="${p.normalPrice}" data-price-special="${p.specialPrice}">${priceHtml}</td>`; }); cardsHtml += `</tr>`; cardsHtml += `<tr class="offer-row price-row"><td>Oferta $</td>`; productGroup.forEach(p => { cardsHtml += `<td class="price-cell" data-name="${p.name}" data-pres="${p.pres}" data-price-normal="${p.normalPrice}" data-price-special="${p.specialPrice}">${p.specialPrice.toFixed(2)}</td>`; }); cardsHtml += `</tr></tbody></table></div></div>`; } }); cardsHtml += '</div>'; if (!productsFound && products.length > 0) { const message = state.searchTerm ? `No se encontraron productos con precio que coincidan con "${state.searchTerm}".` : `No hay productos con precios definidos en esta categoría.`; elements.contentContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">${message}</p>`; } else if (products.length === 0) { elements.contentContainer.innerHTML = `<p style="text-align:center; padding: 2rem;">No se encontraron productos.</p>`; } else { elements.contentContainer.innerHTML = cardsHtml; } }
function renderEmpresaFilter() { const empresas = [...new Set(state.colorCharts.map(c => c.empresa))].sort(); elements.empresaFilterSelect.innerHTML = '<option value="Todos">Todas las Empresas</option>'; empresas.forEach(empresa => { const option = document.createElement('option'); option.value = empresa; option.textContent = empresa; elements.empresaFilterSelect.appendChild(option); }); elements.empresaFilterSelect.value = state.activeEmpresa; }
function renderColorCharts() { const filteredCharts = state.activeEmpresa === 'Todos' ? state.colorCharts : state.colorCharts.filter(c => c.empresa === state.activeEmpresa); let html = '<div id="color-charts-gallery">'; if (filteredCharts.length > 0) { filteredCharts.forEach(carta => { html += `<a href="${carta.urlCarta}" target="_blank" rel="noopener noreferrer" class="color-chart-card-link"><div class="color-chart-card"><div class="color-chart-placeholder"><span class="placeholder-text">${carta.producto}</span></div><div class="title-container"><div class="empresa-title">${carta.empresa}</div><div class="producto-title">${carta.producto}</div></div></div></a>`; }); } else { html += '<p class="empty-message">No hay cartas de colores para la empresa seleccionada.</p>'; } html += '</div>'; elements.colorChartsContentContainer.innerHTML = html; }
function showLoading(isLoading, message = '') { if(elements.initialWelcomeMessage) { elements.initialWelcomeMessage.style.display = isLoading ? 'flex' : 'none'; if (isLoading) { document.querySelector('#initial-welcome-message span').textContent = message; } } }
function updateBodyClasses() { if(elements.body) elements.body.classList.toggle('offer-mode-on', state.isOfferMode); }
function handleContentClick(event) { const cell = event.target.closest('td.price-cell'); if (!cell || !cell.dataset.name) return; const product = state.fullStoreData.find(p => p.tienda === state.selectedStore && p.name === cell.dataset.name && p.pres === cell.dataset.pres ); if (!product) return; const { normalPrice, specialPrice, colors } = product; const priceInBs = normalPrice * state.bcvRate; elements.productDetailModalProductName.textContent = product.name; let detailsHtml = '<ul>'; detailsHtml += `<li><span class="detail-label">Presentación:</span><strong class="detail-value">${product.pres}</strong></li>`; detailsHtml += `<li><span class="detail-label">Precio $:</span><strong class="detail-value">${normalPrice.toFixed(2)}</strong></li>`; detailsHtml += `<li><span class="detail-label">Precio Bs:</span><strong class="detail-value">${BS_FORMATTER.format(priceInBs)}</strong></li>`; if (state.isOfferMode && specialPrice > 0) { detailsHtml += `<li><span class="detail-label offer-label">Oferta en $:</span><strong class="detail-value">${specialPrice.toFixed(2)}</strong></li>`; } detailsHtml += '</ul>'; elements.productDetailContent.innerHTML = detailsHtml; elements.quantityInput.value = 1; if (colors && colors.length > 0) { let sortedColors = [...colors]; const blancoIndex = sortedColors.findIndex(c => c.trim().toLowerCase() === 'blanco'); if (blancoIndex > -1) { const blanco = sortedColors.splice(blancoIndex, 1)[0]; sortedColors.sort((a, b) => a.localeCompare(b)); sortedColors.unshift(blanco); } else { sortedColors.sort((a, b) => a.localeCompare(b)); } elements.colorSelect.innerHTML = sortedColors.map(color => `<option value="${color}">${color}</option>`).join(''); elements.colorSelectionContainer.style.display = 'flex'; } else { elements.colorSelectionContainer.style.display = 'none'; } elements.productDetailModalOverlay.dataset.product = JSON.stringify(product); elements.productDetailModalOverlay.classList.add('visible'); }
function closeProductDetailModal() { elements.productDetailModalOverlay.classList.remove('visible'); }
function updateWorkAreaIndicator() { const count = state.workArea.items.reduce((sum, item) => sum + item.quantity, 0); elements.workAreaItemCount.textContent = count; elements.workAreaItemCount.style.display = count > 0 ? 'flex' : 'none'; }
async function handleAddToWorkArea() { const product = JSON.parse(elements.productDetailModalOverlay.dataset.product); if (!product) return; const quantity = parseInt(elements.quantityInput.value, 10); if (isNaN(quantity) || quantity < 1) { await showNotification("Por favor, ingrese una cantidad válida.", "Error de Cantidad"); return; } let color = ''; if (elements.colorSelectionContainer.style.display !== 'none') { color = elements.colorSelect.value; } const itemId = `${product.name}-${product.pres}-${color}`; const existingItemIndex = state.workArea.items.findIndex(item => item.id === itemId); if (existingItemIndex > -1) { state.workArea.items[existingItemIndex].quantity += quantity; } else { state.workArea.items.push({ id: itemId, product: product, quantity: quantity, color: color }); } updateWorkAreaIndicator(); closeProductDetailModal(); }
function renderWorkArea() { if (!elements.workAreaContentContainer || !elements.workAreaFooter) return; elements.workAreaTitle.textContent = state.workArea.editingId ? `Editando ${state.workArea.editingType === 'cotizaciones' ? 'Cotización' : 'Venta'} #${state.workArea.editingId}` : 'Borrador Actual'; elements.discountInput.value = state.workArea.discountPercentage > 0 ? state.workArea.discountPercentage : ''; elements.saleOptions.classList.add('hidden'); elements.mainActions.classList.remove('hidden'); if (state.workArea.items.length === 0) { elements.workAreaContentContainer.innerHTML = `<p class="empty-message">Añade productos para empezar.</p>`; elements.workAreaFooter.style.display = 'none'; return; } elements.workAreaFooter.style.display = 'flex'; let subTotal = 0; let offerTotal = 0; const sortedItems = [...state.workArea.items].sort((a, b) => a.product.name.localeCompare(b.product.name)); const tableRows = sortedItems.map(item => { const price = item.product.normalPrice; const lineTotal = item.quantity * price; subTotal += lineTotal; if (item.product.specialPrice > 0) { offerTotal += item.quantity * item.product.specialPrice; } else { offerTotal += lineTotal; } const colorHtml = item.color ? `<span class="quote-product-color">(${item.color})</span>` : ''; return `<tr data-id="${item.id}"><td class="col-product">${item.product.name} ${colorHtml}</td><td class="col-pres">${item.product.pres}</td><td class="col-qty"><div class="quote-qty-controls"><button class="quote-qty-btn" data-action="decrease">-</button><span class="quote-qty-value">${item.quantity}</span><button class="quote-qty-btn" data-action="increase">+</button></div></td><td class="col-price">$${price.toFixed(2)}</td><td class="col-total"><strong>$${lineTotal.toFixed(2)}</strong></td><td class="col-delete"><button class="quote-delete-btn" data-action="delete" title="Eliminar">×</button></td></tr>`; }).join(''); elements.workAreaContentContainer.innerHTML = `<table class="quote-table"><thead><tr><th class="col-product">Producto</th><th class="col-pres">Pres.</th><th class="col-qty">Cant.</th><th class="col-price">P. Unit.</th><th class="col-total">Total</th><th class="col-delete"></th></tr></thead><tbody>${tableRows}</tbody></table>`; const discountValue = subTotal * (state.workArea.discountPercentage / 100); const grandTotal = subTotal - discountValue; const grandTotalBs = grandTotal * state.bcvRate; let totalsHtml = `<div class="total-line"><span class="total-label">Subtotal $:</span><span class="total-value">${subTotal.toFixed(2)}</span></div>`; if (discountValue > 0) { totalsHtml += `<div class="total-line"><span class="total-label">Descuento (${state.workArea.discountPercentage}%):</span><span class="total-value">- ${discountValue.toFixed(2)}</span></div>`; } totalsHtml += `<div class="total-line" style="font-weight: bold;"><span class="total-label">Total $:</span><span class="total-value">${grandTotal.toFixed(2)}</span></div>`; totalsHtml += `<div class="total-line"><span class="total-label">Total Bs:</span><span class="total-value">${BS_FORMATTER.format(grandTotalBs)}</span></div>`; if (state.isOfferMode) { totalsHtml += `<div class="total-line offer-total-line" style="margin-top:0.5rem;"><span class="total-label">Total Oferta en $:</span><span class="total-value">${offerTotal.toFixed(2)}</span></div>`; } elements.workAreaTotals.innerHTML = totalsHtml; }
function handleWorkAreaActions(event) { const button = event.target.closest('[data-action]'); if (!button) return; const row = button.closest('tr'); if (!row) return; const itemId = row.dataset.id; const itemIndex = state.workArea.items.findIndex(item => item.id === itemId); if (itemIndex === -1) return; const action = button.dataset.action; if (action === 'increase') { state.workArea.items[itemIndex].quantity++; } else if (action === 'decrease') { state.workArea.items[itemIndex].quantity--; if (state.workArea.items[itemIndex].quantity <= 0) { state.workArea.items.splice(itemIndex, 1); } } else if (action === 'delete') { state.workArea.items.splice(itemIndex, 1); } renderWorkArea(); updateWorkAreaIndicator(); }
async function openClientInfoModal(action, client) { if (state.workArea.items.length === 0) { await showNotification("El borrador está vacío.", "Aviso"); return; } const clientData = client || { name: '', rif: '' }; state.clientInfoAction = action; elements.clientInfoTitle.textContent = action === 'saveQuote' ? 'Datos para la Cotización' : 'Datos para la Venta'; elements.clientInfoDescription.textContent = action === 'saveQuote' ? 'Ingrese los datos del cliente para guardar la cotización.' : 'Ingrese los datos del cliente para registrar la venta.'; elements.clientInfoForm.reset(); elements.clientNameInput.value = clientData.name; elements.clientRifInput.value = clientData.rif; elements.clientInfoModalOverlay.classList.add('visible'); elements.clientNameInput.focus(); }
async function handleClientInfoSubmit(event) { event.preventDefault(); const clientName = elements.clientNameInput.value.trim(); const clientRif = elements.clientRifInput.value.trim(); elements.clientInfoModalOverlay.classList.remove('visible'); if (state.clientInfoAction === 'saveQuote') { await finalizeQuote(clientName, clientRif); } else if (state.clientInfoAction === 'registerSale') { await finalizeSale(clientName, clientRif); } }
function renderQuotesHistory(records) { elements.historyTotalsSummary.innerHTML = ''; let listHtml = ''; if (records.length === 0) { listHtml = '<p class="empty-message">No hay cotizaciones registradas para esta fecha.</p>'; } else { listHtml = '<div class="history-column" style="width: 100%;">'; listHtml += `<div class="history-column-header">Cotizaciones</div><div class="history-column-content">`; records.forEach(record => { listHtml += createHistoryItemHtml(record, 'cotizaciones'); }); listHtml += '</div></div>'; } elements.historyListContainer.innerHTML = listHtml; }
function renderSalesHistory(records) { const salesByMethod = { 'Pago $': [], 'Pago Bs.': [], 'Oferta en $': [] }; records.forEach(r => { if(r.pricingMethod in salesByMethod){ salesByMethod[r.pricingMethod].push(r); } }); const showOfferColumn = state.isOfferMode; let columnsHtml = ''; const createColumn = (title, sales) => { let columnContent = sales.map(sale => createHistoryItemHtml(sale, 'ventas')).join(''); return `<div class="history-column"><div class="history-column-header">${title}</div><div class="history-column-content">${columnContent || '<p class="empty-message small">Sin ventas</p>'}</div></div>`; }; columnsHtml += createColumn('Pago $', salesByMethod['Pago $']); columnsHtml += createColumn('Pago Bs.', salesByMethod['Pago Bs.']); if(showOfferColumn) { columnsHtml += createColumn('Oferta en $', salesByMethod['Oferta en $']); } elements.historyListContainer.innerHTML = records.length > 0 ? columnsHtml : '<p class="empty-message">No hay ventas registradas para esta fecha.</p>'; const totalVentaDolar = salesByMethod['Pago $'].reduce((sum, r) => sum + r.totals.grandTotal, 0); const totalVentaBs = salesByMethod['Pago Bs.'].reduce((sum, r) => sum + r.totals.grandTotal * r.bcvRate, 0); const totalVentaBsInUsd = salesByMethod['Pago Bs.'].reduce((sum, r) => sum + r.totals.grandTotal, 0); const totalOfertaDolar = salesByMethod['Oferta en $'].reduce((sum, r) => sum + r.totals.grandTotal, 0); const ventaTotalEnDolar = totalVentaDolar + totalVentaBsInUsd; const granTotalVenta = totalVentaDolar + totalOfertaDolar; const granTotalVentaDia = totalVentaDolar + totalVentaBsInUsd + totalOfertaDolar; let summaryHtml = ` <div class="left-totals"> <div class="total-line">Venta en $: <strong>$${totalVentaDolar.toFixed(2)}</strong></div> <div class="total-line">Venta en Bs.: <strong>${BS_FORMATTER.format(totalVentaBs)}</strong></div> <div class="total-line">Venta total en $: <strong>$${ventaTotalEnDolar.toFixed(2)}</strong></div> </div> `; if (showOfferColumn) { summaryHtml += ` <div class="right-totals"> <div class="total-line grand-total-day">Gran Total Venta en $: <strong>$${granTotalVenta.toFixed(2)}</strong></div> <div class="total-line grand-total-day">Gran Total Venta del Día en $: <strong>$${granTotalVentaDia.toFixed(2)}</strong></div> </div> `; } elements.historyTotalsSummary.innerHTML = records.length > 0 ? summaryHtml : ''; }
function createHistoryItemHtml(record, type) { const recordTime = new Date(record.timestamp).toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true }); let totalDisplay; if(type === 'ventas' && record.pricingMethod === 'Pago Bs.') { totalDisplay = `${BS_FORMATTER.format(record.totals.grandTotal * record.bcvRate)} Bs.`; } else { totalDisplay = `$${record.totals.grandTotal.toFixed(2)}`; } return ` <div class="history-item" data-id="${record.id}" data-type="${type}"> <div class="history-item-line-1"> <div class="client-name-time"> <span class="time">${recordTime}</span> <span class="client-name">${record.client.name}</span> </div> <div class="history-item-actions"> <button class="edit-btn" title="Editar"><i data-feather="edit-2" class="feather-small"></i></button> <button class="delete-btn" title="Eliminar"><i data-feather="trash-2" class="feather-small"></i></button> </div> </div> <div class="history-item-line-2"> <div class="record-total">${totalDisplay}</div> </div> </div> `; }
function generatePdf(type, record) { const { jsPDF } = window.jspdf; const doc = new jsPDF(); const storeInfo = STORE_DETAILS[record.store]; const isQuote = type === 'cotizaciones'; const docTitle = isQuote ? 'COTIZACIÓN' : 'RECIBO DE VENTA'; doc.setFontSize(20); doc.text(STORE_DISPLAY_NAMES[record.store], 14, 22); doc.setFontSize(10); doc.text(storeInfo.rif, 14, 28); doc.text(storeInfo.contact, 14, 34); doc.setFontSize(12); doc.text(docTitle, 205, 22, { align: 'right' }); doc.text(`Fecha: ${new Date(record.timestamp).toLocaleDateString('es-ES')}`, 205, 28, { align: 'right' }); let showBcv = true; if(!isQuote && record.pricingMethod === 'Oferta en $') { showBcv = false; } if(showBcv) { doc.text(`Tasa BCV: ${record.bcvRate.toFixed(2)}`, 205, 34, { align: 'right' }); } doc.text("Cliente:", 14, 46); doc.text(record.client.name, 30, 46); doc.text("RIF/C.I.:", 14, 52); doc.text(record.client.rif, 30, 52); let tableBody; const footerRows = []; const tableHead = [['Cant.', 'Producto', 'Pres.', 'Color', 'P. Unit.', 'Total']]; if (isQuote) { const subTotalWithoutVAT = record.items.reduce((sum, item) => sum + (item.quantity * (item.product.normalPrice / IVA_RATE)), 0); const discountValueOnSubtotal = subTotalWithoutVAT * (record.totals.discountPercentage / 100); const baseImponible = subTotalWithoutVAT - discountValueOnSubtotal; const ivaAmount = baseImponible * (IVA_RATE - 1); const totalPagar = baseImponible + ivaAmount; tableBody = record.items.map(item => { const priceWithoutVAT = item.product.normalPrice / IVA_RATE; return [ item.quantity, item.product.name, item.product.pres, item.color, `$${priceWithoutVAT.toFixed(2)}`, `$${(item.quantity * priceWithoutVAT).toFixed(2)}` ]; }); footerRows.push([{ content: 'SubTotal:', colSpan: 5, styles: { halign: 'right' } }, { content: `$${subTotalWithoutVAT.toFixed(2)}`, styles: { halign: 'right' } }]); if (record.totals.discountPercentage > 0) { footerRows.push([{ content: `Descuento (${record.totals.discountPercentage}%):`, colSpan: 5, styles: { halign: 'right' } }, { content: `-$${discountValueOnSubtotal.toFixed(2)}`, styles: { halign: 'right' } }]); } footerRows.push([{ content: 'IVA (16%):', colSpan: 5, styles: { halign: 'right' } }, { content: `$${ivaAmount.toFixed(2)}`, styles: { halign: 'right' } }]); footerRows.push([{ content: 'Total a Pagar ($):', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: `$${totalPagar.toFixed(2)}`, styles: { halign: 'right', fontStyle: 'bold' } }]); footerRows.push([{ content: 'Total a Pagar (Bs.):', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: `${BS_FORMATTER.format(totalPagar * record.bcvRate)}`, styles: { halign: 'right', fontStyle: 'bold' } }]); } else { tableBody = record.items.map(item => { const price = record.pricingMethod === 'Oferta en $' ? (item.product.specialPrice || item.product.normalPrice) : item.product.normalPrice; return [ item.quantity, item.product.name, item.product.pres, item.color, `$${price.toFixed(2)}`, `$${(item.quantity * price).toFixed(2)}` ]; }); if (record.pricingMethod !== 'Oferta en $') { footerRows.push([{ content: 'Subtotal:', colSpan: 5, styles: { halign: 'right' } }, { content: `$${record.totals.subTotal.toFixed(2)}`, styles: { halign: 'right' } }]); } if (record.totals.discountValue > 0) { footerRows.push([{ content: `Descuento (${record.totals.discountPercentage}%):`, colSpan: 5, styles: { halign: 'right' } }, { content: `-$${record.totals.discountValue.toFixed(2)}`, styles: { halign: 'right' } }]); } const finalTotal = record.totals.grandTotal; footerRows.push([{ content: 'TOTAL ($):', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: `$${finalTotal.toFixed(2)}`, styles: { halign: 'right', fontStyle: 'bold' } }]); if (record.pricingMethod !== 'Oferta en $') { footerRows.push([{ content: 'TOTAL (Bs.):', colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: `${BS_FORMATTER.format(finalTotal * record.bcvRate)}`, styles: { halign: 'right', fontStyle: 'bold' } }]); } } doc.autoTable({ startY: 60, head: tableHead, body: tableBody, foot: footerRows, headStyles: { fillColor: [0, 159, 255] }, footStyles: { fillColor: [240, 240, 240], textColor: [0,0,0] }, theme: 'grid', didDrawPage: (data) => { if(!isQuote) { doc.setFontSize(8); doc.text(`Método de Pago: ${record.pricingMethod}`, data.settings.margin.left, doc.internal.pageSize.height - 10); } } }); doc.save(`${isQuote ? 'Cotizacion' : 'Venta'}-${record.client.name.replace(/\s/g, '_')}-${record.id}.pdf`); }
async function handleStoreSelection(event) { if (!event.target.matches('.store-button')) return; const storeName = event.target.dataset.store; const expectedPassword = STORE_PASSWORDS[storeName]; if (!expectedPassword) { proceedToNextStep(storeName); return; } const password = await showPrompt(`Por favor, ingrese la contraseña para la tienda ${STORE_DISPLAY_NAMES[storeName] || storeName}:`, "Contraseña de Tienda"); if (password === expectedPassword) { proceedToNextStep(storeName); } else if (password !== null) { await showNotification("Contraseña incorrecta.", "Error de Acceso"); } }
function proceedToNextStep(storeName) { state.selectedStore = storeName; document.querySelector('.logo span').textContent = STORE_DISPLAY_NAMES[storeName] || storeName; processDataForStore(); document.getElementById('store-modal-overlay').classList.remove('visible'); document.getElementById('rate-modal-overlay').classList.add('visible'); document.getElementById('rate-input').focus(); }
function handleInitialRateSubmit(event) { event.preventDefault(); if (validateAndSetRate(document.getElementById('rate-input').value)) { document.getElementById('rate-modal-overlay').classList.remove('visible'); initializeAppUI(); } else { document.getElementById('rate-input').select(); } }
async function handleRateClick() { if (!state.selectedStore) return; const newRateInput = await showPrompt("Modificar Tasa BCV:", "Actualizar Tasa", "text"); if (newRateInput !== null && validateAndSetRate(newRateInput)) { renderProductTable(); if (elements.workAreaModalOverlay.classList.contains('visible')) renderWorkArea(); } }
async function handleOfferToggle(event) { const checkbox = event.target; if (checkbox.checked) { const pwd = await showPrompt("Ingrese la clave para ver los precios de oferta: ", "Modo Oferta"); state.isOfferMode = pwd === OFFER_PASSWORD; if (!state.isOfferMode && pwd !== null) { await showNotification("Clave incorrecta.", "Error"); checkbox.checked = false; } else if (pwd === null) { checkbox.checked = false; } } else { state.isOfferMode = false; } elements.offerPricingOption.classList.toggle('hidden', !state.isOfferMode); updateBodyClasses(); renderProductTable(); if (elements.workAreaModalOverlay.classList.contains('visible')) renderWorkArea(); }
function handleSearchInput(event) { const searchTerm = event.target.value.trim().toLowerCase(); state.searchTerm = searchTerm; elements.clearSearchBtn.style.display = searchTerm ? 'block' : 'none'; if (searchTerm) { document.querySelectorAll('.menu-button.active, .tipo-button.active').forEach(b => b.classList.remove('active')); } renderProductTable(); }
function handleClearSearch() { elements.searchInput.value = ''; handleSearchInput({ target: { value: '' } }); elements.searchInput.focus(); }
async function validateAndSetRate(rawInput) { if (!rawInput || rawInput.trim() === "") { await showNotification("Por favor, introduce un valor para la tasa.", "Valor Requerido"); return false; } const parsedRate = parseFloat(rawInput.replace(',', '.')); if (!isNaN(parsedRate) && parsedRate > 0) { state.bcvRate = parsedRate; document.getElementById('bcv-rate-display').innerHTML = `<span class="rate-title">Tasa BCV</span><span class="rate-value">${state.bcvRate.toFixed(4)}</span>`; return true; } await showNotification("El valor introducido no es un número válido.", "Error de Formato"); return false; }
function initializeAppUI() { elements.body.classList.remove('app-loading'); updateView(); updateWorkAreaIndicator(); }
function getTodayDateString() { const today = new Date(); const year = today.getFullYear(); const month = String(today.getMonth() + 1).padStart(2, '0'); const day = String(today.getDate()).padStart(2, '0'); return `${year}-${month}-${day}`; }

function setupEventListeners() {
    const addSafeListener = (element, event, handler) => { if (element) element.addEventListener(event, handler); };
    const toggleSidebar = (visible) => { elements.sidebarMenu.classList.toggle('visible', visible); elements.sidebarOverlay.classList.toggle('visible', visible); };
    addSafeListener(elements.hamburgerBtn, 'click', () => toggleSidebar(true));
    addSafeListener(elements.closeSidebarBtn, 'click', () => toggleSidebar(false));
    addSafeListener(elements.sidebarOverlay, 'click', () => toggleSidebar(false));
    elements.sidebarLinks.forEach(link => { addSafeListener(link, 'click', () => { const view = link.dataset.view; if (view && state.activeView !== view) { state.activeView = view; updateView(); } toggleSidebar(false); }); });
    addSafeListener(elements.empresaFilterSelect, 'change', (event) => { state.activeEmpresa = event.target.value; renderColorCharts(); });
    addSafeListener(elements.themeToggle, 'change', () => applyTheme(elements.themeToggle.checked ? 'light' : 'dark'));
    addSafeListener(elements.rateForm, 'submit', handleInitialRateSubmit);
    addSafeListener(elements.storeButtonsContainer, 'click', handleStoreSelection);
    addSafeListener(elements.bcvRateDisplay, 'click', handleRateClick);
    addSafeListener(elements.offerToggle, 'change', handleOfferToggle);
    addSafeListener(elements.searchInput, 'input', handleSearchInput);
    addSafeListener(elements.clearSearchBtn, 'click', handleClearSearch);
    addSafeListener(document.getElementById('menu-tabs-container'), 'click', (e) => { if (e.target.matches('.menu-button')) { state.searchTerm = ''; elements.searchInput.value = ''; elements.clearSearchBtn.style.display = 'none'; state.activeMenu = e.target.dataset.menu.trim(); const tipos = Object.keys(state.storeData[state.activeMenu] || {}).sort((a,b) => a.localeCompare(b)); state.activeTipo = tipos.length > 0 ? tipos[0] : null; renderCatalogUI(); } });
    addSafeListener(document.getElementById('tipo-tabs-container'), 'click', (e) => { if (e.target.matches('.tipo-button')) { state.searchTerm = ''; elements.searchInput.value = ''; elements.clearSearchBtn.style.display = 'none'; state.activeTipo = e.target.dataset.tipo.trim(); renderCatalogUI(); } });
    addSafeListener(elements.contentContainer, 'click', handleContentClick);
    addSafeListener(elements.closeProductDetailModalBtn, 'click', closeProductDetailModal);
    addSafeListener(elements.addToWorkAreaBtn, 'click', handleAddToWorkArea);
    addSafeListener(elements.workAreaFab, 'click', () => { renderWorkArea(); elements.workAreaModalOverlay.classList.add('visible'); });
    addSafeListener(elements.closeWorkAreaModalBtn, 'click', () => { state.workArea = { items: [], discountPercentage: 0, editingId: null, editingType: null, client: null }; updateWorkAreaIndicator(); elements.workAreaModalOverlay.classList.remove('visible'); });
    addSafeListener(elements.workAreaContentContainer, 'click', handleWorkAreaActions);
    addSafeListener(elements.clearWorkAreaBtn, 'click', async () => { const confirmed = await showConfirmation("¿Estás seguro de que quieres limpiar el borrador actual?", "Limpiar Borrador"); if (confirmed) { state.workArea = { items: [], discountPercentage: 0, editingId: null, editingType: null, client: null }; renderWorkArea(); updateWorkAreaIndicator(); } });
    addSafeListener(elements.applyDiscountBtn, 'click', async () => { let discount = parseFloat(elements.discountInput.value) || 0; if(discount > MAX_DISCOUNT_PERCENTAGE) { await showNotification(`El descuento no puede ser mayor al ${MAX_DISCOUNT_PERCENTAGE}%.`, "Límite de Descuento"); discount = MAX_DISCOUNT_PERCENTAGE; elements.discountInput.value = discount; } state.workArea.discountPercentage = discount; renderWorkArea(); });
    addSafeListener(elements.saveQuoteBtn, 'click', () => openClientInfoModal('saveQuote', state.workArea.client));
    addSafeListener(elements.registerSaleBtn, 'click', () => { elements.saleOptions.classList.remove('hidden'); elements.mainActions.classList.add('hidden'); });
    addSafeListener(elements.confirmSaleBtn, 'click', () => openClientInfoModal('registerSale', state.workArea.client));
    addSafeListener(elements.clientInfoForm, 'submit', handleClientInfoSubmit);
    addSafeListener(elements.cancelClientInfoBtn, 'click', () => elements.clientInfoModalOverlay.classList.remove('visible'));
    addSafeListener(elements.closeClientInfoBtn, 'click', () => elements.clientInfoModalOverlay.classList.remove('visible'));
    addSafeListener(elements.historyBtn, 'click', () => { elements.historyDatePicker.value = getTodayDateString(); elements.historyChoiceModalOverlay.classList.add('visible'); });
    addSafeListener(elements.closeHistoryChoiceModalBtn, 'click', () => elements.historyChoiceModalOverlay.classList.remove('visible'));
    addSafeListener(elements.viewQuotesHistoryBtn, 'click', () => openHistory('cotizaciones', elements.historyDatePicker.value));
    addSafeListener(elements.viewSalesHistoryBtn, 'click', () => openHistory('ventas', elements.historyDatePicker.value));
    addSafeListener(elements.historyDatePicker, 'change', () => { const currentTitle = elements.historyListTitle.textContent; if (elements.historyListModalOverlay.classList.contains('visible')) { if (currentTitle.includes('Ventas')) { openHistory('ventas', elements.historyDatePicker.value); } else if (currentTitle.includes('Cotizaciones')) { openHistory('cotizaciones', elements.historyDatePicker.value); } } });
    addSafeListener(elements.closeHistoryListModalBtn, 'click', () => elements.historyListModalOverlay.classList.remove('visible'));
    addSafeListener(elements.historyListContainer, 'click', (e) => { const itemEl = e.target.closest('.history-item'); if (!itemEl) return; const id = itemEl.dataset.id; const type = itemEl.dataset.type; const targetButton = e.target.closest('button'); if(targetButton) { if(targetButton.matches('.edit-btn, .edit-btn *')) { handleEditRecord(type, id); } else if (targetButton.matches('.delete-btn, .delete-btn *')) { handleDeleteRecord(type, id); } } else { openDetail(type, id); } });
    addSafeListener(elements.detailModalOverlay, 'click', e => { if(e.target === elements.detailModalOverlay || e.target.matches('#close-detail-modal-btn, #close-detail-modal-btn *')) { elements.detailModalOverlay.classList.remove('visible'); } });
    addSafeListener(elements.downloadPdfBtn, 'click', (e) => { const recordDataString = e.target.dataset.recordObject; if (recordDataString) { generatePdf(e.target.dataset.type, JSON.parse(recordDataString)); } });
    addSafeListener(elements.successActionBtn, 'click', () => { if (state.modal.currentRecordForPdf) { const { type, ...record } = state.modal.currentRecordForPdf; generatePdf(type, record); } });
    addSafeListener(elements.successCloseBtn, 'click', () => { elements.successModal.classList.remove('visible'); state.modal.currentRecordForPdf = null; });
    addSafeListener(elements.generateReportBtn, 'click', generarReporteVentas);
}

function setupReportFilters() {
    const storeProducts = state.fullStoreData.filter(p => p.tienda === state.selectedStore);
    const menus = [...new Set(storeProducts.map(p => p.menu).filter(Boolean))].sort();
    const tipos = [...new Set(storeProducts.map(p => p.tipo).filter(Boolean))].sort();
    const presentaciones = [...new Set(storeProducts.map(p => p.pres).filter(Boolean))].sort();
    const productos = [...new Set(storeProducts.map(p => p.name).filter(Boolean))].sort();

    const populateSelect = (selectElement, options, defaultLabel) => {
        selectElement.innerHTML = `<option value="Todos">${defaultLabel}</option>`;
        options.forEach(opt => { selectElement.innerHTML += `<option value="${opt}">${opt}</option>`; });
    };

    populateSelect(elements.reportFilterMenu, menus, "Todos los Menús");
    populateSelect(elements.reportFilterTipo, tipos, "Todos los Tipos");
    populateSelect(elements.reportFilterPres, presentaciones, "Todas las Presentaciones");
    populateSelect(elements.reportFilterProducto, productos, "Todos los Productos");

    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    elements.reportStartDate.value = firstDayOfMonth.toISOString().split('T')[0];
    elements.reportEndDate.value = lastDayOfMonth.toISOString().split('T')[0];
}

async function generarReporteVentas() {
    elements.reportResultsContainer.innerHTML = `<p>Generando reporte, por favor espere...</p>`;
    const startDate = new Date(elements.reportStartDate.value);
    startDate.setHours(0,0,0,0);
    const endDate = new Date(elements.reportEndDate.value);
    endDate.setHours(23,59,59,999);

    if (isNaN(startDate) || isNaN(endDate) || endDate < startDate) {
        showNotification("Por favor, seleccione un rango de fechas válido.", "Error");
        elements.reportResultsContainer.innerHTML = '';
        return;
    }

    try {
        const querySnapshot = await db_firestore.collection('ventas')
            .where('store', '==', state.selectedStore)
            .where('timestamp', '>=', startDate)
            .where('timestamp', '<=', endDate)
            .get();
        
        const ventas = [];
        querySnapshot.forEach(doc => ventas.push(doc.data()));

        const filtros = {
            menu: elements.reportFilterMenu.value,
            tipo: elements.reportFilterTipo.value,
            pres: elements.reportFilterPres.value,
            producto: elements.reportFilterProducto.value,
        };

        const groupBy = elements.reportGroupBy.value;
        const metric = elements.reportMetric.value;

        state.reporte.datos = procesarDatosDeVentas(ventas, filtros, groupBy);
        state.reporte.sortColumn = metric === 'ambas' ? 'dinero' : metric;
        state.reporte.sortDirection = 'desc';
        
        renderTablaDeReporte();

    } catch (error) {
        console.error("Error al generar el reporte:", error);
        elements.reportResultsContainer.innerHTML = `<p class="empty-message">Error al generar el reporte: ${error.message}</p>`;
    }
}

function procesarDatosDeVentas(ventas, filtros, groupBy) {
    const datosAgrupados = new Map();

    ventas.forEach(venta => {
        venta.items.forEach(item => {
            const p = item.product;
            
            if (filtros.menu !== 'Todos' && p.menu !== filtros.menu) return;
            if (filtros.tipo !== 'Todos' && p.tipo !== filtros.tipo) return;
            if (filtros.pres !== 'Todos' && p.pres !== filtros.pres) return;
            if (filtros.producto !== 'Todos' && p.name !== filtros.producto) return;

            let key;
            if (groupBy === 'producto') key = p.name;
            else if (groupBy === 'producto_color') key = `${p.name} (${item.color || 'Sin color'})`;
            else if (groupBy === 'menu') key = p.menu;
            else if (groupBy === 'tipo') key = p.tipo;
            else if (groupBy === 'pres') key = p.pres;
            else key = 'Desconocido';

            if (!key) return;

            if (!datosAgrupados.has(key)) {
                datosAgrupados.set(key, { unidades: 0, dinero: 0 });
            }

            const stats = datosAgrupados.get(key);
            stats.unidades += item.quantity;
            stats.dinero += item.quantity * (venta.pricingMethod === 'Oferta en $' ? (p.specialPrice || p.normalPrice) : p.normalPrice);
        });
    });
    
    return Array.from(datosAgrupados.entries()).map(([key, value]) => ({ key, ...value }));
}

function renderTablaDeReporte() {
    const { datos, sortColumn, sortDirection } = state.reporte;
    const metric = elements.reportMetric.value;

    if (datos.length === 0) {
        elements.reportResultsContainer.innerHTML = `<p class="empty-message">No se encontraron ventas que coincidan con los filtros seleccionados.</p>`;
        return;
    }

    // Ordenar los datos
    datos.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const getSortClass = (columnName) => {
        if (columnName !== sortColumn) return '';
        return sortDirection === 'asc' ? 'sort-asc' : 'sort-desc';
    };

    const groupBy = elements.reportGroupBy.value;
    const nombreColumna = groupBy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let headersHtml = `<th data-sort="key" class="${getSortClass('key')}">${nombreColumna}</th>`;
    if (metric === 'dinero') {
        headersHtml += `<th data-sort="dinero" class="${getSortClass('dinero')}">Venta Total ($)</th>`;
    } else if (metric === 'unidades') {
        headersHtml += `<th data-sort="unidades" class="${getSortClass('unidades')}">Unidades Vendidas</th>`;
    } else { // Ambas
        headersHtml += `<th data-sort="dinero" class="${getSortClass('dinero')}">Venta Total ($)</th>`;
        headersHtml += `<th data-sort="unidades" class="${getSortClass('unidades')}">Unidades Vendidas</th>`;
    }

    let tablaHtml = `<table class="quote-table report-table"><thead><tr>${headersHtml}</tr></thead><tbody>`;

    let totalDinero = 0;
    let totalUnidades = 0;
    datos.forEach(item => {
        totalDinero += item.dinero;
        totalUnidades += item.unidades;
        
        tablaHtml += `<tr><td>${item.key}</td>`;
        if (metric === 'dinero') {
            tablaHtml += `<td>$${item.dinero.toFixed(2)}</td>`;
        } else if (metric === 'unidades') {
            tablaHtml += `<td>${item.unidades}</td>`;
        } else { // Ambas
            tablaHtml += `<td>$${item.dinero.toFixed(2)}</td>`;
            tablaHtml += `<td>${item.unidades}</td>`;
        }
        tablaHtml += `</tr>`;
    });
    
    tablaHtml += `</tbody><tfoot><tr><td><strong>Total General</strong></td>`;
    if (metric === 'dinero') {
        tablaHtml += `<td><strong>$${totalDinero.toFixed(2)}</strong></td>`;
    } else if (metric === 'unidades') {
        tablaHtml += `<td><strong>${totalUnidades}</strong></td>`;
    } else { // Ambas
        tablaHtml += `<td><strong>$${totalDinero.toFixed(2)}</strong></td>`;
        tablaHtml += `<td><strong>${totalUnidades}</strong></td>`;
    }
    tablaHtml += `</tr></tfoot></table>`;

    elements.reportResultsContainer.innerHTML = tablaHtml;

    // Añadir listeners a los nuevos encabezados de la tabla
    document.querySelectorAll('.report-table th').forEach(th => {
        th.addEventListener('click', (e) => {
            const newSortColumn = e.target.dataset.sort;
            if (state.reporte.sortColumn === newSortColumn) {
                state.reporte.sortDirection = state.reporte.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.reporte.sortColumn = newSortColumn;
                state.reporte.sortDirection = 'desc';
            }
            renderTablaDeReporte();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeElements();
    setupTheme();
    setupEventListeners();
    initialFetchAndSetup();
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});