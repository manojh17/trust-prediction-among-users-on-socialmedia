// Dark Mode Toggle Functionality

// Get the theme toggle checkbox
const themeToggle = document.getElementById('theme-toggle');

// Function to set the theme based on user preference or system preference
function setTheme() {
  // Check if user has a saved preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
    themeToggle.checked = false;
  } else {
    // If no saved preference, check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDark) {
      document.body.classList.add('dark-theme');
      themeToggle.checked = true;
    }
  }
  
  // Add CSS variables for RGB values needed for transparency
  const rootStyles = getComputedStyle(document.documentElement);
  
  // Extract RGB values from primary color for use in rgba()
  const primaryColor = rootStyles.getPropertyValue('--primary').trim();
  const successColor = rootStyles.getPropertyValue('--success').trim();
  const warningColor = rootStyles.getPropertyValue('--warning').trim();
  const errorColor = rootStyles.getPropertyValue('--error').trim();
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the RGB components
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }
  
  // Set the RGB variables
  document.documentElement.style.setProperty('--primary-rgb', hexToRgb(primaryColor));
  document.documentElement.style.setProperty('--success-rgb', hexToRgb(successColor));
  document.documentElement.style.setProperty('--warning-rgb', hexToRgb(warningColor));
  document.documentElement.style.setProperty('--error-rgb', hexToRgb(errorColor));
}

// Listen for toggle changes
themeToggle.addEventListener('change', function() {
  if (this.checked) {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
  
  // Update RGB variables when theme changes
  setTheme();
});

// Initialize theme when DOM is loaded
document.addEventListener('DOMContentLoaded', setTheme);