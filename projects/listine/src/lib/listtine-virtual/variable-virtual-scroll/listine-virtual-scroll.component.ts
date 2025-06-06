import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
  OnInit,
  OnDestroy,
  NgZone,
} from "@angular/core";
import { CommonModule } from "@angular/common";

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
@Component({
  selector: "listine-variable-virtual-scroll",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./listine-virtual-scroll.component.html",
  styleUrls: ["./listine-virtual-scroll.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListineVirtualScrollComponent
  implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
  /** List of all items to render */
  @Input() items: any[] = [];

  /** Height of the scrollable viewport in pixels */
  @Input() viewportHeight = 400;

  /** Number of extra items to render above and below the viewport */
  @Input() buffer = 5;

  /** Template reference for rendering each item */
  @Input() itemTemplate: TemplateRef<any>;

  /** Initial estimated height of each item before actual measurement */
  @Input() initialItemHeight = 50;

  /** Emits scroll position whenever user scrolls */
  @Output() scrollEmitter = new EventEmitter<any>();

  /** Reference to the scrolling container */
  @ViewChild("scroller", { static: true }) scrollerRef!: ElementRef;

  /** QueryList of rendered item elements (used for height measurement) */
  @ViewChildren("itemElement", { read: ElementRef })
  itemElements!: QueryList<ElementRef>;

  /** Stores measured heights of items */
  itemHeights: number[] = [];

  /** Stores calculated top offset for each item */
  itemTops: number[] = [];

  /** Total height of all items (used to simulate full scrollable area) */
  totalContentHeight = 0;

  /** Index of the first visible item (including buffer) */
  visibleStart = 0;

  /** Index of the last visible item (including buffer) */
  visibleEnd = 0;

  /** Items currently visible in the viewport */
  visibleItems: any[] = [];

  /** ResizeObserver to watch for item height changes */
  private resizeObserver = new ResizeObserver(() => {
    this.ngZone.run(() => {
      this.measureItemHeights();
    });
  });

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  /** Initialize item heights on component initialization */
  ngOnInit(): void {
    this.initializeHeights();
    console.log("items ", this.items);
  }

  /**
   * Respond to changes in input bindings (mainly the `items` array)
   * @param changes - input property changes
   */
  ngOnChanges(changes: SimpleChanges): void {
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
  ngOnDestroy(): void {
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
  getItemTop(index: number): number {
    return this.itemTops[index] || 0;
  }

  /** Scroll event handler: calculates which items should be visible */
  onScroll() {
    const scrollTop = this.scrollerRef.nativeElement.scrollTop;
    const viewportBottom = scrollTop + this.viewportHeight;

    let start = 0;
    while (
      start < this.items.length &&
      this.getItemTop(start + 1) < scrollTop
    ) {
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
}
