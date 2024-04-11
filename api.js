import { restaurantRow, restaurantModal } from "./components.js";


  document.addEventListener('DOMContentLoaded', function() {
    fetchRestaurantData();
  });
  
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

const populateRestaurantList = (restaurants) =>{
    const table = document.createElement('table');
    let tableBody = table.querySelector("tbody") || document.createElement('tbody');
    tableBody.innerHTML = '';
    table.appendChild(tableBody);


    document.getElementById('main-table').appendChild(table);

  
    restaurants.sort((a, b) => a.name.localeCompare(b.name));

  
    restaurants.forEach(restaurant => {
        // we use restaurant() to create and return a new row
        const row = restaurantRow(restaurant);


        row.addEventListener('click', () => {
        removeHighlight();
        row.classList.add('highlight');
        fetchMenuAndShowModal(restaurant);
    
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

   const fetchMenuAndShowModal = async (restaurant) => {
    const menuUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/daily/${restaurant._id}/fi`;
    const menuWeeklyUrl = `https://10.120.32.94/restaurant/api/v1/restaurants/weekly/${restaurant._id}/fi`;
    try {
      const menuResponse = await fetch(menuUrl)
      if (!menuResponse.ok) {
        throw new Error (`HTTTP error status: ${menuResponse.status}`);
      }
      const menu = await menuResponse.json();
      

    const menuWeeklyResponse = await fetch(menuWeeklyUrl);

      if (!menuWeeklyResponse.ok) {
        throw new Error (`HTTTP error status: ${menuWeeklyResponse.status}`);
      }

      const menuWeekly = await menuWeeklyResponse.json();


      showModal(restaurant, menu, menuWeekly); // pass menu data to showDialog
    } catch (e) {
      console.error('Fetch menu error!: ', e);
    }
  }
  
  document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('restaurantDetailsModal').close();
  });
  
  // function to remove highlight
  const removeHighlight = async () => {
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('highlight');
    });
  }

  //function to populate and show modal
  const showModal = (restaurant, dailymenu, weeklymenu) => {
    const modal = document.getElementById('restaurantDetailsModal');
    const modalContent = document.getElementById('modalContent');


    // const dailyCoursesString = dailymenu.courses.map(course => `${course.name}: ${course.price}`).join('<br>');
    // const weeklyCoursesString = formatDaysWithCourses(weeklymenu);

    // console.log('API MENU DEBUG: ', dailyCoursesString);
    // console.log('API WEEKLY MENU DEBUG: ', weeklyCoursesString);

    const formattedMenus = restaurantModal(restaurant, dailymenu, weeklymenu);

    
    // Update dialogContent's innerHTML with the complete htmlContent
    modalContent.innerHTML = formattedMenus;

    // Show the modal dialog
    modal.showModal();
}

const formatDaysWithCourses = (weeklymenu) => {
    return weeklymenu.days.map(day => {
      // Assuming each course has a 'name' property you want to display
      const coursesString = day.courses.map(course => `${course.name}: ${course.price}`).join('<br> ');
      return `${day.date}: ${coursesString}`;
    }).join('\n <br> <br>'); // Joining each day with a newline for better readability
  }   