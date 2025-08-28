#!/bin/bash

# Add share buttons to all demo pages

echo "Adding share buttons to all demo pages..."

# Define the share button CSS
SHARE_CSS='
        /* Share Buttons */
        .share-buttons {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 9998;
        }

        .share-toggle {
            background: linear-gradient(135deg, #f9c74f, #f39c12);
            color: #1a1f71;
            border: none;
            padding: 12px 24px;
            border-radius: 30px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 5px 20px rgba(249, 199, 79, 0.3);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .share-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 30px rgba(249, 199, 79, 0.5);
        }

        .share-icon {
            font-size: 16px;
        }

        .share-menu {
            position: absolute;
            bottom: 60px;
            left: 0;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            padding: 10px;
            min-width: 180px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s;
        }

        .share-menu.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        .share-option {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: #333;
            text-decoration: none;
            border-radius: 10px;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: 500;
        }

        .share-option:hover {
            background: #f0f0f0;
            color: #f39c12;
            transform: translateX(5px);
        }

        .share-option span {
            font-size: 18px;
        }'

# Define the share button HTML
SHARE_HTML='
    <!-- Share Buttons -->
    <div class="share-buttons">
        <button class="share-toggle" onclick="toggleShareMenu()" aria-label="Share this page">
            <span class="share-icon">🔗</span>
            <span class="share-text">Share</span>
        </button>
        <div class="share-menu" id="shareMenu">
            <a href="#" onclick="shareOnFacebook(event)" class="share-option" aria-label="Share on Facebook">
                <span>📘</span> Facebook
            </a>
            <a href="#" onclick="shareOnTwitter(event)" class="share-option" aria-label="Share on Twitter">
                <span>🐦</span> Twitter
            </a>
            <a href="#" onclick="shareOnLinkedIn(event)" class="share-option" aria-label="Share on LinkedIn">
                <span>💼</span> LinkedIn
            </a>
            <a href="#" onclick="shareViaEmail(event)" class="share-option" aria-label="Share via Email">
                <span>✉️</span> Email
            </a>
            <a href="#" onclick="copyLink(event)" class="share-option" aria-label="Copy link">
                <span>📋</span> Copy Link
            </a>
        </div>
    </div>'

# Define the share button JavaScript
SHARE_JS='
        // Share functionality
        function toggleShareMenu() {
            const menu = document.getElementById("shareMenu");
            menu.classList.toggle("active");
        }

        // Close share menu when clicking outside
        document.addEventListener("click", function(event) {
            const shareButtons = document.querySelector(".share-buttons");
            if (!shareButtons.contains(event.target)) {
                document.getElementById("shareMenu").classList.remove("active");
            }
        });

        function shareOnFacebook(event) {
            event.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "width=600,height=400");
            toggleShareMenu();
        }

        function shareOnTwitter(event) {
            event.preventDefault();
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("Check out this amazing website! " + document.title);
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "width=600,height=400");
            toggleShareMenu();
        }

        function shareOnLinkedIn(event) {
            event.preventDefault();
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "width=600,height=400");
            toggleShareMenu();
        }

        function shareViaEmail(event) {
            event.preventDefault();
            const subject = encodeURIComponent("Check out this website");
            const body = encodeURIComponent(`I thought you might like this website:\n\n${document.title}\n${window.location.href}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
            toggleShareMenu();
        }

        function copyLink(event) {
            event.preventDefault();
            navigator.clipboard.writeText(window.location.href).then(function() {
                // Change button text temporarily
                const btn = event.target.closest(".share-option");
                const originalText = btn.innerHTML;
                btn.innerHTML = "<span>✅</span> Copied!";
                setTimeout(() => {
                    btn.innerHTML = originalText;
                }, 2000);
            });
            toggleShareMenu();
        }'

echo "Script created. To add share buttons to a demo page:"
echo "1. Add the CSS to the <style> section"
echo "2. Add the HTML after the demo badge"
echo "3. Add the JavaScript before the closing </script> tag"

echo "Done!"