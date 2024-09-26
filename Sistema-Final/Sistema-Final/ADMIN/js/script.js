document.addEventListener('DOMContentLoaded', () => {
    const productFormSection = document.getElementById('productFormSection');
    const supplierFormSection = document.getElementById('supplierFormSection');
    const viewProductsSection = document.getElementById('viewProductsSection');
    const viewSuppliersSection = document.getElementById('viewSuppliersSection');
    const viewRequestsSection = document.getElementById('viewRequestsSection'); // Adiciona a seção de solicitações

    const viewProductsBtn = document.getElementById('viewProductsBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const viewSuppliersBtn = document.getElementById('viewSuppliersBtn');
    const addSupplierBtn = document.getElementById('addSupplierBtn');
    const viewRequestsBtn = document.getElementById('viewRequestsBtn'); // Adiciona o botão de visualizar solicitações

    const productForm = document.getElementById('productForm');
    const supplierForm = document.getElementById('supplierForm');

    const productsTableBody = document.querySelector('#productsTable tbody');
    const suppliersTableBody = document.querySelector('#suppliersTable tbody');
    const requestsList = document.getElementById('requestsList'); // Adiciona a lista de solicitações

    viewProductsBtn.addEventListener('click', () => toggleSection(viewProductsSection));
    addProductBtn.addEventListener('click', () => toggleSection(productFormSection));
    viewSuppliersBtn.addEventListener('click', () => toggleSection(viewSuppliersSection));
    addSupplierBtn.addEventListener('click', () => toggleSection(supplierFormSection));

    // Alternar visibilidade das seções, incluindo a nova seção de solicitações
    viewRequestsBtn.addEventListener('click', () => {
        toggleSection(viewRequestsSection);
        displayRequests(); // Carrega as solicitações quando a seção for exibida
    });

    function toggleSection(section) {
        [productFormSection, supplierFormSection, viewProductsSection, viewSuppliersSection, viewRequestsSection].forEach(sec => sec.style.display = 'none');
        section.style.display = 'block';

        if (section === viewProductsSection) {
            displayProducts();
            checkExpiryDates(); // Checar datas de validade ao visualizar produtos
        }
        if (section === viewSuppliersSection) displaySuppliers();
    }

    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
            code: document.getElementById('productCode').value,
            description: document.getElementById('productDescription').value,
            category: document.getElementById('productCategory').value,
            quantity: document.getElementById('productQuantity').value,
            unit: document.getElementById('unitOfMeasure').value,
            price: document.getElementById('purchasePrice').value,
            supplier: document.getElementById('productSupplier').value,
            entryDate: document.getElementById('entryDate').value,
            expiryDate: document.getElementById('expiryDate').value,
            location: document.getElementById('warehouseLocation').value,
        };
        saveData('products', product);
        productForm.reset();
    });

    supplierForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const supplier = {
            name: document.getElementById('supplierName').value,
            cnpjCpf: document.getElementById('supplierCNPJCPF').value,
            phone: document.getElementById('supplierPhone').value,
            email: document.getElementById('supplierEmail').value,
            site: document.getElementById('supplierSite').value,
            rating: document.getElementById('supplierRating').value,
            discounts: document.getElementById('supplierDiscounts').value,
        };
        saveData('suppliers', supplier);
        supplierForm.reset();
    });

    // Função para carregar e exibir as solicitações de produtos
    function displayRequests() {
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        requestsList.innerHTML = ''; // Limpa a lista antes de adicionar os itens

        solicitacoes.forEach((solicitacao, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${solicitacao.nomeSolicitante} solicitou ${solicitacao.quantidade} de ${solicitacao.nomeProduto} <button onclick="removerSolicitacao(${index})">Remover</button>`;
            requestsList.appendChild(li);
        });
    }
    

    function saveData(key, data) {
        const storedData = JSON.parse(localStorage.getItem(key)) || [];
        storedData.push(data);
        localStorage.setItem(key, JSON.stringify(storedData));
    }

    function displayProducts() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        productsTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = productsTableBody.insertRow();
            row.insertCell(0).textContent = product.code;
            row.insertCell(1).textContent = product.description;
            row.insertCell(2).textContent = product.category;
            row.insertCell(3).textContent = product.quantity;
            row.insertCell(4).textContent = product.unit;
            row.insertCell(5).textContent = product.price;
            row.insertCell(6).textContent = product.supplier;
            row.insertCell(7).textContent = product.entryDate;
            row.insertCell(8).textContent = product.expiryDate;
            row.insertCell(9).textContent = product.location;

            for (let i = 0; i < 10; i++) {
                row.cells[i].addEventListener('click', () => makeEditable(row, index, i, 'products'));
            }

            const deleteCell = row.insertCell(10);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteProduct(index));
            deleteCell.appendChild(deleteButton);
        });
    }
    
    function displaySuppliers() {
        const suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        suppliersTableBody.innerHTML = '';
        suppliers.forEach((supplier, index) => {
            const row = suppliersTableBody.insertRow();
            row.insertCell(0).textContent = supplier.name;
            row.insertCell(1).textContent = supplier.cnpjCpf;
            row.insertCell(2).textContent = supplier.phone;
            row.insertCell(3).textContent = supplier.email;
            row.insertCell(4).textContent = supplier.site;
            row.insertCell(5).textContent = supplier.rating;
            row.insertCell(6).textContent = supplier.discounts;

            // Adicionar funcionalidade de edição
            for (let i = 0; i < 7; i++) {
                row.cells[i].addEventListener('click', () => makeEditable(row, index, i, 'suppliers'));
            }

            const deleteCell = row.insertCell(7);
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.addEventListener('click', () => deleteSupplier(index));
            deleteCell.appendChild(deleteButton);
        });
    }


    function checkExpiryDates() {
        const products = JSON.parse(localStorage.getItem('products')) || [];
        const today = new Date();
        const warningThreshold = 2; // 2 dias antes da data de validade

        products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            const timeDifference = expiryDate - today;
            const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convertendo ms em dias

            if (daysRemaining <= warningThreshold && daysRemaining >= 0) {
                showExpiryAlert(product);
            }
        });
    }

    function showExpiryAlert(product) {
        const alertMessage = `Atenção! O produto "${product.description}" (Código: ${product.code}) está com a validade próxima. Restam ${Math.ceil(new Date(product.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)} dias.`;
        alert(alertMessage);
        // Você pode personalizar essa função para mostrar alertas no HTML, em vez de usar `alert()`.
    }

    function makeEditable(row, index, cellIndex, key) {
        const originalText = row.cells[cellIndex].textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        row.cells[cellIndex].textContent = '';
        row.cells[cellIndex].appendChild(input);

        input.focus();
        input.addEventListener('blur', () => saveEdit(row, index, cellIndex, key, input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveEdit(row, index, cellIndex, key, input.value);
            }
        });
    }

    function saveEdit(row, index, cellIndex, key, newValue) {
        const data = JSON.parse(localStorage.getItem(key)) || [];
        const item = data[index];
        const keys = key === 'products'
            ? ['code', 'description', 'category', 'quantity', 'unit', 'price', 'supplier', 'entryDate', 'expiryDate', 'location']
            : ['name', 'cnpjCpf', 'phone', 'email', 'site', 'rating', 'discounts'];

        item[keys[cellIndex]] = newValue;
        localStorage.setItem(key, JSON.stringify(data));
        row.cells[cellIndex].textContent = newValue;
    }

    function deleteProduct(index) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        displayProducts();
    }

    function deleteSupplier(index) {
        let suppliers = JSON.parse(localStorage.getItem('suppliers')) || [];
        suppliers.splice(index, 1);
        localStorage.setItem('suppliers', JSON.stringify(suppliers));
        displaySuppliers();
    }
});
