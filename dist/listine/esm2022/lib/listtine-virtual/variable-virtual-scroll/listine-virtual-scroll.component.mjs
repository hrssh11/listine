import { Component, Input, ViewChild, ElementRef, ChangeDetectionStrategy, ViewChildren, EventEmitter, Output, } from "@angular/core";
import { CommonModule } from "@angular/common";
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * `s73-variable-virtual-scroll`
 *
 * A lightweight, customizable virtual scroll component that supports variable item heights.
 * Efficiently renders only visible items to improve performance for large lists.
 *
 * ## Inputs:
 * - `items`: List of data items to display
 * - `viewportHeight`: Height of the scrollable container (default: 400px)
 * - `buffer`: Number of extra items rendered above and below the viewport for smooth scrolling (default: 5)
 * - `itemTemplate`: Angular template for rendering each item
 * - `initialItemHeight`: Default item height before measurement (default: 50px)
 *
 * ## Outputs:
 * - `scrollEmitter`: Emits scroll position on every scroll event
 */
export class ListineVirtualScrollModule {
    cdr;
    ngZone;
    /** List of all items to render */
    items = [];
    /** Height of the scrollable viewport in pixels */
    viewportHeight = 400;
    /** Number of extra items to render above and below the viewport */
    buffer = 5;
    /** Template reference for rendering each item */
    itemTemplate;
    /** Initial estimated height of each item before actual measurement */
    initialItemHeight = 50;
    /** Emits scroll position whenever user scrolls */
    scrollEmitter = new EventEmitter();
    /** Reference to the scrolling container */
    scrollerRef;
    /** QueryList of rendered item elements (used for height measurement) */
    itemElements;
    /** Stores measured heights of items */
    itemHeights = [];
    /** Stores calculated top offset for each item */
    itemTops = [];
    /** Total height of all items (used to simulate full scrollable area) */
    totalContentHeight = 0;
    /** Index of the first visible item (including buffer) */
    visibleStart = 0;
    /** Index of the last visible item (including buffer) */
    visibleEnd = 0;
    /** Items currently visible in the viewport */
    visibleItems = [];
    /** ResizeObserver to watch for item height changes */
    resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => {
            this.measureItemHeights();
        });
    });
    constructor(cdr, ngZone) {
        this.cdr = cdr;
        this.ngZone = ngZone;
    }
    /** Initialize item heights on component initialization */
    ngOnInit() {
        this.initializeHeights();
        console.log("items ", this.items);
    }
    /**
     * Respond to changes in input bindings (mainly the `items` array)
     * @param changes - input property changes
     */
    ngOnChanges(changes) {
        if (changes["items"]) {
            this.items = changes["items"].currentValue;
            this.initializeHeights();
            setTimeout(() => {
                this.calculateHeights();
                this.onScroll();
            });
        }
    }
    /**
     * Called after view initialization. Triggers initial height calculation.
     */
    ngAfterViewInit() {
        setTimeout(() => {
            this.calculateHeights();
            this.onScroll();
        });
    }
    /**
     * Disconnects ResizeObserver on component destroy
     */
    ngOnDestroy() {
        this.resizeObserver.disconnect();
    }
    /** Initializes item height and position tracking arrays */
    initializeHeights() {
        this.itemHeights = this.items.map(() => this.initialItemHeight);
        this.updateItemTops();
    }
    /** Recalculates item top positions and content height */
    calculateHeights() {
        this.updateItemTops();
    }
    /** Updates top positions of all items based on their current heights */
    updateItemTops() {
        this.itemTops = [];
        let top = 0;
        for (const height of this.itemHeights) {
            this.itemTops.push(top);
            top += height;
        }
        this.totalContentHeight = top;
    }
    /**
     * Returns the top position of an item by index
     * @param index - index of the item
     */
    getItemTop(index) {
        return this.itemTops[index] || 0;
    }
    /** Scroll event handler: calculates which items should be visible */
    onScroll() {
        const scrollTop = this.scrollerRef.nativeElement.scrollTop;
        const viewportBottom = scrollTop + this.viewportHeight;
        let start = 0;
        while (start < this.items.length &&
            this.getItemTop(start + 1) < scrollTop) {
            start++;
        }
        let end = start;
        while (end < this.items.length && this.getItemTop(end) < viewportBottom) {
            end++;
        }
        this.visibleStart = Math.max(0, start - this.buffer);
        this.visibleEnd = Math.min(this.items.length, end + this.buffer);
        this.measureItemHeights();
        this.updateVisibleItems();
        this.scrollEmitter.emit(scrollTop);
    }
    /** Updates the list of items to be rendered based on scroll position */
    updateVisibleItems() {
        this.visibleItems = this.items.slice(this.visibleStart, this.visibleEnd);
        // Wait for DOM render before measuring heights
        setTimeout(() => {
            this.measureItemHeights();
        });
    }
    /** Measures actual heights of rendered DOM elements and updates tracking */
    measureItemHeights() {
        this.itemElements.forEach((el, idx) => {
            const index = this.visibleStart + idx;
            const height = el.nativeElement.offsetHeight;
            if (this.itemHeights[index] !== height) {
                this.itemHeights[index] = height;
                this.resizeObserver.observe(el.nativeElement);
            }
        });
        this.updateItemTops();
        this.cdr.markForCheck();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ListineVirtualScrollModule, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: ListineVirtualScrollModule, isStandalone: true, selector: "listine-variable-virtual-scroll", inputs: { items: "items", viewportHeight: "viewportHeight", buffer: "buffer", itemTemplate: "itemTemplate", initialItemHeight: "initialItemHeight" }, outputs: { scrollEmitter: "scrollEmitter" }, viewQueries: [{ propertyName: "scrollerRef", first: true, predicate: ["scroller"], descendants: true, static: true }, { propertyName: "itemElements", predicate: ["itemElement"], descendants: true, read: ElementRef }], usesOnChanges: true, ngImport: i0, template: "<div\n  #scroller\n  class=\"scroll-container\"\n  (scroll)=\"onScroll()\"\n  [style.height.px]=\"viewportHeight\"\n>\n  <div class=\"total-height\" [style.height.px]=\"totalContentHeight\">\n    <ng-container *ngFor=\"let item of visibleItems; let i = index\">\n      <div\n        #itemElement\n        class=\"item\"\n        [style.transform]=\"'translateY(' + getItemTop(visibleStart + i) + 'px)'\"\n      >\n        <ng-container\n          *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item }\"\n        ></ng-container>\n      </div>\n    </ng-container>\n  </div>\n</div>\n", styles: [".scroll-container{overflow-y:auto;position:relative;width:100%;background:#fff}.total-height{position:relative;width:100%}.item{position:absolute;width:100%;box-sizing:border-box;will-change:transform}\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: ListineVirtualScrollModule, decorators: [{
            type: Component,
            args: [{ selector: "listine-variable-virtual-scroll", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: "<div\n  #scroller\n  class=\"scroll-container\"\n  (scroll)=\"onScroll()\"\n  [style.height.px]=\"viewportHeight\"\n>\n  <div class=\"total-height\" [style.height.px]=\"totalContentHeight\">\n    <ng-container *ngFor=\"let item of visibleItems; let i = index\">\n      <div\n        #itemElement\n        class=\"item\"\n        [style.transform]=\"'translateY(' + getItemTop(visibleStart + i) + 'px)'\"\n      >\n        <ng-container\n          *ngTemplateOutlet=\"itemTemplate; context: { $implicit: item }\"\n        ></ng-container>\n      </div>\n    </ng-container>\n  </div>\n</div>\n", styles: [".scroll-container{overflow-y:auto;position:relative;width:100%;background:#fff}.total-height{position:relative;width:100%}.item{position:absolute;width:100%;box-sizing:border-box;will-change:transform}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }], propDecorators: { items: [{
                type: Input
            }], viewportHeight: [{
                type: Input
            }], buffer: [{
                type: Input
            }], itemTemplate: [{
                type: Input
            }], initialItemHeight: [{
                type: Input
            }], scrollEmitter: [{
                type: Output
            }], scrollerRef: [{
                type: ViewChild,
                args: ["scroller", { static: true }]
            }], itemElements: [{
                type: ViewChildren,
                args: ["itemElement", { read: ElementRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdGluZS12aXJ0dWFsLXNjcm9sbC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saXN0aW5lL3NyYy9saWIvbGlzdHRpbmUtdmlydHVhbC92YXJpYWJsZS12aXJ0dWFsLXNjcm9sbC9saXN0aW5lLXZpcnR1YWwtc2Nyb2xsLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpc3RpbmUvc3JjL2xpYi9saXN0dGluZS12aXJ0dWFsL3ZhcmlhYmxlLXZpcnR1YWwtc2Nyb2xsL2xpc3RpbmUtdmlydHVhbC1zY3JvbGwuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFNBQVMsRUFDVCxLQUFLLEVBRUwsU0FBUyxFQUNULFVBQVUsRUFFVix1QkFBdUIsRUFFdkIsWUFBWSxFQUVaLFlBQVksRUFDWixNQUFNLEdBTVAsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFFL0M7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBU0gsTUFBTSxPQUFPLDBCQUEwQjtJQXFEakI7SUFBZ0M7SUFsRHBELGtDQUFrQztJQUN6QixLQUFLLEdBQVUsRUFBRSxDQUFDO0lBRTNCLGtEQUFrRDtJQUN6QyxjQUFjLEdBQUcsR0FBRyxDQUFDO0lBRTlCLG1FQUFtRTtJQUMxRCxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBRXBCLGlEQUFpRDtJQUN4QyxZQUFZLENBQW1CO0lBRXhDLHNFQUFzRTtJQUM3RCxpQkFBaUIsR0FBRyxFQUFFLENBQUM7SUFFaEMsa0RBQWtEO0lBQ3hDLGFBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBRWxELDJDQUEyQztJQUNGLFdBQVcsQ0FBYztJQUVsRSx3RUFBd0U7SUFFeEUsWUFBWSxDQUF5QjtJQUVyQyx1Q0FBdUM7SUFDdkMsV0FBVyxHQUFhLEVB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dXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgVmlld0NoaWxkcmVuLFxuICBRdWVyeUxpc3QsXG4gIEV2ZW50RW1pdHRlcixcbiAgT3V0cHV0LFxuICBPbkNoYW5nZXMsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgT25EZXN0cm95LFxuICBOZ1pvbmUsXG59IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5cbi8qKlxuICogYHM3My12YXJpYWJsZS12aXJ0dWFsLXNjcm9sbGBcbiAqXG4gKiBBIGxpZ2h0d2VpZ2h0LCBjdXN0b21pemFibGUgdmlydHVhbCBzY3JvbGwgY29tcG9uZW50IHRoYXQgc3VwcG9ydHMgdmFyaWFibGUgaXRlbSBoZWlnaHRzLlxuICogRWZmaWNpZW50bHkgcmVuZGVycyBvbmx5IHZpc2libGUgaXRlbXMgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSBmb3IgbGFyZ2UgbGlzdHMuXG4gKlxuICogIyMgSW5wdXRzOlxuICogLSBgaXRlbXNgOiBMaXN0IG9mIGRhdGEgaXRlbXMgdG8gZGlzcGxheVxuICogLSBgdmlld3BvcnRIZWlnaHRgOiBIZWlnaHQgb2YgdGhlIHNjcm9sbGFibGUgY29udGFpbmVyIChkZWZhdWx0OiA0MDBweClcbiAqIC0gYGJ1ZmZlcmA6IE51bWJlciBvZiBleHRyYSBpdGVtcyByZW5kZXJlZCBhYm92ZSBhbmQgYmVsb3cgdGhlIHZpZXdwb3J0IGZvciBzbW9vdGggc2Nyb2xsaW5nIChkZWZhdWx0OiA1KVxuICogLSBgaXRlbVRlbXBsYXRlYDogQW5ndWxhciB0ZW1wbGF0ZSBmb3IgcmVuZGVyaW5nIGVhY2ggaXRlbVxuICogLSBgaW5pdGlhbEl0ZW1IZWlnaHRgOiBEZWZhdWx0IGl0ZW0gaGVpZ2h0IGJlZm9yZSBtZWFzdXJlbWVudCAoZGVmYXVsdDogNTBweClcbiAqXG4gKiAjIyBPdXRwdXRzOlxuICogLSBgc2Nyb2xsRW1pdHRlcmA6IEVtaXRzIHNjcm9sbCBwb3NpdGlvbiBvbiBldmVyeSBzY3JvbGwgZXZlbnRcbiAqL1xuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiBcImxpc3RpbmUtdmFyaWFibGUtdmlydHVhbC1zY3JvbGxcIixcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gIHRlbXBsYXRlVXJsOiBcIi4vbGlzdGluZS12aXJ0dWFsLXNjcm9sbC5jb21wb25lbnQuaHRtbFwiLFxuICBzdHlsZVVybHM6IFtcIi4vbGlzdGluZS12aXJ0dWFsLXNjcm9sbC5jb21wb25lbnQuc2Nzc1wiXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIExpc3RpbmVWaXJ0dWFsU2Nyb2xsTW9kdWxlXG4gIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveVxue1xuICAvKiogTGlzdCBvZiBhbGwgaXRlbXMgdG8gcmVuZGVyICovXG4gIEBJbnB1dCgpIGl0ZW1zOiBhbnlbXSA9IFtdO1xuXG4gIC8qKiBIZWlnaHQgb2YgdGhlIHNjcm9sbGFibGUgdmlld3BvcnQgaW4gcGl4ZWxzICovXG4gIEBJbnB1dCgpIHZpZXdwb3J0SGVpZ2h0ID0gNDAwO1xuXG4gIC8qKiBOdW1iZXIgb2YgZXh0cmEgaXRlbXMgdG8gcmVuZGVyIGFib3ZlIGFuZCBiZWxvdyB0aGUgdmlld3BvcnQgKi9cbiAgQElucHV0KCkgYnVmZmVyID0gNTtcblxuICAvKiogVGVtcGxhdGUgcmVmZXJlbmNlIGZvciByZW5kZXJpbmcgZWFjaCBpdGVtICovXG4gIEBJbnB1dCgpIGl0ZW1UZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAvKiogSW5pdGlhbCBlc3RpbWF0ZWQgaGVpZ2h0IG9mIGVhY2ggaXRlbSBiZWZvcmUgYWN0dWFsIG1lYXN1cmVtZW50ICovXG4gIEBJbnB1dCgpIGluaXRpYWxJdGVtSGVpZ2h0ID0gNTA7XG5cbiAgLyoqIEVtaXRzIHNjcm9sbCBwb3NpdGlvbiB3aGVuZXZlciB1c2VyIHNjcm9sbHMgKi9cbiAgQE91dHB1dCgpIHNjcm9sbEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogUmVmZXJlbmNlIHRvIHRoZSBzY3JvbGxpbmcgY29udGFpbmVyICovXG4gIEBWaWV3Q2hpbGQoXCJzY3JvbGxlclwiLCB7IHN0YXRpYzogdHJ1ZSB9KSBzY3JvbGxlclJlZiE6IEVsZW1lbnRSZWY7XG5cbiAgLyoqIFF1ZXJ5TGlzdCBvZiByZW5kZXJlZCBpdGVtIGVsZW1lbnRzICh1c2VkIGZvciBoZWlnaHQgbWVhc3VyZW1lbnQpICovXG4gIEBWaWV3Q2hpbGRyZW4oXCJpdGVtRWxlbWVudFwiLCB7IHJlYWQ6IEVsZW1lbnRSZWYgfSlcbiAgaXRlbUVsZW1lbnRzITogUXVlcnlMaXN0PEVsZW1lbnRSZWY+O1xuXG4gIC8qKiBTdG9yZXMgbWVhc3VyZWQgaGVpZ2h0cyBvZiBpdGVtcyAqL1xuICBpdGVtSGVpZ2h0czogbnVtYmVyW10gPSBbXTtcblxuICAvKiogU3RvcmVzIGNhbGN1bGF0ZWQgdG9wIG9mZnNldCBmb3IgZWFjaCBpdGVtICovXG4gIGl0ZW1Ub3BzOiBudW1iZXJbXSA9IFtdO1xuXG4gIC8qKiBUb3RhbCBoZWlnaHQgb2YgYWxsIGl0ZW1zICh1c2VkIHRvIHNpbXVsYXRlIGZ1bGwgc2Nyb2xsYWJsZSBhcmVhKSAqL1xuICB0b3RhbENvbnRlbnRIZWlnaHQgPSAwO1xuXG4gIC8qKiBJbmRleCBvZiB0aGUgZmlyc3QgdmlzaWJsZSBpdGVtIChpbmNsdWRpbmcgYnVmZmVyKSAqL1xuICB2aXNpYmxlU3RhcnQgPSAwO1xuXG4gIC8qKiBJbmRleCBvZiB0aGUgbGFzdCB2aXNpYmxlIGl0ZW0gKGluY2x1ZGluZyBidWZmZXIpICovXG4gIHZpc2libGVFbmQgPSAwO1xuXG4gIC8qKiBJdGVtcyBjdXJyZW50bHkgdmlzaWJsZSBpbiB0aGUgdmlld3BvcnQgKi9cbiAgdmlzaWJsZUl0ZW1zOiBhbnlbXSA9IFtdO1xuXG4gIC8qKiBSZXNpemVPYnNlcnZlciB0byB3YXRjaCBmb3IgaXRlbSBoZWlnaHQgY2hhbmdlcyAqL1xuICBwcml2YXRlIHJlc2l6ZU9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpID0+IHtcbiAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgdGhpcy5tZWFzdXJlSXRlbUhlaWdodHMoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIG5nWm9uZTogTmdab25lKSB7fVxuXG4gIC8qKiBJbml0aWFsaXplIGl0ZW0gaGVpZ2h0cyBvbiBjb21wb25lbnQgaW5pdGlhbGl6YXRpb24gKi9cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pbml0aWFsaXplSGVpZ2h0cygpO1xuICAgIGNvbnNvbGUubG9nKFwiaXRlbXMgXCIsIHRoaXMuaXRlbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3BvbmQgdG8gY2hhbmdlcyBpbiBpbnB1dCBiaW5kaW5ncyAobWFpbmx5IHRoZSBgaXRlbXNgIGFycmF5KVxuICAgKiBAcGFyYW0gY2hhbmdlcyAtIGlucHV0IHByb3BlcnR5IGNoYW5nZXNcbiAgICovXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlc1tcIml0ZW1zXCJdKSB7XG4gICAgICB0aGlzLml0ZW1zID0gY2hhbmdlc1tcIml0ZW1zXCJdLmN1cnJlbnRWYWx1ZTtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZUhlaWdodHMoKTtcblxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlSGVpZ2h0cygpO1xuICAgICAgICB0aGlzLm9uU2Nyb2xsKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGFmdGVyIHZpZXcgaW5pdGlhbGl6YXRpb24uIFRyaWdnZXJzIGluaXRpYWwgaGVpZ2h0IGNhbGN1bGF0aW9uLlxuICAgKi9cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jYWxjdWxhdGVIZWlnaHRzKCk7XG4gICAgICB0aGlzLm9uU2Nyb2xsKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGlzY29ubmVjdHMgUmVzaXplT2JzZXJ2ZXIgb24gY29tcG9uZW50IGRlc3Ryb3lcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqIEluaXRpYWxpemVzIGl0ZW0gaGVpZ2h0IGFuZCBwb3NpdGlvbiB0cmFja2luZyBhcnJheXMgKi9cbiAgaW5pdGlhbGl6ZUhlaWdodHMoKSB7XG4gICAgdGhpcy5pdGVtSGVpZ2h0cyA9IHRoaXMuaXRlbXMubWFwKCgpID0+IHRoaXMuaW5pdGlhbEl0ZW1IZWlnaHQpO1xuICAgIHRoaXMudXBkYXRlSXRlbVRvcHMoKTtcbiAgfVxuXG4gIC8qKiBSZWNhbGN1bGF0ZXMgaXRlbSB0b3AgcG9zaXRpb25zIGFuZCBjb250ZW50IGhlaWdodCAqL1xuICBjYWxjdWxhdGVIZWlnaHRzKCkge1xuICAgIHRoaXMudXBkYXRlSXRlbVRvcHMoKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRvcCBwb3NpdGlvbnMgb2YgYWxsIGl0ZW1zIGJhc2VkIG9uIHRoZWlyIGN1cnJlbnQgaGVpZ2h0cyAqL1xuICB1cGRhdGVJdGVtVG9wcygpIHtcbiAgICB0aGlzLml0ZW1Ub3BzID0gW107XG4gICAgbGV0IHRvcCA9IDA7XG4gICAgZm9yIChjb25zdCBoZWlnaHQgb2YgdGhpcy5pdGVtSGVpZ2h0cykge1xuICAgICAgdGhpcy5pdGVtVG9wcy5wdXNoKHRvcCk7XG4gICAgICB0b3AgKz0gaGVpZ2h0O1xuICAgIH1cbiAgICB0aGlzLnRvdGFsQ29udGVudEhlaWdodCA9IHRvcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB0b3AgcG9zaXRpb24gb2YgYW4gaXRlbSBieSBpbmRleFxuICAgKiBAcGFyYW0gaW5kZXggLSBpbmRleCBvZiB0aGUgaXRlbVxuICAgKi9cbiAgZ2V0SXRlbVRvcChpbmRleDogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtVG9wc1tpbmRleF0gfHwgMDtcbiAgfVxuXG4gIC8qKiBTY3JvbGwgZXZlbnQgaGFuZGxlcjogY2FsY3VsYXRlcyB3aGljaCBpdGVtcyBzaG91bGQgYmUgdmlzaWJsZSAqL1xuICBvblNjcm9sbCgpIHtcbiAgICBjb25zdCBzY3JvbGxUb3AgPSB0aGlzLnNjcm9sbGVyUmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIGNvbnN0IHZpZXdwb3J0Qm90dG9tID0gc2Nyb2xsVG9wICsgdGhpcy52aWV3cG9ydEhlaWdodDtcblxuICAgIGxldCBzdGFydCA9IDA7XG4gICAgd2hpbGUgKFxuICAgICAgc3RhcnQgPCB0aGlzLml0ZW1zLmxlbmd0aCAmJlxuICAgICAgdGhpcy5nZXRJdGVtVG9wKHN0YXJ0ICsgMSkgPCBzY3JvbGxUb3BcbiAgICApIHtcbiAgICAgIHN0YXJ0Kys7XG4gICAgfVxuXG4gICAgbGV0IGVuZCA9IHN0YXJ0O1xuICAgIHdoaWxlIChlbmQgPCB0aGlzLml0ZW1zLmxlbmd0aCAmJiB0aGlzLmdldEl0ZW1Ub3AoZW5kKSA8IHZpZXdwb3J0Qm90dG9tKSB7XG4gICAgICBlbmQrKztcbiAgICB9XG5cbiAgICB0aGlzLnZpc2libGVTdGFydCA9IE1hdGgubWF4KDAsIHN0YXJ0IC0gdGhpcy5idWZmZXIpO1xuICAgIHRoaXMudmlzaWJsZUVuZCA9IE1hdGgubWluKHRoaXMuaXRlbXMubGVuZ3RoLCBlbmQgKyB0aGlzLmJ1ZmZlcik7XG4gICAgdGhpcy5tZWFzdXJlSXRlbUhlaWdodHMoKTtcbiAgICB0aGlzLnVwZGF0ZVZpc2libGVJdGVtcygpO1xuXG4gICAgdGhpcy5zY3JvbGxFbWl0dGVyLmVtaXQoc2Nyb2xsVG9wKTtcbiAgfVxuXG4gIC8qKiBVcGRhdGVzIHRoZSBsaXN0IG9mIGl0ZW1zIHRvIGJlIHJlbmRlcmVkIGJhc2VkIG9uIHNjcm9sbCBwb3NpdGlvbiAqL1xuICB1cGRhdGVWaXNpYmxlSXRlbXMoKSB7XG4gICAgdGhpcy52aXNpYmxlSXRlbXMgPSB0aGlzLml0ZW1zLnNsaWNlKHRoaXMudmlzaWJsZVN0YXJ0LCB0aGlzLnZpc2libGVFbmQpO1xuXG4gICAgLy8gV2FpdCBmb3IgRE9NIHJlbmRlciBiZWZvcmUgbWVhc3VyaW5nIGhlaWdodHNcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMubWVhc3VyZUl0ZW1IZWlnaHRzKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogTWVhc3VyZXMgYWN0dWFsIGhlaWdodHMgb2YgcmVuZGVyZWQgRE9NIGVsZW1lbnRzIGFuZCB1cGRhdGVzIHRyYWNraW5nICovXG4gIG1lYXN1cmVJdGVtSGVpZ2h0cygpIHtcbiAgICB0aGlzLml0ZW1FbGVtZW50cy5mb3JFYWNoKChlbCwgaWR4KSA9PiB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMudmlzaWJsZVN0YXJ0ICsgaWR4O1xuICAgICAgY29uc3QgaGVpZ2h0ID0gZWwubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgICBpZiAodGhpcy5pdGVtSGVpZ2h0c1tpbmRleF0gIT09IGhlaWdodCkge1xuICAgICAgICB0aGlzLml0ZW1IZWlnaHRzW2luZGV4XSA9IGhlaWdodDtcbiAgICAgICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKGVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMudXBkYXRlSXRlbVRvcHMoKTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxufVxuIiwiPGRpdlxuICAjc2Nyb2xsZXJcbiAgY2xhc3M9XCJzY3JvbGwtY29udGFpbmVyXCJcbiAgKHNjcm9sbCk9XCJvblNjcm9sbCgpXCJcbiAgW3N0eWxlLmhlaWdodC5weF09XCJ2aWV3cG9ydEhlaWdodFwiXG4+XG4gIDxkaXYgY2xhc3M9XCJ0b3RhbC1oZWlnaHRcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cInRvdGFsQ29udGVudEhlaWdodFwiPlxuICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2YgdmlzaWJsZUl0ZW1zOyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICA8ZGl2XG4gICAgICAgICNpdGVtRWxlbWVudFxuICAgICAgICBjbGFzcz1cIml0ZW1cIlxuICAgICAgICBbc3R5bGUudHJhbnNmb3JtXT1cIid0cmFuc2xhdGVZKCcgKyBnZXRJdGVtVG9wKHZpc2libGVTdGFydCArIGkpICsgJ3B4KSdcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICAgKm5nVGVtcGxhdGVPdXRsZXQ9XCJpdGVtVGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtIH1cIlxuICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgPC9kaXY+XG48L2Rpdj5cbiJdfQ==