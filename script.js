// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Coca-Cola 350ml",
        category: "refrigerantes",
        price: 4.50,
        image: "https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 2,
        name: "Pepsi 350ml",
        category: "refrigerantes",
        price: 4.00,
        image: "https://images.pexels.com/photos/2775860/pexels-photo-2775860.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 3,
        name: "Guaraná Antarctica 350ml",
        category: "refrigerantes",
        price: 4.20,
        image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 4,
        name: "Heineken 350ml",
        category: "cervejas",
        price: 6.50,
        image: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 5,
        name: "Skol 350ml",
        category: "cervejas",
        price: 3.80,
        image: "https://images.pexels.com/photos/1267696/pexels-photo-1267696.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 6,
        name: "Brahma 350ml",
        category: "cervejas",
        price: 4.00,
        image: "https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 7,
        name: "Red Bull 250ml",
        category: "energeticos",
        price: 8.90,
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 8,
        name: "Monster Energy 473ml",
        category: "energeticos",
        price: 9.50,
        image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 9,
        name: "Água Crystal 500ml",
        category: "aguas",
        price: 2.50,
        image: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 10,
        name: "Água com Gás 500ml",
        category: "aguas",
        price: 3.00,
        image: "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 11,
        name: "Vodka Smirnoff 1L",
        category: "destilados",
        price: 45.90,
        image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 12,
        name: "Whisky Jack Daniels 1L",
        category: "destilados",
        price: 89.90,
        image: "https://images.pexels.com/photos/602750/pexels-photo-602750.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
];

// Estado da aplicação
let cart = JSON.parse(localStorage.getItem('masukeCart')) || {};
let currentFilter = 'all';
let searchTerm = '';

// Elementos DOM
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const clearCart = document.getElementById('clearCart');
const checkoutBtn = document.getElementById('checkoutBtn');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateCartUI();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Carrinho
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    clearCart.addEventListener('click', clearCartItems);
    checkoutBtn.addEventListener('click', checkout);
    
    // Busca
    searchInput.addEventListener('input', handleSearch);
    
    // Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });
    
    // Fechar modal clicando fora
    cartModal.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            closeCartModal();
        }
    });
    
    // Fechar modal com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cartModal.classList.contains('active')) {
            closeCartModal();
        }
    });
}

// Renderizar produtos
function renderProducts() {
    const filteredProducts = products.filter(product => {
        const matchesFilter = currentFilter === 'all' || product.category === currentFilter;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);">
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou termo de busca</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Criar card do produto
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" 
             onerror="this.src='https://via.placeholder.com/300x250/334155/cbd5e1?text=Imagem+Indisponível'">
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${getCategoryName(product.category)}</p>
            <div class="product-price">R$ ${product.price.toFixed(2).replace('.', ',')}</div>
            <div class="product-actions">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="changeQuantity(${product.id}, -1)">-</button>
                    <span class="quantity-display" id="qty-${product.id}">1</span>
                    <button class="quantity-btn" onclick="changeQuantity(${product.id}, 1)">+</button>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Adicionar
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Obter nome da categoria
function getCategoryName(category) {
    const categories = {
        'refrigerantes': 'Refrigerantes',
        'cervejas': 'Cervejas',
        'energeticos': 'Energéticos',
        'aguas': 'Águas',
        'destilados': 'Destilados'
    };
    return categories[category] || category;
}

// Alterar quantidade
function changeQuantity(productId, delta) {
    const qtyElement = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyElement.textContent);
    currentQty = Math.max(1, currentQty + delta);
    qtyElement.textContent = currentQty;
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const qtyElement = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyElement.textContent);
    
    if (cart[productId]) {
        cart[productId].quantity += quantity;
    } else {
        cart[productId] = {
            ...product,
            quantity: quantity
        };
    }
    
    // Reset quantity display
    qtyElement.textContent = '1';
    
    saveCart();
    updateCartUI();
    
    // Feedback visual
    showNotification(`${product.name} adicionado ao carrinho!`);
}

// Remover do carrinho
function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Alterar quantidade no carrinho
function changeCartQuantity(productId, delta) {
    if (cart[productId]) {
        cart[productId].quantity += delta;
        if (cart[productId].quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
            renderCartItems();
        }
    }
}

// Salvar carrinho
function saveCart() {
    localStorage.setItem('masukeCart', JSON.stringify(cart));
}

// Atualizar UI do carrinho
function updateCartUI() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Abrir carrinho
function openCart() {
    cartModal.classList.add('active');
    renderCartItems();
    document.body.style.overflow = 'hidden';
}

// Fechar carrinho
function closeCartModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Renderizar itens do carrinho
function renderCartItems() {
    const cartItemsArray = Object.values(cart);
    
    if (cartItemsArray.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h3>Seu carrinho está vazio</h3>
                <p>Adicione alguns produtos para continuar</p>
            </div>
        `;
        cartTotal.textContent = '0,00';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = '';
    
    cartItemsArray.forEach(item => {
        total += item.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/80x80/334155/cbd5e1?text=Img'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="changeCartQuantity(${item.id}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeCartQuantity(${item.id}, 1)">+</button>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                    </svg>
                </button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2).replace('.', ',');
}

// Limpar carrinho
function clearCartItems() {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
        cart = {};
        saveCart();
        updateCartUI();
        renderCartItems();
    }
}

// Finalizar compra
function checkout() {
    const cartItemsArray = Object.values(cart);
    
    if (cartItemsArray.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    let message = '*PEDIDO MASUKE DRINKS*\n\n';
    let total = 0;
    
    cartItemsArray.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name}\n`;
        message += `  Qtd: ${item.quantity} x R$ ${item.price.toFixed(2).replace('.', ',')} = R$ ${itemTotal.toFixed(2).replace('.', ',')}\n\n`;
    });
    
    message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    message += `Por favor, confirme o pedido e informe:\n`;
    message += `• Nome completo\n`;
    message += `• Endereço para entrega\n`;
    message += `• Forma de pagamento`;
    
    const whatsappUrl = `https://wa.me/5534998829396?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Busca
function handleSearch(e) {
    searchTerm = e.target.value;
    renderProducts();
}

// Filtros
function handleFilter(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.category;
    renderProducts();
}

// Notificação
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--success-color);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Adicionar estilos para animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);