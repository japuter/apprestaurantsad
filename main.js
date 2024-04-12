import { fetchRestaurantData, fetchMenuAndshowModal, removeHighlight} from './utils.js';
  
  
  document.addEventListener('DOMContentLoaded', function() {
    fetchRestaurantData().then(restaurants => {
      populateRestaurantList(restaurants);
    }).catch(error => console.error('Initialization error;', error));
  });
  

const populateRestaurantList = (restaurants) => {
    const table = document.createElement('table');
    let tableBody = table.querySelector("tbody") || document.createElement('tbody');
    tableBody.innerHTML = '';
    table.appendChild(tableBody);


    document.getElementById('main-table').appendChild(table);

  
    restaurants.sort((a, b) => a.name.localeCompare(b.name));

  
    restaurants.forEach(restaurant => {
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
        removeHighlight();
        row.classList.add('highlight');
        fetchMenuAndshowModal(restaurant, showModal);
    
        });
    
    
        const namecel = document.createElement('td');
        namecel.textContent = restaurant.name;
        const addressCell = document.createElement('td');
        addressCell.textContent=restaurant.address;
        row.appendChild(namecel);
        row.appendChild(addressCell);
        tableBody.appendChild(row);
    });
}

  
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('restaurantDetailsModal').close();
  });
  

  //function to populate and show modal
  const showModal = (restaurant, menu, weeklymenu) => {
    const modall = document.getElementById('restaurantDetailsModal');
    const restaurantDetailsModal = document.getElementById('restaurantDetailsModal');
    console.log(menu)

    const coursesString = menu.courses.map(course => `${course.name}: ${course.price}`).join('<br>');

    console.log(weeklymenu);

    let formattedMenu = formatDaysWithCourses(weeklymenu);

    // Start with setting the innerHTML for basic restaurant details
    let htmlContent = `
        <p>Name: ${restaurant.name}</p>
        <p>Address: ${restaurant.address}</p>
        <p>Postal Code: ${restaurant.postalCode}</p>
        <p>City: ${restaurant.city}</p>
        <p>Phone: ${restaurant.phone}</p>
        <p>Company: ${restaurant.company}</p>
        <p>Menu: <br>${coursesString}</p>
        <p>Weekly menu: <br> ${formattedMenu} </p>
    `;

    
    
    // Update restaurantDetailsModal's innerHTML with the complete htmlContent
    restaurantDetailsModal.innerHTML = htmlContent;

    // Show the modal modall
    modall.showModal();
}

const formatDaysWithCourses = (weeklymenu) => {
    return weeklymenu.days.map(day => {
      // Assuming each course has a 'name' property you want to display
      const coursesString = day.courses.map(course => `${course.name}: ${course.price}`).join('<br> ');
      return `${day.date}: ${coursesString}`;
    }).join('\n <br> <br>'); // Joining each day with a newline for better readability
  }
