import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';

import Modal from '../modal/modal.jsx';
import Button from '../button/button.jsx';

const STEPS = [
    'Welcome to MerrCode! This tutorial will walk you through the basics.',
    'This area is the stage where your project runs.',
    'On the left are the block categories. Drag blocks into the scripts area to program.',
    'Use the green flag to start your project. You can stop with the stop button.',
    'That’s it — have fun exploring and building!'
];

const Tutorial = ({open, onClose}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (open) setIndex(0);
    }, [open]);

    if (!open) return null;

    const onFinish = () => {
        try {
            localStorage.setItem('merrcode_tutorial_shown', '1');
        } catch (e) {
            // ignore if localStorage isn't available
        }
        onClose();
    };

    return (
        <Modal
            contentLabel={`Tutorial step ${index + 1}`}
            onRequestClose={onClose}
            styleContent={{ maxWidth: '640px', margin: '0 auto' }}
        >
            <div style={{ padding: '20px' }}>
                <h2 style={{ marginTop: 0 }}>Step {index + 1}</h2>
                <p>{STEPS[index]}</p>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                    <div>
                        <Button
                            onClick={() => setIndex(Math.max(0, index - 1))}
                            disabled={index === 0}
                        >
                            Back
                        </Button>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <Button onClick={onFinish}>Skip</Button>
                        {index < STEPS.length - 1 ? (
                            <Button onClick={() => setIndex(index + 1)}>Next</Button>
                        ) : (
                            <Button onClick={onFinish}>Finish</Button>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

Tutorial.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired
};

Tutorial.defaultProps = {
    open: false
};

export default Tutorial;
