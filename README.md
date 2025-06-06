
# Listine virtual scroller 

Why Our Custom Virtual Scroll?
Our virtual scroll implementation bridges the gap left by existing solutions by offering:

True Dynamic Height Support: Unlike Angular CDK and PrimeNG virtual scrollers that require a fixed item size, our library intelligently measures and handles items of varying heights dynamically, providing smooth scrolling experience even with heterogeneous content.

Standalone Component Compatibility: Built for Angular 14+ standalone components architecture, it does not rely on NgModules, making it future-proof and easy to integrate with modern Angular projects without legacy module constraints.

Optimized Performance: Uses smart view recycling and virtualization techniques, minimizing DOM node creation and improving rendering performance in large lists with variable heights.

Flexible API: Provides hooks and event emitters to customize rendering, handle loading states, and integrate seamlessly with asynchronous data sources.

Responsive and Accessible: Designed with responsiveness in mind and supports keyboard navigation and ARIA accessibility standards.

Use Cases
This virtual scroll is ideal when:

Your list items have variable heights that cannot be predetermined.

You want to adopt Angular's latest standalone components without legacy module dependencies.

You need a lightweight but powerful scrolling solution tailored to your specific UI needs.

You are working on complex data-heavy applications requiring smooth, performant scrolling experiences.

Summary
While existing libraries like Angular CDK virtual scroll and ngx-virtual-scroller cover many scenarios, they fall short when it comes to combining dynamic height support with standalone component compatibility in Angular 14+. Our custom virtual scroll library fills this gap, offering a modern, performant, and flexible solution for Angular developers.
## Installation

Install listine with npm

```bash
  npm install listine
```

## Example


## Authors

- [@hrssh11](https://www.github.com/hrssh11)


## License

[MIT](LICENSE)

