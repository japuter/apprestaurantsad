const restaurantRow = (restaurant) => {
    const { name, company, companyId } = restaurant;
    const tr = document.createElement('tr');
    
    tr.innerHTML = `<td>${name}</td><td>${company}</td><td><button class="favorite-btn" data-id="${companyId}">★</button></td>`;
    return tr;
}


// POPULATES THE CONTENT FOR SPECIFIED RESTAURANTS MODAL AND RETURNS IT IN HTML FORMAT
const restaurantModal = async (restaurant, dailyCourses, weeklyCourses, map, markers) => {
    const { name, address, postalCode, location} = restaurant;

    // Initialize empty string for accumulating menu items HTML  
    let menuHtml = "";   
    
    // Daily courses processing
    menuHtml += '<h1>Daily menu:</h1>';
    if (Array.isArray(dailyCourses.courses) && dailyCourses.courses.length) {
        dailyCourses.courses.forEach(course => {
            // For each item, append HTML snippet to 'menuHtml'
            menuHtml += `<div class="menu-item">
                <h3>${course.name}</h3>
                <p>Price: ${course.price}</p>
                <p>Dietary options: ${course.diets}</p>
            </div>`;
        });
    } else {
        menuHtml += "<h2>No menus found</h2>";
    }

     // Weekly courses processing
     menuHtml += '<h1>Weekly menu:</h1>';
     if (Array.isArray(weeklyCourses.days) && weeklyCourses.days.length) {
        weeklyCourses.days.forEach(day => {
            menuHtml += `<details class="day-menu">
                <summary>${day.date}</summary>`;  // Clickable summary part
            day.courses.forEach(course => {
                menuHtml += `<div class="menu-item">
                    <h4>${course.name}</h4>
                    <p>Price: ${course.price}</p>
                    <p>Dietary options: ${course.diets}</p>
                </div>`;
            });
            menuHtml += `</details>`; // Close the details tag
        });
    } else {
        menuHtml += "<h2>No menus found</h2>";
    }

    const [lon, lat] = [location.coordinates[0].toFixed(4), location.coordinates[1].toFixed(4)];    

    map.flyTo([lat, lon], 15);  // Fly to the restaurant location with zoom level 15

    // Clear existing markers
    markers.clearLayers();

    // Create and add new marker for the selected restaurant
    L.marker([lat, lon])
        .addTo(markers)
        .bindPopup(`<strong>${name}</strong><br>${address}`)
        .openPopup();

    // Construct full HTML for the modal, including restaurant details and the menu HTML
    const modalContentHtml = `
        <div class="restaurant-info">
            <h2>${name}</h2>
            <p>Address: ${address}, ${postalCode}</p>
        </div>
        <div class="menu">${menuHtml}</div>
    `;

    return modalContentHtml;
}

export { restaurantRow, restaurantModal };
