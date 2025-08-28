/**
 * Conversion Tools Library
 * Advanced conversion optimization features for premium demos
 */

class ConversionTools {
    constructor() {
        this.init();
        this.analytics = {
            pageViews: 0,
            interactions: [],
            timeOnPage: 0,
            scrollDepth: 0
        };
    }

    init() {
        // Initialize all conversion features
        this.initExitIntent();
        this.initUrgencyTimers();
        this.initSocialProof();
        this.initLiveChat();
        this.initABTesting();
        this.initFormValidation();
        this.initProgressTracking();
        this.initTestimonialCarousel();
        this.initPricingCalculator();
        this.initLeadCapture();
        this.trackAnalytics();
    }

    // Exit Intent Popup
    initExitIntent() {
        let exitIntentShown = false;
        
        document.addEventListener('mouseout', (e) => {
            if (!exitIntentShown && e.clientY <= 0 && e.relatedTarget == null) {
                exitIntentShown = true;
                this.showExitPopup();
            }
        });
    }

    getExitPopupContent() {
        // Detect which demo page we're on
        const path = window.location.pathname.toLowerCase();
        const title = document.title.toLowerCase();
        
        // Wedding Demo
        if (path.includes('wedding') || title.includes('wedding')) {
            return {
                icon: '💍',
                headline: 'Planning Your Dream Wedding?',
                offer: 'Save 25% on Our Exclusive Wedding Package!',
                features: [
                    'Custom wedding website design',
                    'Guest RSVP management system',
                    'Professional photo galleries',
                    'Lifetime hosting included'
                ],
                buttonText: 'Get Your Wedding Discount',
                disclaimer: 'Limited offer for engaged couples - Valid for 48 hours'
            };
        }
        
        // Birthday Demo
        if (path.includes('birthday') || title.includes('birthday')) {
            return {
                icon: '🎂',
                headline: 'Make Your Birthday Unforgettable!',
                offer: 'Get 20% OFF Birthday Event Packages',
                features: [
                    'Interactive birthday countdown',
                    'Custom party themes',
                    'Guest photo sharing',
                    'Virtual celebration options'
                ],
                buttonText: 'Claim Birthday Special',
                disclaimer: 'Birthday month special - Book within 24 hours'
            };
        }
        
        // Anniversary Demo
        if (path.includes('anniversary') || title.includes('anniversary')) {
            return {
                icon: '❤️',
                headline: 'Celebrate Your Love Story in Style!',
                offer: 'Anniversary Special - Save $500',
                features: [
                    'Romantic anniversary website',
                    'Timeline of your journey',
                    'Guest memory book',
                    'Premium anniversary themes'
                ],
                buttonText: 'Get Anniversary Package',
                disclaimer: 'Exclusive offer for milestone anniversaries'
            };
        }
        
        // Corporate Event Demo
        if (path.includes('corporate') || title.includes('corporate')) {
            return {
                icon: '🏢',
                headline: 'Elevate Your Corporate Event',
                offer: 'Executive Package - 30% Discount',
                features: [
                    'Professional event platform',
                    'Registration & ticketing system',
                    'Sponsor showcase sections',
                    'Analytics & reporting dashboard'
                ],
                buttonText: 'Get Executive Access',
                disclaimer: 'Enterprise discount - Decision makers only'
            };
        }
        
        // Fundraiser Demo
        if (path.includes('fundraiser') || title.includes('fundrais')) {
            return {
                icon: '🎗️',
                headline: 'Ready to Make a Difference?',
                offer: 'Free Fundraising Success Toolkit',
                features: [
                    'Donation tracking system',
                    'Progress thermometer',
                    'Donor recognition wall',
                    'Social media integration'
                ],
                buttonText: 'Get Free Toolkit',
                disclaimer: 'Non-profits get 50% off all packages'
            };
        }
        
        // Garage Sale Demo
        if (path.includes('garage') || path.includes('sale') || title.includes('garage')) {
            return {
                icon: '🏷️',
                headline: 'Maximize Your Garage Sale Profits!',
                offer: 'Seller Success Guide + 15% OFF',
                features: [
                    'Interactive item catalog',
                    'Price suggestion tool',
                    'Buyer notification system',
                    'Sales tracking dashboard'
                ],
                buttonText: 'Get Seller Advantage',
                disclaimer: 'Weekend special - Start selling smarter today'
            };
        }
        
        // Default fallback
        return {
            icon: '🌟',
            headline: 'Don\'t Miss This Exclusive Offer!',
            offer: 'Save 20% on Premium Event Packages',
            features: [
                'Professional event website',
                'Mobile responsive design',
                'Unlimited customization',
                '24/7 premium support'
            ],
            buttonText: 'Claim Your Discount',
            disclaimer: 'Limited time offer - Valid for 24 hours'
        };
    }
    
