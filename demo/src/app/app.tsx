import * as React from 'react'

import { VirtualScroll } from '../../../src/virtual-scroll'

const items = require('../assets/data/items.json')

interface State {
  darkTheme?: boolean
  multiColumn?: boolean
}

export class App extends React.Component<{}, State> {

  constructor(props) {
    super(props)
    this.state = {
      darkTheme: false,
      multiColumn: false
    }
  }

  renderItem(item) {
    return <div key={item.index}
      className={`flx mb1 divider-b primary ${this.state.multiColumn ? 'w50 flxc mr1' : ''}`}>
      <div className="accent w13 flx aic jcc">{item.index}</div>
      <div className="ma2 flx jcc flxc">
        <div className="fw1">{item.name}</div>
        <div className="o6 f3 fw1 mt1">
          <span className="uc">{item.gender}</span> | {item.address}
        </div>
        <div className="o6 f3 fw1 mt1"> {item.phone} | {item.email} </div>
      </div>
    </div>
  }

  renderHeader() {
    return <div className="flx mb4">
      <button className="ma1" onClick={() => this.setState(state => ({
        darkTheme: !state.darkTheme
      }))}>Switch Theme</button>
      <button className="ma1" onClick={() => this.setState(state => ({
        multiColumn: !state.multiColumn
      }))}>{this.state.multiColumn ? 'Single Column' : 'Multi Column'}</button>
    </div>
  }

  render() {
    const theme = this.state.darkTheme ? 'dark' : 'light'
    const primary = this.state.darkTheme ? 'primary-s1' : 'primary-s2'
    return <div className={`${theme} fill`}>
      <div className={`fill flx flxc aic jcc ${primary} ph20`}>
        <h1 className="fw1">Virtual Scroll</h1>
        {this.renderHeader()}
        <div className="h99 w100">
          <VirtualScroll className={this.state.multiColumn ? 'flx flxw' : ''} items={items} renderItem={this.renderItem.bind(this)} />
        </div>
      </div>
    </div>
  }
}
