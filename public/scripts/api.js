'use strict';

// Import statements
import { restaurantRow, restaurantModal } from "../scripts/components.js";

let map;
let markers;
let restaurants;

// Event listener for DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {

    map = L.map('map').setView([0, 0], 2);  // Set a minimal zoom level to show a world view
    markers = new L.LayerGroup().addTo(map);  // Create a LayerGroup to manage markers


    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 15,
        attribution: '© OpenStreetMap'
    }).addTo(map);


    try {
        restaurants = await fetchRestaurantData();
        populateRestaurantList(restaurants);
    } catch (error) {
        console.error('Error fetching restaurant data:', error);
    }
});

// Fetch restaurant data function and return it
const fetchRestaurantData = async () => {
    const url = 'https://10.120.32.94/restaurant/api/v1/restaurants';
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const populateRestaurantList = (restaurants) => {
    const tableBody = document.getElementById('main-table-body');
    tableBody.innerHTML = ''; // Clear previous entries

    restaurants.sort((a, b) => a.name.localeCompare(b.name));

    restaurants.forEach(restaurant => {
        const row = restaurantRow(restaurant);

        console.log(isFavorite(restaurant.companyId));

        row.addEventListener('click', async (event) => {
            if (event.target.classList.contains('favorite-btn')) {
                event.stopPropagation(); // Prevent triggering row click event
                const restaurantId = event.target.getAttribute('data-id');
                toggleFavorite(restaurantId);
                updateFavoriteButton(event.target, isFavorite(restaurantId));
            } else {
                removeHighlight();
                row.classList.add('highlight');
                try {
                    const [dailyMenu, weeklyMenu] = await fetchMenus(restaurant);
                    showModal(restaurant, dailyMenu, weeklyMenu);
                } catch (e) {
                    console.error('Error fetching menus:', e);
                }
            }
        });
        const favoriteButton = row.querySelector('.favorite-btn');
        updateFavoriteButton(favoriteButton, isFavorite(restaurant.companyId));

        tableBody.appendChild(row);
    });
}


const fetchMenus = async (restaurant) => {
    const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${restaurant._id}/fi`;
    const menuWeeklyUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${restaurant._id}/fi`;

    const responses = await Promise.all([
        fetch(menuUrl), fetch(menuWeeklyUrl)
    ]);

    if (!responses[0].ok || !responses[1].ok) {
        throw new Error(`HTTP error status: ${responses[0].status} or ${responses[1].status}`);
    }

    return Promise.all(responses.map(res => res.json()));
}



// SHOW MODAL V2
const showModal = async (restaurant, dailyMenu, weeklyMenu) => {
    const modal = document.getElementById('restaurantDetailsModal');

    const modalContent = document.getElementById('modalContent');

    modalContent.innerHTML = await restaurantModal(restaurant, dailyMenu, weeklyMenu, map, markers);

    modal.style.display = 'block';
    map.invalidateSize();

    modal.showModal();
}

// Remove highlight function
const removeHighlight = () => {
    document.querySelectorAll('tr.highlight').forEach(row => {
        row.classList.remove('highlight');
    });
}

// Event listener for close modal
document.getElementById('closeModal').addEventListener('click', () => {
    const modal = document.getElementById('restaurantDetailsModal');
    removeHighlight();
    
    modal.style.display = 'none';
    modal.close(); 

});


// Function to format days with courses
const formatDaysWithCourses = (weeklymenu) => {
    return weeklymenu.days.map(day => {
        const coursesString = day.courses.map(course => `${course.name}: ${course.price}`).join('<br> ');
        return `${day.date}: ${coursesString}`;
    }).join('\n <br> <br>');
}