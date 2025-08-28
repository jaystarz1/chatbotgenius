/* =================================================================
   FORMS.JS - Form Validation and Enhancement
   
   This module provides:
   - Accessible form validation
   - Real-time field validation
   - Error message management
   - Success handling
   - Form submission handling
   ================================================================= */

(function() {
    'use strict';

    /* =================================================================
       FORM VALIDATION
       ================================================================= */
    
    // Validation rules
    const validationRules = {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            pattern: /^[\d\s\-\+\(\)]+$/,
            message: 'Please enter a valid phone number'
        },
        url: {
            pattern: /^https?:\/\/.+/,
            message: 'Please enter a valid URL starting with http:// or https://'
        },
        name: {
            pattern: /^[a-zA-Z\s\-']+$/,
            message: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)'
        }
    };
    
    // Initialize form validation
    function initFormValidation(form) {
        if (!form) return;
        
        // Add novalidate to handle validation ourselves
        form.setAttribute('novalidate', '');
        
        // Get all form fields
        const fields = form.querySelectorAll('input, select, textarea');
        
        // Add real-time validation
        fields.forEach(field => {
            // Add ARIA attributes
            if (field.hasAttribute('required')) {
                field.setAttribute('aria-required', 'true');
            }
            
            // Validate on blur
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Clear error on input
            field.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    clearFieldError(this);
                }
            });
            
            // Special handling for select elements
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', function() {
                    validateField(this);
                });
            }
        });
        
        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            const firstInvalidField = null;
            
            fields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                    if (!firstInvalidField) {
                        firstInvalidField = field;
                    }
                }
            });
            
            if (isValid) {
                handleFormSubmit(form);
            } else {
                // Focus first invalid field
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                
                // Announce error to screen readers
                if (window.AccessibilityUtils && window.AccessibilityUtils.announce) {
                    window.AccessibilityUtils.announce('Please correct the errors in the form', 'assertive');
                }
            }
        });
    }
    
    /* =================================================================
       FIELD VALIDATION
       ================================================================= */
    
    function validateField(field) {
        // Skip if field is disabled or readonly
        if (field.disabled || field.readOnly) return true;
        
        let isValid = true;
        let errorMessage = '';
        
        const value = field.value.trim();
        const type = field.type || field.tagName.toLowerCase();
        const isRequired = field.hasAttribute('required');
        
        // Check if required field is empty
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Check specific field types
        else if (value) {
            switch(type) {
                case 'email':
                    if (!validationRules.email.pattern.test(value)) {
                        isValid = false;
                        errorMessage = validationRules.email.message;
                    }
                    break;
                    
                case 'tel':
                    if (!validationRules.phone.pattern.test(value)) {
                        isValid = false;
                        errorMessage = validationRules.phone.message;
                    }
                    break;
                    
                case 'url':
                    if (!validationRules.url.pattern.test(value)) {
                        isValid = false;
                        errorMessage = validationRules.url.message;
                    }
                    break;
                    
                case 'number':
                    const min = field.getAttribute('min');
                    const max = field.getAttribute('max');
                    const numValue = parseFloat(value);
                    
                    if (isNaN(numValue)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid number';
                    } else if (min && numValue < parseFloat(min)) {
                        isValid = false;
                        errorMessage = `Value must be at least ${min}`;
                    } else if (max && numValue > parseFloat(max)) {
                        isValid = false;
                        errorMessage = `Value must be no more than ${max}`;
                    }
                    break;
                    
                case 'password':
                    if (value.length < 8) {
                        isValid = false;
                        errorMessage = 'Password must be at least 8 characters';
                    }
                    break;
            }
            
            // Check custom validation pattern
            const pattern = field.getAttribute('pattern');
            if (pattern && isValid) {
                const regex = new RegExp(pattern);
                if (!regex.test(value)) {
                    isValid = false;
                    errorMessage = field.getAttribute('data-error-message') || 'Please match the requested format';
                }
            }
            
            // Check custom validation function
            const customValidation = field.getAttribute('data-validate');
            if (customValidation && window[customValidation]) {
                const result = window[customValidation](value);
                if (result !== true) {
                    isValid = false;
                    errorMessage = result;
                }
            }
        }
        
        // Update field state
        if (isValid) {
            setFieldSuccess(field);
        } else {
            setFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    /* =================================================================
       ERROR/SUCCESS STATES
       ================================================================= */
    
    function setFieldError(field, message) {
        // Add error class
        field.classList.add('error');
        field.classList.remove('success');
        field.setAttribute('aria-invalid', 'true');
        
        // Get or create error element
        let errorId = field.id + '-error';
        let errorElement = document.getElementById(errorId);
        
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.id = errorId;
            errorElement.className = 'form-error';
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'polite');
            
            // Insert after field or after label if exists
            const label = field.parentNode.querySelector('label');
            if (label && label.nextSibling === field) {
                field.parentNode.insertBefore(errorElement, field.nextSibling);
            } else {
                field.parentNode.appendChild(errorElement);
            }
        }
        
        errorElement.textContent = message;
        field.setAttribute('aria-describedby', errorId);
    }
    
    function setFieldSuccess(field) {
        // Add success class
        field.classList.add('success');
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        
        // Remove error message if exists
        clearFieldError(field);
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        // Remove error element
        const errorId = field.id + '-error';
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    /* =================================================================
       FORM SUBMISSION
       ================================================================= */
    
    function handleFormSubmit(form) {
        // Disable submit button
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }
        
        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Show loading state
        showFormLoading(form);
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Success!
            showFormSuccess(form);
            
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                hideFormMessages(form);
                
                // Clear validation states
                const fields = form.querySelectorAll('.success, .error');
                fields.forEach(field => {
                    field.classList.remove('success', 'error');
                });
            }, 5000);
            
        }, 2000);
    }
    
    /* =================================================================
       FORM MESSAGES
       ================================================================= */
    
    function showFormLoading(form) {
        hideFormMessages(form);
        
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'form-loading-message';
        loadingMsg.innerHTML = '<span class="loading"></span> Processing...';
        loadingMsg.setAttribute('role', 'status');
        loadingMsg.setAttribute('aria-live', 'polite');
        
        form.appendChild(loadingMsg);
    }
    
    function showFormSuccess(form) {
        hideFormMessages(form);
        
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-message';
        successMsg.textContent = form.getAttribute('data-success-message') || 'Form submitted successfully!';
        successMsg.setAttribute('role', 'status');
        successMsg.setAttribute('aria-live', 'polite');
        
        form.appendChild(successMsg);
        
        // Announce to screen readers
        if (window.AccessibilityUtils && window.AccessibilityUtils.announce) {
            window.AccessibilityUtils.announce(successMsg.textContent);
        }
    }
    
    function showFormError(form, message) {
        hideFormMessages(form);
        
        const errorMsg = document.createElement('div');
        errorMsg.className = 'form-error-message';
        errorMsg.textContent = message || 'An error occurred. Please try again.';
        errorMsg.setAttribute('role', 'alert');
        errorMsg.setAttribute('aria-live', 'assertive');
        
        form.appendChild(errorMsg);
        
        // Announce to screen readers
        if (window.AccessibilityUtils && window.AccessibilityUtils.announce) {
            window.AccessibilityUtils.announce(errorMsg.textContent, 'assertive');
        }
    }
    
    function hideFormMessages(form) {
        const messages = form.querySelectorAll('.form-loading-message, .form-success-message, .form-error-message');
        messages.forEach(msg => msg.remove());
    }
    
    /* =================================================================
       SPECIAL FORM FEATURES
       ================================================================= */
    
    // Password strength indicator
    function initPasswordStrength(field) {
        if (!field || field.type !== 'password') return;
        
        // Create strength indicator
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.innerHTML = `
            <div class="password-strength-bar">
                <div class="password-strength-fill"></div>
            </div>
            <span class="password-strength-text">Password strength: <span class="strength-level">None</span></span>
        `;
        
        field.parentNode.appendChild(strengthIndicator);
        
        const strengthFill = strengthIndicator.querySelector('.password-strength-fill');
        const strengthLevel = strengthIndicator.querySelector('.strength-level');
        
        // Check password strength on input
        field.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            
            if (password.length >= 8) strength++;
            if (password.length >= 12) strength++;
            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
            if (/\d/.test(password)) strength++;
            if (/[^a-zA-Z\d]/.test(password)) strength++;
            
            // Update indicator
            const percentage = (strength / 5) * 100;
            strengthFill.style.width = percentage + '%';
            
            // Update color and text
            if (strength < 2) {
                strengthFill.style.background = '#e74c3c';
                strengthLevel.textContent = 'Weak';
            } else if (strength < 4) {
                strengthFill.style.background = '#f39c12';
                strengthLevel.textContent = 'Medium';
            } else {
                strengthFill.style.background = '#27ae60';
                strengthLevel.textContent = 'Strong';
            }
        });
    }
    
    // Character counter
    function initCharacterCounter(field) {
        const maxLength = field.getAttribute('maxlength');
        if (!maxLength) return;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('aria-atomic', 'true');
        
        field.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - field.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 20) {
                counter.style.color = '#e74c3c';
            } else {
                counter.style.color = '';
            }
        }
        
        field.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    // Auto-save draft
    function initAutoSave(form) {
        const formId = form.id || 'form-draft';
        const fields = form.querySelectorAll('input, select, textarea');
        
        // Load saved draft on page load
        const savedData = localStorage.getItem(formId);
        if (savedData) {
            const data = JSON.parse(savedData);
            fields.forEach(field => {
                if (data[field.name]) {
                    field.value = data[field.name];
                }
            });
            
            // Show draft loaded message
            const draftMsg = document.createElement('div');
            draftMsg.className = 'form-info-message';
            draftMsg.textContent = 'Draft loaded from previous session';
            form.insertBefore(draftMsg, form.firstChild);
            
            setTimeout(() => draftMsg.remove(), 5000);
        }
        
        // Save draft on input
        let saveTimer;
        fields.forEach(field => {
            field.addEventListener('input', function() {
                clearTimeout(saveTimer);
                saveTimer = setTimeout(() => {
                    const data = {};
                    fields.forEach(f => {
                        if (f.name && f.value) {
                            data[f.name] = f.value;
                        }
                    });
                    localStorage.setItem(formId, JSON.stringify(data));
                }, 1000);
            });
        });
        
        // Clear draft on successful submit
        form.addEventListener('submit', function() {
            localStorage.removeItem(formId);
        });
    }
    
    /* =================================================================
       INITIALIZATION
       ================================================================= */
    
    function init() {
        // Initialize all forms with validation
        const forms = document.querySelectorAll('.event-form, .rsvp-form, form[data-validate="true"]');
        forms.forEach(form => {
            initFormValidation(form);
            
            // Add special features if requested
            if (form.hasAttribute('data-autosave')) {
                initAutoSave(form);
            }
        });
        
        // Initialize password strength indicators
        const passwordFields = document.querySelectorAll('input[type="password"][data-strength="true"]');
        passwordFields.forEach(initPasswordStrength);
        
        // Initialize character counters
        const textareas = document.querySelectorAll('textarea[maxlength]');
        textareas.forEach(initCharacterCounter);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    /* =================================================================
       PUBLIC API
       ================================================================= */
    
    window.FormUtils = {
        init: init,
        initFormValidation: initFormValidation,
        validateField: validateField,
        setFieldError: setFieldError,
        setFieldSuccess: setFieldSuccess,
        clearFieldError: clearFieldError,
        showFormSuccess: showFormSuccess,
        showFormError: showFormError,
        initPasswordStrength: initPasswordStrength,
        initCharacterCounter: initCharacterCounter,
        initAutoSave: initAutoSave
    };

})();