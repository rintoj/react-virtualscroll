
# react-virtualscroll

Virtual Scroll displays a virtual, "infinite" list. Supports multi-column.

## About

This module displays a small subset of records just enough to fill the viewport and uses the same DOM elements as the user scrolls.
This method is effective because the number of DOM elements are always constant and tiny irrespective of the size of the list. Thus virtual scroll can display infinitely growing list of items in an efficient way.

* React compatible module
* Supports multi-column
* Easy to use apis
* OpenSource and available in [GitHub](https://github.com/rintoj/react-virtualscroll)

## Usage

```jsx
  <VirtualScroll className="flx flxw"
    items={this.state.items}
    onChange={(event) => this.setState(event)}
    renderItem={this.renderItem.bind(this)} />
```

## Get Started

**Step 1:** Install react-virtualscroll

```sh
npm install react-virtualscroll --save
```

**Step 2:** Import virtual scroll module into your app module

```ts
import { VirtualScroll } from 'react-virtualscroll';
```

**Step 3:** Wrap virtual-scroll tag around list items;

```ts
 <VirtualScroll className="flx flxw"
    items={this.state.items}
    onChange={(event) => this.setState(event)}
    renderItem={this.renderItem.bind(this)} />
```

**Step 4:** Create 'renderItem' function.

```tsx
renderItem(item) {
  return <div key={item.index} className="flx mb1 divider-b primary">
    <div className="fw1">{item.name}</div>
  </div>
}
```

## API

| Attribute      | Type   | Description
|----------------|--------|------------
| items          | any[]  | The data that builds the templates within the virtual scroll. This is the same data that you'd pass to ngFor. It's important to note that when this data has changed, then the entire virtual scroll is refreshed.
| childWidth     | number | The minimum width of the item template's cell. This dimension is used to help determine how many cells should be created when initialized, and to help calculate the height of the scrollable area. Note that the actual rendered size of the first cell is used by default if not specified.
| childHeight    | number | The minimum height of the item template's cell. This dimension is used to help determine how many cells should be created when initialized, and to help calculate the height of the scrollable area. Note that the actual rendered size of the first cell is used by default if not specified.
| onStart         | Event  | This event is fired every time `start` reaches 0
| onEnd           | Event  | This event is fired every time `end` reaches total number of items in `items` array
| onUpdate         | Event  | This event is fired every time `start` or `end` index change and emits list of items from `start` to `end`. The list emitted by this event must be used with `*ngFor` to render the actual list of items within `<virtual-scroll>`
| onChange         | Event  | This event is fired every time `start` or `end` index change and emits `ChangeEvent` which of format: `{ start: number, end: number }`

## Items with variable size

Items must have fixed height and width for this module to work perfectly. However if your list happen to have items with variable width and height, set inputs `childWidth` and `childHeight` to the smallest possible values to make this work.

```jsx
 <VirtualScroll className="flx flxw"
    items={this.state.items}
    childWidth={80}
    childHeight={30}
    onChange={(event) => this.setState(event)}
    renderItem={this.renderItem.bind(this)} />
```

## Loading in chunk

The event `onEnd` is fired every time scroll reaches at the end of the list. You could use this to load more items at the end of the scroll. See below.

```jsx
  render() {
  return <VirtualScroll className="flx flxw"
    items={this.state.items}
    onEnd={(event) => this.fetchMore()}
    renderItem={this.renderItem.bind(this)} />
  }

  ....

  fetchMore(event) {
    if (event.end !== this.buffer.length) return;
    this.fetchNextChunk(this.buffer.length, 10).then(chunk => {
      this.setState(state => ({ items: state.items.concat(chunk) }))
    })
  }

  fetchNextChunk(skip: number, limit: number): Promise<ListItem[]> {
    return new Promise((resolve, reject) => {
        ....
    });
  }
}
```

## If container size change

If virtual scroll is used within a dropdown or collapsible menu, virtual scroll needs to know when the container size change. Use `refresh()` function after container is resized (include time for animation as well).

## Sorting Items

Always be sure to send an immutable copy of items to virtual scroll to avoid unintended behavior. You need to be careful when doing non-immutable operations such as sorting:

```ts
sort() {
  this.setState(state => ({
    items: [].concat(state.items || []).sort()
  }))
}
```

This will be deprecated once [Resize Observer](https://wicg.github.io/ResizeObserver/) is fully implemented.

## Contributing
Contributions are very welcome! Just send a pull request. Feel free to contact me or checkout my [GitHub](https://github.com/rintoj) page.

## Author

**Rinto Jose** (rintoj)

### Hope this module is helpful to you. If you are looking for Angular version please check [https://github.com/rintoj/angular2-virtual-scroll](https://github.com/rintoj/angular2-virtual-scroll) Please make sure to checkout my other [projects](https://github.com/rintoj) and [articles](https://medium.com/@rintoj). Enjoy coding!

Follow me:
  [GitHub](https://github.com/rintoj)
| [Facebook](https://www.facebook.com/rinto.jose)
| [Twitter](https://twitter.com/rintoj)
| [Google+](https://plus.google.com/+RintoJoseMankudy)
| [Youtube](https://youtube.com/+RintoJoseMankudy)

## Versions
[Check CHANGELOG](https://github.com/rintoj/react-virtualscroll/blob/master/CHANGELOG.md)

## License
```
The MIT License (MIT)

Copyright (c) 2016 Rinto Jose (rintoj)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
