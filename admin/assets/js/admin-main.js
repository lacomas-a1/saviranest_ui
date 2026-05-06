(function () {
    // Sidebar & logout
    const menuBtn = document.getElementById('menuToggleBtn');
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; }
    function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; }
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    window.addEventListener('resize', () => { if (window.innerWidth > 992 && sidebar.classList.contains('open')) closeSidebar(); });
    document.getElementById('logoutBtn')?.addEventListener('click', () => alert('Logout demo (admin session)'));

    // initial filter
    filterTableRows();
})();