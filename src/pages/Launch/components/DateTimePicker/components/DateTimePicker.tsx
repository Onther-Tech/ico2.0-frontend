/** This component renders the Calendar, & Time picker used on the step 1 simplified launch
 * TODO: Notes for incomplete tasks.
 * FIXME: : Needs to be fixed.
 */

import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {Calendar} from './Calendar';
import {ActionBar} from './ActionBar';
import {Clock} from './Clock';
import {
  Box,
  Flex,
  Button,
  useColorMode,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@chakra-ui/react';

// icons
import calendarInactiveIcon from 'assets/svgs/calendar_inactive_icon.svg';
import calendarActiveIcon from 'assets/svgs/calendar_active_icon.svg';
import calendarInactiveIconDark from 'assets/launch/calendar-inactive-icon-dark.svg';

// library
import * as dateFns from 'date-fns';

// styles
import '../styles/layout.scss';
import '../styles/button.scss';
import '../styles/cell.scss';

// Props
type DateTimePickerProps = {
  setDate?: Dispatch<SetStateAction<any>>;
  range?: boolean;
  startDate?: number;
  endDate?: number;
  disabled?: boolean;
  startTimeCap?: number;
  onCancel?: () => void;
};
// TODO: construct startDate & time, endDate & time when in range.

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  range,
  setDate,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [startTimeArray, setStartTimeArray] = useState<any>([]);
  const {colorMode} = useColorMode();
  const [image, setImage] = useState(
    colorMode === 'light' ? calendarInactiveIcon : calendarInactiveIconDark,
  );

  let dateInEpoch: number = 0;
  let endDateInEpoch: number = 0;

  const setSelectedDateTime = (onClose: any) => {
    setSelectedDate(selectedDate ? new Date(selectedDate.getTime()) : null);
    setEndDate(endDate ? new Date(endDate.getTime()) : null);

    if (selectedDate) {
      console.log('Selected Date', selectedDate);
      const date = new Date(selectedDate.getTime());
      const time = new Date(startTime * 1000);

      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      date.setSeconds(time.getSeconds());

      dateInEpoch = Math.floor(date.getTime() / 1000);
      setStartTime(Math.floor(date.getTime() / 1000));

      if (setDate) {
        setDate(dateInEpoch);
      }
    }
    if (endDate) {
      const date = new Date(endDate.getTime());
      const time = new Date(startTime * 1000);

      date.setHours(time.getHours());
      date.setMinutes(time.getMinutes());
      date.setSeconds(time.getSeconds());

      endDateInEpoch = Math.floor(date.getTime() / 1000);
      setEndTime(Math.floor(date.getTime() / 1000));

      console.log('date', date);

      if (setDate) {
        setDate(endDateInEpoch);
      }
    }

    onClose();
  };

  const create = () => {
    const starts = dateFns.startOfSecond(dateFns.toDate(startTime * 1000));
    const startDates = dateFns.set(starts, {
      hours: startTimeArray[0],
      minutes: startTimeArray[1],
      seconds: startTimeArray[2],
    });
    setStartTime(dateFns.getUnixTime(dateFns.startOfSecond(startDates)));
  };

  useEffect(() => {
    create();
  }, [startTimeArray, startTime]);

  return (
    <Popover closeOnBlur={true} placement="bottom">
      {({isOpen, onClose}) => (
        <>
          <PopoverTrigger>
            <img
              src={image}
              onMouseEnter={() => setImage(calendarActiveIcon)}
              onMouseOut={() =>
                setImage(
                  colorMode === 'light'
                    ? calendarInactiveIcon
                    : calendarInactiveIconDark,
                )
              }
              style={{cursor: 'pointer'}}
              alt={'calender_icon'}></img>
          </PopoverTrigger>
          <PopoverContent _focus={{border: 'none'}} style={{border: 'none'}}>
            <div
              // FIXME: selected dates are not shown when selecting date range.
              className={`date-time-selector${
                colorMode === 'light' ? '--light-mode' : '--dark-mode'
              }`}>
              <Calendar
                value={currentDate}
                onChange={setCurrentDate}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedEndDate={endDate}
                setSelectedEndDate={setEndDate}
                range={range}
              />
              <>
                {range ? (
                  // FIXME: selected times are not shown when selecting date range.
                  <div>
                    <Clock
                      value={currentDate}
                      range={true}
                      text={'Start time'}
                      time={startTime}
                      setTime={setStartTimeArray}
                    />
                    <Clock
                      value={currentDate}
                      setTime={setStartTimeArray}
                      range={true}
                      text={'End time'}
                      time={endTime}
                    />
                  </div>
                ) : (
                  <Clock
                    value={currentDate}
                    setTime={setStartTimeArray}
                    // onChange={setStartTimeArray}
                    time={startTime}
                  />
                )}
              </>
              <ActionBar
                onSet={() => setSelectedDateTime(onClose)}
                onCancel={() => onClose()}
              />
            </div>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};
