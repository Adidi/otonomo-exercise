import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-flexbox-grid'
import PopoverConfirm from '../ui/PopoverConfirm'
import noop from 'lodash/noop'
import ldMap from 'lodash/map'
import Button from '../ui/Button'
import Checkbox from '../ui/Checkbox'
import Input from '../ui/Input'
import './cars.scss'

const Cars = ({ cars, addCar, deleteCar, toggleCar, validateVin }) => {
  const [text, setText] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const onChangeText = useCallback(e => {
    setText(e.target.value)
    setErrMsg('')
  })
  const submit = async e => {
    const ivv = validateVin(text)
    if (!ivv.valid) {
      setErrMsg(ivv.errMsg)
    } else {
      addCar(text)
    }

    setText('')
  }

  const onKeyDown = e => {
    if (e.key === 'Enter') {
      submit()
    }
  }

  return (
    <section className="cars">
      <Row middle="xs" className="form">
        <Col xs={10}>
          <Input
            placeholder="Insert VIN"
            style={{ width: '100%' }}
            value={text}
            onChange={onChangeText}
            onKeyDown={onKeyDown}
          />
          {!!errMsg && <div className="err-box">{errMsg}</div>}
        </Col>
        <Col xs={2}>
          <Button onClick={submit}>Add</Button>
        </Col>
      </Row>
      <Row start="xs">
        {ldMap(cars, car => (
          <Col xs={12} key={car.vin} className="vin-box">
            <Row between="xs">
              <Col>
                <div className="w" onClick={toggleCar(car.vin)}>
                  <Checkbox checked={car.enabled} onChange={noop} />
                  <span className="vin" style={{ color: car.color }}>
                    {car.vin}
                  </span>
                </div>
              </Col>
              <Col xs={1}>
                <PopoverConfirm
                  title={`Are you sure you want to delete car ${car.vin} ?`}
                  handler={deleteCar(car.vin)}>
                  <i className="del material-icons">delete</i>
                </PopoverConfirm>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </section>
  )
}

Cars.propTypes = {
  cars: PropTypes.object.isRequired,
  addCar: PropTypes.func.isRequired,
  deleteCar: PropTypes.func.isRequired,
  toggleCar: PropTypes.func.isRequired,
  validateVin: PropTypes.func.isRequired,
}

export default Cars
