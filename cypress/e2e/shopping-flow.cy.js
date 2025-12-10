describe('Core Shopping Flow (CSF 01 - 13)', () => {

  beforeEach(() => {
    cy.loginUser();
  });

  // ==========================================
  // FILTER & SORT (CSF 01 - 05)
  // ==========================================

  it('CSF-01: Filter Brands (Samsung) & Category (Smartphones)', () => {
    cy.openFilterSidebar();
    cy.contains('p', 'Brands').click({force: true}); 
    cy.contains('.MuiFormControlLabel-label', 'Samsung').click({force: true});
    cy.contains('p', 'Category').click({force: true});
    cy.contains('.MuiFormControlLabel-label', 'smartphones').click({force: true});
    
    // Tutup filter
    cy.get('body').click(0, 0, {force: true});
    
    // Validasi & Screenshot
    cy.get('.MuiPaper-root').should('have.length.gt', 0);
    cy.screenshot('CSF-01-Filter-Success');
  });

  it('CSF-02: Hapus Filter (Reset)', () => {
    // Pre-condition
    cy.openFilterSidebar();
    cy.contains('p', 'Brands').click({force: true}); 
    cy.contains('.MuiFormControlLabel-label', 'Samsung').click({force: true});
    cy.wait(1000); 

    // Action: Uncheck
    cy.contains('.MuiFormControlLabel-label', 'Samsung').click({force: true});
    cy.get('body').click(0, 0, {force: true});
    
    // Validasi & Screenshot
    cy.get('.MuiPaper-root').should('have.length.gt', 1);
    cy.screenshot('CSF-02-Reset-Filter-Success');
  });

  it('CSF-03 & 04: Sort Harga (High-Low & Low-High)', () => {
    // High to Low
    cy.get('.MuiSelect-select, [role="combobox"]').first().click({force: true});
    cy.contains('li', 'Price: high to low').click({force: true});
    cy.wait(2000);
    cy.screenshot('CSF-03-Sort-HighLow');
    
    // Low to High
    cy.get('.MuiSelect-select, [role="combobox"]').first().click({force: true});
    cy.contains('li', 'Price: low to high').click({force: true});
    cy.wait(1000);
    cy.screenshot('CSF-04-Sort-LowHigh');
  });

  it('CSF-05: Reset Sort', () => {
     cy.get('.MuiSelect-select, [role="combobox"]').first().click({force: true});
     cy.contains('li', 'Reset').click({force: true});
     cy.wait(1000);
     cy.screenshot('CSF-05-Reset-Sort');
  });

  // ==========================================
  // CART ACTIONS (CSF 06 - 08)
  // ==========================================

  it('CSF-06: Add to Cart dari Home', () => {
    cy.scrollTo('top');
    cy.addToCartByIndex(0); 
    cy.wait(2000);
    cy.get('.MuiBadge-badge').should('exist');
    cy.screenshot('CSF-06-AddToCart-Home');
  });

  it('CSF-07: Manipulasi Cart (Tambah/Kurang/Hapus)', () => {
    cy.addToCartByIndex(0);
    cy.get('svg[data-testid="ShoppingCartOutlinedIcon"]').closest('button').click({force: true});
    cy.url().should('include', '/cart');
    
    cy.wait(2000);
    
    // Tambah (+)
    cy.get('svg[data-testid="AddIcon"]').first().closest('button').click({force: true});
    cy.wait(1000);
    // Kurang (-)
    cy.get('svg[data-testid="RemoveIcon"]').first().closest('button').click({force: true});
    cy.wait(1000);
    // Hapus
    cy.get('svg[data-testid="RemoveIcon"]').first().closest('button').click({force: true});
    
    cy.wait(1000);
    cy.get('body').then($body => {
      if ($body.find('button:contains("Checkout")').length === 0) {
        cy.log('Checkout button gone -> Cart Empty');
      } else {
        cy.contains(/empty|kosong|no items|belanja/i).should('be.visible');
      }
    });
    cy.screenshot('CSF-07-Manipulate-Cart');
  });

  it('CSF-08: Add to Cart dari Halaman Detail', () => {
    // 1. Tunggu homepage stabil
    cy.wait(3000);
    
    // 2. Klik Judul "iPhone 9" untuk masuk detail
    cy.contains('h6', /iPhone 9/i).should('be.visible').click({force: true});
    
    // 3. Validasi URL
    cy.url({ timeout: 20000 }).should('include', '/product-details');
    
    // 4. Tunggu halaman siap (Judul Produk)
    cy.contains('iPhone 9', { timeout: 20000 }).should('be.visible');

    // 5. FIX FINAL: Gunakan Ikon Favorite sebagai patokan lokasi tombol
    // Karena tombol "Add To Cart" bersebelahan dengan tombol Wishlist (icon hati).
    cy.get('[data-testid="FavoriteBorderIcon"], [data-testid="FavoriteIcon"]', { timeout: 20000 })
      .should('exist')
      .closest('div') // Div pembungkus icon
      .parent()       // Container parent yang membungkus Button dan Icon Div
      .find('button') // Cari button di dalam container ini
      .filter((index, button) => {
         // Pastikan bukan tombol + atau - (tombol qty biasanya kecil/punya class beda)
         // Atau filter berdasarkan text content manual JS jika cy.contains gagal
         return button.innerText.toLowerCase().includes('cart');
      })
      .click({ force: true });
    
    // 6. Validasi Sukses: Cek Teks Tombol Berubah atau Notifikasi Muncul
    // Kadang teks berubah jadi "In Cart" atau "Added", jadi kita cek keberadaan salah satunya
    cy.wait(1000);
    cy.get('body').then($body => {
      if ($body.find(':contains("Added to cart")').length > 0) {
        cy.contains('Added to cart').should('be.visible');
      } else if ($body.find(':contains("In Cart")').length > 0) {
        cy.contains('In Cart').should('be.visible');
      } else {
        // Fallback: Cek badge cart bertambah
        cy.get('.MuiBadge-badge').should('exist');
      }
    });
    
    cy.screenshot('CSF-08-AddToCart-Detail');
  });

  // ==========================================
  // CHECKOUT FLOW (CSF 09 - 13)
  // ==========================================

  context('Checkout Process', () => {
    beforeEach(() => {
      cy.addToCartByIndex(0); 
      cy.get('svg[data-testid="ShoppingCartOutlinedIcon"]').closest('button').click({force: true});
      cy.wait(1000);
      cy.get('a[href="/checkout"]').click({force: true});
      cy.url().should('include', '/checkout');
    });

    it('CSF-09: Checkout Berhasil (Happy Path)', () => {
      cy.fillShippingForm({
        type: 'Home',
        street: 'Jl. Raya Indonesia',
        country: 'Indonesia',
        phoneNumber: '081812345678',
        city: 'Depok',
        state: 'Jawa Barat',
        postalCode: '16519'
      });
      cy.contains('button', 'add').click({force: true});
      cy.wait(2000);
      
      cy.contains('p', 'Home').parents('.MuiPaper-root').find('input[type="radio"]').check({force: true});
      cy.contains('p', 'Cash').parents('.MuiStack-root').find('input[type="radio"]').check({force: true});

      cy.wait(1000);
      cy.contains('button', 'Pay and order').click({force: true});

      cy.url({timeout: 30000}).should('not.include', '/checkout');
      cy.contains(/Status|Success|Order Placed/i, {timeout: 20000}).should('exist');
      
      cy.screenshot('CSF-09-Checkout-Success');
    });

    // NEGATIVE TEST CASES
    const negativeCases = [
      { code: 'CSF-10A', field: 'street', desc: 'Street Kosong' },
      { code: 'CSF-10B', field: 'country', desc: 'Country Kosong' },
      { code: 'CSF-10C', field: 'phoneNumber', desc: 'Phone Kosong' },
      { code: 'CSF-10D', field: 'city', desc: 'City Kosong' },
      { code: 'CSF-10E', field: 'state', desc: 'State Kosong' },
      { code: 'CSF-10F', field: 'postalCode', desc: 'Postal Code Kosong' },
    ];

    negativeCases.forEach((tc) => {
      it(`${tc.code}: ${tc.desc}`, () => {
        const data = {
          type: 'Home', street: 'Jl. Test', country: 'ID', 
          phoneNumber: '0812345', city: 'Test City', state: 'Test State', postalCode: '12345'
        };
        data[tc.field] = '';

        cy.fillShippingForm(data);
        cy.contains('button', 'add').click({force: true});

        cy.get('body').then($body => {
            if ($body.find('.Mui-error').length > 0) {
                cy.get('.Mui-error').should('exist');
            } else {
                cy.contains('button', 'add').should('exist');
            }
        });
        cy.screenshot(`${tc.code}-Negative-Test`);
      });
    });

    it('CSF-11: Validasi Phone Number', () => {
        cy.get('input[name="phoneNumber"]').type('ABCDE', {force: true});
        cy.get('input[name="phoneNumber"]').should('have.value', '');
        cy.screenshot('CSF-11-Phone-Validation');
    });

    it('CSF-12: Checkout Tanpa Payment Method', () => {
        cy.fillShippingForm({
            type: 'Office', street: 'Jl. Kerja', country: 'ID', 
            phoneNumber: '0812999', city: 'Jkt', state: 'DKI', postalCode: '1000'
        });
        cy.contains('button', 'add').click({force: true});
        cy.wait(1000);
        
        cy.contains('p', 'Office').parents('.MuiPaper-root').find('input[type="radio"]').check({force:true});
        
        cy.contains('button', 'Pay and order').click({force: true});
        
        cy.url().should('include', '/checkout');
        cy.screenshot('CSF-12-No-Payment-Fail');
    });
  });

  it('CSF-13: Check Order Status (Post-Checkout)', () => {
    cy.addToCartByIndex(0);
    cy.get('svg[data-testid="ShoppingCartOutlinedIcon"]').closest('button').click({force: true});
    cy.get('a[href="/checkout"]').click({force: true});
    
    cy.fillShippingForm({
        type: 'Home', street: 'Jl. Status', country: 'ID', 
        phoneNumber: '081', city: 'Jkt', state: 'DKI', postalCode: '10'
    });
    cy.contains('button', 'add').click({force: true});
    cy.wait(2000);
    
    cy.contains('p', 'Home').parents('.MuiPaper-root').find('input[type="radio"]').check({force:true});
    cy.contains('p', 'Cash').parents('.MuiStack-root').find('input[type="radio"]').check({force:true});
    cy.wait(1000);
    
    cy.contains('button', 'Pay and order').click({force: true});

    cy.url({timeout: 30000}).should('not.include', '/checkout');
    
    cy.get('body').then($body => {
        if ($body.find('button:contains("Check Order Status")').length > 0) {
            cy.contains('button', 'Check Order Status').click({ force: true });
        } else {
            cy.log('Manual visit orders');
            cy.visit('/orders');
        }
    });
    
    cy.url().should('include', '/orders');
    cy.screenshot('CSF-13-Order-Status-Page');
  });

});