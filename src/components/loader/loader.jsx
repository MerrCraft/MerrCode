import React from 'react';
import {defineMessages, FormattedMessage, intlShape, injectIntl} from 'react-intl';
import classNames from 'classnames';
import styles from './loader.css';
import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';

import topBlock from './top-block.svg';
import middleBlock from './middle-block.svg';
import bottomBlock from './bottom-block.svg';

import * as progressMonitor from './tw-progress-monitor';
import isScratchDesktop from '../../lib/isScratchDesktop';

// tw:
// we make some rather large changes here:
//  - remove random message, replaced with message dependent on what is actually being loaded
//  - add a progress bar
//  - bring in intl so that we can translate everything
// The way of doing this is extremely unusual and weird compared to how things are typically done for performance.
// This is because react updates are too performance crippling to handle the progress bar rapidly updating.

const mainMessages = {
    'gui.loader.headline': (
        <FormattedMessage
            defaultMessage="Loading Project"
            description="Main loading message"
            id="gui.loader.headline"
        />
    ),
    'gui.loader.creating': (
        <FormattedMessage
            defaultMessage="Creating Project"
            description="Main creating message"
            id="gui.loader.creating"
        />
    ),
    'pm.loader.playground': (
        <FormattedMessage
            defaultMessage="Loading Playground"
            description="Playground load message"
            id="pm.loader.playground"
        />
    )
};

const messages = defineMessages({
    generic: {
        defaultMessage: 'Loading project …',
        description: 'Initial generic loading message',
        id: 'tw.loader.generic'
    },
    projectData: {
        defaultMessage: 'Downloading project data …',
        description: 'Appears when loading project data',
        id: 'tw.loader.data'
    },
    assetsKnown: {
        defaultMessage: 'Downloading assets ({complete}/{total}) …',
        description: 'Appears when loading project assets and amount of assets is known',
        id: 'tw.loader.assets.known'
    },
    assetsUnknown: {
        defaultMessage: 'Downloading assets …',
        description: 'Appears when loading project assets but amount of assets is unknown',
        id: 'tw.loader.assets.unknown'
    }
});

const UTList = [
    'Minecraft is amazing!',
    'Evil larry will come into your closet at night.',
    'Why are you here, please, say hello for no reason',
    'heheheh, i see you',
    'freaky billy is watching you',
    'I jumped into the amazing place',
    'Do you like cats?',
    'Who are reading dese tips?',
    'I like turtles',
    'Did you know? The earth is flat!',
    'Why is the sky blue?',
    'I love cats!',
    'Did you know? you are special!',
    'Why did the chicken cross the road?',
    'I am watching you sleep',
    'Do you like pancakes?',
    'Why is water wet?',
    'Have you ever seen a unicorn?',
    'Do you believe in magic?',
    'Why do we dream?',
    'this was made by MerrCraft',
    'Did you know? MerrCraft has made a lot of websites?',
    'weird tips are weird',
    'I am a loader tip',
    'Loading the loading screen… loading the loading',
    'there is a lot of these "tips", there are exactly {LENGTH} of them',
    'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
];

// Replace the placeholder with the actual length
UTList[25] = UTList[25].replace('{LENGTH}', UTList.length);
let unhelpfulTip = UTList[Math.floor(Math.random() * UTList.length)]; // abrivated into UT for "unhelpful tips"

class LoaderComponent extends React.Component {
    constructor (props) {
        super(props);
        this._state = 0;
        this.progress = 0;
        this.complete = 0;
        this.total = 0;
        bindAll(this, [
            'barInnerRef',
            'handleProgressChange',
            'messageRef'
        ]);
    }
    componentDidMount () {
        if (!isScratchDesktop()) {
            progressMonitor.setProgressHandler(this.handleProgressChange);
        }
        this.updateMessage();
    }
    componentDidUpdate () {
        this.update();
    }
    componentWillUnmount () {
        // force completion
        this.progress = 1;
        this.update();
        progressMonitor.setProgressHandler(() => {});
    }
    handleProgressChange (state, progress, complete, total) {
        if (state !== this._state) {
            this._state = state;
            this.updateMessage();
        }
        this.progress = progress;
        this.complete = complete;
        this.total = total;
        this.update();
    }
    update () {
        if (this.barInner) {
            this.barInner.style.width = `${this.progress * 100}%`;
        }
        if (this._state === 2) {
            this.updateMessage();
        }
    }
    updateMessage () {
        if (this._state === 0) {
            this.message.textContent = this.props.intl.formatMessage(messages.generic);
        } else if (this._state === 1) {
            this.message.textContent = this.props.intl.formatMessage(messages.projectData);
        } else if (this.total > 0) {
            this.message.textContent = this.props.intl.formatMessage(messages.assetsKnown, {
                complete: this.complete,
                total: this.total
            });
        } else {
            this.message.textContent = this.props.intl.formatMessage(messages.assetsUnknown);
        }
    }
    barInnerRef (element) {
        this.barInner = element;
    }
    messageRef (element) {
        this.message = element;
    }
    render () {
        return (
            <div
                className={classNames(styles.background, {
                    [styles.fullscreen]: this.props.isFullScreen
                })}
            >
                <div className={styles.container}>
                    <div className={styles.blockAnimation}>
                        <img
                            className={styles.topBlock}
                            src={topBlock}
                        />
                        <img
                            className={styles.middleBlock}
                            src={middleBlock}
                        />
                        <img
                            className={styles.bottomBlock}
                            src={bottomBlock}
                        />
                    </div>
                    <div className={styles.title}>
                        {mainMessages[this.props.messageId]}
                    </div>
                    <div className={styles.messageContainerOuter}>
                        <div
                            className={styles.messageContainerInner}
                            ref={this.messageRef}
                        />
                    </div>
                    <div>
                        <div>{unhelpfulTip}</div>
                    </div>
                    {!isScratchDesktop() && (
                        <div className={styles.twProgressOuter}>
                            <div
                                className={styles.twProgressInner}
                                ref={this.barInnerRef}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

LoaderComponent.propTypes = {
    isFullScreen: PropTypes.bool,
    intl: intlShape.isRequired,
    messageId: PropTypes.string
};
LoaderComponent.defaultProps = {
    isFullScreen: false,
    messageId: 'gui.loader.headline'
};

export default injectIntl(LoaderComponent);
