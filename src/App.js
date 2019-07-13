import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid'
import compose from 'lodash/fp/compose'
import ldFilter from 'lodash/filter'
import { isValidVin } from './util/car-validation'
import createCarStreamer from './api/car-data-streamer'
import Cars from './components/cars'
import Events from './components/events'
import createRandomColor from './dom-utils/colors'

import './App.css'

class App extends Component {
  constructor() {
    super()
    this.state = { cars: {}, events: [], filterEvents: false }
    this.streamers = {}
  }

  componentDidMount() {
    ;['AA2433', 'BH3K45', 'we34II'].forEach(vin => this.addCar(vin))
  }

  validateVin = vin => isValidVin(this.state.cars)(vin)

  addCar = vin => {
    if (!this.validateVin(vin).valid) {
      return
    }

    vin = vin.toUpperCase()

    this.setState(
      state => {
        const { cars } = state
        const car = {
          vin,
          color: createRandomColor(),
          enabled: true,
        }
        return {
          cars: { ...cars, [car.vin]: car },
        }
      },
      () => {
        // add streamer
        const streamer = createCarStreamer(vin)
        streamer.subscribe(this.onCarEventArrive)
        streamer.start()
        this.streamers[vin] = streamer
      },
    )
  }

  deleteCar = vin => e => {
    // delete car and car
    this.setState(
      state => {
        const { cars, events } = state
        const { [vin]: car, ...restCars } = cars
        return {
          cars: restCars,
          events: events.filter(event => event.vin !== vin),
        }
      },
      () => {
        // remove streamer
        this.streamers[vin].removeHandler(this.onCarEventArrive)
        delete this.streamers[vin]
      },
    )
  }

  carExists = vin => !!this.state.cars[vin]

  onCarEventArrive = event => {
    this.setState(state => ({ events: [event, ...state.events] }))
  }

  toggleCar = vin => e => {
    const { cars } = this.state
    const oldCar = cars[vin]
    const newEnabled = !oldCar.enabled
    const action = newEnabled ? 'start' : 'stop'
    this.streamers[vin][action]()
    this.setState(state => {
      const newCar = { ...oldCar, enabled: newEnabled }
      return {
        cars: { ...state.cars, [vin]: newCar },
      }
    })
  }

  getCarByVin = vin => {
    return this.state.cars[vin]
  }

  getCarColorByVin = vin => this.getCarByVin(vin).color

  filterDisableVins = events => {
    const { cars } = this.state
    const disabledVins = ldFilter(cars, car => !car.enabled).map(car => car.vin)
    if (disabledVins.length) {
      return events.filter(event => !disabledVins.includes(event.vin))
    }

    return events
  }

  filterEvents = events => {
    const { filterEvents } = this.state
    if (filterEvents) {
      return events.filter(event => parseFloat(event.fuel) > 0.15)
    }

    return events
  }

  getFilteredEvents = () =>
    compose(
      this.filterDisableVins,
      this.filterEvents,
    )(this.state.events)

  toggleFilterEvents = e => {
    this.setState(state => ({ filterEvents: !state.filterEvents }))
  }

  render() {
    const { cars, filterEvents } = this.state

    return (
      <Grid className="app" fluid>
        <Row center="xs">
          <Col sm={12} md={4} lg={3}>
            <Cars
              cars={cars}
              addCar={this.addCar}
              deleteCar={this.deleteCar}
              toggleCar={this.toggleCar}
              validateVin={this.validateVin}
            />
          </Col>
          <Col sm={12} md={8} lg={5}>
            <Events
              events={this.getFilteredEvents()}
              getCarColorByVin={this.getCarColorByVin}
              filter={filterEvents}
              toggleFilter={this.toggleFilterEvents}
            />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default App
