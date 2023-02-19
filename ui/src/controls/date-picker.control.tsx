import React, { useCallback, useMemo } from 'react'
import ReactDatePicker from "react-datepicker";
import format from "date-fns/format";

interface DatePickerProps {
    selected: string;
    onChangeCallback: any;
    placeholder?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({selected, onChangeCallback, placeholder}) => {
    const selectedDate = useMemo(() => {
        return !!selected ? new Date(selected) : null;
    }, [selected]);

    const onChange = useCallback((date: Date) => {
        if (!date) return onChangeCallback("");
        const datefmt = format(date, "yyyy-MM-dd");
        onChangeCallback(datefmt);
    }, [onChangeCallback]);

  return (
    <ReactDatePicker
        className='form-control'
        selected={selectedDate}
        onChange={onChange}
        placeholderText={placeholder}
        dateFormat={"yyyy-MM-dd"}
    ></ReactDatePicker>
  )
}
