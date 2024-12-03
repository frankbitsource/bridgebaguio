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

// Mobile menu functionality
const burgerMenu = document.getElementById('burgerMenu');
const menu = document.getElementById('menu');

burgerMenu.addEventListener('click', () => {
    menu.classList.toggle('active');
});

// Search functionality
async function searchGrave() {
    const searchInput = document.getElementById('searchInput').value.trim();
    console.log('Searching for:', searchInput); // For debugging
    
    try {
        const response = await fetch(`/api/graves/search/${encodeURIComponent(searchInput)}`);
        console.log('Search response:', response); // For debugging
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Grave not found');
        }
        
        const grave = await response.json();
        console.log('Found grave:', grave); // For debugging

        // Get user's location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = [position.coords.longitude, position.coords.latitude];
                displayRoute(userLocation, [grave.longitude, grave.latitude], grave);
            },
            (error) => {
                alert('Please enable location services to see the route.');
            }
        );
    } catch (error) {
        console.error('Search error:', error);
        alert(error.message || 'Error searching for grave');
    }
}

// Display route on map
async function displayRoute(start, end, grave) {
    // Clear existing markers and route
    map.getSource('route')?.removeSource();
    document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());

    // Add markers
    new mapboxgl.Marker({ color: '#0000FF' })
        .setLngLat(start)
        .addTo(map);
    
    new mapboxgl.Marker({ color: '#FF0000' })
        .setLngLat(end)
        .addTo(map);

    // Get route
    const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
    );
    const json = await query.json();
    const data = json.routes[0];

    // Add route to map
    map.addLayer({
        id: 'route',
        type: 'line',
        source: {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: {},
                geometry: data.geometry
            }
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round'
        },
        paint: {
            'line-color': '#0000FF',
            'line-width': 5,
            'line-opacity': 0.75
        }
    });

    // Display grave info
    displayGraveInfo(grave);

    // Fit map to show route
    const bounds = new mapboxgl.LngLatBounds()
        .extend(start)
        .extend(end);
    map.fitBounds(bounds, { padding: 50 });
}

// Display grave information
function displayGraveInfo(grave) {
    const infoDiv = document.getElementById('graveInfo');
    infoDiv.innerHTML = `
        <h3>${grave.name}</h3>
        <p>Birthday: ${new Date(grave.birthday).toLocaleDateString()}</p>
        <p>Date of Death: ${new Date(grave.dateOfDeath).toLocaleDateString()}</p>
    `;
    infoDiv.classList.add('active');
}
  