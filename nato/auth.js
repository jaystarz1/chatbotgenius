// Client-side password protection for NATO M&S Workflow
// This is suitable for protecting against casual access

class PasswordProtection {
    constructor() {
        this.correctPasswordHash = '560ad1bcf2d9c2c0f33b8f40c36aa3e54de96067a6911186a0a65279f559c369'; // hash only - no password in code
        this.sessionKey = 'nato_auth_session';
        this.init();
    }

    async init() {
        // Check if already authenticated in this session
        const isAuthenticated = sessionStorage.getItem(this.sessionKey) === 'authenticated';
        
        if (!isAuthenticated) {
            this.showPasswordPrompt();
        } else {
            this.showContent();
        }
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async verifyPassword(password) {
        const hashedPassword = await this.hashPassword(password);
        return hashedPassword === this.correctPasswordHash;
    }

    showPasswordPrompt() {
        document.body.innerHTML = `
            <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
                margin: 0;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                ">
                    <h2 style="margin: 0 0 10px 0; color: #1a237e; font-size: 24px;">NATO M&S Workflow</h2>
                    <p style="margin: 0 0 30px 0; color: #666; font-size: 14px;">This area contains sensitive project information</p>
                    
                    <div id="error-message" style="
                        color: #d32f2f;
                        background: #ffebee;
                        padding: 10px;
                        border-radius: 6px;
                        margin-bottom: 20px;
                        display: none;
                        font-size: 14px;
                    "></div>
                    
                    <form id="password-form">
                        <input 
                            type="password" 
                            id="password-input" 
                            placeholder="Enter access code"
                            style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #ddd;
                                border-radius: 6px;
                                font-size: 16px;
                                margin-bottom: 20px;
                                box-sizing: border-box;
                            "
                            required
                        />
                        <button 
                            type="submit"
                            style="
                                width: 100%;
                                padding: 12px;
                                background: #1a237e;
                                color