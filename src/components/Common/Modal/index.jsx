import React from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'react-bootstrap'
import ShadowContainer from '../ShadowContainer'
import './index.scss'
import { Icon } from '@iconify/react'

const CloseButtonIcon = '/images/closeWhite.svg'
// const CloseButtonIcon =
//     'https://storage.googleapis.com/evolv-store/icons/common/close.svg'

const CustomModal = ({
    onHide,
    children,
    show,
    title,
    width = 'large',
    dark = false,
    ...props
}) => {
    return (
        <Modal
            {...props}
            show={show}
            size="xs"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName={`modal-${width}`}
            contentClassName="no-background"
        >
            <ShadowContainer>
                <Modal.Body
                    className={`modal-container modal-container-${width} ${
                        dark && 'dark'
                    }`}
                >
                    <div className="modal-header-container">
                        <h4 className="modal-title">{title}</h4>
                        {/* <img
                            onClick={onHide}
                            className="close-button-icon"
                            src={CloseButtonIcon}
                            alt="close-icon"
                        /> */}
                        <Icon
                            icon={'ep:close-bold'}
                            onClick={onHide}
                            className="close-button-icon"
                        />
                    </div>
                    <div className="modal-body-container">{children}</div>
                </Modal.Body>
            </ShadowContainer>
        </Modal>
    )
}

CustomModal.propTypes = {
    show: PropTypes.bool,
    width: PropTypes.string,
    onHide: PropTypes.func,
    children: PropTypes.element,
    dark: PropTypes.bool,
    title: PropTypes.string,
}

export default CustomModal
