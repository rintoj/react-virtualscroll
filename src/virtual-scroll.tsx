import * as React from 'react'

export interface ChangeEvent {
  start?: number
  end?: number
}

export interface Props {
  items: any[]
  className?: string
  scrollbarWidth?: number
  scrollbarHeight?: number
  childWidth?: number
  childHeight?: number
  onUpdate?(items: any[])
  onChange?(event: ChangeEvent)
  onStart?(event: ChangeEvent)
  onEnd?(event: ChangeEvent)
  renderItem(item: any)
}

export interface State {
  topPadding?: number
  scrollHeight?: number
  items?: any
}

const style: any = {
  host: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    overflowY: 'auto',
    position: 'relative',
    WebkitOverflowScrolling: 'touch'
  },
  content: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}

export class VirtualScroll extends React.Component<Props, State> {

  previousStart: number
  previousEnd: number
  startupLoop: boolean = true

  private el: HTMLElement
  private content: HTMLElement
  private onScrollListener

  constructor(props) {
    super(props)
    this.state = { scrollHeight: 0 }
  }

  componentDidMount() {
    this.onScrollListener = this.el.addEventListener('scroll', this.refresh.bind(this))
    this.refresh()
  }

  componentWillReceiveProps(props) {
    if (props.items != undefined && this.props.items == undefined || this.props.items.length === 0) {
      this.startupLoop = true
    }
    this.refresh()
  }

  componentWillUnmount() {
    if (this.onScrollListener !== undefined) {
      this.onScrollListener()
    }
  }

  render() {
    return <div ref={el => this.el = el} style={style.host}>
      <div className={`total-padding`} style={{ opacity: 0, width: 0, height: `${this.state.scrollHeight}px` }} />
      <div ref={el => this.content = el} className={this.props.className}
        style={Object.assign({}, style.content, { transform: `translateY(${this.state.topPadding}px)` })}>
        {(this.state.items || []).map(this.props.renderItem)}
      </div >
    </div >
  }

  refresh() {
    requestAnimationFrame(() => this.calculateItems())
  }

  scrollInto(item: any) {
    let index: number = (this.props.items || []).indexOf(item)
    if (index < 0 || index >= (this.props.items || []).length) return

    let d = this.calculateDimensions()
    this.el.scrollTop = Math.floor(index / d.itemsPerRow) *
      d.childHeight - Math.max(0, (d.itemsPerCol - 1)) * d.childHeight
    this.refresh()
  }

  private countItemsPerRow() {
    let offsetTop
    let itemsPerRow
    let children = this.content.children
    for (itemsPerRow = 0; itemsPerRow < children.length; itemsPerRow++) {
      if (offsetTop != undefined && offsetTop !== (children[itemsPerRow] as any).offsetTop) break
      offsetTop = (children[itemsPerRow] as any).offsetTop
    }
    return itemsPerRow
  }

  private calculateDimensions() {
    let items = this.props.items || []
    let itemCount = items.length
    let viewWidth = this.el.clientWidth - (this.props.scrollbarWidth || 0)
    let viewHeight = this.el.clientHeight - (this.props.scrollbarHeight || 0)

    let contentDimensions
    if (this.props.childWidth == undefined || this.props.childHeight == undefined) {
      contentDimensions = this.content.children[0] ? this.content.children[0].getBoundingClientRect() : {
        width: viewWidth,
        height: viewHeight
      }
    }
    let childWidth = this.props.childWidth || contentDimensions.width
    let childHeight = this.props.childHeight || contentDimensions.height

    let itemsPerRow = Math.max(1, this.countItemsPerRow())
    let itemsPerRowByCalc = Math.max(1, Math.floor(viewWidth / childWidth))
    let itemsPerCol = Math.max(1, Math.floor(viewHeight / childHeight))
    let scrollTop = Math.max(0, this.el.scrollTop)
    if (itemsPerCol === 1 && Math.floor(scrollTop / this.state.scrollHeight * itemCount) + itemsPerRowByCalc >= itemCount) {
      itemsPerRow = itemsPerRowByCalc
    }

    return {
      itemCount: itemCount,
      viewWidth: viewWidth,
      viewHeight: viewHeight,
      childWidth: childWidth,
      childHeight: childHeight,
      itemsPerRow: itemsPerRow,
      itemsPerCol: itemsPerCol,
      itemsPerRowByCalc: itemsPerRowByCalc
    }
  }

  private calculateItems() {
    let d = this.calculateDimensions()
    let items = this.props.items || []
    const scrollHeight = d.childHeight * d.itemCount / d.itemsPerRow
    if (this.el.scrollTop > scrollHeight) {
      this.el.scrollTop = scrollHeight
    }

    let scrollTop = Math.max(0, this.el.scrollTop)
    let indexByScrollTop = scrollTop / scrollHeight * d.itemCount / d.itemsPerRow
    let end = Math.min(d.itemCount, Math.ceil(indexByScrollTop) * d.itemsPerRow + d.itemsPerRow * (d.itemsPerCol + 1))

    let maxStartEnd = end
    const modEnd = end % d.itemsPerRow
    if (modEnd) {
      maxStartEnd = end + d.itemsPerRow - modEnd
    }
    let maxStart = Math.max(0, maxStartEnd - d.itemsPerCol * d.itemsPerRow - d.itemsPerRow)
    let start = Math.min(maxStart, Math.floor(indexByScrollTop) * d.itemsPerRow)

    const topPadding = d.childHeight * Math.ceil(start / d.itemsPerRow)
    this.setState({ topPadding, scrollHeight })

    start = !isNaN(start) ? start : -1
    end = !isNaN(end) ? end : -1
    if (start !== this.previousStart || end !== this.previousEnd) {

      // update the scroll list
      if (typeof this.props.renderItem === 'function') {
        const scrollItems = items.slice(start, end)
        this.setState({ items: scrollItems })
        if (typeof this.props.onUpdate === 'function') {
          this.props.onUpdate(scrollItems)
        }
      }

      // emit 'start' event
      if (typeof this.props.onStart === 'function') {
        if (start !== this.previousStart && this.startupLoop === false) {
          this.props.onStart({ start, end })
        }
      }

      // emit 'end' event
      if (typeof this.props.onEnd === 'function') {
        if (end !== this.previousEnd && this.startupLoop === false) {
          this.props.onEnd({ start, end })
        }
      }

      this.previousStart = start
      this.previousEnd = end

      if (this.startupLoop === true) {
        this.refresh()
      } else {
        if (typeof this.props.onChange === 'function') {
          this.props.onChange({ start, end })
        }
      }

    } else if (this.startupLoop === true) {
      this.startupLoop = false
      this.refresh()
    }
  }
}
