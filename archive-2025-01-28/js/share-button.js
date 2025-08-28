// Universal Share Button Component for The Chatbot Genius
// This script can be included on any page to add share functionality

(function() {
    // Create and inject the share button HTML
    function createShareButton() {
        // Check if share button already exists
        if (document.getElementById('universal-share-btn')) return;
        
        // Create the share button
        const shareButtonHTML = `
            <button id="universal-share-btn" class="btn btn-share" style="
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #1a1f71 0%, #4c5fd5 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 24px;
                font-size: 16px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9998;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s ease;
            " aria-label="Share this page">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
            </button>
        `;
        
        // Create the share menu with expanded options
        const shareMenuHTML = `
            <div id="share-menu-overlay" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
                display: none;
                backdrop-filter: blur(5px);
            "></div>
            
            <div id="share-menu" style="
                position: fixed;
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                display: none;
                min-width: 320px;
                max-width: 400px;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                max-height: 80vh;
                overflow-y: auto;
            ">
                <h3 style="margin: 0 0 20px 0; color: #1a1f71; font-size: 20px; font-weight: 600;">
                    Share This Page
                </h3>
                
                <div class="share-grid" style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 20px;
                ">
                    <!-- Primary Social Platforms -->
                    <div onclick="shareToLinkedIn()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#0077b5'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                    </div>
                    
                    <div onclick="shareToTwitter()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#000'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                        X (Twitter)
                    </div>
                    
                    <div onclick="shareToFacebook()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#1877f2'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                    </div>
                    
                    <div onclick="shareToReddit()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#ff4500'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                        </svg>
                        Reddit
                    </div>
                    
                    <div onclick="shareToWhatsApp()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#25d366'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.123-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        WhatsApp
                    </div>
                    
                    <div onclick="shareToTelegram()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#0088cc'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                        Telegram
                    </div>
                    
                    <div onclick="shareToPinterest()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#bd081c'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0a12 12 0 0 0-12 12c0 5.123 3.211 9.497 7.73 11.218-.11-.937-.227-2.482.025-3.566.217-.932 1.401-5.938 1.401-5.938s-.357-.715-.357-1.774c0-1.66.962-2.9 2.161-2.9 1.02 0 1.512.765 1.512 1.682 0 1.025-.653 2.557-.99 3.978-.281 1.189.597 2.159 1.769 2.159 2.123 0 3.756-2.239 3.756-5.471 0-2.861-2.056-4.86-4.991-4.86-3.398 0-5.393 2.549-5.393 5.184 0 1.027.395 2.127.889 2.726a.36.36 0 0 1 .083.343c-.091.378-.293 1.189-.332 1.355-.053.218-.173.265-.4.159-1.492-.694-2.424-2.875-2.424-4.627 0-3.769 2.737-7.229 7.892-7.229 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.373 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                        </svg>
                        Pinterest
                    </div>
                    
                    <div onclick="shareToSlack()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#4a154b'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                        </svg>
                        Slack
                    </div>
                </div>
                
                <!-- Utility Options -->
                <div style="border-top: 1px solid #e9ecef; padding-top: 15px;">
                    <div onclick="shareToEmail()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                        margin-bottom: 10px;
                    " onmouseover="this.style.background='#4c5fd5'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        Email
                    </div>
                    
                    <div onclick="shareCopyLink()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                        margin-bottom: 10px;
                    " onmouseover="this.style.background='#4c5fd5'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        Copy Link
                    </div>
                    
                    <div onclick="shareQRCode()" class="share-option" style="
                        padding: 12px;
                        cursor: pointer;
                        border-radius: 8px;
                        background: #f8f9fa;
                        transition: all 0.2s;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        color: #333;
                        font-size: 14px;
                    " onmouseover="this.style.background='#4c5fd5'; this.style.color='white'" onmouseout="this.style.background='#f8f9fa'; this.style.color='#333'">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 17h2v2h-2zM19 19h2v2h-2zM15 19h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
                        </svg>
                        QR Code
                    </div>
                </div>
                
                <button onclick="closeShareMenu()" style="
                    width: 100%;
                    padding: 12px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #666;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#e9ecef'" onmouseout="this.style.background='#f8f9fa'">
                    Cancel
                </button>
            </div>
            
            <!-- QR Code Modal -->
            <div id="qr-modal" style="
                position: fixed;
                background: white;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                z-index: 10001;
                display: none;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            ">
                <h3 style="margin: 0 0 20px 0; color: #1a1f71;">Scan to Share</h3>
                <div id="qr-code-container"></div>
                <button onclick="closeQRModal()" style="
                    margin-top: 20px;
                    padding: 10px 20px;
                    background: #4c5fd5;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                ">
                    Close
                </button>
            </div>
        `;
        
        // Inject HTML into the page
        const container = document.createElement('div');
        container.innerHTML = shareButtonHTML + shareMenuHTML;
        document.body.appendChild(container);
        
        // Add event listeners
        initializeShareButton();
    }
    
    // Initialize share button functionality
    function initializeShareButton() {
        const shareBtn = document.getElementById('universal-share-btn');
        const shareMenu = document.getElementById('share-menu');
        const overlay = document.getElementById('share-menu-overlay');
        
        if (!shareBtn || !shareMenu) return;
        
        // Share button click
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareMenu.style.display = 'block';
            overlay.style.display = 'block';
            
            // Add animation
            requestAnimationFrame(() => {
                shareMenu.style.opacity = '0';
                shareMenu.style.transform = 'translate(-50%, -50%) scale(0.9)';
                requestAnimationFrame(() => {
                    shareMenu.style.transition = 'all 0.3s ease';
                    shareMenu.style.opacity = '1';
                    shareMenu.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            });
        });
        
        // Overlay click to close
        overlay.addEventListener('click', closeShareMenu);
    }
    
    // Share functions
    window.shareToLinkedIn = function() {
        const url = window.location.href;
        const title = document.title;
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        closeShareMenu();
    };
    
    window.shareToTwitter = function() {
        const text = document.title + ' - Check out this great content from The Chatbot Genius!';
        const url = window.location.href;
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        closeShareMenu();
    };
    
    window.shareToFacebook = function() {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        closeShareMenu();
    };
    
    window.shareToReddit = function() {
        const url = window.location.href;
        const title = document.title;
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        closeShareMenu();
    };
    
    window.shareToWhatsApp = function() {
        const text = document.title + ' ' + window.location.href;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const whatsappUrl = isMobile 
            ? `whatsapp://send?text=${encodeURIComponent(text)}`
            : `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
        closeShareMenu();
    };
    
    window.shareToTelegram = function() {
        const url = window.location.href;
        const text = document.title;
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        closeShareMenu();
    };
    
    window.shareToPinterest = function() {
        const url = window.location.href;
        const description = document.querySelector('meta[name="description"]')?.content || document.title;
        const media = document.querySelector('meta[property="og:image"]')?.content || '';
        window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}&media=${encodeURIComponent(media)}`, '_blank');
        closeShareMenu();
    };
    
    window.shareToSlack = function() {
        const url = window.location.href;
        // Note: This opens Slack's add to Slack page. For direct sharing, you'd need Slack workspace integration
        alert('To share on Slack, copy this link and paste it in your Slack channel:\n\n' + url);
        navigator.clipboard.writeText(url);
        closeShareMenu();
    };
    
    window.shareToEmail = function() {
        const subject = 'Check out: ' + document.title;
        const url = window.location.href;
        const body = `I thought you might find this interesting:\n\n${document.title}\n\n${url}\n\nShared from The Chatbot Genius - Expert AI Solutions`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        closeShareMenu();
    };
    
    window.shareCopyLink = function() {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            // Show success message
            const button = event.target.closest('.share-option');
            const originalHTML = button.innerHTML;
            button.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Copied!
            `;
            button.style.background = '#28a745';
            button.style.color = 'white';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.background = '#f8f9fa';
                button.style.color = '#333';
                closeShareMenu();
            }, 1500);
        }).catch(() => {
            alert('Failed to copy link. Please try again.');
        });
    };
    
    window.shareQRCode = function() {
        const url = window.location.href;
        const qrModal = document.getElementById('qr-modal');
        const qrContainer = document.getElementById('qr-code-container');
        
        // Generate QR code using a free API
        qrContainer.innerHTML = `
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" 
                 alt="QR Code for sharing"
                 style="border: 2px solid #e9ecef; border-radius: 8px; padding: 10px; background: white;">
            <p style="margin-top: 10px; color: #666; font-size: 14px;">${url}</p>
        `;
        
        qrModal.style.display = 'block';
        closeShareMenu();
    };
    
    window.closeQRModal = function() {
        document.getElementById('qr-modal').style.display = 'none';
    };
    
    window.closeShareMenu = function() {
        const shareMenu = document.getElementById('share-menu');
        const overlay = document.getElementById('share-menu-overlay');
        
        if (shareMenu) {
            shareMenu.style.transition = 'all 0.2s ease';
            shareMenu.style.opacity = '0';
            shareMenu.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            setTimeout(() => {
                shareMenu.style.display = 'none';
                overlay.style.display = 'none';
            }, 200);
        }
    };
    
    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeShareMenu();
            closeQRModal();
        }
    });
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createShareButton);
    } else {
        createShareButton();
    }
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        #universal-share-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.3) !important;
        }
        
        .share-option {
            user-select: none;
        }
        
        @media (max-width: 768px) {
            #share-menu {
                width: 90% !important;
                max-width: none !important;
            }
            
            .share-grid {
                grid-template-columns: 1fr !important;
            }
            
            #universal-share-btn {
                bottom: 20px !important;
                right: 20px !important;
                padding: 10px 20px !important;
                font-size: 14px !important;
            }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        #universal-share-btn.pulse {
            animation: pulse 2s infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Add pulse animation on page load to draw attention
    setTimeout(() => {
        const btn = document.getElementById('universal-share-btn');
        if (btn) {
            btn.classList.add('pulse');
            setTimeout(() => btn.classList.remove('pulse'), 6000);
        }
    }, 2000);
    
})();