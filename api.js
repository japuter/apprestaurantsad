import { restaurantRow, restaurantModal } from "./components.js";


  document.addEventListener('DOMContentLoaded', function() {
    fetchRestaurantData().then(restaurants => {
      // Filters the fetched restaurants to include only those belonging to 'Compass' or 'Sodexho'.
      const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.includes('Compass') || restaurant.name.includes('Sodexho')
      );

    displayRestaurants(filteredRestaurants);

  }).catch(error => {
    console.error('Initialization error: ', error);
    displayErrorMessage('Failed to load restaurants.!!');
  });
});

const displayErrorMessage = (message) => {
  const errorContainer = document.getElementById('error-message');
  errorContainer.innerHTML = `<p class='error'>${message}</p>`;
  errorContainer.style.display = 'block';
};



  // Fetches restaurant data from a specific API endpoint.
  const fetchRestaurantData = async () => {
    const url = 'https://10.120.32.94/restaurant/api/v1/restaurants';
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
       }
      const restaurants = await response.json();
      populateRestaurantList(restaurants);
    } catch (error) {
      console.error('Fetch error: ', error);
    }
  }


  // Generates HTML content for displaying restaurants and inserts it into the DOM.
displayRestaurants = (restaurant) => {
  if (restaurants.length === 0) {
    displayErrorMessage('No Sodexho or Compass restaurants found.');
  }
  const restaurantHTML = restaurants.map(restaurant => `
  div class='restaurant'
  <h2>${restaurant.name}</h2>
  <p>${restaurant.address}</p>
  <p>${restaurant.company}</strong></p>
  </div>
  `).join('');
  document.getElementById('main-table').innerHTML = restaurantHTML;
}



// Handles the initial population of the restaurant list, likely used when loading all restaurants.
const populateRestaurantList = (restaurants) =>{
    const table = document.createElement('table');
    let tableBody = table.querySelector("tbody") || document.createElement('tbody');
    tableBody.innerHTML = '';
    table.appendChild(tableBody);

    document.getElementById('main-table').appendChild(table);

    // Sorts restaurants by name and adds each to the HTML table.
    restaurants.sort((a, b) => a.name.localeCompare(b.name));

    restaurants.forEach(restaurant => {
        const row = restaurantRow(restaurant); // Creates a row for each restaurant.


        row.addEventListener('click', () => {
        removeHighlight(); // Removes highlighting from other rows.
        row.classList.add('highlight'); // Highlights the selected row.
        fetchMenuAndShowModal(restaurant); // Fetches and displays the menu for the selected restaurant.
    
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


    // Fetches the daily and weekly menu for a specific restaurant and displays it using a modal.
   const fetchMenuAndShowModal = async (restaurant) => {
    const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${restaurant._id}/fi`;
    const menuWeeklyUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${restaurant._id}/fi`;
    try {
      // Fetch the daily menu
      const menuResponse = await fetch(menuUrl)
      if (!menuResponse.ok) {
        throw new Error (`HTTTP error status: ${menuResponse.status}`);
      }
      const menu = await menuResponse.json();
      
      // Fetch the weekly menu.
    const menuWeeklyResponse = await fetch(menuWeeklyUrl);
      if (!menuWeeklyResponse.ok) {
        throw new Error (`HTTTP error status: ${menuWeeklyResponse.status}`);
      }
      const menuWeekly = await menuWeeklyResponse.json();

       // Display the fetched menus in a modal.
      showModal(restaurant, menu, menuWeekly);
    } catch (e) {
      console.error('Fetch menu error!: ', e);
    }
  }
  
  
// Adds an event listener to the 'Close' button in the modal for closing it.
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('restaurantDetailsModal').close();
  });
  

  // function to remove highlight
  const removeHighlight = async () => {
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('highlight');
    });
  }

  //Displays detailed information about a restaurant and its menus in a modal.
  const showModal = (restaurant, dailymenu, weeklymenu) => {
    const modal = document.getElementById('restaurantDetailsModal');
    const modalContent = document.getElementById('modalContent');


      // Generate the content for the modal using a helper function from components.js
    const formattedMenus = restaurantModal(restaurant, dailymenu, weeklymenu);

    
    // Update dialogContent's innerHTML with the complete htmlContent
    modalContent.innerHTML = formattedMenus;

    // Show the modal dialog
    modal.showModal();
}


// Formats the weekly menu data into a readable string, detailing each day's menu.
const formatDaysWithCourses = (weeklymenu) => {
    return weeklymenu.days.map(day => {
      // Creates a string for each day that lists courses and their prices.
      const coursesString = day.courses.map(course => `${course.name}: ${course.price}`).join('<br> ');
      return `${day.date}: ${coursesString}`;
    }).join('\n <br> <br>'); // Joining each day with a newline for better readability
  }