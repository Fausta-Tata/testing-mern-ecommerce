// cypress/e2e/admin-management-complete.cy.js

// --- 1. HANDLE REACT ERROR (WAJIB ADA) ---
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('insertBefore') || err.message.includes('not a child of this node')) {
    return false; 
  }
  return true;
});

describe('Admin Management Complete Test Suite (ADM-01 s/d ADM-42)', () => {

  const ADMIN_CREDENTIALS = {
    email: 'demo@gmail.com',
    password: 'helloWorld@123'
  };

  // ID dari DB Anda
  const BRAND_ID_APPLE = "65a7e20102e12c44f59943da"; 
  const BRAND_ID_SAMSUNG = "65a7e21002e12c44f59943db"; // Asumsi ID Samsung (jika ada, atau pakai ID lain)
  const CATEGORY_ID_SMARTPHONE = "65a7e24602e12c44f599442c";
  const CATEGORY_ID_LAPTOP = "65a7e25202e12c44f599442f"; // Asumsi ID Laptop

  // --- HELPER LOGIN ---
  const loginAdmin = () => {
    cy.session('admin-session', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').clear().type(ADMIN_CREDENTIALS.email);
      cy.get('input[name="password"]').clear().type(ADMIN_CREDENTIALS.password);
      cy.contains('button', 'Login').click();
      cy.url({timeout: 20000}).should('include', '/admin/dashboard');
    });
    cy.visit('/admin/dashboard');
  };

  // --- HELPER ISI FORM ---
  const fillProductForm = (data) => {
    if (data.title !== undefined) cy.get('input[name="title"]').clear().type(data.title, {force: true});
    if (data.description !== undefined) cy.get('textarea[name="description"]').clear().type(data.description, {force: true});
    if (data.price !== undefined) cy.get('input[name="price"]').clear().type(data.price, {force: true});
    if (data.stockQuantity !== undefined) cy.get('input[name="stockQuantity"]').clear().type(data.stockQuantity, {force: true});
    if (data.discountPercentage !== undefined) cy.get('input[name="discountPercentage"]').clear().type(data.discountPercentage, {force: true});
    
    // Dropdown Brand
    if (data.brandId) {
      cy.get('input[name="brand"]').parent().click({force: true});
      // Gunakan selector contains agar lebih fleksibel jika ID berubah, atau data-value jika ID pasti
      cy.get('li[role="option"]').first().click({force: true}); 
    }
    // Dropdown Category
    if (data.categoryId) {
      cy.get('input[name="category"]').parent().click({force: true});
      cy.get('li[role="option"]').first().click({force: true});
    }
  };

  beforeEach(() => {
    cy.intercept('GET', '**/products*').as('getProducts');
    cy.intercept('POST', '**/products').as('addProduct');
    cy.intercept('PUT', '**/products/**').as('updateProduct');
    cy.intercept('PUT', '**/orders/**').as('updateOrder');
    
    loginAdmin();
    cy.wait('@getProducts', {timeout: 15000});
  });

  // =================================================================
  // GROUP 1: UPDATE PRODUCT SCENARIOS (ADM-01 s/d ADM-16)
  // =================================================================
  context('Group 1: Update Product Scenarios', () => {
    
    // Helper navigasi ke halaman update
    const goToUpdatePage = () => {
        cy.contains('a', /Update/i).first().scrollIntoView().click({force: true});
        cy.url().should('include', '/admin/product-update/');
    };

    it('ADM-01 & ADM-02: Masuk Halaman Update & Update Nama (Happy Path)', () => {
        goToUpdatePage();
        const newTitle = 'Updated Product ' + Date.now();
        fillProductForm({ title: newTitle });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct').its('response.statusCode').should('eq', 200);
        cy.screenshot('ADM-02-Update-Title');
    });

    it('ADM-03: Update Brand', () => {
        goToUpdatePage();
        // Ubah brand (Pilih opsi ke-2 di dropdown)
        cy.get('input[name="brand"]').parent().click({force: true});
        cy.get('li[role="option"]').eq(1).click({force: true}); 
        
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-03-Update-Brand');
    });

    it('ADM-04: Update Kategori', () => {
        goToUpdatePage();
        // Ubah kategori (Pilih opsi ke-2 di dropdown)
        cy.get('input[name="category"]').parent().click({force: true});
        cy.get('li[role="option"]').eq(1).click({force: true}); 
        
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-04-Update-Category');
    });

    it('ADM-05: Update Deskripsi', () => {
        goToUpdatePage();
        fillProductForm({ description: 'This is testing description update' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-05-Update-Description');
    });

    it('ADM-06: Update Harga Valid', () => {
        goToUpdatePage();
        fillProductForm({ price: '500' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-06-Update-Price-Valid');
    });

    it('ADM-07: Update Harga Salah (Negatif)', () => {
        goToUpdatePage();
        fillProductForm({ price: '-500' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        // Validasi: API tidak dipanggil atau UI error
        cy.screenshot('ADM-07-Update-Price-Invalid');
    });

    it('ADM-08: Update Diskon Valid', () => {
        goToUpdatePage();
        fillProductForm({ discountPercentage: '10' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-08-Update-Discount-Valid');
    });

    it('ADM-10: Update Diskon Lebih dari Maksimal (>100)', () => {
        goToUpdatePage();
        fillProductForm({ discountPercentage: '150' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.screenshot('ADM-10-Update-Discount-Invalid');
    });

    it('ADM-11: Update Stok Valid', () => {
        goToUpdatePage();
        fillProductForm({ stockQuantity: '11' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-11-Update-Stock-Valid');
    });

    it('ADM-12: Update Stok Salah (Negatif)', () => {
        goToUpdatePage();
        fillProductForm({ stockQuantity: '-11' });
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.screenshot('ADM-12-Update-Stock-Invalid');
    });

    it('ADM-13: Update Thumbnail Valid', () => {
        goToUpdatePage();
        cy.get('input[name="thumbnail"]').clear().type('https://placehold.co/200', {force: true});
        cy.get('button[type="submit"]').contains(/Update/i).click({force: true});
        cy.wait('@updateProduct');
        cy.screenshot('ADM-13-Update-Thumbnail');
    });
  });

  // =================================================================
  // GROUP 2: ADD PRODUCT SCENARIOS (ADM-17 s/d ADM-35)
  // =================================================================
  context('Group 2: Add Product Scenarios', () => {

    beforeEach(() => {
        cy.get('.MuiAvatar-root').parent().click({force: true});
        cy.contains('Add new Product').click({force: true});
        cy.url().should('include', '/admin/add-product');
    });

    const validProductData = {
        title: 'New Product Test ' + Date.now(),
        description: 'Test Desc',
        price: '100',
        stockQuantity: '10',
        discountPercentage: '0',
        brandId: BRAND_ID_APPLE,
        categoryId: CATEGORY_ID_SMARTPHONE
    };

    const fillImages = () => {
        const img = 'https://placehold.co/100';
        cy.get('input[name="thumbnail"]').type(img, {force: true});
        cy.get('input[name="image0"]').type(img, {force: true});
        cy.get('input[name="image1"]').type(img, {force: true});
        cy.get('input[name="image2"]').type(img, {force: true});
        cy.get('input[name="image3"]').type(img, {force: true});
    };

    it('ADM-17: Add Product Valid (Happy Path)', () => {
        fillProductForm(validProductData);
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.wait('@addProduct').its('response.statusCode').should('eq', 201);
        cy.screenshot('ADM-17-AddProduct-Success');
    });

    it('ADM-20: Add Product Duplikat (Nama Sama)', () => {
        // 1. Buat produk unik
        const uniqueTitle = 'Duplicate Test ' + Date.now();
        fillProductForm({...validProductData, title: uniqueTitle});
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.wait('@addProduct');

        // 2. Coba buat lagi dengan nama SAMA
        cy.visit('/admin/dashboard'); // Reset
        cy.get('.MuiAvatar-root').parent().click({force: true});
        cy.contains('Add new Product').click({force: true});
        
        fillProductForm({...validProductData, title: uniqueTitle});
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        
        // Validasi: Harusnya gagal atau muncul toast error
        // Kita screenshot untuk bukti UI
        cy.screenshot('ADM-20-AddProduct-Duplicate');
    });

    it('ADM-21: Add Product Tanpa Nama', () => {
        fillProductForm({...validProductData, title: ''}); // Kosongkan
        cy.get('input[name="title"]').clear();
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.contains(/Title is required/i).should('be.visible');
        cy.screenshot('ADM-21-No-Title');
    });

    it('ADM-22: Add Product Tanpa Brand', () => {
        fillProductForm({...validProductData, brandId: null}); // Skip Brand
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        // Validasi error (mui select validation bisa berbeda, cek screenshot)
        cy.screenshot('ADM-22-No-Brand');
    });

    it('ADM-25: Add Product Tanpa Harga', () => {
        fillProductForm({...validProductData, price: ''});
        cy.get('input[name="price"]').clear();
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.contains(/Price is required/i).should('be.visible');
        cy.screenshot('ADM-25-No-Price');
    });

    it('ADM-26: Add Product Harga Huruf (Invalid)', () => {
        fillProductForm({...validProductData, price: 'abc'});
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.screenshot('ADM-26-Price-Letters');
    });

    it('ADM-29: Add Product Tanpa Stok', () => {
        fillProductForm({...validProductData, stockQuantity: ''});
        cy.get('input[name="stockQuantity"]').clear();
        fillImages();
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.contains(/Stock Quantity is required/i).should('be.visible');
        cy.screenshot('ADM-29-No-Stock');
    });

    it('ADM-31: Add Product Tanpa Thumbnail', () => {
        fillProductForm(validProductData);
        // Isi images tapi SKIP thumbnail
        const img = 'https://placehold.co/100';
        cy.get('input[name="image0"]').type(img);
        cy.get('input[name="image1"]').type(img);
        
        cy.get('button[type="submit"]').contains(/Add Product/i).click({force: true});
        cy.contains(/Thumbnail is required/i).should('be.visible');
        cy.screenshot('ADM-31-No-Thumbnail');
    });
  });

  // =================================================================
  // GROUP 3: ORDER MANAGEMENT SCENARIOS (ADM-36 s/d ADM-42)
  // =================================================================
  context('Group 3: Order Management Scenarios', () => {
    
    beforeEach(() => {
         cy.get('.MuiAvatar-root').parent().click({force: true});
         cy.contains('Orders').click({force: true});
         cy.url().should('include', '/admin/orders');
    });

    // Helper untuk update status
    const updateOrderStatus = (status) => {
        cy.get('table', {timeout: 10000}).should('exist');
        cy.get('tbody tr').first().within(() => {
            cy.get('[data-testid="EditOutlinedIcon"]').click({force: true}); 
            cy.wait(500);
            cy.get('select[name="status"]').select(status, {force: true});
            cy.get('[data-testid="CheckCircleOutlinedIcon"]').closest('button').click({force: true});
        });
        cy.wait('@updateOrder').its('response.statusCode').should('eq', 200);
        cy.get('tbody tr').first().contains(new RegExp(status, "i")).should('exist');
    };

    it('ADM-37: Update Order -> Dispatched', () => {
        updateOrderStatus('Dispatched');
        cy.screenshot('ADM-37-Dispatched');
    });

    it('ADM-38: Update Order -> Out for Delivery', () => {
        updateOrderStatus('Out for delivery'); // Sesuaikan string persis dengan JSX editOptions
        cy.screenshot('ADM-38-OutForDelivery');
    });

    it('ADM-39: Update Order -> Delivered', () => {
        updateOrderStatus('Delivered');
        cy.screenshot('ADM-39-Delivered');
    });

    it('ADM-40: Update Order -> Cancelled', () => {
        updateOrderStatus('Cancelled');
        cy.screenshot('ADM-40-Cancelled');
    });

    it('ADM-41: Update Order -> Pending (Reset)', () => {
        updateOrderStatus('Pending');
        cy.screenshot('ADM-41-Pending');
    });
  });

  // =================================================================
  // GROUP 4: DELETE PRODUCT (ADM-17/XXX)
  // =================================================================
  it('ADM-XXX: Hapus Produk dan Un-delete', () => {
      // Tombol delete
      cy.contains('button', 'Delete').first().click({force: true});
      cy.wait(1000);
      cy.screenshot('ADM-Delete-Clicked');

      // Tombol un-delete
      cy.contains('button', 'Un-delete').first().click({force: true});
      cy.wait(1000);
      cy.screenshot('ADM-UnDelete-Clicked');
  });

});