    showExitPopup() {
        // Get customized content based on the current page
        const exitContent = this.getExitPopupContent();
        
        const popup = document.createElement('div');
        popup.className = 'exit-popup';
        popup.innerHTML = `
            <div class="exit-popup-overlay"></div>
            <div class="exit-popup-content">
                <button class="exit-popup-close">×</button>
                <div class="exit-icon">${exitContent.icon}</div>
                <h2>${exitContent.headline}</h2>
                <p class="exit-offer">${exitContent.offer}</p>
                <div class="exit-features">
                    ${exitContent.features.map(feature => 
                        `<div class="feature-item">✓ ${feature}</div>`
                    ).join('')}
                </div>
                <form class="exit-form" id="exitForm">
                    <input type="email" placeholder="Enter your email for exclusive offer" required>
                    <button type="submit" class="btn-luxury">${exitContent.buttonText}</button>
                </form>
                <p class="exit-disclaimer">${exitContent.disclaimer}</p>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Add styles
        this.addExitPopupStyles();
        
        // Animation
        setTimeout(() => popup.classList.add('show'), 10);
        
        // Close handlers
        popup.querySelector('.exit-popup-close').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });
        
        popup.querySelector('.exit-popup-overlay').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });
        
        // Form handler
        popup.querySelector('#exitForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLeadCapture(e.target.querySelector('input').value);
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
            if (window.premiumLoader) {
                window.premiumLoader.showNotification('Discount code sent to your email!', 'success');
            }
        });
    }

    addExitPopupStyles() {
        if (!document.querySelector('#exit-popup-styles')) {
            const style = document.createElement('style');
            style.id = 'exit-popup-styles';
            style.textContent = `
                .exit-popup {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.4s ease, visibility 0.4s ease;
                }

                .exit-popup.show {
                    opacity: 1;
                    visibility: visible;
                }

                .exit-popup-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95));
                    backdrop-filter: blur(10px);
                }

                .exit-popup-content {
                    position: relative;
                    background: linear-gradient(135deg, #ffffff, #fafafa);
                    border-radius: 30px;
                    padding: 3.5rem 3rem;
                    max-width: 550px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 
                        0 30px 80px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.1) inset,
                        0 10px 40px rgba(102, 126, 234, 0.1);
                    transform: scale(0.85) translateY(20px);
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.320, 1);
                }

                .exit-popup.show .exit-popup-content {
                    transform: scale(1) translateY(0);
                }

                .exit-popup-close {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    background: rgba(0, 0, 0, 0.05);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #999;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .exit-popup-close:hover {
                    background: rgba(0, 0, 0, 0.1);
                    color: #333;
                    transform: rotate(90deg);
                }

                .exit-icon {
                    font-size: 4rem;
                    margin-bottom: 1.5rem;
                    animation: iconPulse 2s infinite;
                }

                @keyframes iconPulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }

                .exit-popup-content h2 {
                    font-size: 2rem;
                    color: #333;
                    margin: 0 0 1rem 0;
                    font-weight: 700;
                    line-height: 1.2;
                }

                .exit-offer {
                    font-size: 1.75rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: bold;
                    margin: 1.5rem 0;
                    animation: offerShine 3s infinite;
                }

                @keyframes offerShine {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.2); }
                }

                .exit-features {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 1rem;
                    margin: 2rem 0;
                    padding: 1.5rem;
                    background: rgba(102, 126, 234, 0.05);
                    border-radius: 15px;
                }

                .feature-item {
                    color: #555;
                    font-size: 0.9rem;
                    padding: 0.5rem 1rem;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                    white-space: nowrap;
                }

                .exit-form {
                    display: flex;
                    gap: 1rem;
                    margin-top: 2rem;
                    flex-direction: column;
                }

                @media (min-width: 480px) {
                    .exit-form {
                        flex-direction: row;
                    }
                }

                .exit-form input {
                    flex: 1;
                    padding: 1.2rem 1.5rem;
                    border: 2px solid transparent;
                    background: rgba(102, 126, 234, 0.05);
                    border-radius: 50px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .exit-form input:focus {
                    outline: none;
                    border-color: #667eea;
                    background: white;
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.2);
                }

                .exit-form .btn-luxury {
                    padding: 1.2rem 2rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
                    white-space: nowrap;
                }

                .exit-form .btn-luxury:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
                }

                .exit-disclaimer {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 1px solid rgba(0, 0, 0, 0.05);
                    color: #888;
                    font-size: 0.85rem;
                    font-style: italic;
                }

                @media (max-width: 480px) {
                    .exit-popup-content {
                        padding: 2.5rem 1.5rem;
                    }
                    
                    .exit-icon {
                        font-size: 3rem;
                    }
                    
                    .exit-popup-content h2 {
                        font-size: 1.5rem;
                    }
                    
                    .exit-offer {
                        font-size: 1.4rem;
                    }
                    
                    .exit-features {
                        gap: 0.5rem;
                    }
                    
                    .feature-item {
                        font-size: 0.85rem;
                        padding: 0.4rem 0.8rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Urgency and Scarcity Timers
    initUrgencyTimers() {
        const urgencyElements = document.querySelectorAll('[data-urgency]');
        
        urgencyElements.forEach(el => {
            const type = el.dataset.urgency;
            
            if (type === 'countdown') {
                this.createUrgencyCountdown(el);
            } else if (type === 'stock') {
                this.createStockCounter(el);
            } else if (type === 'viewers') {
                this.createViewerCounter(el);
            }
        });
    }

    createUrgencyCountdown(element) {
        let hours = 2;
        let minutes = 0;
        let seconds = 0;
        
        const timer = setInterval(() => {
            if (seconds > 0) {
                seconds--;
            } else if (minutes > 0) {
                minutes--;
                seconds = 59;
            } else if (hours > 0) {
                hours--;
                minutes = 59;
                seconds = 59;
            } else {
                clearInterval(timer);
                element.innerHTML = '<span style="color: #f5576c;">Offer Expired!</span>';
                return;
            }
            
            element.innerHTML = `
                <span class="urgency-label">Offer ends in:</span>
                <span class="urgency-time">${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}</span>
            `;
        }, 1000);
    }

    createStockCounter(element) {
        let stock = 5 + Math.floor(Math.random() * 10);
        element.innerHTML = `<span style="color: #f5576c;">Only ${stock} left in stock!</span>`;
        
        // Randomly decrease stock
        setInterval(() => {
            if (stock > 2 && Math.random() > 0.7) {
                stock--;
                element.innerHTML = `<span style="color: #f5576c;">Only ${stock} left in stock!</span>`;
            }
        }, 30000);
    }

    createViewerCounter(element) {
        let viewers = 12 + Math.floor(Math.random() * 20);
        element.innerHTML = `<span style="color: #667eea;">${viewers} people viewing this right now</span>`;
        
        // Fluctuate viewer count
        setInterval(() => {
            viewers = Math.max(8, viewers + Math.floor(Math.random() * 7) - 3);
            element.innerHTML = `<span style="color: #667eea;">${viewers} people viewing this right now</span>`;
        }, 5000);
    }

    // Social Proof Notifications
    initSocialProof() {
        const notifications = this.getSocialProofNotifications();
        
        let index = 0;
        
        // Show first notification after 5 seconds
        setTimeout(() => {
            setInterval(() => {
                this.showSocialProof(notifications[index]);
                index = (index + 1) % notifications.length;
            }, 15000);
        }, 5000);
    }
    
    getSocialProofNotifications() {
        const path = window.location.pathname.toLowerCase();
        const title = document.title.toLowerCase();
        
        // Wedding specific notifications
        if (path.includes('wedding') || title.includes('wedding')) {
            return [
                { name: 'Emma & James', location: 'New York', action: 'just booked', product: 'Dream Wedding Package' },
                { name: 'Sarah M.', location: 'Los Angeles', action: 'saved $2,000 with', product: 'Wedding Bundle' },
                { name: 'The Johnsons', location: 'Chicago', action: 'are celebrating with', product: 'Premium Wedding Site' },
                { name: 'Rachel K.', location: 'Miami', action: 'just reserved', product: 'Platinum Wedding Package' },
                { name: 'David & Maria', location: 'Boston', action: 'just upgraded to', product: 'All-Inclusive Package' }
            ];
        }
        
        // Birthday specific notifications
        if (path.includes('birthday') || title.includes('birthday')) {
            return [
                { name: 'Mike T.', location: 'San Francisco', action: 'is throwing a party with', product: 'Birthday Bash Package' },
                { name: 'Sophie', location: 'Seattle', action: 'just booked her 30th with', product: 'Milestone Package' },
                { name: 'The Chen Family', location: 'Portland', action: 'celebrating with', product: 'Kids Party Special' },
                { name: 'Jessica R.', location: 'Denver', action: 'saved 25% on', product: 'Birthday Premium' },
                { name: 'Carlos M.', location: 'Austin', action: 'just ordered', product: 'Surprise Party Package' }
            ];
        }
        
        // Anniversary specific notifications
        if (path.includes('anniversary') || title.includes('anniversary')) {
            return [
                { name: 'The Smiths', location: 'Nashville', action: 'celebrating 25 years with', product: 'Silver Anniversary Package' },
                { name: 'Robert & Linda', location: 'Phoenix', action: 'just renewed vows with', product: 'Golden Package' },
                { name: 'Mark & Sarah', location: 'Dallas', action: 'booked their 10th with', product: 'Decade of Love Special' },
                { name: 'The Wilsons', location: 'Orlando', action: 'are celebrating with', product: 'Romantic Anniversary Site' },
                { name: 'Tom & Betty', location: 'Las Vegas', action: 'just purchased', product: 'Ruby Anniversary Package' }
            ];
        }
        
        // Corporate specific notifications
        if (path.includes('corporate') || title.includes('corporate')) {
            return [
                { name: 'TechCorp Inc.', location: 'Silicon Valley', action: 'streamlined their event with', product: 'Enterprise Package' },
                { name: 'Global Finance', location: 'Wall Street', action: 'just deployed', product: 'Executive Platform' },
                { name: 'Innovation Labs', location: 'Boston', action: 'saved 40% with', product: 'Corporate Bundle' },
                { name: 'MegaCorp', location: 'Chicago', action: 'hosting 500+ attendees with', product: 'Conference Pro' },
                { name: 'StartupHub', location: 'Austin', action: 'just launched with', product: 'Business Event Solution' }
            ];
        }
        
        // Fundraiser specific notifications
        if (path.includes('fundraiser') || title.includes('fundrais')) {
            return [
                { name: 'Hope Foundation', location: 'Washington', action: 'raised $50K with', product: 'Charity Platform' },
                { name: 'Green Earth Org', location: 'Portland', action: 'exceeded goals using', product: 'Fundraiser Pro' },
                { name: 'Community Cares', location: 'Atlanta', action: 'just launched', product: 'Donation Drive Package' },
                { name: 'Kids First', location: 'Philadelphia', action: 'doubled donations with', product: 'Non-Profit Special' },
                { name: 'Health Heroes', location: 'San Diego', action: 'raising awareness with', product: 'Cause Campaign Kit' }
            ];
        }
        
        // Garage sale specific notifications
        if (path.includes('garage') || path.includes('sale') || title.includes('garage')) {
            return [
                { name: 'The Johnsons', location: 'Suburban Heights', action: 'sold out using', product: 'Neighborhood Sale Kit' },
                { name: 'Mary K.', location: 'Oak Park', action: 'earned $3,000 with', product: 'Mega Sale Package' },
                { name: 'Community Center', location: 'Downtown', action: 'organizing with', product: 'Multi-Family Sale Tool' },
                { name: 'Bob & Sue', location: 'Riverside', action: 'clearing house with', product: 'Estate Sale Special' },
                { name: 'Spring Cleaners', location: 'Maple Grove', action: 'just started', product: 'Weekend Sale Planner' }
            ];
        }
        
        // Default fallback
        return [
            { name: 'Sarah M.', location: 'New York', action: 'just purchased', product: 'Premium Package' },
            { name: 'John D.', location: 'Los Angeles', action: 'just signed up for', product: 'Consultation' },
            { name: 'Emma W.', location: 'Chicago', action: 'just booked', product: 'Event Package' },
            { name: 'Michael R.', location: 'Houston', action: 'just registered for', product: 'Event Planning' },
            { name: 'Lisa T.', location: 'Phoenix', action: 'just purchased', product: 'Complete Package' }
        ];
    }

    showSocialProof(data) {
        const notification = document.createElement('div');
        notification.className = 'social-proof';
        notification.innerHTML = `
            <div class="social-proof-avatar">${data.name.charAt(0)}</div>
            <div class="social-proof-content">
                <strong>${data.name}</strong> from ${data.location}<br>
                ${data.action} <strong>${data.product}</strong>
                <div class="social-proof-time">${Math.floor(Math.random() * 10) + 2} minutes ago</div>
            </div>
        `;
        
        // Add styles
        if (!document.querySelector('#social-proof-styles')) {
            const style = document.createElement('style');
            style.id = 'social-proof-styles';
            style.textContent = `
                .social-proof {
                    position: fixed;
                    bottom: 2rem;
                    left: 2rem;
                    background: white;
                    border-radius: 10px;
                    padding: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    transform: translateX(-400px);
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.320, 1);
                    z-index: 1000;
                    max-width: 320px;
                }

                .social-proof.show {
                    transform: translateX(0);
                }

                .social-proof-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                .social-proof-content {
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .social-proof-time {
                    font-size: 0.8rem;
                    color: #999;
                    margin-top: 0.25rem;
                }

                @media (max-width: 768px) {
                    .social-proof {
                        left: 1rem;
                        right: 1rem;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Live Chat Widget
    initLiveChat() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'chat-widget';
        chatWidget.innerHTML = `
            <button class="chat-toggle">
                <span class="chat-icon">💬</span>
                <span class="chat-badge">1</span>
            </button>
            <div class="chat-window">
                <div class="chat-header">
                    <div class="chat-status">
                        <span class="status-dot"></span>
                        <span>We're online</span>
                    </div>
                    <button class="chat-close">×</button>
                </div>
                <div class="chat-messages">
                    <div class="chat-message">
                        <div class="message-avatar">J</div>
                        <div class="message-content">
                            <strong>Jay</strong>
                            <p>Hi! How can I help you today? 👋</p>
                        </div>
                    </div>
                </div>
                <form class="chat-input">
                    <input type="text" placeholder="Type your message...">
                    <button type="submit">Send</button>
                </form>
            </div>
        `;
        
        document.body.appendChild(chatWidget);
        
        // Add chat styles
        this.addChatStyles();
        
        // Toggle chat
        chatWidget.querySelector('.chat-toggle').addEventListener('click', () => {
            chatWidget.classList.toggle('open');
            chatWidget.querySelector('.chat-badge').style.display = 'none';
        });
        
        chatWidget.querySelector('.chat-close').addEventListener('click', () => {
            chatWidget.classList.remove('open');
        });
        
        // Handle messages
        chatWidget.querySelector('.chat-input').addEventListener('submit', (e) => {
            e.preventDefault();
            const input = e.target.querySelector('input');
            if (input.value.trim()) {
                this.addChatMessage(input.value, 'user');
                input.value = '';
                
                // Simulate response
                setTimeout(() => {
                    this.addChatMessage("Thanks for your message! I'll get back to you shortly.", 'agent');
                }, 1000);
            }
        });
    }

    addChatStyles() {
        if (!document.querySelector('#chat-styles')) {
            const style = document.createElement('style');
            style.id = 'chat-styles';
            style.textContent = `
                .chat-widget {
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    z-index: 1000;
                }

                .chat-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                    position: relative;
                    transition: transform 0.3s ease;
                }

                .chat-toggle:hover {
                    transform: scale(1.1);
                }

                .chat-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #f5576c;
                    color: white;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                }

                .chat-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 350px;
                    height: 450px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
                    display: none;
                    flex-direction: column;
                }

                .chat-widget.open .chat-window {
                    display: flex;
                }

                .chat-header {
                    padding: 1rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-radius: 15px 15px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .chat-status {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }

                .chat-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                }

                .chat-messages {
                    flex: 1;
                    padding: 1rem;
                    overflow-y: auto;
                }

                .chat-message {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                }

                .message-avatar {
                    width: 30px;
                    height: 30px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.85rem;
                    font-weight: bold;
                }

                .message-content {
                    flex: 1;
                }

                .message-content strong {
                    display: block;
                    margin-bottom: 0.25rem;
                    font-size: 0.85rem;
                }

                .message-content p {
                    background: #f0f0f0;
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    margin: 0;
                }

                .chat-input {
                    display: flex;
                    padding: 1rem;
                    border-top: 1px solid #e0e0e0;
                }

                .chat-input input {
                    flex: 1;
                    padding: 0.5rem;
                    border: 1px solid #e0e0e0;
                    border-radius: 20px;
                    outline: none;
                }

                .chat-input button {
                    margin-left: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .chat-window {
                        width: calc(100vw - 2rem);
                        right: -1rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'chat-message';
        
        if (sender === 'user') {
            messageEl.style.flexDirection = 'row-reverse';
            messageEl.innerHTML = `
                <div class="message-avatar" style="background: #f0f0f0; color: #333;">U</div>
                <div class="message-content">
                    <strong>You</strong>
                    <p style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">${message}</p>
                </div>
            `;
        } else {
            messageEl.innerHTML = `
                <div class="message-avatar">J</div>
                <div class="message-content">
                    <strong>Jay</strong>
                    <p>${message}</p>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageEl);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // A/B Testing Framework
    initABTesting() {
        // Randomly assign user to variant
        const variant = Math.random() > 0.5 ? 'A' : 'B';
        document.body.dataset.abVariant = variant;
        
        // Track variant in analytics
        this.analytics.variant = variant;
        
        // Apply variant-specific changes
        if (variant === 'B') {
            // Example: Different CTA text
            document.querySelectorAll('.btn-primary').forEach(btn => {
                if (btn.textContent.includes('Get Started')) {
                    btn.textContent = 'Start Free Trial';
                }
            });
        }
    }

    // Advanced Form Validation
    initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
            
            // Real-time validation
            form.querySelectorAll('input, textarea').forEach(field => {
                field.addEventListener('blur', () => {
                    this.validateField(field);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        
        form.querySelectorAll('input, textarea').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email';
                isValid = false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^\+?[\d\s-()]+$/;
            if (!phoneRegex.test(value) || value.length < 10) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }
        
        // Show error
        if (!isValid) {
            const error = document.createElement('div');
            error.className = 'field-error';
            error.textContent = errorMessage;
            error.style.cssText = 'color: #f5576c; font-size: 0.85rem; margin-top: 0.25rem;';
            field.parentElement.appendChild(error);
            field.style.borderColor = '#f5576c';
        } else {
            field.style.borderColor = '#4ade80';
        }
        
        return isValid;
    }

    // Progress Tracking
    initProgressTracking() {
        const sections = document.querySelectorAll('section');
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-indicator';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .progress-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                z-index: 10000;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                width: 0;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
        
        // Update on scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / height) * 100;
            
            progressBar.querySelector('.progress-fill').style.width = progress + '%';
            this.analytics.scrollDepth = Math.max(this.analytics.scrollDepth, progress);
        });
    }

    // Testimonial Carousel
    initTestimonialCarousel() {
        const carousels = document.querySelectorAll('[data-carousel]');
        
        carousels.forEach(carousel => {
            const items = carousel.querySelectorAll('.carousel-item');
            let currentIndex = 0;
            
            // Auto-rotate
            setInterval(() => {
                items[currentIndex].classList.remove('active');
                currentIndex = (currentIndex + 1) % items.length;
                items[currentIndex].classList.add('active');
            }, 5000);
        });
    }

    // Pricing Calculator
    initPricingCalculator() {
        const calculators = document.querySelectorAll('[data-calculator]');
        
        calculators.forEach(calc => {
            const inputs = calc.querySelectorAll('input[type="range"], input[type="number"]');
            const output = calc.querySelector('.calculator-output');
            
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.calculatePrice(calc);
                });
            });
        });
    }

    calculatePrice(calculator) {
        let basePrice = 997;
        const multipliers = {
            guests: 2,
            features: 50,
            support: 100
        };
        
        let total = basePrice;
        
        calculator.querySelectorAll('input').forEach(input => {
            const name = input.name;
            const value = parseInt(input.value);
            
            if (multipliers[name]) {
                total += value * multipliers[name];
            }
        });
        
        const output = calculator.querySelector('.calculator-output');
        if (output) {
            output.textContent = `$${total.toLocaleString()}`;
        }
    }

    // Lead Capture
    initLeadCapture() {
        // Capture form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName === 'FORM') {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                this.handleLeadCapture(data.email || '', data);
            }
        });
    }

    handleLeadCapture(email, additionalData = {}) {
        // Store lead data
        const leadData = {
            email: email,
            timestamp: new Date().toISOString(),
            pageUrl: window.location.href,
            variant: this.analytics.variant,
            ...additionalData
        };
        
        // In production, send to server
        console.log('Lead captured:', leadData);
        
        // Store in localStorage for demo
        const leads = JSON.parse(localStorage.getItem('premium_leads') || '[]');
        leads.push(leadData);
        localStorage.setItem('premium_leads', JSON.stringify(leads));
        
        // Track conversion
        this.trackConversion('lead_capture', leadData);
    }

    // Analytics Tracking
    trackAnalytics() {
        // Page view
        this.analytics.pageViews++;
        
        // Time on page
        const startTime = Date.now();
        window.addEventListener('beforeunload', () => {
            this.analytics.timeOnPage = Math.floor((Date.now() - startTime) / 1000);
        });
        
        // Track interactions
        document.addEventListener('click', (e) => {
            const target = e.target;
            const interaction = {
                type: 'click',
                element: target.tagName,
                text: target.textContent?.substring(0, 50),
                timestamp: Date.now()
            };
            
            this.analytics.interactions.push(interaction);
        });
    }

    trackConversion(type, data) {
        const conversion = {
            type: type,
            data: data,
            timestamp: Date.now(),
            analytics: this.analytics
        };
        
        // In production, send to analytics service
        console.log('Conversion tracked:', conversion);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.conversionTools = new ConversionTools();
    });
} else {
    window.conversionTools = new ConversionTools();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConversionTools;
}