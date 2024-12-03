mapboxgl.accessToken = 'pk.eyJ1IjoiZnJhbmtqYXNwZXI0IiwiYSI6ImNtNDhvdXZiazAyYWMybHI2YmVza2Q3cmIifQ.Av2SoALTdY0aUFS12Z0prQ';

// Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [120.5976, 16.4023], // Baguio City coordinates
    zoom: 15
});

// Add navigation controls
map.addControl(new mapboxgl.NavigationControl());

// Load existing graves
async function loadGraves() {
    try {
        const response = await fetch('/api/graves');
        const data = await response.json();
        const gravesList = document.getElementById('gravesList');
        
        gravesList.innerHTML = data.graves.map(grave => `
            <div class="grave-item">
                <h4>${grave.name}</h4>
                <p>Latitude: ${grave.latitude}</p>
                <p>Longitude: ${grave.longitude}</p>
                <p>Birthday: ${new Date(grave.birthday).toLocaleDateString()}</p>
                <p>Date of Death: ${new Date(grave.dateOfDeath).toLocaleDateString()}</p>
                <button onclick="deleteGrave('${grave.id}')">Delete</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading graves:', error);
    }
}

// Add new grave
document.getElementById('addGraveForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newGrave = {
        name: document.getElementById('name').value,
        latitude: parseFloat(document.getElementById('latitude').value),
        longitude: parseFloat(document.getElementById('longitude').value),
        birthday: document.getElementById('birthday').value,
        dateOfDeath: document.getElementById('deathDate').value
    };

    try {
        const response = await fetch('/api/graves', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newGrave)
        });

        if (response.ok) {
            alert('Grave added successfully');
            e.target.reset();
            loadGraves();
        } else {
            throw new Error('Failed to add grave');
        }
    } catch (error) {
        alert(error.message);
    }
});

// Delete grave
async function deleteGrave(id) {
    if (confirm('Are you sure you want to delete this grave?')) {
        try {
            const response = await fetch(`/api/graves/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Grave deleted successfully');
                loadGraves();
            } else {
                throw new Error('Failed to delete grave');
            }
        } catch (error) {
            alert(error.message);
        }
    }
}

// Load graves when page loads
loadGraves(); 