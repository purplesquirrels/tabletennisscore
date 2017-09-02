import React, { Component } from 'react';
import classnames from 'classnames';
import './Timer.css';

class Timer extends Component {

    constructor(props) {
        super(props);

        this.formatTimer = this.formatTimer.bind(this);
        this.timer = null;

        let now = new Date();

        this.state = {
            starttime: props.starttime,
            timenow: now.toUTCString(),
            duration: now.getTime() - (new Date(props.starttime).getTime())
        }
    }

    componentWillReceiveProps(nextProps) {
        let now = new Date();
        this.setState({
            starttime: nextProps.starttime,
            timenow: now.toUTCString(),
            duration: now.getTime() - (new Date(nextProps.starttime).getTime())
        });
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            let now = new Date();
            this.setState({
                timenow: new Date().toUTCString(),
                duration: now.getTime() - (new Date(this.props.starttime).getTime())
            });
        }, 1000);
    }

    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    formatTimer(date) {
        const d = new Date(date);
        let h = d.getUTCHours();
        let m = d.getUTCMinutes();
        let s = d.getUTCSeconds();

        h = h < 10 ? "0" + h : "" + h;
        m = m < 10 ? "0" + m : "" + m;
        s = s < 10 ? "0" + s : "" + s;

        return (h === "00" ? "" : `${h}:`) + `${m}:${s}`;
    }

    render() {

        var classes = {
            timer: true,
            ...this.props.classNames
        };

        if (this.props.starttime) {
            classes.visible = true;
        }

        classes = classnames(classes);

        return <div className={classes}>{this.props.starttime ? this.formatTimer(this.state.duration) : "00:00"}</div>;
    }
}

Timer.defaultProps = {
    classNames: {},
    starttime: 0
};

export default Timer;