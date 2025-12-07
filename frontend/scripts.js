document.addEventListener('DOMContentLoaded', () => {
    // --- Data Model (Mock Database) ---
    // In a real app, this comes from your Backend API
    let items = [
        { id: 1, label: 'Wallet', desc: 'Black leather wallet, found near library', date: '2 days ago', img: 'https://via.placeholder.com/300/333/FFF?text=Wallet' },
        { id: 2, label: 'Bottle', desc: 'Blue hydro flask', date: 'Yesterday', img: 'https://via.placeholder.com/300/0071e3/FFF?text=Bottle' },
        { id: 3, label: 'Keys', desc: 'Car keys with a Mario keychain', date: 'Today', img: 'https://via.placeholder.com/300/e30000/FFF?text=Keys' },
        { id: 4, label: 'AirPods', desc: 'White case with cat sticker', date: '3 days ago', img: 'https://via.placeholder.com/300/eee/333?text=AirPods' },
        { id: 5, label: 'Notebook', desc: 'Chemistry 101 notes', date: 'Today', img: 'https://via.placeholder.com/300/f4a261/FFF?text=Notebook' }
    ];

    const recommendedTags = ['All', 'Wallet', 'Keys', 'Phone', 'Bottle', 'Laptop'];

    // --- DOM Elements ---
    const searchInput = document.getElementById('searchInput');
    const tagsContainer = document.getElementById('tagsContainer');
    const itemsGrid = document.getElementById('itemsGrid');
    const emptyState = document.getElementById('emptyState');
    
    // Modal Elements
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadModal = document.getElementById('uploadModal');
    const closeModal = document.getElementById('closeModal');
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const confirmUpload = document.getElementById('confirmUpload');

    // --- Initialization ---
    renderTags();
    renderItems(items);

    // --- Core Functions ---

    /**
     * Renders the grid of items.
     * Handles switching between the Grid View and the Empty State (Security Office).
     */
    function renderItems(data) {
        itemsGrid.innerHTML = '';
        
        if (data.length === 0) {
            // No results: Show Security Office info
            itemsGrid.classList.add('hidden');
            emptyState.classList.remove('hidden');
        } else {
            // Results found: Show grid
            emptyState.classList.add('hidden');
            itemsGrid.classList.remove('hidden');

            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'item-card';
                card.innerHTML = `
                    <div class="card-image-wrapper">
                        <img src="${item.img}" alt="${item.label}">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">${item.label}</h3>
                        <p class="card-meta">${item.desc} • ${item.date}</p>
                        <button class="remove-btn" onclick="removeItem(${item.id})">Remove Item</button>
                    </div>
                `;
                itemsGrid.appendChild(card);
            });
        }
    }

    /**
     * Renders the pill-shaped tags for quick filtering.
     */
    function renderTags() {
        // Keep the "Suggested:" label
        const label = tagsContainer.querySelector('.tag-label');
        tagsContainer.innerHTML = ''; 
        tagsContainer.appendChild(label);

        recommendedTags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = 'tag';
            if (tag === 'All') btn.classList.add('active');
            btn.textContent = tag;
            
            btn.addEventListener('click', () => {
                // Update UI state
                document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
                btn.classList.add('active');
                
                // Update Search Logic
                if (tag === 'All') {
                    searchInput.value = '';
                    renderItems(items);
                } else {
                    searchInput.value = tag; // visual feedback
                    filterItems(tag);
                }
            });
            tagsContainer.appendChild(btn);
        });
    }

    /**
     * Filters the items array based on text input.
     */
    function filterItems(query) {
        const lowerQuery = query.toLowerCase();
        const filtered = items.filter(item => 
            item.label.toLowerCase().includes(lowerQuery) || 
            item.desc.toLowerCase().includes(lowerQuery)
        );
        renderItems(filtered);
    }

    // --- Global Function for Remove (attached to window to work in innerHTML) ---
    window.removeItem = function(id) {
        // In a real app: call API DELETE /items/:id
        if(confirm("Did you retrieve this item? Removing it from the list.")) {
            items = items.filter(i => i.id !== id);
            // Re-run filter based on current search input
            filterItems(searchInput.value);
        }
    }

    // --- Event Listeners ---

    // 1. Search Input Logic
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        // Reset tags active state if typing manually
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        filterItems(val);
    });

    // 2. Modal Logic (Open/Close)
    uploadBtn.addEventListener('click', () => uploadModal.classList.remove('hidden'));
    closeModal.addEventListener('click', () => uploadModal.classList.add('hidden'));
    uploadModal.addEventListener('click', (e) => {
        if (e.target === uploadModal) uploadModal.classList.add('hidden');
    });

    // 3. File Upload Simulation
    dropzone.addEventListener('click', () => fileInput.click());
    
    confirmUpload.addEventListener('click', () => {
        if (fileInput.files.length === 0) {
            alert("Please select an image first.");
            return;
        }

        // Simulate API Processing State
        confirmUpload.textContent = "AI Analyzing...";
        confirmUpload.style.backgroundColor = "#86868b";
        
        setTimeout(() => {
            // Mock New Item from Backend
            const newItem = {
                id: Date.now(),
                label: 'Backpack', // This would come from your ML Model
                desc: 'Auto-detected: Grey Backpack',
                date: 'Just now',
                img: 'https://via.placeholder.com/300/333/FFF?text=New+Item' // Use the uploaded file in real app
            };
            
            items.unshift(newItem); // Add to top of list
            renderItems(items);
            
            // Reset Modal
            uploadModal.classList.add('hidden');
            confirmUpload.textContent = "Analyze & Upload";
            confirmUpload.style.backgroundColor = ""; // Reset color
            alert(`Item identified as "${newItem.label}" and added!`);
        }, 1500);
    });
});