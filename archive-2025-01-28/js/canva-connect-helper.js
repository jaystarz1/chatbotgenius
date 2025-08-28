// Canva Connect API Helper for The Chatbot Genius website
class CanvaConnectHelper {
  constructor(backendUrl = 'http://localhost:3000') {
    this.backendUrl = backendUrl;
    this.sessionId = localStorage.getItem('canva_session');
  }

  // Start OAuth flow
  authenticate() {
    window.open(`${this.backendUrl}/auth/canva`, 'canva-auth', 'width=600,height=700');
    
    // Listen for completion
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        const newSessionId = localStorage.getItem('canva_session');
        if (newSessionId && newSessionId !== this.sessionId) {
          this.sessionId = newSessionId;
          clearInterval(checkInterval);
          resolve(newSessionId);
        }
      }, 1000);
    });
  }

  // Export a design and download it
  async exportAndDownloadDesign(designId, format = 'png') {
    if (!this.sessionId) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/export-design`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          designId,
          format
        })
      });

      const data = await response.json();
      
      if (data.success && data.urls && data.urls.length > 0) {
        // Download the first URL (for single-page designs)
        const downloadUrl = data.urls[0];
        
        // Create a temporary link to download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `canva-export-${designId}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        return downloadUrl;
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }

  // Get list of designs
  async getDesigns() {
    if (!this.sessionId) {
      throw new Error('Not authenticated. Please authenticate first.');
    }

    const response = await fetch(`${this.backendUrl}/api/designs?sessionId=${this.sessionId}`);
    return response.json();
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.sessionId;
  }
}

// Usage example:
// const canva = new CanvaConnectHelper();
// 
// // Check if authenticated
// if (!canva.isAuthenticated()) {
//   await canva.authenticate();
// }
// 
// // Get designs
// const designs = await canva.getDesigns();
// console.log('Your designs:', designs);
// 
// // Export a design
// const downloadUrl = await canva.exportAndDownloadDesign('DAGxxxxxx', 'png');
// console.log('Downloaded from:', downloadUrl);
