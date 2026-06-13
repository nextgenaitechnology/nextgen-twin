import os

css = """
/* =========================================
   GLOBAL UI/UX REFINEMENTS
   ========================================= */

/* Smooth Transitions for Interactive Elements */
a, button, .icon-btn, .pill, .card, .profile-circle, .btn-primary, .nexa-btn {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button & Link Active/Hover states */
button:active, .btn-primary:active, .nexa-btn:active, .pill:active {
    transform: scale(0.95) !important;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.4);
}

.nexa-btn:hover, .btn-primary:hover {
    filter: brightness(1.1);
    box-shadow: 0 4px 12px rgba(255, 51, 102, 0.3);
}

/* Premium Form Inputs (Studio, Community, Settings) */
input[type="text"], input[type="password"], input[type="email"], textarea, select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 14px 16px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    transition: all 0.3s ease;
    width: 100%;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: #ff3366;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(255, 51, 102, 0.2);
}

/* Custom Premium Scrollbar */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #0a0b0c; 
}
::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2); 
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3); 
}

/* Fix mobile nav padding */
body {
    padding-bottom: 80px; /* space for mobile nav */
}

/* Glassmorphism Modals */
.nexa-modal-overlay {
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    background: rgba(0, 0, 0, 0.6);
    transition: opacity 0.3s ease;
}
.nexa-modal {
    transform: scale(0.95);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.nexa-modal-overlay.active .nexa-modal {
    transform: scale(1);
    opacity: 1;
}

/* Fix specific spacing on inputs with labels */
.form-group {
    margin-bottom: 20px;
}
.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #e2e8f0;
    font-size: 14px;
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("Refinement CSS injected!")
