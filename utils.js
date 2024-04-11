//importing the base URL from the variables module 
import { baseUrl } from './variables.js';


//Function to fetch restaurant data
export const fetchRestaurantData = async () => {
    const url = `${baseUrl}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
       }
      const restaurants = await response.json();
      return restaurants;
    } catch (error) {
      console.error('Fetch error: ', error);
    }
  };

  // Utility function for removing highlight from rows
export const removeHighlight = () => {
    document.querySelectorAll('tr').forEach(row => {
        row.classList.remove('highlight');
    });
};

export const fetchMenuAndshowModal = async (restaurant, showDialogCallback) => {
    const menuUrl = `${baseUrl}/daily/${restaurant._id}/fi`;
    const menuWeeklyUrl = `${baseUrl}/weekly/${restaurant._id}/fi`;
    try {
        const menuResponse = await fetch(menuUrl);
        if (!menuResponse.ok) {
            throw new Error(`HTTP error status: ${menuResponse.status}`);
        }
        const menu = await menuResponse.json();

        const menuWeeklyResponse = await fetch(menuWeeklyUrl);
        if (!menuWeeklyResponse.ok) {
            throw new Error(`HTTP error status: ${menuWeeklyResponse.status}`);
        }
        const menuWeekly = await menuWeeklyResponse.json();

        showDialogCallback(restaurant, menu, menuWeekly); // Using callback to show dialog with fetched data
    } catch (e) {
        console.error('Fetch menu error!: ', e);
    }
};