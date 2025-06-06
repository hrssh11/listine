import * as i0 from '@angular/core';
import { EventEmitter, ElementRef, ViewChildren, ViewChild, Output, Input, ChangeDetectionStrategy, Component } from '@angular/core';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';

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
class ListineVirtualScrollModule {
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

/*
 * Public API Surface of Listine
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ListineVirtualScrollModule };
//# sourceMappingURL=listine.mjs.map
