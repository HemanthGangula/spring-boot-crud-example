document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = '/api/products';
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('productTableBody');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const productId = document.getElementById('productId');

    // Load all products when page loads
    fetchProducts();

    // Submit form handler
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const product = {
            name: document.getElementById('name').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value)
        };
        
        if (productId.value) {
            // Update existing product
            product.id = parseInt(productId.value);
            updateProduct(product);
        } else {
            // Add new product
            addProduct(product);
        }
    });

    // Reset form button handler
    resetBtn.addEventListener('click', resetForm);

    function fetchProducts() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(products => {
                displayProducts(products);
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    function displayProducts(products) {
        productTableBody.innerHTML = '';
        
        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.quantity}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productTableBody.appendChild(tr);
            
            // Add event listeners for edit and delete buttons
            tr.querySelector('.edit-btn').addEventListener('click', function() {
                editProduct(product);
            });
            
            tr.querySelector('.delete-btn').addEventListener('click', function() {
                deleteProduct(product.id);
            });
        });
    }

    function addProduct(product) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            fetchProducts();
            resetForm();
            alert('Product added successfully!');
        })
        .catch(error => console.error('Error adding product:', error));
    }

    function updateProduct(product) {
        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.json())
        .then(data => {
            fetchProducts();
            resetForm();
            submitBtn.textContent = 'Add Product';
            alert('Product updated successfully!');
        })
        .catch(error => console.error('Error updating product:', error));
    }

    function deleteProduct(id) {
        if (confirm('Are you sure you want to delete this product?')) {
            fetch(`${apiUrl}/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.text())
            .then(data => {
                fetchProducts();
                alert('Product deleted successfully!');
            })
            .catch(error => console.error('Error deleting product:', error));
        }
    }

    function editProduct(product) {
        productId.value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('quantity').value = product.quantity;
        document.getElementById('price').value = product.price;
        submitBtn.textContent = 'Update Product';
    }

    function resetForm() {
        productForm.reset();
        productId.value = '';
        submitBtn.textContent = 'Add Product';
    }
});
