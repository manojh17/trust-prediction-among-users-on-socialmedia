// Authentication functionality

// Handle registration form submission
const registerForm = document.getElementById('register-form');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Simple validation
    if (password.length < 8) {
      showNotification('Password must be at least 8 characters long', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }
    
    // In a real application, you would send this data to a server
    // For demo purposes, we'll just save to localStorage
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password); // Not secure, demo only
    
    showNotification('Account created successfully!', 'success');
    
    // Redirect to login page after a brief delay
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  });
}

// Handle login form submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // In a real application, this would validate against a server
    // For demo purposes, we'll check localStorage
    const savedEmail = localStorage.getItem('userEmail');
    const savedPassword = localStorage.getItem('userPassword');
    
    if (email === savedEmail && password === savedPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      
      showNotification('Login successful!', 'success');
      
      // Redirect to home page
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    } else {
      showNotification('Invalid email or password', 'error');
    }
  });
}

// Handle password visibility toggle
document.addEventListener('DOMContentLoaded', function() {
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const passwordInput = this.previousElementSibling;
      const type = passwordInput.getAttribute('type');
      
      if (type === 'password') {
        passwordInput.setAttribute('type', 'text');
        this.textContent = '🔒';
      } else {
        passwordInput.setAttribute('type', 'password');
        this.textContent = '👁️';
      }
    });
  });
});

// Show notification function
function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add notification to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Apply notification styles
const style = document.createElement('style');
style.textContent = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 24px;
    border-radius: var(--radius-md);
    color: white;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    max-width: 300px;
  }
  
  .notification.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .notification.success {
    background-color: var(--success);
  }
  
  .notification.error {
    background-color: var(--error);
  }
  
  .notification.info {
    background-color: var(--primary);
  }
`;
document.head.appendChild(style);