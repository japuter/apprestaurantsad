'use strict';

const restaurantRow = (restaurant) => {
    const { name, company } = restaurant;
    const tr = document.createElement('tr')
    tr.innerHTML = `<td>${name}</td><td>${company}</td>`;
    return tr;
}

const restaurantModal = (restaurant, dailyCourses, weeklyCourses) => {
    const { name, address, postalCode} = restaurant;

    console.log('dailyCourses: ', dailyCourses);
    console.log(weeklyCourses);

    let menuHtml = ""; //Itialize empty string for accumulating menu itms HTML    

    if (Array.isArray(dailyCourses.courses) && dailyCourses.courses.length) {
        dailyCourses.courses.forEach(course => {
            // FOR each item, append hmtl snipped to 'menuHTML'
            menuHtml += `<div class="menu-item">
            <h4>${course.name}</h4>
            <p>Price: ${course.price}</p>
            <p>Dietary options: ${course.diets}</p>
            
        </div>`;
        });
    } else {
        menuHtml = ("<p> Ei salee ollut!!! </p>");
    }

    // Construct full HTML for the modal, including restaurant details and the menu HTML :D
    const modalContentHtml = `
    <h2>${name}</h2>
    <p>Address: ${address}, ${postalCode}</p>
    <div class="menu">${menuHtml}</div>
    `


    return modalContentHtml;
}


export { restaurantRow, restaurantModal };