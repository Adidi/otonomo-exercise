import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import noop from 'lodash/noop'
import { Scrollbars } from 'react-custom-scrollbars'
import { Row, Col } from 'react-flexbox-grid'
import EventNotification from '../ui/EventNotification'
import Checkbox from '../ui/Checkbox'

import './events.scss'

const Events = ({ events, getCarColorByVin, filter, toggleFilter }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const scrollbar = useRef(null)

  const onScroll = e => {
    setScrollTop(e.target.scrollTop)
  }

  const scrollToTop = () => {
    scrollbar.current.view.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Row className="events" start="xs">
      <Col xs={12} className="filter">
        <div className="f-box" onClick={toggleFilter}>
          <Checkbox checked={filter} onChange={noop} />
          <span>Filter events where fuel is under 15%</span>
        </div>
        {scrollTop > 0 && (
          <div className="s-top" onClick={scrollToTop}>
            <i className="material-icons">arrow_upward</i>
          </div>
        )}
      </Col>
      <Scrollbars onScroll={onScroll} ref={scrollbar} style={{ height: 500 }}>
        <div className="wrapper">
          {events.map(event => (
            <EventNotification
              color={getCarColorByVin(event.vin)}
              key={event.timestamp}
              carEvent={event}
            />
          ))}
        </div>
      </Scrollbars>

      <Col xs={12} className="e-count">
        <span>{`${events.length} events`}</span>
      </Col>
    </Row>
  )
}

Events.propTypes = {
  events: PropTypes.array.isRequired,
  filter: PropTypes.bool.isRequired,
  getCarColorByVin: PropTypes.func.isRequired,
  toggleFilter: PropTypes.func.isRequired,
}

export default Events
