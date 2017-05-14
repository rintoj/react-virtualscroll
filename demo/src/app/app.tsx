import * as React from 'react'

import { VirtualScroll } from '../../../src/virtual-scroll'

const items = require('../assets/data/items.json')
const scales = [0, 100, 250, 500, 750, 1000]

interface State {
  darkTheme?: boolean
  multiColumn?: boolean
  sortByName?: boolean
  start?: number
  end?: number
  total?: number
  items?: any[]
}

export class App extends React.Component<{}, State> {

  constructor(props) {
    super(props)
    this.state = {
      darkTheme: false,
      multiColumn: false,
      sortByName: false,
      items: items,
      total: 1000
    }
  }

  renderItem(item) {
    return <div key={item.index}
      className={`flx mb1 divider-b primary ${this.state.multiColumn ? 'w50 h30 flxc mr1' : 'h20'}`}>
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

  calculateItems(sortByName, length) {
    return [].concat(items.slice(0, length)).sort((a, b) => {
      const attr = sortByName ? 'name' : 'index'
      return -(a[attr] < b[attr]) || +(a[attr] !== b[attr])
    })
  }

  renderHeader() {
    return <div className="flx aic jcc mb4">
      <button className="ma1" onClick={() => this.setState(state => ({
        darkTheme: !state.darkTheme
      }))}>Switch Theme</button>

      <button className="ma1" onClick={() => this.setState(state => ({
        multiColumn: !state.multiColumn
      }))}>{this.state.multiColumn ? 'Single Column' : 'Multi Column'}</button>

      <button className="ma1" onClick={() => this.setState(state => ({
        items: this.calculateItems(!state.sortByName, state.total),
        sortByName: !state.sortByName
      }))}>{this.state.sortByName ? 'Sort By Index' : 'Sort By Name'}</button>

      <select className="ma1" value={this.state.total} onChange={(event) => {
        event.persist()
        this.setState(state => ({
          items: this.calculateItems(state.sortByName, parseInt(event.target.value, undefined)),
          total: parseInt(event.target.value, undefined)
        }))
      }}> {scales.map((scale, index) => <option key={index} value={scale}>{scale}</option>)} </select>
    </div>
  }

  renderStatus() {
    return <div className="f3 mv2 o6">
      {`Showing ${this.state.start} - ${this.state.end} of ${(this.state.items || []).length}`}
    </div>
  }

  render() {
    const theme = this.state.darkTheme ? 'dark' : 'light'
    const primary = this.state.darkTheme ? 'primary-s1' : 'primary-s2'
    return <div className={`${theme} fill`}>
      <div className={`fill flx flxc aic jcc ${primary} ph20`}>
        <h1 className="fw1">Virtual Scroll</h1>
        {this.renderHeader()}
        {this.renderStatus()}
        <div className={`h99 w100 ${this.state.darkTheme ? 'secondary-s2' : 'secondary-s1'}`}>
          <VirtualScroll
            className={this.state.multiColumn ? 'flx flxw' : ''}
            items={this.state.items}
            onChange={(event) => this.setState(event)}
            renderItem={this.renderItem.bind(this)} />
        </div>
      </div>
    </div>
  }
}
