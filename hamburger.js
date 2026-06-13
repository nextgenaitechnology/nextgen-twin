(function() {
    const hamburgerBtns = document.querySelectorAll('.hamburger-btn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburgerBtns.length > 0) {
        hamburgerBtns.forEach(hamburgerBtn => {
            hamburgerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (mobileMenu) {
                    mobileMenu.classList.toggle('active');
                    hamburgerBtn.classList.toggle('active');
                } else {
                    if (window.showToast) window.showToast('Menu opening...', 'info');
                }
            });
        });

        if (mobileMenu) {
            document.addEventListener('click', (e) => {
                const path = e.composedPath ? e.composedPath() : [];
                const isInsideMenu = path.includes(mobileMenu) || mobileMenu.contains(e.target);
                const isHamburgerBtn = Array.from(hamburgerBtns).some(btn => path.includes(btn) || btn.contains(e.target));

                if (mobileMenu.classList.contains('active') && !isInsideMenu && !isHamburgerBtn) {
                    mobileMenu.classList.remove('active');
                    hamburgerBtns.forEach(btn => btn.classList.remove('active'));
                }
            });
        }
    }
})();
