# TODO: Move Sidebar Toggle Button to Header

## Steps to Complete
- [ ] Update src/app/layout/layout.ts: Add isCollapsed property and toggleSidebar method.
- [ ] Update src/app/layout/layout.html: Pass isCollapsed to <app-header> and <app-sidebar>, and handle toggle event from header.
- [ ] Update src/app/header/header.ts: Add Input for isCollapsed, Output for toggle event.
- [ ] Update src/app/header/header.html: Add the toggle button with click event.
- [ ] Update src/app/sidebar/sidebar.ts: Add Input for isCollapsed, remove local state and method.
- [ ] Update src/app/sidebar/sidebar.html: Remove the toggle button.
