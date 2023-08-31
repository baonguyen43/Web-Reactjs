import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import './style.sidebar.css'

const Sidebar = (props) => {
    const [opened, setOpened] = useState(false)
    const ref = useRef()

    const toggleOpened = useCallback(
        () => {
            setOpened(!opened)
        },
        [opened],
    )

    const onClickOutSideHandler = useCallback(
        (event) => {
            if (opened && !ref.current.contains(event.target)) {
                setOpened(false)
            }
        },
        [opened],
    )

    useEffect(() => {
        // componentDidMount
        window.addEventListener('click', onClickOutSideHandler)
        return () => {
            // componentWillUnmount
            window.removeEventListener('click', onClickOutSideHandler)
        }
    }, [onClickOutSideHandler])

    return (
        <Fragment>
            <span ref={ref}>
                <div className="sidebar" style={{ width: opened ? 282 : 0 }}>
                    <span className="closebtn" onClick={toggleOpened}>&times;</span>
                    {props.content}
                </div>
                <div id="main">
                    <div className="openbtn" onClick={toggleOpened}>&#9776;</div>
                </div>
            </span>
        </Fragment>
    )
}

Sidebar.propTypes = {
    content: PropTypes.object
}

export default Sidebar
