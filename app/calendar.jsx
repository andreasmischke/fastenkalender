import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment-easter';
import 'moment-round';


const stateNames = ['unknown', 'fail', 'success'];

class Heading extends React.Component {
    constructor() {
        super();
        this.weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    }
    render() {
        return (
            <th data-wday={this.props.wday}>
                {this.weekdays[this.props.wday]}
            </th>
        );
    }
};

class Filler extends React.Component {
    render() {
        return (
            <td className="filler"></td>
        );
    }
};

class Day extends React.Component {
    render() {
        const className = [];
        if(this.props.today.isSame(this.props.date))
            className.push("today");
        if(this.props.easter) 
            className.push("easter");
        if(this.props.date.day() == 0)
            className.push("sunday");
        if(this.props.date.isBefore(this.props.today)) {
            className.push("over_" + this.props.state);
        }
        return (
            <td className={className.join(' ')}
                onClick={this.props.onClick}>
                <div className="date">{this.props.date.format("DD")}</div>
                <div className="month">{this.props.date.format("MM")}</div>
            </td>
        );
    }
};

class Calendar extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        const today = moment().floor(24, 'hours'),
              easter = today.easter(),
              ash_wed = moment(easter).subtract(46, 'days');

        let success = null;
        if(localStorage) {
            const storageData = localStorage.getItem('fastenkalender');
            if(storageData !== null) {
                success = storageData.split('').map((x) => parseInt(x));
            }
        }
        if(success === null) {
            success = _.range(46).map(() => 0);
        }

        this.state = {
            today: today,
            easter: easter,
            ash_wed: ash_wed,
            success: success
        };
    }

    handleClick(triggeredOffset, e) {
        const today = this.state.today.dayOfYear(),
              ash_wed = this.state.ash_wed.dayOfYear(),
              offset = today - ash_wed;
        if(triggeredOffset < offset) {
            const success = this.state.success,
                  oldValue = success[triggeredOffset],
                  newValue = oldValue == 2 ? 1 : 2;

            success[triggeredOffset] = newValue;
            localStorage.setItem('fastenkalender', success.join(''));
            this.setState({success: success});
        }
    }

    create_day(date_iter) {
        const date = moment(date_iter),
              easter = date.isSame(this.state.easter),
              offset = date.dayOfYear() - this.state.ash_wed.dayOfYear(),
              stateNum = this.state.success[offset],
              state = stateNames[stateNum],
              partialClick = _.partial(this.handleClick, offset);

        return (
            <Day key={date.dayOfYear()}
                 date={date}
                 today={this.state.today}
                 state={state}
                 onClick={partialClick}
                 easter={easter} />
        );
    }

    render() {
        const weeks = [],
              date_iter = moment(this.state.ash_wed),
              first_wday = date_iter.day();

        let week = [];

        if(first_wday != 1) {
            _.range(((first_wday % 7) + 6) % 7).map((i) => {
                 week.push(<Filler key={i} />);
            });
        }

        while(week.length < 7) {
            week.push(this.create_day(date_iter));
            date_iter.add(1, 'days');
        }
        weeks.push(week);

        while(this.state.easter.dayOfYear() - date_iter.dayOfYear() > 6) {
            week = [];
            _.range(7).map((i) => {
                week.push(this.create_day(date_iter));
                date_iter.add(1, 'days');
            });
            weeks.push(week);
        }

        week = [];
        while(date_iter.isSameOrBefore(this.state.easter)) {
            week.push(this.create_day(date_iter));
            date_iter.add(1, 'days');
        }
        while(week.length < 7) {
            week.push(<Filler key={week.length} />);
        }

        weeks.push(week);

        const today = this.state.today.dayOfYear(),
              ash_wed = this.state.ash_wed.dayOfYear(),
              day_count = today - ash_wed,
              percentage = Math.floor(day_count / 0.046) / 10,
              success_days = _.range(day_count).reduce((acc, val) => {
                  if(this.state.success[val] == 2)
                      acc = acc + 1;
                  return acc;
              }, 0),
              success_percentage = Math.floor(success_days / day_count * 1000) / 10;

        return (
            <div>
                <h1>Fastenkalender {this.state.today.format("YYYY")}</h1>
                <table className='calendar'>
                    <thead>
                        <tr>
                        {_.range(7).map((i) => {
                            i = (i+1) % 7;
                            return <Heading key={i} wday={i} />
                        })}
                        </tr>
                    </thead>
                    <tbody>
                    {weeks.map((week, i) => {
                        i = "tr_" + i;
                        return <tr key={i}>{week}</tr>;
                    })}
                    </tbody>
                </table>
                <div className="progress">
                    {day_count} von 46 Tagen ({percentage}%) vorbei<br />
                    Du hast dein Fastenziel zu {success_percentage}%
                    eingehalten
                </div>
                <div className="click_info">
                    Du kannst vergangene Tage durch (mehrmaliges) Klicken
                    grün oder rot färben, je nach dem, ob du dein Fastenziel
                    an dem Tag eingehalten hast. Die Farben bleiben
                    gespeichert, solange du den Kalender mit dem gleichen
                    Gerät und Browser aufrufst.
                </div>
            </div>
        );
    }

};

module.exports = Calendar;
