# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [1.1.0] - 2025-07-21

### Added
- `@Input() panelOpen: boolean = false`  
  New input to handle scroll-related issues inside panels or overlays. Helps avoid white screen bug when scrolling inside a panel and closing it.
  
- `@Output() scrollToEnd = new EventEmitter<void>()`  
  Emits an event when the user reaches the end of the list. Useful for implementing lazy loading.

### Fixed
- Resolved an issue where virtual scroll did not work properly when the parent container used `display: flex`.

---

## [1.0.0] - 2025-06-15

### Added
- Initial release of **Listine Virtual Scroller**.
- Support for dynamic height measurement and virtualization.
- Compatibility with Angular 14+ standalone components.
- Configurable buffer and viewport height.
- Template support for custom item rendering.

---
