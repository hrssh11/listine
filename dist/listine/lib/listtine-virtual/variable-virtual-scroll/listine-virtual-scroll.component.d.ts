import { TemplateRef, ElementRef, AfterViewInit, ChangeDetectorRef, QueryList, EventEmitter, OnChanges, SimpleChanges, OnInit, OnDestroy, NgZone } from "@angular/core";
import * as i0 from "@angular/core";
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
export declare class ListineVirtualScrollModule implements OnInit, AfterViewInit, OnChanges, OnDestroy {
    private cdr;
    private ngZone;
    /** List of all items to render */
    items: any[];
    /** Height of the scrollable viewport in pixels */
    viewportHeight: number;
    /** Number of extra items to render above and below the viewport */
    buffer: number;
    /** Template reference for rendering each item */
    itemTemplate: TemplateRef<any>;
    /** Initial estimated height of each item before actual measurement */
    initialItemHeight: number;
    /** Emits scroll position whenever user scrolls */
    scrollEmitter: EventEmitter<any>;
    /** Reference to the scrolling container */
    scrollerRef: ElementRef;
    /** QueryList of rendered item elements (used for height measurement) */
    itemElements: QueryList<ElementRef>;
    /** Stores measured heights of items */
    itemHeights: number[];
    /** Stores calculated top offset for each item */
    itemTops: number[];
    /** Total height of all items (used to simulate full scrollable area) */
    totalContentHeight: number;
    /** Index of the first visible item (including buffer) */
    visibleStart: number;
    /** Index of the last visible item (including buffer) */
    visibleEnd: number;
    /** Items currently visible in the viewport */
    visibleItems: any[];
    /** ResizeObserver to watch for item height changes */
    private resizeObserver;
    constructor(cdr: ChangeDetectorRef, ngZone: NgZone);
    /** Initialize item heights on component initialization */
    ngOnInit(): void;
    /**
     * Respond to changes in input bindings (mainly the `items` array)
     * @param changes - input property changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Called after view initialization. Triggers initial height calculation.
     */
    ngAfterViewInit(): void;
    /**
     * Disconnects ResizeObserver on component destroy
     */
    ngOnDestroy(): void;
    /** Initializes item height and position tracking arrays */
    initializeHeights(): void;
    /** Recalculates item top positions and content height */
    calculateHeights(): void;
    /** Updates top positions of all items based on their current heights */
    updateItemTops(): void;
    /**
     * Returns the top position of an item by index
     * @param index - index of the item
     */
    getItemTop(index: number): number;
    /** Scroll event handler: calculates which items should be visible */
    onScroll(): void;
    /** Updates the list of items to be rendered based on scroll position */
    updateVisibleItems(): void;
    /** Measures actual heights of rendered DOM elements and updates tracking */
    measureItemHeights(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ListineVirtualScrollModule, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ListineVirtualScrollModule, "listine-variable-virtual-scroll", never, { "items": { "alias": "items"; "required": false; }; "viewportHeight": { "alias": "viewportHeight"; "required": false; }; "buffer": { "alias": "buffer"; "required": false; }; "itemTemplate": { "alias": "itemTemplate"; "required": false; }; "initialItemHeight": { "alias": "initialItemHeight"; "required": false; }; }, { "scrollEmitter": "scrollEmitter"; }, never, never, true, never>;
}
