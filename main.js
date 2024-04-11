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
        const row = document.createElement('tr');
        row.addEventListener('click', () => {
        removeHighlight();
        row.classList.add('highlight');
        fetchMenuAndShowDialog(restaurant);
    
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

   const fetchMenuAndShowDialog = async (restaurant) => {
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


      showDialog(restaurant, menu, menuWeekly); // pass menu data to showDialog
    } catch (e) {
      console.error('Fetch menu error!: ', e);
    }
  }
  
  document.getElementById('closeDialog').addEventListener('click', () => {
    document.getElementById('restaurantDetailsDialog').close();
  });
  
  // function to remove highlight
  const removeHighlight = async () => {
    document.querySelectorAll('tr').forEach(row => {
      row.classList.remove('highlight');
    });
  }

  //function to populate and show modal
  const showDialog = (restaurant, menu, weeklymenu) => {
    const dialog = document.getElementById('restaurantDetailsDialog');
    const dialogContent = document.getElementById('dialogContent');
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

    
    
    // Update dialogContent's innerHTML with the complete htmlContent
    dialogContent.innerHTML = htmlContent;

    // Show the modal dialog
    dialog.showModal();
}

const formatDaysWithCourses = (weeklymenu) => {
    return weeklymenu.days.map(day => {
      // Assuming each course has a 'name' property you want to display
      const coursesString = day.courses.map(course => `${course.name}: ${course.price}`).join('<br> ');
      return `${day.date}: ${coursesString}`;
    }).join('\n <br> <br>'); // Joining each day with a newline for better readability
  }
