const initializeUsers = () => {
    const users = [
        {
            username: "jape",
            password: "amFwZQ==",  // Base64 for "ThisIsNotASecureHash"
            name: "Jasper Kaira",
            pic: '',
            favorites: ["restaurant1", "restaurant2"]
        }
    ];

    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}



// AFTER REGISTRATION ADDING USER INTO LOCAL STORAGE
const addUser = (newUser) => {
    // Retrieve users from 'localStorage'
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user already exists
    const userExists = users.some(user => user.username === newUser.username);
    if (userExists) {
        alert('User already exists!');
        return;
    }

    // Add new user to the array
    users.push(newUser);

    // Save updated users back to 'localStorage'
    localStorage.setItem('users', JSON.stringify(users));
    alert('User added successfully!');
}



// FUNCTION TO ENCRYPT THE PASSWORD
const encodePassword = (password) => {
    console.log('got here (encodePassword())');
    console.log('encodePassword: ', btoa(password));
    return btoa(password);  // btoa() is a built-in JavaScript function that encodes a string in base64
};



// LOGIN & REGISTER USER SECTION / LOGIN.HTML & REGISTRATION.HTML
const register = () => {
    const name = document.getElementById('registerName').value;
    const favorites = [];
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const encodedPassword = encodePassword(password);

    const newUser = {
        username: username,
        password: encodedPassword,  // Base64 for "AnotherInsecureHash"
        name: name,
        favorites: favorites,
        pic: ''
    };

    addUser(newUser);
    alert('Registration successful! You can now login.');
    window.location.href = 'login.html';
}
 
const login = () => {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const encodedPassword = btoa(password);  // Encode the password in base64

    // Retrieve users from 'localStorage'
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if user exists and password matches
    const user = users.find(user => user.username === username && user.password === encodedPassword);
    
    
    if (user) {
        saveUser(user);
        localStorage.setItem('currentUsername', username);
        document.cookie = "loggedIn=true; path=/; max-age=7200"; // Cookie expires in 2 hour
        // You can redirect the user to another page or change the interface
        window.location.href = 'index.html'; // Redirect to home page or dashboard
    } else {
        alert('Invalid username or password!');
    }
}

function logout() {
    document.cookie = "loggedIn=; path=/; max-age=-1"; // Clears the loggedIn cookie
    window.location.href = 'index.html'; // Redirects to the homepage
}

function checkLoginStatus() {
    // Parse the document.cookie string
    const cookies = document.cookie.split(';');
    const loggedInCookie = cookies.find(cookie => cookie.trim().startsWith('loggedIn='));
    return loggedInCookie && loggedInCookie.split('=')[1] === 'true';
}

// SERVE THE CORRECT NAVBAR BASED IF THE USAER IS LOGGED IN
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = checkLoginStatus();
    const navRight = document.querySelector('.nav-right');
    const profileName = document.getElementById('profileName');
    const profileUsername = document.getElementById('profileUsername');

    const currentUsername = localStorage.getItem('currentUsername');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(user => user.username === currentUsername);
    
    if (isLoggedIn) {
        navRight.innerHTML = `
            <a href="../views/profile.html" class="profile-link">
                <img id="displayPhoto" alt="profilepic">
                <span class="tooltip">Edit Profile Here</span>
            </a>
            <a href="#" onclick="logout()">Logout</a>
        `;
    } else {
        navRight.innerHTML = `
            <a href="../views/login.html">Login</a>
            <a href="../views/registration.html">Register</a>
        `;
    }

    if (currentUser && currentUser.pic) {
        document.getElementById('displayPhoto').src = currentUser.pic;
        document.getElementById('profileDisplayPhoto').src = currentUser.pic;
        profileName.innerHTML = currentUser.name;
        profileUsername.innerHTML = currentUser.username;
    }
   
});

// FAVORITE RESTRAURANT SECTION 

// Get the current logged-in user
const getCurrentUser = () => {
    const currentUsername = localStorage.getItem('currentUsername');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.username === currentUsername);
}

// Save the updated user back to localStorage
const saveUser = (user) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
        users[userIndex] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Toggle restaurant in favorites
const toggleFavorite = (restaurantId) => {
    const user = getCurrentUser();
    if (!user) return;

    if (user.favorites.includes(restaurantId)) {
        user.favorites = user.favorites.filter(id => id !== restaurantId);
        // console.log('Favorite restaurants (id): ', user.favorites);
    } else {
        user.favorites.push(restaurantId);
    }
    saveUser(user);
}

// Check if a restaurant is a favorite
const isFavorite = (restaurantId) => {
    const user = getCurrentUser();
    // console.log(user);
    console.log('Isfavorite: ', user.favorites.includes(restaurantId));
    return user && user.favorites.includes(restaurantId);
}

// Update the favorite button state
const updateFavoriteButton = (button, isFavorite) => {
    
    if (isFavorite) {
        button.classList.add('favorite');
    } else {
        button.classList.remove('favorite');
    }
}


// UPDATE PROFILE SECTION / PROFILE.HTML
async function updateProfilePic() {
    const profilePhoto = document.getElementById('profilePhoto').files[0];
    const currentUsername = localStorage.getItem('currentUsername');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === currentUsername);
                             
    if (userIndex !== -1 && profilePhoto) {
        await resizeAndSaveImage(profilePhoto, currentUsername);
        alert('Profile pictured updated succesfully. Reload the page to see the results.')
    } else {
        alert('No image selected or user not found!');
    }
}

async function resizeAndSaveImage(file, username) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.onload = function() {
            // Resize the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 100; // New width
            canvas.height = 100; // New height
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convert resized image back to base64
            const newDataUrl = canvas.toDataURL('image/png');

            // Save new data URL
             try {
                const users = JSON.parse(localStorage.getItem('users')) || [];
                const userIndex = users.findIndex(user => user.username === username);
                users[userIndex].pic = newDataUrl;
                localStorage.setItem('users', JSON.stringify(users));
            } catch (e) {
                if (e.name === 'QuotaExceededError') {
                    alert('Storage limit exceeded. Try reducing the file size or use a different storage method.');
                }
                console.error('Error saving to localStorage:', e);
            }
        };
    };
    reader.readAsDataURL(file);
}


function updatePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const currentUsername = localStorage.getItem('currentUsername');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === currentUsername);
    
    console.info('Users before changing info: ', users);

    if (userIndex !== -1 && newPassword) {
        users[userIndex].password = encodePassword(newPassword); // Encoding new password in base64
        localStorage.setItem('users', JSON.stringify(users));
        console.info('Users after changing info: ', users);
        alert('Password updated successfully!');

    } else {
        alert('No new password provided or user not found!');
    }
}

function updateName() {
    const newName = document.getElementById('name').value;
    const currentUsername = localStorage.getItem('currentUsername');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.username === currentUsername);

    if (userIndex !== -1 && newPassword) {
        users[userIndex].name = newName;
        localStorage.setItem('users', JSON.stringify(users));
        console.info('Users after changing name: ', users);
        alert('Name updated successfully! Reload the page to see the results.');

    } else {
        alert('No new name provided or user not found!');
    }
}


function saveUpdates(users) {
    localStorage.setItem('users', JSON.stringify(users));
    alert('Profile updated successfully! Reload the page to see the results.');
}

