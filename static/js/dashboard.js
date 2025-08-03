// Dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
  const predictionForm = document.getElementById('prediction-form');
  const resultContainer = document.getElementById('result-container');
  const trustScoreDisplay = document.getElementById('trust-score-display');
  const trustLabel = document.getElementById('trust-label');
  const resultFactors = document.getElementById('result-factors');
  const backToFormButton = document.getElementById('back-to-form');
  
  if (predictionForm) {
    predictionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const formData = new FormData(predictionForm);
      const formValues = Object.fromEntries(formData.entries());
      
      // In a real application, you would send this data to a server for processing
      // For demo purposes, we'll calculate a simple trust score locally
      const trustScore = calculateTrustScore(formValues);
      
      // Display the result
      displayTrustResult(trustScore);
      
      // Hide form, show result
      hideElement(predictionForm);
      showElement(resultContainer);
    });
  }
  
  if (backToFormButton) {
    backToFormButton.addEventListener('click', function() {
      // Hide result, show form
      hideElement(resultContainer);
      showElement(predictionForm);
      
      // Reset form
      predictionForm.reset();
    });
  }
  
  // Calculate trust score based on form values
  function calculateTrustScore(values) {
    // This is a simplified algorithm for demonstration purposes
    // In a real application, this would be a more complex calculation
    
    let score = 0;
    
    // Reputation score (0-100)
    score += parseInt(values.reputationScore) * 0.2;
    
    // Original content ratio (0-1)
    score += parseFloat(values.originalContentRatio) * 15;
    
    // Context score (0-100)
    score += parseInt(values.contextScore) * 0.1;
    
    // Social reputation (0-100)
    score += parseInt(values.socialReputation) * 0.2;
    
    // Has URL bonus
    if (values.hasUrl === 'yes') {
      score += 5;
    }
    
    // Followers count impact (diminishing returns)
    const followers = parseInt(values.followersCount);
    if (followers > 0) {
      score += Math.min(Math.log10(followers) * 5, 15);
    }
    
    // Mentions ratio impact
    score += parseFloat(values.mentionsRatio) * 10;
    
    // Limit score to 0-100 range
    score = Math.min(Math.max(score, 0), 100);
    
    return Math.round(score);
  }
  
  // Display trust result
  function displayTrustResult(score) {
    // Update score display
    trustScoreDisplay.textContent = score;
    
    // Determine trust category and update label
    let category, factors;
    
    if (score >= 70) {
      category = 'trusted';
      trustLabel.textContent = 'Trusted';
      trustLabel.className = 'trust-label trusted';
      factors = [
        'Strong original content ratio',
        'High reputation score',
        'Good social engagement metrics',
        'Healthy follower to following ratio'
      ];
    } else if (score >= 40) {
      category = 'average';
      trustLabel.textContent = 'Average';
      trustLabel.className = 'trust-label average';
      factors = [
        'Moderate original content',
        'Average reputation score',
        'Some social engagement',
        'Room for improvement in engagement metrics'
      ];
    } else {
      category = 'untrusted';
      trustLabel.textContent = 'Untrusted';
      trustLabel.className = 'trust-label untrusted';
      factors = [
        'Low original content ratio',
        'Poor reputation score',
        'Limited social engagement',
        'Suspicious activity patterns'
      ];
    }
    
    // Update factors list
    resultFactors.innerHTML = '';
    factors.forEach(factor => {
      const li = document.createElement('li');
      li.textContent = factor;
      resultFactors.appendChild(li);
    });
    
    // Animate the result card
    resultContainer.classList.add('animate-in');
  }
});